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
        <img
          src="../../assets/images/update.png"
          alt=""
          width="150px"
        >
      </v-card-title>
      <div class="text-center">
        <h3>Update Account Information</h3>
      </div>
      <br>
      <v-container>
        <v-form
          ref="update"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="username"
            name="username"
            label="Username"
            prepend-inner-icon="mdi-pencil"
            readonly
            outlined
          />
          <v-text-field
            v-model="email"
            :rules="[
              (value) =>
                (!!value && value.trim() != '') ||
                'The email field is required!',
              (value) =>
                /^\w+([\.-]?\w+)*@\w+([a-z\.-]?\w+)*(\.\w[a-z]{1,3})+$/.test(
                  value
                ) === true || 'Please enter a valid email!',
              (value) =>
                String(value).length <= 100 ||
                'The email may not be greater than 100 characters!',
            ]"
            prepend-inner-icon="mdi-email"
            name="email"
            label="Email"
            placeholder="Enter gmail account"
            :error="hasError('email')"
            dense
            outlined
            @keydown="clearErrors"
          />
          <div class="error-message">
            <p
              v-if="hasError('email')"
              class="invalid-feedback"
            >
              {{ getError("email") }}
            </p>
          </div>
          <v-text-field
            v-model="currentPass"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            name="currentpassword"
            label="Current Password"
            prepend-inner-icon="mdi-key-variant"
            :error="hasError('currentpassword')"
            outlined
            @click:append="showPass = !showPass"
            @keydown="clearErrors"
            @keyup="enterKeyTriggered"
          />
          <div>
            <p
              v-if="hasError('currentpassword')"
              class="invalid-feedback"
            >
              {{ getError("currentpassword") }}
            </p>
          </div>
          <v-text-field
            v-model="newpassword"
            :append-icon="showNPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showNPass ? 'text' : 'password'"
            label="New Password"
            prepend-inner-icon="mdi-key-variant"
            name="new_password"
            :error="hasError('new_password')"
            outlined
            @click:append="showNPass = !showNPass"
            @keydown="clearErrors"
            @keyup="enterKeyTriggered"
          />
          <div>
            <p
              v-if="hasError('new_password')"
              class="invalid-feedback"
            >
              {{ getError("new_password") }}
            </p>
          </div>
          <v-text-field
            v-model="confirmPass"
            :append-icon="showCPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showCPass ? 'text' : 'password'"
            label="Confirm Password"
            prepend-inner-icon="mdi-key-variant"
            name="confirm_password"
            :error="hasError('confirm_password')"
            outlined
            @click:append="showCPass = !showCPass"
            @keydown="clearErrors"
            @keyup="enterKeyTriggered"
          />
          <div>
            <p
              v-if="hasError('confirm_password')"
              class="invalid-feedback"
            >
              {{ getError("confirm_password") }}
            </p>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="mr-4"
              color="error"
              @click="clear"
            >
              clear
            </v-btn>
            <v-btn
              class="mr-4"
              color="primary"
              :loading="loading"
              :disabled="loading || !valid"
              @click="submit"
            >
              submit
            </v-btn>
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
      email: "",
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
            email: this.email,
            currentpassword: this.currentPass,
            new_password: this.newpassword,
            confirm_password: this.confirmPass,
          })
          .then((response) => {
            this.loading = false;
            if (response.data.message) {
              this.clear();
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Password is successfully changed.",
              });
              this.userDetails.user.updated = 1;
              this.$store.commit("setUserData", this.userDetails);
              this.$router.push({ path: "/sign-in" }).catch(() => {});
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
      this.email = null;
      this.currentPass = null;
      this.newpassword = null;
      this.confirmPass = null;
      this.errors = {};
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
