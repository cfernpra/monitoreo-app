const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: [
    // Agrega las dependencias que deseas transpilar aquí
  ],

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
};

