<template>
  <div>
    <bread-crumb
      :item="items"
      pageName="Enrollment"
    />
    <br><br>
    <v-container>
      <v-row
        align="center"
        justify="end"
      >
        <v-btn
          color="primary"
          rounded
          link
          to="/enroll"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <div class="table">
      <v-card
        class="table-header"
        color="#2e856e"
      >
        <v-card-title class="text-center justify-center">
          <div class="display-2 font-weight-light">
            Enrollments
          </div>
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
            <v-icon
              color="info"
              large
            >
              mdi-account-alert
            </v-icon>
          </v-tab>

          <v-tab
            href="#tab-2"
            @click="triggerRefreshDeclinedData()"
          >
            Declined
            <v-icon
              color="error"
              large
            >
              mdi-account-minus
            </v-icon>
          </v-tab>
        </v-tabs>
        <!-- </v-container> -->
      </v-card>
      <v-tabs-items v-model="enrollmentTab">
        <v-tab-item :value="'tab-1'">
          <pending-enrollment :is-data-loaded="dataLoaded" />
        </v-tab-item>
        <v-tab-item :value="'tab-2'">
          <declined-enrollments :is-data-loaded="pDataLoaded" />
        </v-tab-item>
      </v-tabs-items>
      <br>
    </div>
  </div>
</template>
<script>
import { EventBus } from "../bus/bus";
import BreadCrumb from /* webpackChunkName: "BreadCrumb" */ "@/layout/BreadCrumb.vue";
import PendingEnrollment from /* webpackChunkName: "PendingEnrollment" */ "@/components/enrollment-data/PendingEnrollment.vue";
import DeclinedEnrollments from /* webpackChunkName: "DeclinedEnrollments" */ "@/components/enrollment-data/DeclinedEnrollments.vue";

export default {
  components: {
    BreadCrumb,
    PendingEnrollment,
    DeclinedEnrollments,
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

  methods: {
    triggerRefreshDeclinedData() {
      EventBus.$emit("refresh");
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
