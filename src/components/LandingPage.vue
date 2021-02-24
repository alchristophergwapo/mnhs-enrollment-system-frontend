<template>
  <div class="body">
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
        <br />
        <div class="login-btn">
          <v-btn class="ma-2" outlined color="indigo" link to="/sign-in"
            >login</v-btn
          >
        </div>
      </div>
    </div>

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
          color="success"
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

    <v-container>
      <v-row>
        <v-col md="4">
          <v-card
            class="mx-auto"
            height="100%"
            color="#8bd3f0"
            light
            max-width="1000"
          >
            <v-card-text>
              <h3>MISSION</h3>
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

        <v-col md="4">
          <v-card
            class="mx-auto"
            height="100%"
            color="#8bd3f0"
            light
            max-width="1000"
          >
            <v-card-text>
              <h3>VISION</h3>
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

        <v-col md="4">
          <v-card
            class="mx-auto"
            height="100%"
            color="#8bd3f0"
            light
            max-width="1000"
          >
            <v-card-text>
              <h3>CORE VALUES</h3>
              <ul>
                <li>Maka-Diyos</li>
                <li>Makatao</li>
                <li>Makakalikasan</li>
                <li>Makabansa</li>
              </ul>
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

<style>
.body {
  padding-left: 3%;
  padding-right: 3%;
}

.mx-auto {
  padding: 10px;
  text-align: justify;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.footer-copyright {
  text-align: center;
  font-size: 20px;
}

.btn {
  color: white;
  text-transform: uppercase;
  background-image: linear-gradient(#48a7ff 100%, #48a7ff 100%, #64d8fd 100%);
  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15));
  font-size: 30px;
  position: relative;
  top: 75%;
  right: 80%;
}

.header {
  margin-bottom: 0.2%;
  display: table;
  width: 100%;
  table-layout: fixed;
  border-spacing: 10px;
  background-color: #3bbdda;
}
.col {
  display: table-cell;
}
#col1 {
  width: 20%;
  text-align: center;
}
#col2 {
  text-align: center;
  width: 60%;
  font-size: 30px;
  margin-top: -5%;
  color: rgb(220, 240, 247);
  position: relative;
  top: -50px;
}
#col3 {
  width: 20%;
}

#logo {
  width: 120px;
  height: 120px;
}
#logo2 {
  width: 120px;
  height: 120px;
}

.login-btn {
  position: absolute;
  right: 60px;
}

/* On screens that are 600px wide or less, the background color is olive */
@media screen and (max-width: 600px) {
  #logo {
    margin-left: 20%;
    width: 60px;
    height: 60px;
  }
  #logo2 {
    position: relative;
    right: 60%;
    width: 60px;
    height: 60px;
  }

  #col2 {
    text-align: center;
    width: 60%;
    font-size: 15px;
    color: rgb(220, 240, 247);
    position: relative;
    top: -18px;
  }
  .btn {
    color: white;
    text-transform: uppercase;
    background-image: linear-gradient(#48a7ff 100%, #48a7ff 100%, #64d8fd 100%);
    filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15));
    font-size: 30px;
    margin-top: 0%;
    align-content: center;
  }
}
</style>