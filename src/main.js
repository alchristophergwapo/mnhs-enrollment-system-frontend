import Vue from "vue";

import App from "./App.vue";

import vuetify from "./plugins/vuetify";
import router from "./router/index";
import store from "./store";

import "sweetalert2/dist/sweetalert2.min.css";
import "chartist/dist/chartist.min.css";
import "./plugins/base";

import "./assets/stylesheet/style.css";

import VueNativeNotification from "vue-native-notification";
import VueSweetalert2 from "vue-sweetalert2";
import Axios from "axios";
import VueMoment from "vue-moment";
import moment from "moment-timezone";

Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;
var user = null;

// Axios.get("/auth/init").then((response) => {
//   console.log(response);
// });
window.Vue = Vue;
Vue.use(require("vue-chartist"), {
  messageNoData: "You have not enough data",
  classNoData: "empty",
});
Vue.use(VueSweetalert2);
Vue.use(VueNativeNotification, {
  requestOnNotify: true,
});

Vue.use(VueMoment, {
  moment,
});

import Pusher from "pusher-js";

// window.Pusher.logToConsole = true;

Vue.prototype.$pusher = new Pusher("2041a966486dd958514c", {
  cluster: "mt1",
});

new Vue({
  // Echo,
  vuetify,
  router,
  store,
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        user = userData.user;
        Vue.prototype.$user = user;
        this.$store.commit("setUserData", userData);
        if (userData.user.user_type != "student") {
          if (userData.user.updated == 1) {
            this.$router.push({ path: "/admin" });
          } else {
            this.$router.push({ path: "/admin/profile" });
          }
        } else {
          if (userData.user.updated == 1) {
            this.$router.push({ path: "/student/dashboard" });
          } else {
            this.$router.push({ path: "/student/update-password" });
          }
        }
      }

      this.$store.dispatch("allSections");

      this.$store.dispatch("allTeacher");

      this.$store.dispatch("allStudents", null);

      this.$store.dispatch("allPendingEnrollments", null);

      this.$store.dispatch("allDeclinedEnrollments", null);
    },
  },
  render: (h) => h(App),
}).$mount("#app");
