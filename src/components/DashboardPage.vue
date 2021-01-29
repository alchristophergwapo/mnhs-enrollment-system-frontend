<template>
  <div id="app" app>
    <bread-crumb :item="items" page_name="Dashboard"></bread-crumb>
    <br />
    <br />
    <br />
    <v-container>
      <v-row>
        <v-col sm="6" md="4">
          <v-card class="mx-auto" height="100%" color="#26c6da" dark max-width="300">
            <v-card-text class="headline font-weight-bold">
              <v-avatar class="ma-3" size="125" tile>
                <img :src="require('../assets/images/student.png')" alt="" />
              </v-avatar>
              <div id="text">
                <span class="title font-weight-bold">{{ Students }}</span>
                <br />
                <span class="title font-weight-light">Students</span>
              </div>
            </v-card-text>
            <v-btn id="btn" block link to="/admin/all_students">
              All Students
              <v-icon dark right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card>
        </v-col>

        <v-col sm="6" md="4">
          <v-card class="mx-auto" height="100%" color="#26c6da" dark max-width="300">
            <v-card-text class="headline font-weight-bold">
              <v-avatar class="ma-3" size="125" tile>
                <img :src="require('../assets/images/teachers.png')" alt="" />
              </v-avatar>
              <div id="text">
                <span class="title font-weight-bold">{{ Teachers }}</span>
                <br />
                <span class="title font-weight-light">Teachers</span>
              </div>
            </v-card-text>
            <v-btn id="btn" block link to="/admin/all_teachers">
              All Teachers
              <v-icon dark right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card>
        </v-col>

        <v-col sm="6" md="4">
          <v-card class="mx-auto" height="100%" color="#26c6da" dark max-width="300">
            <v-card-text class="headline font-weight-bold">
              <v-avatar class="ma-3" size="125" tile>
                <img :src="require('../assets/images/section.png')" alt="" />
              </v-avatar>
              <div id="text">
                <span class="title font-weight-bold">{{ Sections }}</span>
                <br />
                <span class="title font-weight-light">Sections</span>
              </div>
            </v-card-text>
            <v-btn id="btn" block link to="/admin/all_sections">
              All Sections
              <v-icon dark right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>



<script>
export default {
  components:{
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
  },
  data: () => ({
    Students: "40",
    Teachers: "15",
    Sections: "5",
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Dashboard",
        disabled: true,
        href: "breadcrumbs_link_2",
      },
    ],
  }),
};
</script>



<style>
#btn:hover,
#btn:focus {
  text-decoration: none;
}

#students {
  width: 30%;
}

#text {
  float: right;
  margin-right: 35px;
  margin-top: 40px;
  text-align-last: right;
}
</style>