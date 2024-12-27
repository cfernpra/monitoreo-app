<template>
    <div id="app">
      <h1>Monitoreo en Tiempo Real</h1>
  
      <!-- Lista de usuarios -->
      <ul>
        <li v-for="(user, index) in users" :key="index">
          {{ user.name }} - Ubicación: [{{ user.latitude }}, {{ user.longitude }}]
        </li>
      </ul>
  
      <!-- Botón para abrir el testeo -->
      <Testing @add-random-user="addRandomUser" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { collection, onSnapshot, addDoc } from "firebase/firestore";
  import { db } from "./firebase";
  import Testing from "./components/TestingButton.vue"; // Importamos el componente de testing
  
  export default {
    name: "App",
    components: { Testing },
    setup() {
      const users = ref([]); // Lista de usuarios
  
      // Leer datos en tiempo real desde Firestore
      onMounted(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
          users.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });
        return () => unsubscribe();
      });
  
      // Función para agregar usuarios aleatorios
      const addRandomUser = async () => {
        const randomName = `Usuario ${Math.floor(Math.random() * 1000)}`; // Nombre aleatorio
        const randomLatitude = (Math.random() * 180 - 90).toFixed(4); // Latitud aleatoria
        const randomLongitude = (Math.random() * 360 - 180).toFixed(4); // Longitud aleatoria
  
        try {
          await addDoc(collection(db, "users"), {
            name: randomName,
            latitude: parseFloat(randomLatitude),
            longitude: parseFloat(randomLongitude),
          });
          console.log("Usuario aleatorio agregado:", randomName);
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
  