<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="0">
      <v-app-bar-nav-icon
        @click="sidebarMenu = !sidebarMenu"
        color="white"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="header-title" v-if="!mini"
        >Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <div class="notif" v-if="user_details.user_type == 'admin'">
        <v-btn
          @click="markAsRead()"
          color="accent"
          link
          to="/admin/notifications"
          class="app-bar-btns"
        >
          <v-badge
            :content="notifications"
            :value="notifications"
            color="red"
            overlap
          >
            <v-icon medium color="white">mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </div>
      <!-- <div v-if="$route.name != 'AdminProfile'"> -->
      <v-card-title>
        <v-menu offset-y open-on-hover bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="info" class="app-bar-btns">
              <v-icon dark color="white"> mdi-account-circle </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item link to="/admin/profile" class="nav-link">
              <v-list-item-title>Profile Settings</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-account-cog</v-icon></v-list-item-icon
              >
            </v-list-item>
            <v-list-item @click="logout" class="nav-link">
              <v-list-item-title>Logout </v-list-item-title>
              <v-list-item-icon
                ><v-icon>mdi-logout-variant</v-icon></v-list-item-icon
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
    </v-app-bar>
    <!-- src="../assets/images/mnhs_bg.jpg" -->
    <v-navigation-drawer
      v-model="sidebarMenu"
      app
      :permanent="sidebarMenu"
      :mini-variant.sync="mini"
    >
      <v-list-item class="px-2" style="background: #006a4e">
        <v-list-item-avatar size="50">
          <v-img src="../assets/images/mnhs-logo.png"></v-img>
        </v-list-item-avatar>
        <v-list-item-title
          style="font-weight: bold; font-size: 20px; color: white"
          >ADMINISTRATOR</v-list-item-title
        >
      </v-list-item>
      <v-divider></v-divider>
      <v-list>
        <template v-for="item in items">
          <v-list-item
            v-if="!item.children"
            :key="item.text"
            @click="currentSelection = item.text"
            class="nav-link"
            :to="item.to"
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content class="nav-def">
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.icon"
            class="nav-link"
          >
            <template v-slot:activator>
              <v-list-item class="activator-text">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item> </template
            ><br />
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              @click="
                item.model = false;
                currentSelection = child.text;
              "
              :class="[
                currentSelection == child.text ? 'grey' : '',
                'nav-link',
              ]"
              :to="child.to"
            >
              <!-- <v-list-item-content class="nav-def"> -->
              <v-list-item-title>
                {{ child.text }}
              </v-list-item-title>
              <v-list-item-icon v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-icon>
              <!-- </v-list-item-content> -->
            </v-list-item>
          </v-list-group>
        </template>
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
      subMenu: false,
      currentSelection: "",
      notifications: 0,
      items: [
        { icon: "mdi-view-dashboard", text: "Dashboard", to: "/admin" },
        {
          icon: "mdi-account-multiple-plus",
          text: "Enrollment",
          to: "/admin/enrollment",
        },
        {
          icon: "mdi-account-group",
          text: "Students",
          to: "/admin/all_students",
        },
        {
          icon: "mdi-account-tie",
          text: "Teachers",
          to: "/admin/all_teachers",
        },
        {
          icon: "mdi-google-classroom",
          append_icon: "mdi-chevron-down",
          "icon-alt": "mdi-chevron-up",
          text: "Sections",
          model: false,
          children: [
            {
              text: "Junior High",
              to: "/admin/sections/junior_high",
              icon: "mdi-home",
            },
            {
              text: "Senior High",
              to: "/admin/sections/senior_high",
              icon: "mdi-home-outline",
            },
          ],
        },
      ],
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

    this.$axios.get(`unreadNotif/${this.user_details.id}`).then((res) => {
      console.log(res);
      this.notifications = res.data.notifications.length;
      this.allNotifications = res.data.notifications;
      console.log(this.notifications);
    });
  },
  mounted() {
    if (this.user_details.user_type == "admin") {
      var channel = this.$pusher.subscribe("student-enroll");
      // console.log(channel);
      channel.bind("new-enrollment", (eventData) => {
        console.log(eventData);
        this.notifications += 1;
        this.allNotifications.push(eventData.notification);
        let enrollmentData = eventData.student;
        const notification = {
          title: "New Enrollment",
          options: {
            body: `${enrollmentData.firstname} ${enrollmentData.lastname} submitted an enrollment.`,
          },
          events: {
            onerror: function () {
              console.log("Custom error event was called");
            },
            onclick: function () {
              console.log("Custom click event was called");
            },
            onclose: function () {
              console.log("Custom close event was called");
            },
          },
        };
        this.$notification.show(
          notification.title,
          notification.options,
          notification.events
        );
        // this.$notification.show(
        //   "New Enrollment",
        //   {
        //     body: `${enrollmentData.firstname} ${enrollmentData.lastname} submitted an enrollment.`,
        //   },
        //   {}
        // );
      });
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
};
</script>

<style>
.v-list .v-list-item--active {
  color: white;
  background-color: #5ca08e;
}

.v-list .v-list-item:hover {
  background-color: #5ca08e;
}

.px-2 {
  padding-top: 30px !important;
  padding-bottom: 30px !important;
}
.main-view {
  margin: 10px;
}

.nav-link {
  margin: 0 8px 0 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  padding-top: 5px;
}

.activator-text {
  margin-left: -15px;
}

.v-list .v-list-item--active .v-list-item__content {
  color: blue;
}

.nav-def {
  position: absolute;
  left: 70px;
  /* color: white; */
}

img.icon {
  height: 35px;
  width: auto;
}

.label {
  margin-right: 20px;
}
</style>