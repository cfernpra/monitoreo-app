<template>
  <div>
    <h1>Usuarios</h1>
    <ul>
      <li v-for="(user, index) in users" :key="index">
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
  name: "UsersPage",
  setup() {
    const users = ref([]);

    onMounted(() => {
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        users.value = snapshot.docs.map((doc) => doc.data());
      });

      return () => unsubscribe();
    });

    return { users };
  },
};
</script>
