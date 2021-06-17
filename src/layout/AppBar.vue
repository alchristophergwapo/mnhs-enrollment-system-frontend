<template>
  <v-app-bar
    app
    color="primary"
    dark
    elevation="0"
    class="toolbar-content"
  >
    <v-avatar @click="$router.push({ path: '/' })">
      <v-img :src="require('../assets/images/logo.jpg')" />
    </v-avatar>
    <v-toolbar-title class="toolbar-title">
      <h4>Mantalongon National High School</h4>
      <span>Mantalongon, Dalaguete Cebu</span>
    </v-toolbar-title>

    <v-spacer />

    <div
      v-if="user_details.user_type == 'admin'"
      class="notif"
    >
      <v-btn
        icon
        text
        link
        to="/admin/notifications"
        @click="markAsRead()"
      >
        <v-badge
          :content="notifications"
          :value="unreadNotification.length"
          color="red"
          overlap
        >
          <v-icon
            medium
            color="white"
          >
            mdi-bell
          </v-icon>
        </v-badge>
      </v-btn>
    </div>
    <div v-if="$route.name != 'AdminProfile'">
      <v-card-title>
        <span
          v-if="user_details.user_type == 'admin'"
          style="color: white"
        >{{
          user_details.username
        }}</span>
        <span
          v-else
          style="color: white"
        >Hello, {{ user_details.firstname }}</span>
        <v-spacer />
        <v-menu
          left
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="user_details.user_type == 'admin'"
              v-bind="attrs"
              v-on="on"
            >
              mdi-chevron-down
            </v-icon>
          </template>

          <v-list>
            <v-list-item
              link
              to="/admin/profile"
            >
              <v-list-item-title>Profile Settings</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
    </div>
    <v-btn
      text
      color="white"
      @click="logout"
    >
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
import { EventBus } from "../bus/bus";
export default {
  data() {
    return {
      user_details: null,
      notifications: 0,
      allNotifications: [],
    };
  },
  computed: {
    unreadNotification() {
      if (this.allNotifications) {
        return this.allNotifications.filter((notification) => {
          return notification.read_at == null;
        });
      } else {
        return null;
      }
    },
  },
  created() {
    let storedInfo = localStorage.getItem("user");
    let userData = JSON.parse(storedInfo);
    console.log(userData);
    if (userData.user.user_type == "admin") {
      this.user_details = userData.user;
    } else {
      console.log('here');
      this.user_details = userData.userInfo;
    }
    let notificationsFromStorage = userData.user.notifications;
    if (notificationsFromStorage) {
      this.allNotifications = notificationsFromStorage;
      this.notifications = this.unreadNotification.length;
    }
  },
  mounted() {
    if (this.user_details.user_type == "admin") {
      window.Echo.private(
        "App.Models.User." + this.user_details.id
      ).notification((eventData) => {
        this.allNotifications.push(eventData.notification);
        this.notifications = this.unreadNotification.length;
        this.setUserData(eventData);
        let enrollmentData = eventData.student_enrolled;
        this.$notification.show(
          "New Enrollment",
          {
            body: `${enrollmentData.firstname} ${enrollmentData.lastname} submitted an enrollment.`,
          },
          {}
        );
      });
    }
  },

  methods: {
    logout() {
      this.$router.push({ path: "/" });
      this.$store.dispatch("logout");
    },
    markAsRead() {
      this.$axios
        .get(`mark-all-read/${this.user_details.id}`)
        .then((response) => {
          this.notifications = 0;
          this.setUserData(response.data);
        });
    },

    setUserData(data) {
      let storedInfo = localStorage.getItem("user");
      let userData = JSON.parse(storedInfo);
      userData.user = data.user;
      this.$store.commit("setUserData", userData);
    },

    toggleSideBar() {
      EventBus.$emit("toggleSidebar", "click");
    },
  },
};
</script>

<style scoped lang="scss">
.toolbar-content {
  height: 80px !important;
  padding: 8px;
  position: fixed;
  z-index: 999;
  width: 100%;

  .toolbar-title {
    margin-left: 20px;
    text-align: center;

    h4 {
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.08rem;
    }

    span {
      font-size: 15px;
      letter-spacing: 0.1rem;
    }
  }

  .form-container {
    padding-top: 64px !important;
  }
}
</style>
