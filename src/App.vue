<template>
  <div id="app">
    <h1>Monitoreo en Tiempo Real</h1>

    <!-- Lista de usuarios -->
    <ul>
      <li v-for="(user, index) in users" :key="index">
        {{ user.name }} - Ubicación: [{{ user.latitude }}, {{ user.longitude }}]
      </li>
    </ul>

    <!-- Botón de Testing -->
    <TestingButton @add-random-user="addRandomUser" />

    <!-- Componente de Geo-Valla -->
    <GeoFenceMap />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import TestingButton from "./components/TestingButton.vue";
import GeoFenceMap from "./components/GeoFenceMap.vue";

export default {
  name: "App",
  components: { TestingButton, GeoFenceMap },
  setup() {
    const users = ref([]);

    // Leer datos en tiempo real
    onMounted(() => {
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        users.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
      return () => unsubscribe();
    });

    // Agregar usuarios aleatorios
    const addRandomUser = async () => {
      const randomName = `Usuario ${Math.floor(Math.random() * 1000)}`;
      const randomLatitude = (Math.random() * 180 - 90).toFixed(4);
      const randomLongitude = (Math.random() * 360 - 180).toFixed(4);

      try {
        await addDoc(collection(db, "users"), {
          name: randomName,
          latitude: parseFloat(randomLatitude),
          longitude: parseFloat(randomLongitude),
        });
      } catch (e) {
        console.error("Error al agregar usuario aleatorio:", e);
      }
    };

    return { users, addRandomUser };
  },
};
</script>

  
  <style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin-bottom: 10px;
  }
  </style>
  