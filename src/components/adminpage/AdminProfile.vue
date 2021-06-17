<template>
  <v-app class="admin-profile">
    <v-container>
      <v-card
        class="profile-card"
        width="100%"
        max-width="500px"
        outlined
        elevation="24"
      >
        <div
          class="icon-container"
          :style="'background: #006a4e'"
        >
          <v-icon
            style="color: white"
            large
          >
            mdi-account
          </v-icon>
        </div>
        <template>
          <div class="ml-auto text-right">
            <div class="body-3 grey--text font-weight-light" />
            <h3 id="card-header-title">
              ADMIN PROFILE
            </h3>
            <v-btn
              icon
              link
              to="/admin"
              class="close-icon"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </template>
        <v-divider />
        <v-card-title>
          <v-spacer />
          <v-row>
            <h2>Mantalongon National High School</h2>
          </v-row>
        </v-card-title>
        <div class="subtitle">
          <span>Mantalongon, Dalaguete, Cebu</span>
        </div>
        <br>
        <v-divider />
        <br>
        <v-container>
          <v-form>
            <div class="field-label">
              <label for="username">Username</label>
            </div>
            <v-text-field
              v-model="username"
              prepend-inner-icon="mdi-pencil"
              name="username"
              placeholder="Username"
              :readonly="true"
              dense
              outlined
            />
            <div class="field-label">
              <label for="currentpassword">Email</label>
            </div>
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
            <div class="field-label">
              <label for="currentpassword">Current Password</label>
            </div>
            <v-text-field
              v-model="currentPass"
              prepend-inner-icon="mdi-key-variant"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              name="currentpassword"
              placeholder="Enter current password"
              :error="hasError('currentpassword')"
              dense
              outlined
              @click:append="showPass = !showPass"
              @keydown="clearErrors"
            />
            <div class="error-message">
              <p
                v-if="hasError('currentpassword')"
                class="invalid-feedback"
              >
                {{ getError("currentpassword") }}
              </p>
            </div>
            <div class="field-label">
              <label for="new_password">New Password</label>
            </div>
            <v-text-field
              v-model="newpassword"
              prepend-inner-icon="mdi-key-variant"
              :append-icon="showNPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showNPass ? 'text' : 'password'"
              placeholder="Enter new password"
              name="new_password"
              :error="hasError('new_password')"
              dense
              outlined
              @click:append="showNPass = !showNPass"
              @keydown="clearErrors"
            />
            <div class="error-message">
              <p
                v-if="hasError('new_password')"
                class="invalid-feedback"
              >
                {{ getError("new_password") }}
              </p>
            </div>
            <div class="field-label">
              <label for="confirm_password">Confirm Password</label>
            </div>
            <v-text-field
              v-model="confirmPass"
              prepend-inner-icon="mdi-key-variant"
              :append-icon="showCPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showCPass ? 'text' : 'password'"
              placeholder="Enter confirmation password"
              name="confirm_password"
              :error="hasError('confirm_password')"
              dense
              outlined
              @click:append="showCPass = !showCPass"
              @keydown="clearErrors"
            />
            <div class="error-message">
              <p
                v-if="hasError('confirm_password')"
                class="invalid-feedback"
              >
                {{ getError("confirm_password") }}
              </p>
            </div>
          </v-form>
        </v-container>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="submit-btn"
            color="green"
            :loading="loading"
            :disabled="hasAnyErors"
            @click="submit"
          >
            submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "AdminProfile",
  props: {},
  data() {
    return {
      username: null,
      email: null,
      currentPass: null,
      newpassword: null,
      confirmPass: null,
      loading: false,
      showPass: "",
      showNPass: "",
      showCPass: "",
      errors: {},
      userData: null,
    };
  },

  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
  mounted: function() {
    //Get Admin Profile
    const userInfo = localStorage.getItem("user");
    this.userData = JSON.parse(userInfo);
    if (this.userData.user.user_type != "student") {
      this.username = this.userData.user.username;
      this.email = this.userData.user.email;
    }
  },

  methods: {
    async submit() {
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
          this.userData.user.email = this.email;
          if (response.data.message) {
            this.loading = false;
            this.clear();
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Password is successfully changed.",
            });
            this.userData.user.updated = 1;
            this.$store.commit("setUserData", this.userData);
            this.$router.push({ path: "/admin" });
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
              text: error.response.data.message,
            });
          }
        });
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
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
    },
  },
};
</script>

<style scoped>
.admin-profile {
  margin-top: 50px;
}

.field-label,
.error-message {
  padding: 0 0 0 10px;
}

.v-input {
  margin: 10px 0 3px 0;
}

.icon-container {
  max-height: 90px;
  height: 90px;
  width: 90px;
  margin-left: 10px;
  /* border-radius: 9999px; */
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  font-size: 24px;
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  position: relative;
  top: -25px;
  text-indent: 0;
}

#card-header-title {
  width: 100%;
  position: absolute;
  top: 10px;
  margin: auto;
}

.close-icon {
  position: absolute;
  right: 10px;
  top: 10px;
}

.invalid-feedback {
  margin-top: -15px;
}
.profile-card {
  margin: auto;
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%) !important;
}

.subtitle {
  text-align: center;
}

.subtitle span {
  font-size: 20px;
}

.theme--light.v-btn.v-btn--has-bg {
  background-color: #006a4e;
  color: white;
  letter-spacing: 0.5rem;
  width: 150px;
}

@media screen and (max-width: 767.98px) {
  .invalid-feedback {
    margin-top: -25px;
  }
}
</style>
