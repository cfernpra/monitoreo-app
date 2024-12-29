<template>
  <v-app>
    <!-- Barra superior -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Monitoreo en Tiempo Real</v-toolbar-title>
    </v-app-bar>

    <!-- Menú lateral -->
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item to="/" exact>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>

        <v-list-item to="/users">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Usuarios</v-list-item-title>
        </v-list-item>

        <v-list-item to="/map">
          <v-list-item-icon>
            <v-icon>mdi-map</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Mapa</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
