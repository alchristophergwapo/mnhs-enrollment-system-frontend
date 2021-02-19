import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/index'
import Axios from 'axios';
import store from "./store";

Vue.config.productionTip = false
Vue.prototype.$axios = Axios;

new Vue({
  vuetify,
  router,
  store,
  created() {
    const userInfo = localStorage.getItem('user')
    if (userInfo) {
      const userData = JSON.parse(userInfo)
      this.$store.commit('setUserData', userData)
      this.$router.push({ path: '/admin' })
      //console.log(userInfo);
    }
    this.$axios.interceptors.response.use(
      response =>response,
      error=>{
        if(error.response.status === 401){
          this.$store.dispatch('logout')
        }
        return Promise.reject(error)
      }
    )
  },
  render: h => h(App),
}).$mount('#app')



