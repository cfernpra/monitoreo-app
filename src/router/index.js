import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Users from "../views/Users.vue";
import GeoFenceMap from "../views/GeoFenceMap.vue";
import GeoFencesManagement from "../views/GeoFencesManagement.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/users", name: "Users", component: Users },
  { path: "/map", name: "Map", component: GeoFenceMap },
  { path: "/geofences", name: "Geo-Fance managing", component: GeoFencesManagement },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
