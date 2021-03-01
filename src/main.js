import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/index'
import Axios from 'axios';
import store from "./store";
import VueSweetalert2 from 'vue-sweetalert2';
import VueNativeNotification from 'vue-native-notification'

Vue.config.productionTip = false
Vue.prototype.$axios = Axios;

window.Vue = Vue;
Vue.use(VueSweetalert2);
Vue.use(VueNativeNotification, {
  requestOnNotify: true
})

new Vue({
  vuetify,
  router,
  store,
  created() {
    // this.initialize();
  },
  mounted: function () {
    this.initialize();
  },
  methods: {
    initialize() {
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

      this.$store.dispatch('allTeacher').then(() => {
        this.$store.state.teachersIsLoaded = true
      })

      this.$store.dispatch('allStudents').then(() => {
        this.$store.state.studentsIsLoaded = true
      })

      this.$store.dispatch('allSections')
    }
  },
  render: h => h(App),
}).$mount('#app')



