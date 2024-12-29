import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify"; // Usa la configuración existente de Vuetify
import { loadFonts } from "./plugins/webfontloader";
import router from "./router"; // Asegúrate de haber configurado Vue Router

// Cargar fuentes personalizadas
loadFonts();

// Crear la aplicación con Vue, Vuetify y Vue Router
createApp(App)
  .use(vuetify) // Usa la instancia existente de Vuetify
  .use(router)  // Usa Vue Router para la navegación
  .mount("#app");
