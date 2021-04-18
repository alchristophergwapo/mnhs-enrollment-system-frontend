<template>
  <div class="admin-profile">
    <v-container>
      <v-card
        class="profile-card pa-4"
        width="100%"
        max-width="500px"
        outlined
        elevation="24"
      >
        <v-card-title>
          <v-row>
            <v-icon>mdi-account</v-icon>
            <h3>ADMIN PROFILE</h3>
          </v-row>
          <v-btn icon link to="/admin">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-row>
            <h2>Mantalongon National High School</h2>
          </v-row>
        </v-card-title>
        <div class="subtitle">
          <span>Mantalongon, Dalaguete, Cebu</span>
        </div>
        <br />
        <v-divider></v-divider>
        <br />
        <v-container>
          <v-form>
              <label for="username">Username</label>
            <v-text-field
              v-model="username"
              name="username"
              placeholder="Username"
              :readonly="true"
              outlined
            ></v-text-field>
            <label for="currentpassword">Current Password</label>
            <v-text-field
              v-model="currentPass"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              name="currentpassword"
              placeholder="Enter current password"
              @click:append="showPass = !showPass"
              @keydown="clearErrors"
              :error="hasError('currentpassword')"
              outlined
            ></v-text-field>
            <div>
              <p v-if="hasError('currentpassword')" class="invalid-feedback">
                {{ getError("currentpassword") }}
              </p>
            </div>
            <label for="new_password">New Password</label>
            <v-text-field
              v-model="newpassword"
              :append-icon="showNPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showNPass ? 'text' : 'password'"
              placeholder="Enter new password"
              name="new_password"
              @click:append="showNPass = !showNPass"
              @keydown="clearErrors"
              :error="hasError('new_password')"
              outlined
            ></v-text-field>
            <div>
              <p v-if="hasError('new_password')" class="invalid-feedback">
                {{ getError("new_password") }}
              </p>
            </div>
            <label for="confirm_password">Confirm Password</label>
            <v-text-field
              v-model="confirmPass"
              :append-icon="showCPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showCPass ? 'text' : 'password'"
              placeholder="Enter confirmation password"
              name="confirm_password"
              @click:append="showCPass = !showCPass"
              @keydown="clearErrors"
              :error="hasError('confirm_password')"
              outlined
            ></v-text-field>
            <div>
              <p v-if="hasError('confirm_password')" class="invalid-feedback">
                {{ getError("confirm_password") }}
              </p>
            </div>
          </v-form>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-4"
            color="green"
            :loading="loading"
            :disabled="hasAnyErors"
            @click="submit"
            >submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "AdminProfile",
  props: {},
  data() {
    return {
      username: "admin",
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
  mounted: function () {
    //Get Admin Profile
    const userInfo = localStorage.getItem("user");
    this.userData = JSON.parse(userInfo);
    if (this.userData.user.user_type == "admin") {
      this.username = this.userData.user.username;
    }
  },

  methods: {
    async submit() {
      this.loading = true;
      this.$axios
        .post(`change`, {
          username: this.username,
          currentpassword: this.currentPass,
          new_password: this.newpassword,
          confirm_password: this.confirmPass,
        })
        .then((response) => {
          if (response.data.message) {
            this.loading = false;
            this.currentPass = null;
            this.newpassword = null;
            this.confirmPass = null;
            // alert("Successfully changed!");
            //this.$router.push({path:"/admin"});
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Password is successfully changed.",
            });

            this.userData.user.updated = 1;
            this.$store.commit("setUserData", this.userData);
            this.$router.push({ path: "/admin" });
          } else {
            alert("Your current password is wrong!");
          }
        })
        .catch((error) => {
          this.loading = false;
          if (error.response.status == 422) {
            this.setErrors(error.response.data.errors);
          } else {
            // alert("Something went wrong!");
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
      this.currentPass = null;
      this.newpassword = null;
      this.confirmPass = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
    },
  },

  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
};
</script>

<style>
.profile-card {
  margin: auto;
}

.subtitle {
  text-align: center;
}

.subtitle span {
  font-size: 20px;
}
</style>