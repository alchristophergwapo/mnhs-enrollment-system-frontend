<template>
  <div>
    <v-carousel cycle height="500" :show-arrows="false">
      <v-carousel-item
        :src="require('../assets/images/mnhs.jpg')"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
      <v-carousel-item
        :src="require('../assets/images/mnhs1.jpg')"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
      <v-carousel-item
        :src="require('../assets/images/mnhs2.jpg')"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
    </v-carousel>
    <v-footer padless>
      <v-card flat tile width="100%">
        <v-card-text>
          <div class="footer-container">
            <h1>Mantalongon National High School</h1>
          </div>
        </v-card-text>
        <v-card-text class="pt-0">
          <div class="footer-container">
            <h2>Welcome you this year's enrollment</h2>
          </div>
        </v-card-text>

        <v-card-text>
          <v-row align="center" justify="space-around">
            <v-btn rounded color="success" class="btn" link to="/enroll">
              <v-icon left> mdi-pencil </v-icon>
              enroll now
            </v-btn>
          </v-row>
        </v-card-text>

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
};
</script>

<style>
.footer-container {
  padding-top: 20px;
  width: 100%;
  text-align: center;
}

.footer-container h1 {
  font-style: normal;
  font-weight: 600;
  font-size: 35px;
  line-height: 25px;
  color: #48a7ff;
}
.footer-container h2 {
  font-style: normal;
  font-weight: 600;
  color: #d2daff;
  font-size: 25px;
}

.footer-copyright {
  text-align: center;
  font-size: 20px;
}

.btn {
  margin-right: 40%;
  margin-left: 40%;
  color: white;
  margin-top: 30px;
  margin-bottom: 20px;
  text-transform: uppercase;
  background-image: linear-gradient(#48a7ff 100%, #48a7ff 100%, #64d8fd 100%);
  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15));
}
</style>