// Importa Vuetify y sus estilos
import { createVuetify } from "vuetify";
import "vuetify/styles";

// Configura el tema de Vuetify
const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#1976D2",
          secondary: "#424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
    },
  },
});

export default vuetify;
