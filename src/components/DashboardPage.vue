<template>
  <div>
    <bread-crumb :item="items" page_name="Dashboard"></bread-crumb>
    <br /><br />
    <v-container id="dashboard" tag="section">
      <v-row>
        <v-col cols="12" lg="5" class="enrollment-chart">
          <!-- <chart
            :data="enrollmentChart.data"
            :options="enrollmentChart.options"
            :responsive-options="enrollmentChart.responsiveOptions"
            color="#E91E63"
            hover-reveal
            type="Bar"
            v-if="initialized"
          > -->
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
              This is a sub description.
            </p>
            <hr />
            <div class="legends">
              <v-card-title class="text-center justify-center">
                <div class="font-weight-light">Legend</div>
              </v-card-title>
              <div class="legend">
                <v-row>
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-card-title class="text-center justify-center">
                      <div class="sheet-container">
                        <v-sheet
                          class="d-flex"
                          color="#006a4e"
                          elevation="1"
                          height="40"
                          width="10"
                        >
                          <!-- <sheet-footer>Male </sheet-footer> -->
                        </v-sheet>
                      </div>
                      <div>Male</div>
                    </v-card-title>
                  </v-col>
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-card-title class="text-center justify-center">
                      <div class="sheet-container">
                        <v-sheet
                          class="d-flex"
                          color="#f05b4f"
                          elevation="1"
                          height="40"
                          width="10"
                        >
                          <!-- <sheet-footer>Male </sheet-footer> -->
                        </v-sheet>
                      </div>
                      <br />
                      <div>Female</div>
                    </v-card-title>
                  </v-col>
                </v-row>
              </div>
            </div>
            <br />
          </chart>
        </v-col>
        <v-col cols="12" lg="7">
          <v-row>
            <v-col cols="12" md="6" lg="6">
              <status-cards
                color="info"
                icon_background_color="#00b4cc"
                icon="mdi-account-multiple-check"
                title="Enrolled Students"
                :value="totalEnrolled"
              >
                <template v-slot:actions>
                  <v-btn
                    id="btn"
                    block
                    link
                    to="/admin/all_students"
                    elevation="24"
                  >
                    see all
                    <v-icon dark right>mdi-arrow-right</v-icon>
                  </v-btn>
                </template>
              </status-cards>
            </v-col>
            <v-col cols="12" md="6" lg="6">
              <status-cards
                color="info"
                icon_background_color="#2e856e"
                icon="mdi-account-alert"
                title="Pending Enrollments"
                :value="totalPending"
              >
                <template v-slot:actions>
                  <v-btn
                    id="btn"
                    block
                    link
                    to="/admin/enrollment"
                    elevation="24"
                  >
                    see all
                    <v-icon dark right>mdi-arrow-right</v-icon>
                  </v-btn>
                </template>
              </status-cards>
            </v-col>
            <v-col cols="12" md="6" lg="6">
              <status-cards
                icon_background_color="#ff4d4d"
                icon="mdi-account-multiple-minus"
                title="Declined Enrollments"
                :value="totalDeclined"
              >
                <template v-slot:actions>
                  <v-btn id="btn" block link elevation="24">
                    see all
                    <v-icon dark right>mdi-arrow-right</v-icon>
                  </v-btn>
                </template>
              </status-cards>
            </v-col>
            <v-col cols="12" md="6" lg="6">
              <status-cards
                color="info"
                icon_background_color="orange"
                icon="mdi-account-multiple"
                title="Teachers"
                :value="totalTeachers"
              >
                <template v-slot:actions>
                  <v-btn
                    id="btn"
                    block
                    link
                    to="/admin/all_teachers"
                    elevation="24"
                  >
                    see all
                    <v-icon dark right>mdi-arrow-right</v-icon>
                  </v-btn>
                </template>
              </status-cards>
            </v-col>
          </v-row>
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
    initialized: false,
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Dashboard",
        disabled: true,
      },
    ],
    enrollmentChart: {
      data: {
        labels: [],
        series: [[0], [0]],
      },
      options: {
        // seriesBarDistance: 10,
        axisX: {
          showGrid: false,
        },
        low: 0,
        high: 2500,
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
            seriesBarDistance: 10,
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
    setTimeout(() => {
      this.initializeData();
      this.initialized = true;
    }, 3000);
    this.initializeData();
  },
  mounted: () => {},
  methods: {
    initializeData() {
      this.enrollmentChart.data.series = [[0], [0]];
      let enrollments = this.$store.getters.allStudents;
      this.totalEnrolled = enrollments.length;
      this.totalPending = this.$store.getters.allPendingEnrollments.length;
      this.totalDeclined = this.$store.getters.allDeclinedEnrollments.length;
      this.totalTeachers = this.$store.getters.totalTeachers;
      for (const index in enrollments) {
        if (enrollments.hasOwnProperty.call(enrollments, index)) {
          const element = enrollments[index];
          const school_year = element["start_school_year"];
          let gender = element["student"]["gender"];

          let exist = this.enrollmentChart.data.labels.some((item) => {
            return item === school_year;
          });
          if (!exist) {
            this.enrollmentChart.data.labels.push(school_year);
            let index = this.enrollmentChart.data.labels.indexOf(school_year);
            if (gender == "Male") {
              this.enrollmentChart.data.series[0][index] = 1;
            }
            if (gender == "Female") {
              this.enrollmentChart.data.series[1][index] = 1;
            }
          } else {
            let index = this.enrollmentChart.data.labels.indexOf(school_year);
            if (gender == "Male") {
              if (this.enrollmentChart.data.series[0][index] != null) {
                this.enrollmentChart.data.series[0][index] += 1;
              } else {
                this.enrollmentChart.data.series[0][index] = 1;
              }
            }
            if (gender == "Female") {
              if (this.enrollmentChart.data.series[1][index] != null) {
                this.enrollmentChart.data.series[1][index] += 1;
              } else {
                this.enrollmentChart.data.series[1][index] = 1;
              }
            }
          }
        }
      }
      // console.log(this.enrollmentChart.data.labels);
      // console.log(this.enrollmentChart.data.series);
    },
  },
};
</script>

<style>
/* .enrollment-chart {
  max-height: 400px;
} */
</style>
