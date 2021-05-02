<template>
  <div class="body" app>
    <v-card tile style="background-color: #006a4e">
      <div class="header">
        <div class="col" id="col1">
          <img id="logo" src="../assets/images/mnhs-logo.png" />
        </div>
        <div class="col" id="col2">
          <h2>Online Enrollment System</h2>
          <h6>Mantalongon National High School</h6>
          <h6>Mantalongon, Dalaguete Cebu</h6>
        </div>
        <div class="col" id="col3">
          <img id="logo2" src="../assets/images/deped-logo.png" />
        </div>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          style="
            background-color: #006a4e;
            color: white;
            letter-spacing: 0.3rem;
          "
          link
          to="/sign-in"
          ><b>login</b></v-btn
        >
      </v-card-actions>
    </v-card>
    <v-carousel cycle height="500" :show-arrows="false">
      <v-carousel-item
        :src="require('../assets/images/mnhs.jpg')"
        reverse-transition="fade-transition"
        transition="fade-transition"
      >
        <v-btn rounded color="success" class="btn" x-large link to="/enroll">
          <v-icon left> mdi-pencil </v-icon>
          enroll now
        </v-btn>
      </v-carousel-item>

      <v-carousel-item
        :src="require('../assets/images/mnhs1.jpg')"
        reverse-transition="fade-transition"
        transition="fade-transition"
      >
        <v-btn rounded color="success" class="btn" x-large link to="/enroll">
          <v-icon left> mdi-pencil </v-icon>
          enroll now
        </v-btn></v-carousel-item
      >
      <v-carousel-item
        :src="require('../assets/images/mnhs2.jpg')"
        reverse-transition="fade-transition"
        transition="fade-transition"
      >
        <v-btn
          color="primary"
          class="btn"
          link
          to="/enroll"
          rounded
          x-large
          elevation="9"
        >
          <v-icon left> mdi-pencil </v-icon>
          enroll now
        </v-btn>
      </v-carousel-item>
    </v-carousel>

    <v-container class="l-container">
      <v-row>
        <v-col cols="12" sm="6" md="4" class="l-col">
          <v-card
            elevation="10"
            height="100%"
            max-width="500px"
            light
            class="l-card"
          >
            <v-card class="table-header" color="#006a4e">
              <v-card-title class="text-center justify-center">
                <div class="display-2 font-weight-light">MISSION</div>
              </v-card-title>
            </v-card>
            <v-card-text>
              <p>
                To protect and promote the right of every Filipino to quality,
                equitable, culture-based, and complete basic education where:
                students learn in a child-friendly, gender-sensitive, safe, and
                motivating environment; teachers facilitate learning and
                constantly nurture every learner; administrators and staff, as
                stewards of the institution, ensure an enabling and supportive
                environment for effective learning to happen; family, community,
                and other stakeholders are actively engaged and share
                responsibility for developing life-long learners.
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="l-col">
          <v-card
            elevation="10"
            height="100%"
            light
            max-width="100%"
            class="l-card"
          >
            <v-card class="table-header" color="#006a4e">
              <v-card-title class="text-center justify-center">
                <div class="display-2 font-weight-light">VISION</div>
              </v-card-title>
            </v-card>
            <v-card-text>
              <p>
                We dream of Filipinos who passionately love their country and
                whose competencies and values enable them to realize their full
                potential and contribute meaningfully to building the nation. We
                are a learner-centered public institution that continuously
                improves itself to pursue its mission.
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="l-col">
          <v-card height="100%" light max-width="1000" class="l-card">
            <v-card class="table-header" color="#006a4e">
              <v-card-title class="text-center justify-center">
                <div class="display-2 font-weight-light">CORE VALUES</div>
              </v-card-title>
            </v-card>
            <v-card-text>
              <v-container>
                <ul>
                  <li>Maka-Diyos</li>
                  <li>Makatao</li>
                  <li>Makakalikasan</li>
                  <li>Makabansa</li>
                </ul>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-footer padless>
      <v-card flat tile width="100%">
        <v-divider></v-divider>
        <v-card-text class="footer-copyright">
          {{ new Date().getFullYear() }} —
          <strong>Mantalongon, Dalaguete NHS</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const userData = JSON.parse(userInfo);
      this.$store.commit("setUserData", userData);
      if (userData.user_type == "admin") {
        this.$router.push({ path: "/admin" });
      }
      console.log(userInfo);
    }
  },
};
</script>
