<template>
  <v-app-bar app color="primary">
    <v-toolbar-title class="header-title"
      >Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title
    >

    <v-spacer></v-spacer>

    <div class="notif" v-if="user.type == 'admin'">
      <v-btn icon link to="/admin/notifications">
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
    <div v-if="$route.name != 'AdminProfile'">
      <span style="color: white">{{ user.username }}</span>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="label"
            ><span v-if="user.type == 'student'">Hello, </span
            >{{ user.firstname }}</span
          >
          <v-icon v-if="user.type == 'admin'" v-bind="attrs" v-on="on"
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
  props: ["user_details"],
  data() {
    return {
      notifications: 4,
      user: this.user_details,
    };
  },

  methods: {
    logout() {
      this.$router.push({ path: "/" });
      this.$store.dispatch("logout");
    },
  },
};
</script>
