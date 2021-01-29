<template>
  <v-navigation-drawer
    v-model="drawer"
    color="#F0F9FC"
    permanent
    expand-on-hover
    app
  >
    <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar>
        <v-img :src="require('../assets/images/logo.jpg')"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Administrator
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

    <v-divider></v-divider>
    <v-list>
      <v-list-item class="nav-link" link to="/admin/">
        <img
          :src="require('../assets//images/icons/dashboard.png')"
          alt="John"
          class="icon"
        />

        <v-list-item-content class="nav-def">
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="nav-link" link to="/admin/enrollment">
        <img
          :src="require('../assets//images/icons/enrollment.png')"
          alt="John"
          class="icon"
        />

        <v-list-item-content class="nav-def">
          <v-list-item-title>Enrollment</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="nav-link" link to="/admin/all_students">
        <img
          :src="require('../assets//images/icons/all_students.png')"
          alt="John"
          class="icon"
        />

        <v-list-item-content class="nav-def">
          <v-list-item-title>All Students</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="nav-link" link to="/admin/all_teachers">
        <img
          :src="require('../assets//images/icons/all_teachers.png')"
          alt="John"
          class="icon"
        />

        <v-list-item-content class="nav-def">
          <v-list-item-title>All Teachers</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="nav-link" link to="/admin/all_sections">
        <img
          :src="require('../assets//images/icons/all_sections.png')"
          alt="John"
          class="icon"
        />

        <v-list-item-content class="nav-def">
          <v-list-item-title>All Sections</v-list-item-title>
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