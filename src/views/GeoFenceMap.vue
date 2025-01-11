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
import { collection, addDoc } from "firebase/firestore";
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
        if (e.layer instanceof L.Circle) {
          const radius = e.layer.getRadius(); // Obtiene el radio del círculo
          const { lat, lng } = e.layer.getLatLng(); // Obtiene las coordenadas del centro
          e.layer.feature = { // Guarda propiedades directamente en la capa
            properties: { radius },
            geometry: {
              type: "Point",
              coordinates: [lng, lat] // Longitud antes de latitud para GeoJSON
            }
          };
        }
      });
    },
    async saveGeoFence() {
      if (!this.drawnItems || !this.drawnItems.getLayers().length) {
        alert("No hay geo-vallas para guardar.");
        return;
      }

      const geoFenceData = this.drawnItems.toGeoJSON();
      try {
        await addDoc(collection(db, "geoFences"), {
          name: `Geo-valla ${new Date().toLocaleString()}`,
          geoFence: geoFenceData,
          createdAt: new Date(),
        });
        alert("Geo-valla guardada correctamente.");
      } catch (error) {
        console.error("Error al guardar la geo-valla:", error);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeMap();
    });
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
