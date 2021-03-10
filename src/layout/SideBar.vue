<template>
  <v-navigation-drawer
    v-model="drawer"
    color="#F0F9FC"
    permanent
    expand-on-hover
    app
  >
   <v-list color="#3BBDDA">
      <div class="head" >
          <img :src="require('../assets/images/mnhs-logo.png')"  width="150" height="150"/>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                ADMINISTRATOR
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
      </div>
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

      <v-list-item class="nav-link" link to="/admin/reports" exact>
        <v-icon color="black">mdi-chart-bar</v-icon>

        <v-list-item-content class="nav-def">
          <v-list-item-title>Reports</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
    };
  },
};
</script>

<style lang="css" scoped>
  .head{
    text-align: center !important;
  }
</style>