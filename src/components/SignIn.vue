<template>
  <v-app id="sign-in">
    <v-container class="signin-container">
      <v-card class="card1" elevation="5">
        <center>
          <img
            :src="require('../assets/images/enroll.png')"
            alt=""
            id="icons"
          />
        </center>
        <h3>MNHS Enrollment System</h3>
        <br />
        <alert
          v-if="response"
          :alert_message="message"
          :alert_type="response"
        ></alert>
        <v-tabs
          v-model="tab"
          show-arrows
          background-color="light-blue"
          icons-and-text
          dark
          grow
        >
          <v-tabs-slider color="grey darken-4"></v-tabs-slider>
          <v-tab v-for="i in tabs" :key="i.name" padding="20">
            <br />
            <v-icon large>{{ i.icon }}</v-icon>
            <div class="caption py-1">{{ i.name }}</div>
          </v-tab>
          <v-tab-item>
            <v-card :loading="loading">
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                ></v-progress-linear>
              </template>
              <v-card-text>
                <v-form ref="regStudentForm" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <div class="font-weight-bold">
                        <h4>Learner's Reference No. (LRN)</h4>
                      </div>
                      <v-text-field
                        v-model="lrn"
                        :rules="[
                          (value) =>
                            !!value || `Learner's Reference No. is required!`,
                        ]"
                        maxlength="20"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col cols="12">
                      <div class="font-weight-bold">
                        <h4>Password</h4>
                      </div>
                      <v-text-field
                        id="pwd"
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[(value) => !!value || 'Password is required!']"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        :hint="
                          password.length >= 8 ? '' : 'At least 8 characters'
                        "
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex ml-auto">
                      <v-btn
                        x-large
                        block
                        :disabled="!valid"
                        color="info"
                        @click="student"
                      >
                        <h4>Sign In</h4>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card :loading="loading">
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-card-text>
                <v-form ref="regAdminForm" v-model="advalid" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <div class="font-weight-bold">
                        <h4>Username</h4>
                      </div>
                      <v-text-field
                        v-model="adminName"
                        :rules="[(value) => !!value || 'Username is required!']"
                        maxlength="20"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col cols="12">
                      <div class="font-weight-bold">
                        <h4>Password</h4>
                      </div>
                      <v-text-field
                        id="pwd"
                        v-model="adminPass"
                        :append-icon="adminshow ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[(value) => !!value || 'Password is required!']"
                        :type="adminshow ? 'text' : 'password'"
                        name="input-10-1"
                        :hint="
                          adminPass.length >= 8 ? '' : 'At least 8 characters'
                        "
                        @click:append="adminshow = !adminshow"
                      ></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex ml-auto">
                      <v-btn
                        x-large
                        block
                        color="info"
                        :disabled="!advalid"
                        @click="adminLogin"
                      >
                        <h4>Sign In</h4>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-container>
  </v-app>
</template>


<script>
import Alert from "../layout/Alert.vue";
export default {
  components: {
    Alert,
  },
  data: () => ({
    loading: false,
    st_sign_in: false,
    ad_sign_in: false,
    tab: 0,

    tabs: [
      { name: "Login as Enrollee", icon: "mdi-account" },
      { name: "Login as Admin", icon: "mdi-account-outline" },
    ],

    valid: true,
    advalid: true,
    lrn: "",
    password: "",

    adminName: "",
    adminPass: "",
    show1: false,
    adminshow: false,
    adrules: {
      username: (value) => !!value || "Username is required!",
      addpwd: (value) => !!value || "Password is required!",
    },

    response: null,
    message: "",
  }),

  computed: {},

  watch: {},

  methods: {
    student() {
      if (this.$refs.regStudentForm.validate()) {
        let data = {
          username: this.lrn,
          password: this.password,
          user_type: "student",
        };

        this.loading = true;
        this.$store
          .dispatch("login", data)
          .then(() => {
            this.loading = false;
            this.$router.push({ path: "/student/dashboard" });
          })
          .catch(() => {
            this.response = "error";
            this.message = "Invalid Credentials!";
            this.loading = false;
          });
        // this.$refs.regStudentForm.reset();
      }
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    adminLogin() {
      let data = {
        username: this.adminName,
        password: this.adminPass,
        user_type: "admin",
      };

      this.loading = true;

      if (this.$refs.regAdminForm.validate()) {
        this.$store
          .dispatch("login", data)
          .then(() => {
            this.loading = false;
            this.$router.push({ path: "/admin" });
          })
          .catch(() => {
            this.response = "error";
            this.message = "Invalid Credentials!";
            this.loading = false;
          });
      }
    },
    
  },
};
</script>


<style>
/* #app{
    background-color: rgb(57, 151, 206);
} */

.card1 {
  padding: 2%;
}

#pwd {
  width: 1px;
  height: 10px;
}

.img1 {
  width: 400px;
  height: 250px;
  margin-top: 15px;
}

h3 {
  font-size: 25px;
  letter-spacing: 1.5;
  text-align: center;
  color: rgb(46, 118, 160);
  font-weight: bolder;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.signin-container {
  width: 50%;
  margin-top: 8%;
}

#icons {
  width: 120px;
  height: 120px;
}

#sign-in {
  background: #3bbdda;
}

@media (max-width: 767px) {
  .signin-container {
    width: 100%;
  }
}
</style>