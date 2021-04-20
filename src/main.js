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
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

Vue.config.productionTip = false
Vue.prototype.$axios = Axios;

window.Vue = Vue;
Vue.use(require('vue-chartist'), {
  messageNoData: "You have not enough data",
  classNoData: "empty"
});
Vue.use(VueSweetalert2);
Vue.use(VueNativeNotification, {
  requestOnNotify: true
});

Vue.use(VueMoment, {
  moment,
})

// import Echo from "laravel-echo"
import { EventBus } from "./bus/bus.js";

import Pusher from 'pusher-js';

// window.Pusher.logToConsole = true;

Vue.prototype.$pusher = new Pusher('2041a966486dd958514c', {
  cluster: 'mt1'
})

new Vue({
  // Echo,
  vuetify,
  router,
  store,
  created() {
    this.initialize();
    // this.$store.dispatch('logout')
    EventBus.$on("sectionUpdated", () => {
      // console.log(data);
      this.$swal.fire({
        icon: "success",
        title: "Success",
        text: "Sections successfully updated.",
      });
    });
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

      this.$store.dispatch("allSections");

      this.$store.dispatch("allTeacher");

      this.$store.dispatch("allStudents");

      this.$store.dispatch("allPendingEnrollments");

      this.$store.dispatch("allDeclinedEnrollments");
    },
  },
  render: h => h(App),
}).$mount('#app')



