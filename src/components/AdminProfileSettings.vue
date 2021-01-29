<template>
  <v-app>
    <app-bar></app-bar>
    <br /><br /><br />
    <v-card
      :loading="loading"
      class="mx-auto my-12"
      width="100%"
      max-width="500px"
    >
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>
      <div class="update-heading">
        <v-card-title class="text-center justify-center py-5">
          <h1 class="display-1 basil--text">Update Account Information</h1>
        </v-card-title>
      </div>
      <br />
      <v-container>
        <v-form ref="updateAccount" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            :rules="[rules.username]"
            name="username"
            label="Username"
          ></v-text-field>
          <v-text-field
            v-model="currentPass"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.password]"
            :type="showPass ? 'text' : 'password'"
            name="currentPass"
            label="Current Password"
            @click:append="showPass = !showPass"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="showNPass ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.password, rules.min]"
            :type="showNPass ? 'text' : 'password'"
            label="New Password"
            name="password"
            :hint="password.length >= 8 ? '' : 'At least 8 characters'"
            @click:append="showNPass = !showNPass"
          ></v-text-field>
          <v-text-field
            v-model="confirmPass"
            :append-icon="showCPass ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.password, rules.min]"
            :type="showPass ? 'text' : 'password'"
            label="Confirm Password"
            name="confirmPassword"
            :hint="confirmPass.length >= 8 ? '' : 'At least 8 characters'"
            @click:append="showCPass = !showCPass"
          ></v-text-field>
          <v-btn color="error" @click="clear"> clear </v-btn>
          <v-btn class="mr-4" :disabled="!valid" color="info" @click="submit">
            submit
          </v-btn>
        </v-form>
      </v-container>
    </v-card>
  </v-app>
</template>

<script>
export default {
  components: {
    AppBar: () => import("@/layout/AppBar.vue"),
  },
  data: () => ({
    loading: false,
    selection: 1,
    valid: true,
    username: "Admin_01",
    currentPass: "",
    password: "",
    confirmPass: "",
    showPass: false,
    showNPass: false,
    showCPass: false,
    rules: {
      username: (val) => !!val || "Username is required!",
      password: (val) => !!val || "Password is required!",
      min: (val) => (val && val.length >= 8) || "Minimum of 8 characters.",
    },
  }),

  methods: {
    submit() {
      console.log("clicked");
      if (this.$refs.updateAccount.validate()) {
        this.loading = true;
        // setTimeout(() => (), 2000);
        setTimeout(() => {
          this.loading = false;
          if (this.loading == false) {
           this.clear();
           this.$router.push({path: '/admin'})
          }
        }, 2000);
      }
    },
    clear() {
      this.username = "";
      this.currentPass = "";
      this.password = "";
      this.confirmPass = "";
    },
  },
};
</script>

<style>
.update-heading {
  background: rgba(196, 196, 196, 0.5);
}
</style>