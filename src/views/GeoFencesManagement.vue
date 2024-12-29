<template>
    <v-container>
      <v-card>
        <v-card-title>Gestión de Geo-Vallas</v-card-title>
        <v-card-text>
          <v-alert v-if="geoFences.length === 0" type="info">
            No hay geo-vallas en la base de datos.
          </v-alert>
          <v-list v-else>
            <v-list-item
              v-for="geoFence in geoFences"
              :key="geoFence.id"
              class="mb-4"
            >
              <v-card class="w-100">
                <v-card-title>
                  <div>
                    <strong>Nombre:</strong> {{ geoFence.name }}
                    <br />
                    <strong>Coordenadas:</strong>
                    <div v-for="(coordinates, index) in geoFence.coordinates" :key="index">
                      {{ coordinates }}
                    </div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn color="error" @click="deleteGeoFence(geoFence.id)">Eliminar</v-btn>
                </v-card-actions>
              </v-card>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
  import { db } from "../firebase";
  
  export default {
    name: "GeoFencesManagement",
    data() {
      return {
        geoFences: [],
      };
    },
    methods: {
      fetchGeoFences() {
        const geoFencesCollection = collection(db, "geoFences");
        onSnapshot(geoFencesCollection, (snapshot) => {
          this.geoFences = snapshot.docs.map((doc) => {
            const data = doc.data();
            const coordinates = data.geoFence.features.map((feature) =>
              JSON.parse(feature.geometry.coordinates)
            );
            return { id: doc.id, name: data.name, coordinates };
          });
        });
      },
      async deleteGeoFence(id) {
        try {
          await deleteDoc(doc(db, "geoFences", id));
          alert("Geo-valla eliminada correctamente.");
        } catch (error) {
          console.error("Error al eliminar la geo-valla:", error);
          alert("No se pudo eliminar la geo-valla.");
        }
      },
    },
    mounted() {
      this.fetchGeoFences();
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    padding: 16px;
    margin-bottom: 8px;
  }
  .v-btn {
    margin-left: auto;
  }
  </style>
  