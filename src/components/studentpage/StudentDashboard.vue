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
            :section_name="user.section.adviser ? user.section.adviser.name : 'No Adviser'"
            :classmates="students"
          ></student-class-details>
        </v-col>
      </v-row>
    </v-container>

    <v-footer dark padless>
      <v-card flat tile width="100%" class="primary white--text text-center">
        <v-card-text>
          <h1 class="pb-2 white--text"> You can contact us at</h1>
         <v-btn class="ma-2" text icon color="white lighten-2"  href="http://mantalongonnhs.weebly.com/">
            <v-icon>mdi-facebook</v-icon>
        </v-btn>

         <v-btn class="ma-2" text icon color="white lighten-2" href="http://mantalongonnhs.weebly.com/">
            <v-icon>mdi-google</v-icon>
        </v-btn>

         <v-btn class="ma-2" text icon color="white lighten-2" href="http://mantalongonnhs.weebly.com/">
            <v-icon>mdi-web</v-icon>
        </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          Copyright 2021 - {{ new Date().getFullYear() }} <a class="white--text"
            href="https://google.com">Online Enrollment System for Mantalongon National High School</a>
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
  },
  data() {
    return {
      user: [],
      students: [],
      panel: [],
    };
  },
   beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  },

  methods: {
    initialize() {
      this.user = this.$store.getters.userInfo;
      console.log(this.user);
      let classmates = this.$store.getters.classmates;
      for (const key in classmates) {
        if (classmates.hasOwnProperty.call(classmates, key)) {
          const element = classmates[key];
          this.students.push(element["student"]);
          // console.log(element);
        }
      }
    },
    onResize() {
      if (window.innerWidth >= 960) {
        this.panel = [...Array(4).keys()].map((k, i) => i);
      } else {
        this.panel = [];
      }
    }
  },

  created() {
    this.initialize();
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
@media (min-width:960px) {
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