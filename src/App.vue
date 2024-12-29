<template>
  <v-app>
    <!-- Barra superior -->
    <v-app-bar color="primary" dark>
      <!-- Ícono de navegación para desplegar el menú lateral -->
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon> <!-- Ícono de menú -->
      </v-app-bar-nav-icon>
      <v-toolbar-title>Monitoreo en Tiempo Real</v-toolbar-title>
    </v-app-bar>

    <!-- Menú lateral (Navigation Drawer) -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <!-- Elementos del menú -->
        <v-list-item
          v-for="item in menuItems"
          :key="item.text"
          @click="navigateTo(item.route)"
          class="menu-item"
        >
          <!-- Íconos personalizados para cada elemento del menú -->
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Vista principal -->
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
        { text: "Inicio", route: "/", icon: "mdi-home" },
        { text: "Usuarios", route: "/users", icon: "mdi-account-group" },
        { text: "Mapa", route: "/map", icon: "mdi-map" },
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
