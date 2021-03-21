import Vue from 'vue'

import App from './App.vue'

import vuetify from './plugins/vuetify'
import router from './router/index'
import store from "./store";

import 'sweetalert2/dist/sweetalert2.min.css';
import 'chartist/dist/chartist.min.css'
import './plugins/base'

import "./assets/stylesheet/style.css";

import VueNativeNotification from 'vue-native-notification'
import VueSweetalert2 from 'vue-sweetalert2';
import Axios from 'axios';

Vue.config.productionTip = false
Vue.prototype.$axios = Axios;

window.Vue = Vue;
Vue.use(require('vue-chartist'));
Vue.use(VueSweetalert2);
Vue.use(VueNativeNotification, {
  requestOnNotify: true
});

import Echo from "laravel-echo"

window.Pusher = require('pusher-js');

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_WEBSOCKET_KEY,
  wsHost: process.env.VUE_APP_WEBSOCKET_SERVER,
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
});

new Vue({
  vuetify,
  router,
  store,
  created() {
    this.initialize();
  },
  mounted: function () {
    // this.initialize();
    // this.$axios.get('broadcast').then(response => {
    //   console.log(response);
    // })
  },
  methods: {
    initialize() {
      const userInfo = localStorage.getItem('user')
      if (userInfo) {
        const userData = JSON.parse(userInfo)
        // console.log(userData);
        this.$store.commit('setUserData', userData)
        if (userData.user.user_type == 'admin') {
          if (userData.user.updated == 1) {
            this.$router.push({ path: '/admin' })
          } else {
            this.$router.push({ path: '/admin/profile' })
          }
        } if ((userData.user.user_type == 'student')) {
          if (userData.user.updated == 1) {
            this.$router.push({ path: '/student/dashboard' })
          } else {
            this.$router.push({ path: '/student/update-password' })
          }
        }
      }
    },

    setUserData(data) {
      let storedInfo = localStorage.getItem("user");
      let userData = JSON.parse(storedInfo);
      userData.user = data.user;
      this.$store.commit("setUserData", userData);
    },
  },
  render: h => h(App),
}).$mount('#app')



