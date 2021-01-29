import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/index'
import Axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$axios = Axios

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
