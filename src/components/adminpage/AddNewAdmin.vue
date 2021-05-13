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
            <h3>ADD NEW ADMIN</h3>
          </v-row>
        </v-card-title>

        <v-divider></v-divider>
        <br />
        <v-container>
          <v-form v-model="newAdminValid" ref="newAdmin" lazy-validation>
            <label for="assigned_gr_level">Grade Level</label>
            <v-select
              name="assigned_gr_level"
              v-model="assigned_gr_level"
              :items="[7, 8, 9, 10, 11, 12]"
              :rules="[(value) => !!value || 'This field is required.']"
              @change="setUsername()"
              hide-selected
              dense
              outlined
              required
            ><v-icon slot="prepend-inner" color="red" x-small>mdi-asterisk</v-icon></v-select>
            <Autocomplete
              request="allTeacher"
              :gradelevel="Number(assigned_gr_level)"
              :edit="false"
              :prepend_icon="
                assigned_teacher ? 'mdi-check-underline' : 'mdi-help'
              "
              property="teacher_name"
              :rules="[(value) => !!value || 'This field is required']"
            >
              <template v-slot:label>
                <span> Assigned Teacher </span>
              </template>
            </Autocomplete>
            <br />
            <label for="email">Teacher Email</label>
            <v-text-field
              v-model="teacher_email"
              placeholder="Email"
              name="email"
              @keydown="clearErrors"
              :error="hasError('user_email')"
              :readonly="true"
              dense
              outlined
            ></v-text-field>
            <label for="username">Default Username</label>
            <v-text-field
              v-model="username"
              placeholder="Username"
              name="username"
              @keydown="clearErrors"
              :error="hasError('username')"
              :readonly="true"
              dense
              outlined
            ></v-text-field>
            <div>
              <p v-if="hasError('username')" class="invalid-feedback">
                {{ getError("username") }}
              </p>
            </div>
            <label for="password">Default Password</label>
            <v-text-field
              v-model="password"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              :rules="[
                (value) =>
                  (!!value && value.trim() != '') ||
                  'The password field is required',
              ]"
              placeholder="Enter password"
              name="password"
              @click:append="showPass = !showPass"
              @keydown="clearErrors"
              :error="hasError('password')"
              required
              dense
              outlined
            ></v-text-field>
            <div>
              <p v-if="hasError('password')" class="invalid-feedback">
                {{ getError("password") }}
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
import { EventBus } from "../../bus/bus";
export default {
  name: "AdminProfile",
  components: {
    Autocomplete: () =>
      import(
        /* webpackChunkName: "Autocomplete" */ "@/layout/Autocomplete.vue"
      ),
  },
  props: {},
  data() {
    return {
      assigned_gr_level: null,
      assigned_teacher: null,
      teacher_email: null,
      username: null,
      password: "Password",
      loading: false,
      showPass: false,
      newAdminValid: false,
      errors: {},
    };
  },
  created: function () {
    EventBus.$on("allTeacher", (data) => {
      this.assigned_teacher = data.data ? data.data.teacher_name : "";
      this.teacher_email = data.data ? data.data.email : "";
    });

    EventBus.$on("clearData", () => {
      this.assigned_teacher = null;
    });
  },

  methods: {
    async submit() {
      if (this.$refs.newAdmin.validate()) {
        this.loading = true;
        let data = {
          username: this.username,
          password: this.password,
          user_type: "teacher_admin",
          user_fullname: this.assigned_teacher,
          user_email: this.teacher_email,
        };
        this.$axios
          .post(`addNewAdmin`, data)
          .then((response) => {
            this.loading = false;
            this.showResponse("Success", response.data.success, "success");
            this.clearInputs();
          })
          .catch((error) => {
            this.loading = false;
            if (error.response.status == 422)
              this.setErrors(error.response.data.errors);
            if (
              error.response.status == 400 &&
              error.response.data.teacher_admin_exist
            )
              this.$swal.fire({
                title: "Ooops...",
                text: error.response.data.teacher_admin_exist,
                icon: "warning",
              });
            if (error.response.data.teacher_isAssigned)
              this.showResponse(
                "Ooops...",
                error.response.data.teacher_isAssigned,
                "info"
              );
            if (error.response.status == 500)
              this.showResponse("Ooops...", error.response.data.error, "error");
          });
      }
    },

    showResponse(title, message, icon) {
      this.$swal.fire({
        icon: icon,
        title: title,
        text: message,
      });
    },

    clearInputs() {
      this.assigned_gr_level = null;
      this.assigned_teacher = null;
      this.teacher_email = null;
      this.username = null;
      EventBus.$emit("save");
      this.$refs.newAdmin.resetValidation();
    },

    setUsername() {
      this.username = "TeacherAdmin_" + this.assigned_gr_level;
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