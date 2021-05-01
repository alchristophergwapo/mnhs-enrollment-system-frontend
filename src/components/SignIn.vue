<template>
  <v-app id="sign-in">
    <v-container class="signin-container">
      <v-card class="card1" elevation="10" max-width="500px">
        <center>
          <img
            :src="require('../assets/images/enroll.png')"
            alt=""
            id="icons"
          />
        </center>
        <h3>MNHS Enrollment System</h3>
        <br />
        <v-card-text>
          <v-form
            v-on:submit.prevent=""
            ref="regAdminForm"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col cols="12">
                <div class="font-weight-bold">
                  <h4>Username</h4>
                </div>
                <v-text-field
                  v-model="username"
                  :rules="[(value) => !!value || 'Username is required!']"
                  @keyup="enterKeyTriggered"
                  maxlength="20"
                  outlined
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
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[(value) => !!value || 'Password is required!']"
                  :type="show ? 'text' : 'password'"
                  name="input-10-1"
                  outlined
                  @keyup="enterKeyTriggered"
                  @click:append="show = !show"
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="d-flex ml-auto">
                <v-btn
                  x-large
                  block
                  color="primary"
                  :loading="loading"
                  :disabled="!valid"
                  @click="signIn()"
                >
                  <h4>Sign In</h4>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>


<script>
export default {
  components: {},
  data: () => ({
    loading: false,
    show: false,
    valid: true,
    username: "",
    password: "",

    response: null,
    message: "",
  }),

  computed: {},

  watch: {},

  methods: {
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    enterKeyTriggered(e) {
      if (e.keyCode === 13) this.signIn();
    },

    signIn() {
      let data = {
        username: this.username,
        password: this.password,
      };

      this.loading = true;

      if (this.$refs.regAdminForm.validate()) {
        this.$store
          .dispatch("login", data)
          .then((response) => {
            this.loading = false;
            const user = response.data.user;
            this.$user = user;
            console.log(this.$user);
            console.log(response);
            if (user.user_type != "student") {
              if (user.updated == 0) {
                this.$router.push({ path: "/admin/profile" });
              } else {
                this.$router.push({ path: "/admin" });
              }
            } else {
              if (user.updated == 0) {
                this.$router.push({ path: "student/update-password" });
              } else {
                this.$router.push({ path: "student/dashboard" });
              }
            }
          })
          .catch((error) => {
            // console.log(error.response);
            this.showError(error.response.data.error);
            this.loading = false;
          });
      }
    },

    showError(message) {
      this.$swal.fire({
        icon: "error",
        title: "Oooops....",
        text: message,
      });
    },
  },
};
</script>
