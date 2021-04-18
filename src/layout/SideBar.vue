<template>
  <v-navigation-drawer v-model="sidebarMenu" color="#F0F9FC" permanent app>
    <v-list-item class="px-2">
      <v-list-item-avatar size="50">
        <v-img src="../assets/images/mnhs-logo.png"></v-img>
      </v-list-item-avatar>
      <v-list-item-title style="font-weight: bold; font-size: 20px"
        >ADMINISTRATOR</v-list-item-title
      >
    </v-list-item>
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
</template>

<script>
import { EventBus } from "../bus/bus";
export default {
  data() {
    return {
      sidebarMenu: true,
    };
  },
  created() {
    EventBus.$on("toggleSidebar", () => {
      console.log("clicked");
      this.sidebarMenu = !this.sidebarMenu;
    });
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
</style>