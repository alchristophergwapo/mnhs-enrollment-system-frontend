<template>
  <v-app>
    <div
      v-if="isLoading === false"
      class="data-container"
    >
      <app-bar :user_details="user" />
      <div class="stdnt-dash-container">
        <br>
        <v-row>
          <v-col
            sm="3
        "
          >
            <student-detail :student-details="userInfo" />
          </v-col>
          <v-col sm="9">
            <v-card>
              <v-card
                class="table-header"
                color="#2e856e"
              >
                <v-tabs
                  v-model="tab"
                  fixed-tabs
                  background-color="#2e856e"
                  color="white"
                  show-arrows
                  dark
                  icons-and-text
                >
                  <v-tabs-slider color="white" />

                  <v-tab href="#tab-1">
                    My Schedule
                    <v-icon large>
                      mdi-clock
                    </v-icon>
                  </v-tab>

                  <v-tab href="#tab-2">
                    My Section
                    <v-icon large>
                      mdi-google-classroom
                    </v-icon>
                  </v-tab>
                </v-tabs>
              </v-card>
              <v-tabs-items v-model="tab">
                <v-tab-item :value="'tab-1'">
                  <schedules :section-id="userInfo.section ? userInfo.section.id : 0" />
                </v-tab-item>
                <v-tab-item :value="'tab-2'">
                  <student-class-details
                    :teacher_name="
                      userInfo.section && userInfo.section.adviser
                        ? userInfo.section.adviser.teacher_name
                        : 'No Adviser'
                    "
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-footer
        dark
        padless
      >
        <v-card
          flat
          tile
          width="100%"
          class="primary white--text text-center"
        >
          <v-card-text>
            <h1 class="pb-2 white--text">
              You can contact us at
            </h1>
            <v-btn
              class="ma-2"
              text
              icon
              color="white lighten-2"
              href="https://www.facebook.com/MantalongonNHSOfficial.Dalaguete/"
            >
              <v-icon>mdi-facebook</v-icon>
            </v-btn>

            <v-btn
              class="ma-2"
              text
              icon
              color="white lighten-2"
              href="http://mantalongonnhs.weebly.com/contact-us.html"
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

          <v-divider />

          <v-card-text class="white--text">
            Copyright 2021 - {{ new Date().getFullYear() }}
            <a
              class="white--text"
              href="https://google.com"
            >Online Enrollment System for Mantalongon National High School</a>
          </v-card-text>
        </v-card>
      </v-footer>
    </div>
    <div
      v-else
      class="preloading-container"
      style="height: 100vh; margin: 3%"
    >
      <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <div class="text-center">
          <v-progress-circular
            :rotate="-90"
            :size="100"
            :value="loaded"
            color="teal darken-4"
            :width="15"
          >
            {{ loaded }}
          </v-progress-circular>
        </div>
      </v-row>
    </div>
  </v-app>
</template>

<script>
import AppBar from /* webpackChunkName: "AppBar" */ "@/layout/AppBar.vue";
import StudentDetail from /* webpackChunkName: "StudentDetails" */ "@/components/studentpage/StudentDetails.vue";
import StudentClassDetails from /* webpackChunkName: "StudentClassDetails" */ "@/components/studentpage/StudentClassDetails.vue";
import Schedules from /* webpackChunkName: "Schedules" */ "@/components/studentpage/Schedules.vue";
import { EventBus } from "../../bus/bus";
export default {
  components: {
    AppBar,
    StudentDetail,
    StudentClassDetails,
    Schedules,
  },
  data() {
    return {
      user: [],
      userInfo: null,
      panel: [],
      tab: null,
      loaded: 0,
      isLoading: true,
    };
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  },
  created() {
    this.initialize();
    EventBus.$on("enrolled", () => {
      this.initialize();
    });
  },
  methods: {
    initialize() {
      this.isLoading = true;
      let storedInfo = localStorage.getItem("user");
      let userData = JSON.parse(storedInfo);
      this.user = userData.user;
      let interval = setInterval(() => {
        if (this.loaded >= 100) {
          this.loaded = 0;
        }
        this.loaded += 10;
      }, 500);
      this.$axios
        .get(`student/details/${userData.user.username}`)
        .then((res) => {
          this.loaded = 100;
          this.userInfo = res.data.myInfo;
          console.log(this.user);
          this.isLoading = false;
          clearInterval(interval);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onResize() {
      if (window.innerWidth >= 960) {
        this.panel = [...Array(4).keys()].map((k, i) => i);
      } else {
        this.panel = [];
      }
    },
  },
};
</script>

<style>
.stdnt-dash-container {
  margin: 150px 3% 5% 3%;
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
