<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Total Alerts: {{ totalAlerts }}</h2>
        <v-simple-table>
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 20%;">Date & Time</th>
              <th style="width: 20%;">Latitude</th>
              <th style="width: 20%;">Longitude</th>
              <th style="width: 10%;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(alert, index) in alerts" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ alert.timestamp }}</td>
              <td>{{ alert.latitude }}</td>
              <td>{{ alert.longitude }}</td>
              <td>
                <v-btn color="success" @click="viewMap(alert.latitude, alert.longitude)">
                  View Map
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "AlertsView",
  setup() {
    const alerts = ref([]);
    const totalAlerts = ref(0);

    const fetchAlerts = async () => {
      const querySnapshot = await getDocs(collection(db, "alerts"));
      querySnapshot.forEach((doc) => {
        alerts.value.push(doc.data());
      });
      totalAlerts.value = alerts.value.length;
    };

    const viewMap = (latitude, longitude) => {
      window.open(
        `https://www.google.com/maps?q=${latitude},${longitude}`,
        "_blank"
      );
    };

    onMounted(() => {
      fetchAlerts();
    });

    return { alerts, totalAlerts, viewMap };
  },
};
</script>

<style>
/* Estilo personalizado para ajustar el espaciado de las columnas */
.v-simple-table th,
.v-simple-table td {
  padding: 8px 12px; /* Más espacio interno para las celdas */
  text-align: center; /* Centrar el contenido */
  white-space: nowrap; /* Evitar que el texto se divida en varias líneas */
}
</style>
