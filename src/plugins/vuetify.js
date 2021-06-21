import Vue from 'vue'
import Vuetify from 'vuetify'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Vuetify)

const theme = {
  primary: '#006a4e',
  secondary: '#2e856e',
  danger: '#B71C1C',
  accent: '#34987d',
  info: '#3bab8d',
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