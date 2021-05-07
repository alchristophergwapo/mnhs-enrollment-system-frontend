<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="0">
      <v-app-bar-nav-icon
        @click="sidebarMenu = !sidebarMenu"
        color="white"
      ></v-app-bar-nav-icon>
      <!-- <v-toolbar-title class="header-title" v-if="!mini"
        >Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title
      > -->
      <v-toolbar-title
        class="toolbar-title"
        style="
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.2rem;
        "
      >
        <h4>Mantalongon National High School</h4>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="notif" v-if="user_details.user_type != 'student'">
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
    <v-navigation-drawer
      v-model="sidebarMenu"
      app
      :permanent="sidebarMenu"
      :mini-variant.sync="mini"
      :expand-on-hover="mini"
      width="280"
    >
      <v-list-item class="px-2" style="background: #006a4e">
        <v-list-item-avatar size="auto">
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
            v-if="!item.admin"
            :key="item.text"
            @click="currentSelection = item.text"
            class="nav-link"
            :to="item.to"
            exact
          >
            <v-list-item-action class="nav-icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content class="nav-def">
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-if="item.children && item.admin"
            :key="item.text"
            v-model="item.model"
            class="nav-link menu-link"
          >
            <template v-slot:activator>
              <v-list-item class="activator-text">
                <v-list-item-action class="nav-icon nav-icon-parent">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item> </template
            ><br />

            <div v-for="(child, i) in item.children" :key="i">
              <v-list-item
                v-if="!child.subChildren"
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
                <!-- <v-list-item-content> -->
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
                <v-list-item-icon v-if="child.icon" class="child-icon">
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-item-icon>
                <!-- </v-list-item-content> -->
              </v-list-item>
              <v-list-group v-else v-model="child.model" no-action sub-group>
                <template v-slot:activator>
                  <v-list-item-title>{{ child.text }}</v-list-item-title>
                  <v-list-item-icon>
                    <v-icon>{{ child.icon }}</v-icon>
                  </v-list-item-icon>
                </template>

                <v-list-item
                  v-for="(subChild, i) in child.subChildren"
                  :key="i"
                  @click="
                    item.model = false;
                    currentSelection = subChild.text;
                  "
                  :class="[
                    currentSelection == subChild.text ? 'grey' : '',
                    'sub-child-link',
                  ]"
                  :to="subChild.to"
                >
                  <v-list-item-title v-text="subChild.text"></v-list-item-title>
                  <v-list-item-icon>
                    <v-icon v-text="subChild.icon"></v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-group>
            </div>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
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
  data() {
    return {
      drawer: true,
      menuOpen: false,
      sidebarMenu: true,
      toggleMini: false,
      subMenu: false,
      juniorHighAdmin: true,
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
          text: "Sections",
          model: false,
          admin: this.$user ? this.$user.user_type == "admin" : true,
          to: this.juniorHighAdmin
            ? "/admin/sections/senior_high"
            : "/admin/sections/junior_high",
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
        {
          icon: "mdi-account-cog",
          text: "Account Management",
          model: false,
          admin: this.$user ? this.$user.user_type == "admin" : true,
          to: "/admin/student-password-management",
          children: [
            {
              text: "Student",
              model: false,
              subChildren: [
                {
                  icon: "mdi-account-key",
                  text: "Password Reset",
                  to: "/admin/student-password-management",
                },
              ],
            },
            {
              text: "Admin",
              model: false,
              subChildren: [
                {
                  icon: "mdi-account-plus",
                  text: "Add Admin",
                  to: "/admin/teacher-admin/add",
                },
                {
                  icon: "mdi-account-key",
                  text: "Reset Password",
                  to: "/admin/teacher-admin/reset-pass",
                },
              ],
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
    let adminLevel = null;
    if (this.$user) {
      let temp = this.$user.username.split("");
      adminLevel = temp[temp.length - 1];
      if (adminLevel < 11) {
        this.juniorHighAdmin = true;
      } else {
        this.juniorHighAdmin = false;
      }
    } else {
      window.location.reload();
    }
    let storedInfo = localStorage.getItem("user");
    let userData = JSON.parse(storedInfo);
    if (userData.user.user_type != "student") {
      this.user_details = userData.user;
    } else {
      this.user_details = userData.userInfo;
    }

    this.$axios.get(`unreadNotif/${this.user_details.id}`).then((res) => {
      this.notifications = res.data.notifications.length;
      this.allNotifications = res.data.notifications;
    });
  },
  mounted() {
    if (this.user_details.user_type == "admin") {
      var channel = this.$pusher.subscribe("student-enroll");
      channel.bind("new-enrollment", (eventData) => {
        this.notifications += 1;
        this.allNotifications.push(eventData.notification);
        let enrollmentData = eventData.student;
        const notification = {
          title: "New Enrollment",
          options: {
            body: `${enrollmentData.firstname} ${enrollmentData.lastname} submitted an enrollment.`,
          },
          events: {
            onerror: function () {},
            onclick: function () {},
            onclose: function () {},
          },
        };
        this.$notification.show(
          notification.title,
          notification.options,
          notification.events
        );
      });
    }
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

<style lang="scss">
.v-list .v-list-group__header.v-list-item--active {
  color: blue;
  background-color: white;
}

.v-list .v-list-group__header.v-list-item--active .v-list-item__content {
  color: blue;
}
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

.nav-icon {
  margin-left: -10px !important;
}

.v-list-group--sub-group .v-list-group__header__prepend-icon {
  margin-left: -15px;
}

.v-list-group--sub-group .sub-child-link {
  margin-left: -50px;
}

.menu-link .v-list-group__header__append-icon {
  position: absolute;
  right: 0;
}

.activator-text {
  margin-left: -15px;
}

.v-list .v-list-item--active .v-list-item__content {
  color: blue;
}

img.icon {
  height: 35px;
  width: auto;
}

.label {
  margin-right: 20px;
}

.v-avatar .v-image {
  width: 50px;
}

@media screen and (max-width: 986.98px) {
  .v-avatar .v-image {
    width: 40px;
  }
  .v-navigation-drawer--mini-variant
    .v-list-item
    .nav-icon-parent
    > *:first-child {
    margin-left: -14px;
  }
  .nav-link {
    margin: 0 3px 0 3px;
    margin-bottom: 10px;

    .nav-icon {
      margin-left: -5px !important;
    }
  }
}

@media (max-width: 768px) {
}
</style>