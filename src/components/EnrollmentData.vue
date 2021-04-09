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
      <v-container>
        <!-- <v-card outlined> -->
        <v-card class="table-header" color="#2e856e">
          <v-card-title class="text-center justify-center">
            <div class="display-2 font-weight-light">Enrollments</div>
          </v-card-title>

          <div class="subtitle-1 font-weight-light text-center justify-center">
            All enrollments as of year {{ year }}
          </div>
          <v-container>
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
          </v-container>
        </v-card>
        <v-tabs-items v-model="enrollmentTab">
          <v-tab-item :value="'tab-1'">
            <pending-enrollment :students="students" :search="search">
              <template v-slot:data-table-header>
                <v-card-title>
                  <!-- Sort By&nbsp;&nbsp; -->
                  <v-select
                    :items="grade_level"
                    v-model="gradelevel"
                    @change="filterByGradeLevel($event, 'pending')"
                    label="Grade Level"
                    outlined
                  ></v-select>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    @keyup="filterByName(($event = search))"
                    append-icon="mdi-magnify"
                    label="Search"
                    outlined
                  ></v-text-field>
                </v-card-title>
              </template>
            </pending-enrollment>
          </v-tab-item>
          <v-tab-item :value="'tab-2'">
            <declined-enrollments
              :declinedEnrollments="declinedEnrollments"
              :searchDeclined="searchDeclined"
            >
              <template v-slot:data-table-header>
                <v-card-title>
                  Sort By&nbsp;&nbsp;
                  <v-select
                    :items="grade_level"
                    v-model="searchDeclined"
                    menu-props="auto"
                    label="Grade Level"
                    dense
                    outlined
                  ></v-select>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="searchDeclined"
                    @keyup="filterByName(($event = searchDeclined))"
                    append-icon="mdi-magnify"
                    label="Search"
                    outlined
                  ></v-text-field>
                </v-card-title>
              </template>
            </declined-enrollments>
          </v-tab-item>
        </v-tabs-items>
        <br />
        <!-- </v-card> -->
      </v-container>
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
    declinedEnrollments: [],
    filterDeclined: [],
    emitted: false,
  }),

  created() {
    if (!this.emitted) {
      // console.log("not from emit event");
      if (!this.students || !this.sections) {
        setTimeout(() => {
          this.initializeData();
        }, 3000);
      }
      this.initializeData();
    }
  },

  methods: {
    initializeData() {
      this.$store.dispatch("allPendingEnrollments").then((res) => {
        let pendingEnrollment = res;
        console.log(pendingEnrollment);
        for (var index in pendingEnrollment) {
          let element = pendingEnrollment[index];
          let studentData = element["student"];
          let enrollmentData = [];
          enrollmentData["enrollment_id"] = element["id"];
          enrollmentData["card_image"] = element["card_image"];
          enrollmentData["fullname"] = studentData["firstname"].concat(
            " ",
            studentData["lastname"]
          );
          for (const data in studentData) {
            const element1 = studentData[data];
            enrollmentData[data] = element1;
          }
          this.students.push(enrollmentData);
          this.filterStudents.push(enrollmentData);
        }
      });

      // console.log(this.students);
      this.$store.dispatch("allDeclinedEnrollments").then((response) => {
        for (var index in response) {
          let element = response[index];
          let declinedStudentData = element["student"];
          let declinedEnrollmentData = [];
          declinedEnrollmentData["enrollment_id"] = element["id"];
          declinedEnrollmentData["card_image"] = element["card_image"];
          declinedEnrollmentData["fullname"] = declinedStudentData[
            "firstname"
          ].concat(" ", declinedStudentData["lastname"]);
          for (const data in declinedStudentData) {
            const element1 = declinedStudentData[data];
            declinedEnrollmentData[data] = element1;
          }
          this.declinedEnrollments.push(declinedEnrollmentData);
          this.filterDeclined.push(declinedEnrollmentData);
        }
      });
    },

    //Methods For Filtering
    filterByGradeLevel(grade, tab) {
      if (grade == "All") {
        if (tab == "pending") {
          this.students = this.filterStudents;
        } else {
          this.declinedEnrollments = this.filterDeclined;
        }
      } else {
        if (tab == "pending") {
          this.search = grade;
        } else {
          this.declinedEnrollments = this.filterDeclined.filter(function (val) {
            return (val.grade_level = grade);
          });
        }
      }
    },

    //Method For Filtering The Name By A GradeLevel Or All GradeLevel
    filterByName(data) {
      // console.log(this.search);
      this.students = this.filterStudents.filter((val) => {
        if (this.gradelevel == null && data != null) {
          // console.log("here");
          return val.fullname
            .concat(" ", val.grade_level)
            .toLowerCase()
            .includes(data.toLowerCase());
        } else if (this.gradelevel == "All" && data != null) {
          return val.fullname
            .concat(" ", val.grade_level)
            .toLowerCase()
            .includes(data.toLowerCase());
        } else {
          if (val.grade_level == this.gradelevel) {
            if (data != null) {
              return val.fullname
                .concat(" ", val.grade_level)
                .toLowerCase()
                .includes(data.toLowerCase());
            } else {
              return val.fullname
                .concat(" ", val.grade_level)
                .toLowerCase()
                .includes(val.grade_level.toLowerCase());
            }
          }
        }
      });
    },

    //Method For Approving the enrollment
    approveEnrollment(id, index) {
      alert("approve:" + id);
      console.log(this.section);
      if (this.section) {
        this.$axios
          .post("approveEnrollment/" + id, { student_section: this.section })
          .then((response) => {
            console.log(response);
            this.students.splice(index, 1);
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Enrollment approved.",
            });
            this.dialog = false;
            this.sendSms(id);
            window.location.reload(true);
          })
          .catch((error) => {
            console.log(error);
            this.$swal.fire({
              icon: "error",
              title: "Ooops....",
              text: error.response.data.message,
            });
            this.dialog = true;
          });
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Ooops....",
          text: "Please select a section.",
        });
        this.dialog = true;
      }
    },
    //Sending a sms notification to a user's cellphone number
    sendSms(studentId) {
      this.$axios
        .get("send-sms/" + studentId)
        .then((response) => {
          if (response.data.success == "success") {
            this.$swal.fire({
              icon: "info",
              title: "Success",
              text: "Successfully send a notification.",
            });
          } else {
            this.$swal.fire({
              icon: "error",
              title: "Failed",
              text: "Not successfully send a notification.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //Method For Declining The Section
    declineEnrollment(id, index) {
      this.$axios
        .post("declineEnrollment/" + id)
        .then((response) => {
          console.log(response);
          this.$swal.fire({
            icon: "info",
            title: "Success",
            text: "Enrollment declined.",
          });
          this.students.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
