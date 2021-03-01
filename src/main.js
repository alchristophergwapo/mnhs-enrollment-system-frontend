import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/index'
import Axios from 'axios';
import store from "./store";
import VueSweetalert2 from 'vue-sweetalert2';

Vue.config.productionTip = false
Vue.prototype.$axios = Axios;

window.Vue = Vue;
Vue.use(VueSweetalert2);

new Vue({
  vuetify,
  router,
  store,
  created() {
    const userInfo = localStorage.getItem('user')
    if (userInfo) {
      const userData = JSON.parse(userInfo)
      this.$store.commit('setUserData', userData)
      if (userData.user.user_type == 'admin') {
        this.$router.push({ path: '/admin' })
      } else {
        this.$router.push({ path: '/student/dashboard' })
      }
    }
  },
  render: h => h(App),
}).$mount('#app')



