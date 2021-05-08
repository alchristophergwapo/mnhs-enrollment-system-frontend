<template>
  <v-app id="sign-in">
    <v-card
      width="100%"
      max-width="500px"
      max-height="100%"
      outlined
      elevation="24"
      class="my-12 update-card"
    >
      <v-card-title class="text-center justify-center">
        <img src="../../assets/images/update.png" alt="" width="150px" />
        <h3>Update Account Information</h3>
      </v-card-title>
      <v-container>
        <v-form ref="update" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            name="username"
            label="Username"
            readonly
            outlined
          ></v-text-field>
          <v-text-field
            v-model="currentPass"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            name="currentpassword"
            label="Current Password"
            @click:append="showPass = !showPass"
            @keydown="clearErrors"
            @keyup="enterKeyTriggered"
            :error="hasError('currentpassword')"
            outlined
          >
          </v-text-field>
          <div>
            <p v-if="hasError('currentpassword')" class="invalid-feedback">
              {{ getError("currentpassword") }}
            </p>
          </div>
          <v-text-field
            v-model="newpassword"
            :append-icon="showNPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showNPass ? 'text' : 'password'"
            label="New Password"
            name="new_password"
            @click:append="showNPass = !showNPass"
            @keydown="clearErrors"
            @keyup="enterKeyTriggered"
            :error="hasError('new_password')"
            outlined
          ></v-text-field>
          <div>
            <p v-if="hasError('new_password')" class="invalid-feedback">
              {{ getError("new_password") }}
            </p>
          </div>
          <v-text-field
            v-model="confirmPass"
            :append-icon="showCPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showCPass ? 'text' : 'password'"
            label="Confirm Password"
            name="confirm_password"
            @click:append="showCPass = !showCPass"
            @keydown="clearErrors"
            @keyup="enterKeyTriggered"
            :error="hasError('confirm_password')"
            outlined
          ></v-text-field>
          <div>
            <p v-if="hasError('confirm_password')" class="invalid-feedback">
              {{ getError("confirm_password") }}
            </p>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-4" color="error" @click="clear">clear</v-btn>
            <v-btn
              class="mr-4"
              color="primary"
              @click="submit"
              :loading="loading"
              :disabled="loading || !valid"
              >submit</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-container>
    </v-card>
  </v-app>
</template>
<script>
export default {
  //   props: {
  //     username: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  data() {
    return {
      valid: false,
      username: null,
      currentPass: "",
      newpassword: "",
      confirmPass: "",
      loading: false,
      showPass: "",
      showNPass: "",
      showCPass: "",
      errors: {},
      userDetails: null,
    };
  },
  created() {
    const user = localStorage.getItem("user");
    this.userDetails = JSON.parse(user);
    if (this.userDetails.user.user_type == "student") {
      this.username = this.userDetails.user.username;
    }
  },
  methods: {
    enterKeyTriggered(e) {
      if (e.keyCode === 13) this.submit();
    },
    submit() {
      if (this.$refs.update.validate()) {
        this.loading = true;
        this.$axios
          .post(`change`, {
            username: this.username,
            currentpassword: this.currentPass,
            new_password: this.newpassword,
            confirm_password: this.confirmPass,
          })
          .then((response) => {
            this.loading = false;
            if (response.data.message) {
              this.currentPass = null;
              this.newpassword = null;
              this.confirmPass = null;
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Password is successfully changed.",
              });
              this.userDetails.user.updated = 1;
              this.$store.commit("setUserData", this.userDetails);
              this.$router.push({ path: "/student/dashboard" });
            } else {
              this.$swal.fire({
                icon: "warning",
                title: "Oops!",
                text: "Your current password is wrong!",
              });
            }
          })
          .catch((error) => {
            this.loading = false;
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Oooops....",
                html: "<b>" + error.response.data.message + "</b>",
                focusConfirm: false,
                confirmButtonText: "OK",
              });
            }
          });
      }
    },

    //Methods For All Errors
    setErrors(error) {
      this.errors = error;
    },

    hasError(fieldname) {
      return fieldname in this.errors;
    },

    clearErrors(event) {
      this.$delete(this.errors, event.target.name);
    },

    getError(fieldName) {
      return this.errors[fieldName][0];
    },

    clear() {
      this.currentPass = null;
      this.newpassword = null;
      this.confirmPass = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
    },
  },
};
</script>
<style scoped>
.invalid-feedback {
  margin-top: -20px;
  margin-bottom: 20px;
}

@media screen and (max-width: 767.98px) {
  .invalid-feedback {
    margin-top: -19px;
    margin-bottom: 19px;
  }
}
</style>