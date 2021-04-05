<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="header-title"
      >Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title
    >

    <v-spacer></v-spacer>

    <div class="notif" v-if="user_details.user_type == 'admin'">
      <!-- <v-menu
        offset-y
        rounded="0"
        bottom
        origin="center center"
        transition="scale-transition"
      > -->
      <!-- <template v-slot:activator="{ on, attrs }"> -->
      <v-btn @click="markAsRead()" icon text link to="/admin/notifications">
        <v-badge
          :content="notifications"
          :value="unreadNotification.length"
          color="red"
          overlap
        >
          <v-icon medium color="white">mdi-bell</v-icon>
        </v-badge>
      </v-btn>
      <!-- </template> -->
      <!-- <v-list>
          <v-list-item v-for="(item, index) in allNotifications" :key="index">
            <v-list-item-title
              >{{ item.data.enrollment.firstname }}
              {{ item.data.enrollment.lastname }} submitted a new
              enrollment.</v-list-item-title
            >
          </v-list-item>
        </v-list> -->
      <!-- </v-menu> -->
    </div>
    <div v-if="$route.name != 'AdminProfile'">
      <v-card-title>
        <span style="color: white" v-if="user_details.user_type == 'admin'">{{
          user_details.username
        }}</span>
        <span style="color: white" v-else
          >Hello, {{ user_details.firstname }}</span
        >
        <v-spacer></v-spacer>
        <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="user_details.user_type == 'admin'"
              v-bind="attrs"
              v-on="on"
              >mdi-chevron-down</v-icon
            >
          </template>

          <v-list>
            <v-list-item link to="/admin/profile">
              <v-list-item-title>Profile Settings</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
    </div>
    <v-btn text @click="logout" color="white">Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  // props: {
  //   user_details: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    return {
      user_details: null,
      notifications: 0,
      allNotifications: [],
    };
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
          console.log(response);
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
  },
  created() {
    let storedInfo = localStorage.getItem("user");
    let userData = JSON.parse(storedInfo);
    if (userData.user.user_type == "admin") {
      this.user_details = userData.user;
    } else {
      this.user_details = userData.userInfo;
    }
    console.log(userData);
    let notificationsFromStorage = userData.user.notifications;
    if (notificationsFromStorage) {
      this.allNotifications = notificationsFromStorage;
      this.notifications = this.unreadNotification.length;
    }
    // console.log(this.allNotifications);
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
  mounted() {
    if (this.user_details.user_type == "admin") {
      window.Echo.channel("student_enroll").listen(
        "StudentEnrollEvent",
        (eventData) => {
          console.log(eventData);
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
        }
      );
    }
  },
};
</script>
