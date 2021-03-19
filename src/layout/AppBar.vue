<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="header-title"
      >Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title
    >

    <v-spacer></v-spacer>

    <div class="notif" v-if="user_details.user_type == 'admin'">
      <v-menu offset-y origin="center center" transition="scale-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="markAsRead()" icon text v-on="on" v-bind="attrs">
            <v-badge
              :content="notifications"
              :value="unreadNotification.length"
              color="red"
              overlap
            >
              <v-icon medium color="white">mdi-bell</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in allNotifications" :key="index">
            <v-list-item-title
              >{{ item.data.enrollment.student_id }} submitted a new
              enrollment.</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-if="$route.name != 'AdminProfile'">
      <span style="color: white">{{ user_details.username }}</span>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="label"
            ><span v-if="user_details.type == 'student'">Hello, </span
            >{{ user_details.firstname }}</span
          >
          <v-icon v-if="user_details.type == 'admin'" v-bind="attrs" v-on="on"
            >mdi-chevron-down</v-icon
          >
        </template>

        <v-list>
          <v-list-item link to="/admin/profile">
            <v-list-item-title>Profile Settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
      notifications: 4,
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
          this.allNotifications = [];
        });
    },
  },
  created() {
    let storedInfo = localStorage.getItem("user");
    let userData = JSON.parse(storedInfo);
    this.user_details = userData.user;
    console.log(this.user_details);
    this.allNotifications = userData.user.notifications;
    this.notifications = this.allNotifications.length;
    console.log(this.allNotifications);
  },
  computed: {
    unreadNotification() {
      return this.allNotifications.filter((notification) => {
        return notification.read_at == null;
      });
    },
  },
};
</script>
