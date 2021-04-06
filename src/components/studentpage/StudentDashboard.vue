<template>
  <v-app>
    <app-bar :user_details="user.firstname"></app-bar>
    <v-container class="stdnt-dash-container">
      <v-card-title class="justify-center header-title">
        Congrats, you are officially enrolled to MNHS!
      </v-card-title>
      <br />
      <v-row>
        <v-col
          sm="3
        "
        >
          <student-detail :student_details="user"></student-detail>
        </v-col>
        <v-col sm="9">
          <v-card>
            <v-card class="table-header" color="#2e856e">
              <v-tabs
                v-model="tab"
                fixed-tabs
                background-color="#2e856e"
                color="white"
                show-arrows
                dark
                icons-and-text
              >
                <v-tabs-slider color="white"></v-tabs-slider>

                <v-tab href="#tab-1">
                  My Schedule
                  <v-icon large>mdi-clock</v-icon>
                </v-tab>

                <v-tab href="#tab-2">
                  My Section
                  <v-icon large>mdi-google-classroom</v-icon>
                </v-tab>
              </v-tabs>
            </v-card>
            <v-tabs-items v-model="tab">
              <v-tabs-items v-model="tab">
                <v-tab-item :value="'tab-1'">
                  <schedules :sectionId="user.section.id"></schedules>
                </v-tab-item>
                <v-tab-item :value="'tab-2'">
                  <student-class-details
                    :section_name="
                      user.section.adviser
                        ? user.section.adviser.teacher_name
                        : 'No Adviser'
                    "
                    :classmates="students"
                  ></student-class-details>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-footer dark padless>
      <v-card flat tile width="100%" class="primary white--text text-center">
        <v-card-text>
          <h1 class="pb-2 white--text">You can contact us at</h1>
          <v-btn
            class="ma-2"
            text
            icon
            color="white lighten-2"
            href="http://mantalongonnhs.weebly.com/"
          >
            <v-icon>mdi-facebook</v-icon>
          </v-btn>

          <v-btn
            class="ma-2"
            text
            icon
            color="white lighten-2"
            href="http://mantalongonnhs.weebly.com/"
          >
            <v-icon>mdi-google</v-icon>
          </v-btn>

          <v-btn
            class="ma-2"
            text
            icon
            color="white lighten-2"
            href="http://mantalongonnhs.weebly.com/"
          >
            <v-icon>mdi-web</v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          Copyright 2021 - {{ new Date().getFullYear() }}
          <a class="white--text" href="https://google.com"
            >Online Enrollment System for Mantalongon National High School</a
          >
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  components: {
    AppBar: () => import("@/layout/AppBar.vue"),
    StudentDetail: () => import("@/components/studentpage/StudentDetails.vue"),
    StudentClassDetails: () =>
      import("@/components/studentpage/StudentClassDetails.vue"),
    Schedules: () => import("@/components/studentpage/Schedules.vue"),
  },
  data() {
    return {
      user: [],
      students: [],
      panel: [],
      tab: null,
    };
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
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

      const section = this.user.enrollment.student_section;

      this.$axios.get(`studentSectionDetails/${section}`).then((res) => {
        console.log(res);
        this.students = res.data.classmates;
        this.students.sort(this.sortData("lastname"));
      });
      // console.log(this.students);
    },

    sortData(property) {
      return function (data1, data2) {
        return data1[property].localeCompare(data2[property]);
      };
    },

    onResize() {
      if (window.innerWidth >= 960) {
        this.panel = [...Array(4).keys()].map((k, i) => i);
      } else {
        this.panel = [];
      }
    },
  },

  created() {
    this.initialize();
    // console.log(this.user);
  },
};
</script>

<style>
.stdnt-dash-container {
  margin-top: 100px;
  margin-bottom: 5%;
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
@media (min-width: 960px) {
  .v-expansion-panel:before {
    box-shadow: none !important;
  }
  .v-expansion-panel:not(:first-child)::after {
    border-top: none;
  }
}
.resize {
  text-align: center;
}
.resize {
  margin-top: 3rem;
  font-size: 1.25rem;
}
/*RESIZESCREEN ANIMATION*/
.right {
  animation: rightanime 1s linear infinite;
}

.left {
  animation: leftanime 1s linear infinite;
}
@keyframes rightanime {
  50% {
    transform: translateX(10px);
    opacity: 0.5;
  }
  100% {
    transform: translateX(10px);
    opacity: 0;
  }
}
@keyframes leftanime {
  50% {
    transform: translateX(-10px);
    opacity: 0.5;
  }
  100% {
    transform: translateX(-10px);
    opacity: 0;
  }
}
</style>