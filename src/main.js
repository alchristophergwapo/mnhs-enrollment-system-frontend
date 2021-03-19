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
import Echo from "laravel-echo"

window.Pusher = require('pusher-js');

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'somekey',
  cluster: 'mt1',
  wsHost: 'http://127.0.0.1',
  wsPort: 6001,
  forceTLS: false,
  disableStats: true
});


Vue.config.productionTip = false
Vue.prototype.$axios = Axios;

window.Vue = Vue;
Vue.use(require('vue-chartist'));
Vue.use(VueSweetalert2);
Vue.use(VueNativeNotification, {
  requestOnNotify: true
});


new Vue({
  vuetify,
  router,
  store,
  created() {
    this.initialize();

    window.Echo.join(`chat`)
      .here((users) => {
        //
        console.log("present users: ", users);
      })
      .joining((user) => {
        console.log(user.name);
      })
      .leaving((user) => {
        console.log(user.name);
      });
  },
  mounted: function () {
    // this.initialize();
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
    }
  },
  render: h => h(App),
}).$mount('#app')



