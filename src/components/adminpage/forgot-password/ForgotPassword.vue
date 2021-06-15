<template>
  <v-app>
    <v-container class="signin-container">
      <v-card class="card1" elevation="10" max-width="500px">
        <v-btn icon link to="/sign-in">
          <v-icon x-large>
            mdi-arrow-left
          </v-icon>
        </v-btn>
        <center>
          <img
            id="icons"
            :src="require('@/assets/images/enroll.png')"
            alt=""
          />
        </center>
        <h3>MNHS Enrollment System</h3>
        <br />
        <div class="text-center message-txt">
          Enter your account email address to verify that this account really
          belongs to you. We will send a link to your email for you to update
          your account recovery.
        </div>
        <br />
        <v-card-text>
          <v-form
            ref="forgotPassForm"
            v-model="valid"
            lazy-validation
            @submit.prevent=""
          >
            <v-row>
              <v-col cols="12">
                <div class="font-weight-bold">
                  <h4>Email</h4>
                </div>
                <v-text-field
                  v-model="user.email"
                  :rules="[(value) => !!value || 'Email is required!']"
                  type="email"
                  outlined
                  required
                  @keyup="enterKeyTriggered"
                />
              </v-col>
              <v-spacer />
              <v-col class="d-flex ml-auto">
                <v-btn
                  x-large
                  block
                  color="primary"
                  :loading="sendingPasswordResetReq"
                  @click="sendForgotPassLink()"
                >
                  <h4>Send</h4>
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
  data() {
    return {
      user: {
        email: "",
      },
      valid: true,
      sendingPasswordResetReq: false,
    };
  },
  methods: {
    enterKeyTriggered() {},
    async sendForgotPassLink() {
      if (this.$refs.forgotPassForm.validate()) {
        this.sendingPasswordResetReq = true;
        this.$axios
          .post("password/email", { email: this.user.email })
          .then((res) => {
            let message = res.data.message;
            this.showResponse("success", '', message);
            this.sendingPasswordResetReq = false;
          })
          .catch((err) => {
            this.sendingPasswordResetReq = false;
            console.log(err);
            switch (err.response.status) {
              case 500:
                this.showResponse(
                  "warning",
                  "Oops!",
                  "An error on the server encountered!"
                );
                break;

              case 422:
                this.showResponse(
                  "warning",
                  "Oops!",
                  err.response.data.message
                );
                break;

              case 400:
                this.showResponse(
                  "warning",
                  "Oops!",
                  err.response.data.message +
                    " Please make sure that the email you provided is the email you used in your account. If you have not added an email for your account, please contact your admin for your account recovery. Thank you."
                );
                break;

              default:
                break;
            }
          });
      }
    },
    showResponse(icon, title, message, action) {
      this.$swal.fire({
        icon: icon,
        title: title,
        text: message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.message-txt {
  font-size: 15px;
}
</style>
