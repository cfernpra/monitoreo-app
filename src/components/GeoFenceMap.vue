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

import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "GeoFenceMap",
  data() {
    return {
      map: null,
      drawnItems: new L.FeatureGroup(), // Grupo de capas dibujadas
      userMarkers: {}, // Marcadores de los usuarios
    };
  },
  methods: {
    initializeMap() {
      // Crear el mapa centrado en Madrid
      this.map = L.map("map").setView([40.4168, -3.7038], 13);

      // Añadir capa base de OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      // Habilitar las herramientas de Leaflet-Geoman
      this.map.pm.addControls({
        position: "topleft",
        drawPolygon: true,
        drawRectangle: true,
        drawCircle: true,
        editMode: true,
        deleteMode: true,
      });

      // Guardar los elementos dibujados en `drawnItems`
      this.map.on("pm:create", (e) => {
        const layer = e.layer;
        this.drawnItems.addLayer(layer);
      });

      // Escuchar las ubicaciones de usuarios y mostrarlas en el mapa
      this.listenToUserLocations();
    },
    listenToUserLocations() {
      const usersCollection = collection(db, "users"); // Colección de usuarios

      // Escuchar cambios en tiempo real en `users`
      onSnapshot(usersCollection, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const userData = change.doc.data();
          const userId = change.doc.id; // ID único del documento en Firebase
          const { latitude, longitude, name } = userData;

          if (change.type === "added" || change.type === "modified") {
            // Si ya existe el marcador, actualiza su posición
            if (this.userMarkers[userId]) {
              this.userMarkers[userId].setLatLng([latitude, longitude]);
            } else {
              // Crear un nuevo marcador si no existe
              const marker = L.marker([latitude, longitude], {
                icon: L.icon({
                  iconUrl: "https://cdn-icons-png.flaticon.com/512/4870/4870928.png",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                }),
              }).addTo(this.map);

              // Añadir un tooltip con el nombre del usuario
              marker.bindTooltip(`Usuario: ${name}`).openTooltip();

              // Guardar el marcador en `userMarkers`
              this.userMarkers[userId] = marker;
            }
          } else if (change.type === "removed") {
            // Si el usuario fue eliminado, elimina su marcador
            if (this.userMarkers[userId]) {
              this.map.removeLayer(this.userMarkers[userId]);
              delete this.userMarkers[userId];
            }
          }
        });
      });
    },
    async saveGeoFence() {
      // Convertir los elementos dibujados a GeoJSON
      const geoFenceData = this.drawnItems.toGeoJSON();

      if (!geoFenceData.features || geoFenceData.features.length === 0) {
        alert("No hay geo-vallas para guardar.");
        return;
      }

      // Convertir las coordenadas para evitar arrays anidados
      const processedFeatures = geoFenceData.features.map((feature) => ({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: JSON.stringify(feature.geometry.coordinates),
        },
      }));

      try {
        // Guardar la geo-valla en Firebase
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
