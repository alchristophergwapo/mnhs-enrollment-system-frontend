<template>
  <v-app id="sign-in">
    <v-container class="signin-container">
      <v-card
        class="card1"
        elevation="10"
        max-width="500px"
      >
        <v-btn
          icon
          link
          to="/"
        >
          <v-icon x-large>
            mdi-arrow-left
          </v-icon>
        </v-btn>
        <center>
          <img
            id="icons"
            :src="require('../assets/images/enroll.png')"
            alt=""
          >
        </center>
        <h3>MNHS Enrollment System</h3>
        <br>
        <v-card-text>
          <v-form
            ref="regAdminForm"
            v-model="valid"
            lazy-validation
            @submit.prevent=""
          >
            <v-row>
              <v-col cols="12">
                <div class="font-weight-bold">
                  <h4>Username</h4>
                </div>
                <v-text-field
                  v-model="username"
                  :rules="[(value) => !!value || 'Username is required!']"
                  maxlength="20"
                  outlined
                  required
                  @keyup="enterKeyTriggered"
                />
              </v-col>
              <v-spacer />

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
                />
              </v-col>
              <v-spacer />
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
              <v-col
                cols="12"
                class="d-flex ml-auto"
                style="align-items: center"
              >
                <router-link to="/forgot-password">
                  Forgot Password?
                </router-link>
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

      if (this.$refs.regAdminForm.validate()) {
        this.loading = true;
        this.$store
          .dispatch("login", data)
          .then((response) => {
            this.loading = false;
            const user = response.data.user;
            this.$user = user;
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
          .catch(() => {
            this.showError("Invalid Credentials!");
            this.loading = false;
          });
      }
    },

    showError(message) {
      this.$swal.fire({
        icon: "error",
        title: "Ooops....",
        text: message,
      });
    },
  },
};
</script>
