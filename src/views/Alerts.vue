<template>
  <v-container>
    <h1>System Alerts</h1>

    <!-- Alerts summary -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <p>Total alerts: {{ totalAlerts }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn color="primary" @click="fetchAlerts">Refresh alerts</v-btn>
      </v-col>
    </v-row>

    <!-- Alerts list -->
    <v-simple-table>
      <thead>
        <tr>
          <th>#</th>
          <th>Date & Time</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(alert, index) in alerts" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ alert.timestamp }}</td>
          <td>{{ alert.latitude }}</td>
          <td>{{ alert.longitude }}</td>
          <td>
            <v-btn color="success" @click="viewMap(alert)">View map</v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- Map modal -->
    <v-dialog v-model="showMap" max-width="800px">
      <v-card>
        <v-card-title>Alert Location</v-card-title>
        <v-card-text>
          <div id="map" style="height: 400px;"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="closeMap">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "AlertsView",
  setup() {
    const alerts = ref([]);
    const totalAlerts = ref(0);
    const showMap = ref(false);
    const selectedAlert = ref(null);

    const fetchAlerts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "alerts"));
        const data = querySnapshot.docs.map((doc) => doc.data());

        alerts.value = data;
        totalAlerts.value = data.length;
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    const viewMap = (alert) => {
      selectedAlert.value = alert;
      showMap.value = true;
      // Initialize map here with Leaflet or Google Maps
    };

    const closeMap = () => {
      showMap.value = false;
    };

    onMounted(() => {
      fetchAlerts();
    });

    return {
      alerts,
      totalAlerts,
      showMap,
      viewMap,
      closeMap,
      fetchAlerts,
    };
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
}
</style>
