<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="0">
      <v-app-bar-nav-icon
        @click="sidebarMenu = !sidebarMenu"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="header-title"
        >Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <div class="notif" v-if="user_details.user_type == 'admin'">
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
    <v-navigation-drawer
      v-model="sidebarMenu"
      app
      floating
      :permanent="sidebarMenu"
      :mini-variant.sync="mini"
    >
      <v-list dense color="primary" dark text>
        <v-list-item class="px-2">
          <v-list-item-avatar size="50">
            <v-img src="../assets/images/mnhs-logo.png"></v-img>
          </v-list-item-avatar>
          <v-list-item-title style="font-weight: bold; font-size: 20px"
            >ADMINISTRATOR</v-list-item-title
          >
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item class="nav-link" link to="/admin/" exact>
          <v-icon color="black">mdi-view-dashboard</v-icon>

          <v-list-item-content class="nav-def">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="nav-link" link to="/admin/enrollment">
          <v-icon color="black">mdi-account-multiple-plus</v-icon>

          <v-list-item-content class="nav-def">
            <v-list-item-title>Enrollment</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="nav-link" link to="/admin/all_students">
          <v-icon color="black">mdi-account-group</v-icon>

          <v-list-item-content class="nav-def">
            <v-list-item-title>All Students</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="nav-link" link to="/admin/all_teachers">
          <v-icon color="black">mdi-account-tie</v-icon>

          <v-list-item-content class="nav-def">
            <v-list-item-title>All Teachers</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="nav-link" link to="/admin/all_sections" exact>
          <v-icon color="black">mdi-google-classroom</v-icon>

          <v-list-item-content class="nav-def">
            <v-list-item-title>All Sections</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- <side-bar></side-bar>
    <app-bar :user_details="user"></app-bar> -->
    <v-main>
      <div class="main-view">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "HomeLayout",
  components: {
    // SideBar: () => import("@/layout/SideBar.vue"),
    // AppBar: () => import("@/layout/AppBar.vue"),
  },
  data() {
    return {
      drawer: true,
      menuOpen: false,
      sidebarMenu: true,
      toggleMini: false,
      user: {
        type: "admin",
        username: "Admin",
      },
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
    mini() {
      return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
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

<style>
.main-view {
  margin: 10px;
}

.nav-link {
  margin-bottom: 15px;
  padding-bottom: 5px;
  padding-top: 5px;
}

.nav-link:hover {
  background: rgba(59, 189, 218, 0.5);
}

.nav-link:active {
  background-color: rgba(59, 189, 218);
}

.nav-def {
  position: absolute;
  left: 80px;
}

img.icon {
  height: 35px;
  width: auto;
}

.label {
  margin-right: 20px;
}
</style>