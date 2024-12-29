<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Monitoreo en Tiempo Real</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.text"
          @click="navigateTo(item.route)"
          class="menu-item"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      menuItems: [
        { text: "Inicio", route: "/" },
        { text: "Usuarios", route: "/users" },
        { text: "Mapa", route: "/map" },
      ],
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
      this.drawer = false; // Cierra el menú al navegar
    },
  },
};
</script>

<style>
.menu-item {
  color: #5f6368; /* Gris de Google */
  cursor: pointer;
}
.menu-item:hover {
  background-color: #e8f0fe; /* Azul claro de Google */
}
</style>
