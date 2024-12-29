import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Users from "../views/Users.vue";
import GeoFenceMap from "../views/GeoFenceMap.vue";
import GeoFencesManagement from "../views/GeoFencesManagement.vue";

const routes = [
  { path: "/", name: "Inicio", component: Home },
  { path: "/users", name: "Usuarios", component: Users },
  { path: "/map", name: "Mapa", component: GeoFenceMap },
  { path: "/geofences", name: "Gestión de Geo-Vallas", component: GeoFencesManagement },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
