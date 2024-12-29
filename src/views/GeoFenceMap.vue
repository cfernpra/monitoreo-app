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
      drawnItems: new L.FeatureGroup(),
      userMarkers: {},
    };
  },
  methods: {
    initializeMap() {
      if (this.map) return;

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
        this.drawnItems.addLayer(e.layer);
      });

      this.listenToUserLocations();
    },
    listenToUserLocations() {
      const usersCollection = collection(db, "users");

      onSnapshot(usersCollection, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const userData = change.doc.data();
          const userId = change.doc.id;
          const { latitude, longitude, name } = userData;

          if (change.type === "added" || change.type === "modified") {
            if (this.userMarkers[userId]) {
              this.userMarkers[userId].setLatLng([latitude, longitude]);
            } else {
              const marker = L.marker([latitude, longitude], {
                icon: L.icon({
                  iconUrl: "https://cdn-icons-png.flaticon.com/512/4870/4870928.png",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                }),
              }).addTo(this.map);

              marker.bindTooltip(`Usuario: ${name}`).openTooltip();
              this.userMarkers[userId] = marker;
            }
          } else if (change.type === "removed") {
            if (this.userMarkers[userId]) {
              this.map.removeLayer(this.userMarkers[userId]);
              delete this.userMarkers[userId];
            }
          }
        });
      });
    },
    async saveGeoFence() {
      if (!this.drawnItems || !this.drawnItems.getLayers().length) {
        alert("No hay geo-vallas para guardar.");
        return;
      }

      const geoFenceData = this.drawnItems.toGeoJSON();

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
      } catch (error) {
        console.error("Error al guardar la geo-valla:", error);
      }
    },
  },
  mounted() {
    this.initializeMap();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
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
