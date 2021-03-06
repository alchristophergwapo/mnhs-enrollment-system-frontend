<template>
  <div>
    <bread-crumb :item="items" page_name="Reports"></bread-crumb>
    <br /><br />
    <v-container id="dashboard" tag="section">
      <v-row>
        <chart
          :data="enrollmentChart.data"
          :options="enrollmentChart.options"
          :responsive-options="enrollmentChart.responsiveOptions"
          color="#E91E63"
          hover-reveal
          type="Bar"
        >
          <h4 class="card-title font-weight-light mt-2 ml-2">
            Enrolled Students
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Last Campaign Performance
          </p>
        </chart>
        <v-col cols="12" sm="6" lg="3">
          <status-cards
            color="info"
            icon_background_color="#00cae3"
            icon="mdi-account-multiple-check"
            title="Enrolled Students"
            :value="totalEnrolled"
          />
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <status-cards
            color="info"
            icon_background_color="#4caf50"
            icon="mdi-account-alert"
            title="Pending Enrollments"
            :value="totalPending"
          />
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <status-cards
            color="info"
            icon_background_color="red"
            icon="mdi-account-multiple-minus"
            title="Declined Enrollments"
            :value="totalDeclined"
          />
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <status-cards
            color="info"
            icon_background_color="orange"
            icon="mdi-account-multiple"
            title="Teachers"
            :value="totalTeachers"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
    Chart: () => import("@/layout/Chart.vue"),
    StatusCards: () => import("@/layout/StatusCards.vue"),
  },
  data: () => ({
    totalEnrolled: 0,
    totalPending: 0,
    totalDeclined: 0,
    totalTeachers: 0,
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Reports",
        disabled: true,
        href: "admin/students",
      },
    ],
    enrollmentChart: {
      data: {
        labels: [],
        series: [[]],
      },
      options: {
        axisX: {
          showGrid: false,
        },
        low: 0,
        high: 1000,
        chartPadding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 0,
        },
      },
      responsiveOptions: [
        [
          "screen and (max-width: 640px)",
          {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              },
            },
          },
        ],
      ],
    },
  }),
  created() {
    let enrollments = this.$store.getters.allStudents;
    this.totalEnrolled = enrollments.length;
    this.totalPending = this.$store.getters.allPendingEnrollments.length;
    this.totalDeclined = this.$store.getters.allDeclinedEnrollments.length;
    this.totalTeachers = this.$store.getters.totalTeachers;
    for (const index in enrollments) {
      if (enrollments.hasOwnProperty.call(enrollments, index)) {
        const element = enrollments[index];
        const school_year = element["start_school_year"];

        let exist = this.enrollmentChart.data.labels.some((item) => {
          return item === school_year;
        });
        if (!exist) {
          this.enrollmentChart.data.labels.push(school_year);
          let index = this.enrollmentChart.data.labels.indexOf(school_year);
          this.enrollmentChart.data.series[0][index] = 1;
        } else {
          let index = this.enrollmentChart.data.labels.indexOf(school_year);
          this.enrollmentChart.data.series[0][index] += 1;
        }
      }
    }
    console.log(this.enrollmentChart.data.labels);
    console.log(this.enrollmentChart.data.series);
  },
};
</script>

<style>
</style>
