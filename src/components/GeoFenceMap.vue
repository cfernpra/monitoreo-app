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
      drawnItems: new L.FeatureGroup(), // Grupo de capas dibujadas
      userMarker: null, // Marcador para la posición del usuario
    };
  },
  methods: {
    initializeMap() {
      // Crear el mapa centrado en Madrid
      this.map = L.map("map").setView([40.4168, -3.7038], 13);

      // Añadir capa base
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      // Añadir Geoman (herramientas de dibujo)
      this.map.pm.addControls({
        position: "topleft",
        drawPolygon: true,
        drawRectangle: true,
        drawCircle: true,
        editMode: true,
        deleteMode: true,
      });

      // Manejar la creación de geo-vallas
      this.map.on("pm:create", (e) => {
        const layer = e.layer;
        console.log("Geo-valla creada:", layer.toGeoJSON());
        this.drawnItems.addLayer(layer); // Guardar la capa en el grupo
      });

      // Mostrar la posición actual del usuario
      this.trackUserPosition();
    },
    trackUserPosition() {
      // Usar la API de Geolocalización para rastrear la posición del usuario
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Si ya existe un marcador, actualiza su posición
            if (this.userMarker) {
              this.userMarker.setLatLng([latitude, longitude]);
            } else {
              // Crear un nuevo marcador para la posición del usuario
              this.userMarker = L.marker([latitude, longitude], {
                icon: L.icon({
                  iconUrl: "https://cdn-icons-png.flaticon.com/512/4870/4870928.png",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                }),
              }).addTo(this.map);
            }

            // Centrar el mapa en la posición del usuario
            this.map.setView([latitude, longitude], 13);
          },
          (error) => {
            console.error("Error al obtener la posición del usuario:", error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        console.error("La geolocalización no está soportada por este navegador.");
      }
    },
    async saveGeoFence() {
      // Convertir las capas dibujadas a GeoJSON
      const geoFenceData = this.drawnItems.toGeoJSON();

      if (!geoFenceData.features || geoFenceData.features.length === 0) {
        alert("No hay geo-vallas para guardar.");
        return;
      }

      try {
        await addDoc(collection(db, "geoFences"), {
          name: "Geo-valla",
          geoFence: geoFenceData,
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
