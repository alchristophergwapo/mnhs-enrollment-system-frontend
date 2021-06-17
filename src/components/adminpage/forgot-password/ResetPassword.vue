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
        <div class="icon-container" :style="'background: #006a4e'">
          <v-icon style="color: white" large>
            mdi-key-variant
          </v-icon>
        </div>
        <template>
          <div class="ml-auto text-right">
            <div class="body-3 grey--text font-weight-light" />
            <h3 id="card-header-title">
              RESET PASSWORD
            </h3>
          </div>
        </template>
        <v-divider />
        <v-container>
          <center>
            <img
              id="icons"
              :src="require('@/assets/images/enroll.png')"
              alt=""
            />
          </center>
          <h3>MNHS Enrollment</h3>
          <br />
          <div class="text-center message-txt">
            To avoid forgetting your password, please note your password on your
            notebook or on your phone.
          </div>
          <br />
          <v-form>
            <div class="font-weight-bold field-label">
              <h4>Email</h4>
            </div>
            <v-text-field
              v-model="email"
              :rules="[(value) => !!value || 'Email is required!']"
              prepend-inner-icon="mdi-email"
              type="email"
              outlined
              required
              dense
              @keyup="enterKeyTriggered"
            />
            <div class="font-weight-bold field-label">
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
              <p v-if="hasError('new_password')" class="invalid-feedback">
                {{ getError("new_password") }}
              </p>
            </div>
            <div class="font-weight-bold field-label">
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
              <p v-if="hasError('confirm_password')" class="invalid-feedback">
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
            color="primary"
            :loading="loading"
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
      token: "",
      email: "",
      newpassword: "",
      confirmPass: "",
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
  mounted() {
    this.token = this.$route.params.token;
  },
  methods: {
    enterKeyTriggered(e) {
      if (e.keyCode === 13) this.submit();
    },
    async submit() {
      this.loading = true;
      this.$axios
        .post(`password/reset`, {
          email: this.email,
          token: this.token.toString(),
          password: this.newpassword,
          password_confirmation: this.confirmPass,
        })
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            text: response.data.message,
          });
          this.$router.push({ path: "/sign-in" });
        })
        .catch((err) => {
          this.loading = false;
          switch (err.response.status) {
            case 500:
              this.showResponse(
                "warning",
                "Oops!",
                "An error on the server encountered!"
              );
              break;

            case 422:
              this.showResponse("warning", "Oops!", err.response.data.message);
              break;

            case 400:
              this.showResponse(
                "warning",
                "Oops!",
                err.response.data.message +
                  " Please make sure that this link is not expired. Thank you."
              );
              break;

            default:
              break;
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
