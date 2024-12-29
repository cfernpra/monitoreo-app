import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css"; // Importa los íconos de Material Design

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#4285F4", // Azul de Google
          secondary: "#FFFFFF", // Fondo blanco
          accent: "#F4B400", // Amarillo de Google
          error: "#EA4335", // Rojo de Google
          success: "#34A853", // Verde de Google
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi", // Especifica que se usen los íconos de Material Design
  },
});
