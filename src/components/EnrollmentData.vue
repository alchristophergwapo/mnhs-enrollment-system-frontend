<template>
  <div>
    <bread-crumb :item="items" page_name="Enrollment"></bread-crumb>
    <br /><br />
    <v-container>
      <v-row align="center" justify="end">
        <v-btn color="primary" rounded link to="/enroll">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <div class="table">
      <v-card class="table-header" color="#2e856e">
        <v-card-title class="text-center justify-center">
          <div class="display-2 font-weight-light">Enrollments</div>
        </v-card-title>

        <div class="subtitle-1 font-weight-light text-center justify-center">
          All enrollments as of year {{ year }}
        </div>
        <v-tabs
          v-model="enrollmentTab"
          fixed-tabs
          background-color="#2e856e"
          color="white"
          show-arrows
          icons-and-text
        >
          <v-tab href="#tab-1">
            Pending
            <v-icon color="info" large>mdi-account-alert</v-icon>
          </v-tab>

          <v-tab href="#tab-2">
            Declined
            <v-icon color="error" large>mdi-account-minus</v-icon>
          </v-tab>
        </v-tabs>
        <!-- </v-container> -->
      </v-card>
      <v-tabs-items v-model="enrollmentTab">
        <v-tab-item :value="'tab-1'">
          <pending-enrollment
          >
          </pending-enrollment>
        </v-tab-item>
        <v-tab-item :value="'tab-2'">
          <declined-enrollments
            :declinedEnrollments="declinedEnrollments"
            :search="searchDeclined"
          >
          </declined-enrollments>
        </v-tab-item>
      </v-tabs-items>
      <br />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
    PendingEnrollment: () =>
      import("@/components/enrollment-data/PendingEnrollment.vue"),
    DeclinedEnrollments: () =>
      import("@/components/enrollment-data/DeclinedEnrollments.vue"),
  },
  data: () => ({
    gradelevel: null,
    declinedgradelevel: null,
    enrollmentTab: null,
    year: new Date().getFullYear(),
    toggle_exclusive: undefined,
    dialog: false,
    dataLoaded: false,
    pDataLoaded: false,
    section: null,
    search: "",
    searchDeclined: "",
    errors: {},
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Enrollment",
        disabled: true,
        href: "admin/enrollment",
      },
    ],
    id: null,
    index: null,
    students: [],
    filterStudents: [],
    declinedEnrollments: [],
    filterDeclined: [],
    grade_level: ["7", "8", "9", "10", "11", "12", "All"],
    sections: [],
  }),

  created() {
   
    this.initializeData();
    if (!this.students || !this.sections) {
      setTimeout(() => {
        this.initializeData();
      }, 3000);
    }
  },

  methods: {
    initializeData() {
      let pendingEnrollment = this.$store.getters.allPendingEnrollments;
      console.log(this.pendingEnrollment);
      this.$store.dispatch("allPendingEnrollments").then((res) => {
        this.dataLoaded = true;
        pendingEnrollment=res;
        //console.log(pendingEnrollment);
        for (var index in pendingEnrollment) {
          let element = pendingEnrollment[index];
          let studentData = element["student"];
          let enrollmentData = [];
          enrollmentData["enrollment_id"] = element["id"];
          enrollmentData["card_image"] = element["card_image"];
          enrollmentData["fullname"] = studentData["firstname"].concat(" ",studentData["lastname"]);
          for (const data in studentData) {
            const element1 = studentData[data];
            enrollmentData[data] = element1;
          }
          this.students.push(enrollmentData);
          this.filterStudents.push(enrollmentData);
        }
      });

      // console.log(this.students);
      let declinedEnrollments = this.$store.getters.allDeclinedEnrollments;
      this.$store.dispatch("allDeclinedEnrollments").then((response) => {
        this.pDataLoaded = true;
        declinedEnrollments = response;
        for (var index in declinedEnrollments) {
          let element = declinedEnrollments[index];
          let declinedStudentData = element["student"];
          let declinedEnrollmentData={};
          declinedEnrollmentData["index"] =index;
          declinedEnrollmentData["enrollment_id"] = element["id"];
          declinedEnrollmentData["card_image"] = element["card_image"];
          declinedEnrollmentData['remarks']=element['remark'];
          declinedEnrollmentData["fullname"] = declinedStudentData["firstname"].concat(" ", declinedStudentData["lastname"]);
          for (const data in declinedStudentData){
            const element1 = declinedStudentData[data];
            declinedEnrollmentData[data] = element1;
          }
          this.declinedEnrollments.push(declinedEnrollmentData);
          this.filterDeclined.push(declinedEnrollmentData);
        }
      });
    },

  },
};
</script>

<style scoped>
@media screen and (max-width: 767.98px) {
  .container {
    padding: 0px;
  }
}
</style>
