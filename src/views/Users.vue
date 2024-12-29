<template>
  <div>
    <h1>Lista de Usuarios</h1>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - [{{ user.latitude }}, {{ user.longitude }}]
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "UsersPage", // Cambiado a un nombre de varias palabras
  setup() {
    const users = ref([]);
    onMounted(() => {
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        users.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      });
      return () => unsubscribe();
    });

    return { users };
  },
};
</script>
