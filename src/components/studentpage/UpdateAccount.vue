<template>
  <v-app style="background-color: #eee">
    <v-card
      width="100%"
      max-width="500px"
      height="430px"
      outlined
      elevation="24"
      class="mx-auto my-12"
    >
      <v-card class="table-header" color="#2e856e">
        <v-card-title class="text-center justify-center">
          <h4 style="color: white">Update Account Information</h4>
        </v-card-title>
      </v-card>
      <v-container>
        <v-form ref="update" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            name="username"
            label="LRN"
            :disabled="true"
          ></v-text-field>
          <v-text-field
            v-model="currentPass"
            :rules="[(current) => !!current || 'Current password is required.']"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            name="currentpassword"
            label="Current Password"
            @click:append="showPass = !showPass"
          ></v-text-field>
          <v-text-field
            v-model="newpassword"
            :rules="[
              (newP) => !!newP || 'This field is required',
              (newP) =>
                newP.length >= 8 || 'Password must be atleast 8 characters.',
            ]"
            :append-icon="showNPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showNPass ? 'text' : 'password'"
            label="New Password"
            name="new_password"
            @click:append="showNPass = !showNPass"
          ></v-text-field>
          <v-text-field
            v-model="confirmPass"
            :rules="[
              (cpass) => !!cpass || 'Confirm password is required',
              (cpass) => cpass == newpassword || 'Password must match.',
            ]"
            :append-icon="showCPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showCPass ? 'text' : 'password'"
            label="Confirm Password"
            name="confirm_password"
            @click:append="showCPass = !showCPass"
          ></v-text-field>
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
    clear() {
      this.currentPass = null;
      this.newpassword = null;
      this.confirmPass = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
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
            if (response.data.message) {
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
              this.userDetails.user.updated = 1;
              this.$store.commit("setUserData", this.userDetails);
              this.$router.push({ path: "/student/dashboard" });
            } else {
              alert("Your current password is wrong!");
            }
          })
          .catch((error) => {
            console.log(error.response);
            this.loading = false;
            this.$swal.fire({
              icon: "error",
              title: "Oooops....",
              html: "<b>" + error.response.data.message + "</b>",
              focusConfirm: false,
              confirmButtonText: "OK",
            });
          });
      }
    },
  },
};
</script>