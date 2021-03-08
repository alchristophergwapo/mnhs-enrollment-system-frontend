<template>
  <v-app>
    <!-- <app-bar></app-bar> -->
    <br>
    <br>
    <br>
    <v-card class="mx-auto my-12" width="100%" max-width="500px">
      <template slot="progress">
        <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
      </template>
      <div class="update-heading">
        <v-card-title class="text-center justify-center py-5">
          <h1 class="display-1 basil--text">Update Account Information</h1>
        </v-card-title>
      </div>
      <br>
      <v-container>
        <v-form>
          <v-text-field v-model="username" name="username" label="Username" :disabled="true"></v-text-field>
          <v-text-field
            v-model="currentPass"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass? 'text' : 'password'"
            name="currentpassword"
            label="Current Password"
            @click:append="showPass = !showPass"
            @keydown="clearErrors"
            :error="hasError('currentpassword')"
          ></v-text-field>
          <p
            v-if="hasError('currentpassword')"
            class="invalid-feedback"
          >{{getError('currentpassword')}}</p>
          <v-text-field
            v-model="newpassword"
            :append-icon="showNPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showNPass ? 'text' : 'password'"
            label="New Password"
            name="new_password"
            @click:append="showNPass = !showNPass"
            @keydown="clearErrors"
            :error="hasError('new_password')"
          ></v-text-field>
          <p v-if="hasError('new_password')" class="invalid-feedback">{{getError('new_password')}}</p>
          <v-text-field
            v-model="confirmPass"
            :append-icon="showCPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showCPass ? 'text' : 'password'"
            label="Confirm Password"
            name="confirm_password"
            @click:append="showCPass = !showCPass"
            @keydown="clearErrors"
            :error="hasError('confirm_password')"
          ></v-text-field>
          <p
            v-if="hasError('confirm_password')"
            class="invalid-feedback"
          >{{getError('confirm_password')}}</p>
          <v-btn class="mr-4" color="error" @click="clear">clear</v-btn>
          <v-btn
            class="mr-4"
            color="info"
            :loading="loading"
            :disabled="hasAnyErors"
            @click="submit"
          >submit</v-btn>
        </v-form>
      </v-container>
    </v-card>
  </v-app>
</template>

<script>
export default {
  components: {
    //AppBar:() => import("@/layout/AppBar.vue")
  },
  data() {
    return {
      HHTP_REQUEST_URL: "http://127.0.0.1:8000/api/",
      username: "admin",
      currentPass: null,
      newpassword: null,
      confirmPass: null,
      loading: false,
      showPass: "",
      showNPass: "",
      showCPass: "",
      errors: {}
    };
  },

  mounted: function() {
    //Get Admin Profile
    this.$axios
      .get(`${this.HHTP_REQUEST_URL}getAdminProfile`)
      .then(response => {
        this.username = response.data[0].username;
      })
      .catch(error => {
        console.log(error);
      });
  },

  methods: {
    async submit() {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 700));
      this.loading = false;
      this.$axios
        .post(`${this.HHTP_REQUEST_URL}change`, {
          username: this.username,
          currentpassword: this.currentPass,
          new_password: this.newpassword,
          confirm_password: this.confirmPass
        })
        .then(response => {
          if (response.data.message) {
            this.currentPass = null;
            this.newpassword = null;
            this.confirmPass = null;
            alert("Successfully changed!");
            //this.$router.push({path:"/admin"});
          } else {
            alert("Your current password is wrong!");
          }
        })
        .catch(error => {
          if (error.response.status == 422) {
            this.setErrors(error.response.data.errors);
          } else {
            alert("Something went wrong!");
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
        this.$delete(this.errors, key)
      }
    }
  },

  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    }
  }
};
</script>


<style>
.update-heading {
  background: rgba(196, 196, 196, 0.5);
}

.invalid-feedback {
  color: red;
  margin-top: -4%;
  font-size: 14px;
}
</style>