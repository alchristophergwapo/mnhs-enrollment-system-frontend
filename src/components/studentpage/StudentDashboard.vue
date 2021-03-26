<template>
  <v-app>
    <app-bar :user_details="user.firstname"></app-bar>
    <v-container class="stdnt-dash-container">
      <v-card-title class="justify-center header-title">
        Congrats, you are officially enrolled to MNHS!
      </v-card-title>
      <v-row>
        <v-col sm="4" md="4" lg="4">
          <student-detail :student_details="user"></student-detail>
        </v-col>
        <v-col sm="8" md="8" lg="8" class="class_details">
          <student-class-details
            :section_name="user.section.adviser.name"
            :classmates="students"
          ></student-class-details>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  components: {
    AppBar: () => import("@/layout/AppBar.vue"),
    StudentDetail: () => import("@/components/studentpage/StudentDetails.vue"),
    StudentClassDetails: () =>
      import("@/components/studentpage/StudentClassDetails.vue"),
  },
  data() {
    return {
      user: [],
      students: [],
    };
  },

  methods: {
    initialize() {
      let storedInfo = localStorage.getItem("user");
      let userData = JSON.parse(storedInfo);
      this.user = userData.userInfo;
      let classmates = userData.classmates;
      for (const key in classmates) {
        if (classmates.hasOwnProperty.call(classmates, key)) {
          const element = classmates[key];
          this.students.push(element["student"]);
          // console.log(classmates["student"]);
        }
      }
      // console.log(this.students);
    },
  },

  created() {
    this.initialize();
  },
};
</script>

<style>
.stdnt-dash-container {
  margin-top: 100px;
}

.header-title {
  font-family: Manrope;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 190%;
  /* or 28px */

  color: #259b69;
}

.class_details {
  border: 1px solid #c4bbbb;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.v-data-table-header {
  background: rgba(78, 190, 215, 0.33);
}
</style>