import Vue from 'vue'
import Vuetify from 'vuetify'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Vuetify)

const theme = {
  primary: '#006a4e',
  secondary: '#2e856e',
  accent: '#9C27b0',
  info: '#00CAE3',
}

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
})