import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Users from "../views/Users.vue";
import GeoFenceMap from "../views/GeoFenceMap.vue"; // Asegúrate de que esta ruta sea correcta

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/users", name: "Users", component: Users },
  { path: "/map", name: "GeoFenceMap", component: GeoFenceMap },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
