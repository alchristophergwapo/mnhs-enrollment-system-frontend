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
      <!-- <v-container> -->
      <!-- <v-card outlined> -->
      <v-card class="table-header" color="#2e856e">
        <v-card-title class="text-center justify-center">
          <div class="display-2 font-weight-light">Enrollments</div>
        </v-card-title>

        <div class="subtitle-1 font-weight-light text-center justify-center">
          All enrollments as of year {{ year }}
        </div>
        <!-- <v-container> -->
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
          >
          </declined-enrollments>
        </v-tab-item>
      </v-tabs-items>
      <br />
      <!-- </v-card> -->
      <!-- </v-container> -->
    </div>
  </div>
</template>
<script>
// import { EventBus } from "../bus/bus.js";
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
    grade_level: ["7", "8", "9", "10", "11", "12", "All"],
    sections: [],
  }),

  created() {},

  methods: {},
};
</script>

<style scoped>
@media screen and (max-width: 767.98px) {
  .container {
    padding: 0px;
  }
}
</style>
