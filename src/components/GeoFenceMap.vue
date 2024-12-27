<template>
  <div>
    <div id="map" style="height: 500px;"></div>
    <button @click="saveGeoFence">Guardar Geo-Valla</button>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "GeoFenceMap",
  data() {
    return {
      map: null,
      drawnItems: new L.FeatureGroup(), // Grupo de capas dibujadas
      userMarker: null, // Marcador para la posición del usuario
    };
  },
  methods: {
    initializeMap() {
      this.map = L.map("map").setView([40.4168, -3.7038], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      this.map.pm.addControls({
        position: "topleft",
        drawPolygon: true,
        drawRectangle: true,
        drawCircle: true,
        editMode: true,
        deleteMode: true,
      });

      this.map.on("pm:create", (e) => {
        const layer = e.layer;
        console.log("Geo-valla creada:", layer.toGeoJSON());
        this.drawnItems.addLayer(layer);
      });

      this.trackUserPosition();
    },
    trackUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await this.updateUserLocation(latitude, longitude);
          },
          (error) => {
            if (error.code === 1) {
              alert("Por favor, permite el acceso a la ubicación para usar esta funcionalidad.");
            } else if (error.code === 2) {
              alert("La ubicación no está disponible.");
            } else if (error.code === 3) {
              alert("La solicitud de ubicación tardó demasiado.");
            }
            console.error("Error al obtener la posición del usuario:", error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.error("La geolocalización no está soportada por este navegador.");
      }
    },
    async updateUserLocation(latitude, longitude) {
      try {
        const userId = "defaultUser";
        await setDoc(doc(db, "userLocations", userId), {
          userId,
          location: { latitude, longitude },
          updatedAt: new Date(),
        });

        if (this.userMarker) {
          this.userMarker.setLatLng([latitude, longitude]);
        } else {
          this.userMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/4870/4870928.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            }),
          }).addTo(this.map);
        }

        this.map.setView([latitude, longitude], 13);
      } catch (e) {
        console.error("Error al actualizar la ubicación:", e);
      }
    },
    async saveGeoFence() {
      const geoFenceData = this.drawnItems.toGeoJSON();

      if (!geoFenceData.features || geoFenceData.features.length === 0) {
        alert("No hay geo-vallas para guardar.");
        return;
      }

      const processedFeatures = geoFenceData.features.map((feature) => ({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: JSON.stringify(feature.geometry.coordinates),
        },
      }));

      try {
        await addDoc(collection(db, "geoFences"), {
          name: `Geo-valla ${new Date().toLocaleString()}`,
          geoFence: {
            type: geoFenceData.type,
            features: processedFeatures,
          },
          createdAt: new Date(),
        });
        alert("Geo-valla guardada correctamente.");
      } catch (e) {
        console.error("Error al guardar la geo-valla:", e);
      }
    },
  },
  mounted() {
    this.initializeMap();
  },
};
</script>

<style>
#map {
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
