<template>
  <v-app-bar app color="#3BBDDA">
    <v-toolbar-title>Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title>

    <v-spacer></v-spacer>

    <div class="notif">
      <v-btn icon link to="/admin/notifications">
        <v-badge
          :content="notifications"
          :value="notifications"
          color="green"
          overlap
        >
          <v-icon large>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </div>
    <div v-if="$route.name != 'AdminProfile'">
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="label">Admin</span>
          <v-icon v-bind="attrs" v-on="on">mdi-chevron-down</v-icon>
        </template>

        <v-list>
          <v-list-item link to="/admin/profile">
            <v-list-item-title>Profile Settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-btn text link to="/">Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      notifications: 1,
    };
  },
};
</script>

<style>
.notif {
  margin-right: 20px;
}
</style>