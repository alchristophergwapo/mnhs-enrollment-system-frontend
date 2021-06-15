<template>
  <div class="admin-profile">
    <!-- <v-container> -->
    <v-card
      class="profile-card pa-4"
      width="100%"
      max-width="500px"
      outlined
    >
      <v-card-title>
        <v-row>
          <v-icon>mdi-account</v-icon>
          <h3>EDIT ADMIN</h3>
          <v-btn
            icon
            class="close-icon"
            @click="close()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>
      </v-card-title>

      <v-divider />
      <br>
      <v-container>
        <v-form
          ref="newAdmin"
          v-model="newAdminValid"
          lazy-validation
        >
          <label for="assigned_gr_level">Grade Level</label>
          <v-select
            v-model="data.assigned_gr_level"
            name="assigned_gr_level"
            :items="[7, 8, 9, 10, 11, 12]"
            :rules="[(value) => !!value || 'This field is required.']"
            hide-selected
            readonly
            dense
            outlined
            required
            @change="setUsername()"
          />
          <Autocomplete
            request="allTeacher"
            :gradelevel="Number(data.assigned_gr_level)"
            :edit="false"
            :prepend-icon="
              data.assigned_teacher ? 'mdi-check-underline' : 'mdi-help'
            "
            property="teacher_name"
            :rules="[(value) => !!value || 'This field is required']"
          >
            <template v-slot:label>
              <span>Assigned Teacher: <strong>{{ data.assigned_teacher }}</strong>
              </span>
            </template>
          </Autocomplete>
          <br>
          <label for="email">Teacher Email</label>
          <v-text-field
            v-model="data.user_email"
            placeholder="Enter email"
            name="email"
            :error="hasError('user_email')"
            :readonly="true"
            dense
            outlined
            @keydown="clearErrors"
          />
          <label for="username">Default Username</label>
          <v-text-field
            v-model="data.username"
            placeholder="Enter Username"
            name="username"
            :error="hasError('username')"
            :readonly="true"
            dense
            outlined
            @keydown="clearErrors"
          />
          <div>
            <p
              v-if="hasError('username')"
              class="invalid-feedback"
            >
              {{ getError("username") }}
            </p>
          </div>
          <label for="password">Default Password</label>
          <v-text-field
            v-model="password"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            placeholder="Enter password"
            name="password"
            :error="hasError('password')"
            dense
            outlined
            @click:append="showPass = !showPass"
            @keydown="clearErrors"
          />
          <div>
            <p
              v-if="hasError('password')"
              class="invalid-feedback"
            >
              {{ getError("password") }}
            </p>
          </div>
        </v-form>
      </v-container>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="mr-4"
          color="green"
          :loading="loading"
          @click="submit"
        >
          submit
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- </v-container> -->
  </div>
</template>

<script>
import { EventBus } from "../../bus/bus";
import Autocomplete from /* webpackChunkName: "Autocomplete" */ "@/layout/Autocomplete.vue";
export default {
  name: "AdminProfile",
  components: {
    Autocomplete,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      password: "Password",
      loading: false,
      showPass: false,
      newAdminValid: false,
      errors: {},
    };
  },

  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
  created: function () {
    console.log(this.data);
    EventBus.$on("allTeacher", (data) => {
      this.data.assigned_teacher = data.data ? data.data.teacher_name : "";
      this.data.teacher_email = data.data ? data.data.email : "";
    });

    EventBus.$on("clearData", () => {
      this.data.assigned_teacher = null;
    });
  },

  methods: {
    async submit() {
      if (this.$refs.newAdmin.validate()) {
        this.loading = true;
        let data = {
          username: this.data.username,
          password: this.password,
          user_type: "teacher_admin",
          user_fullname: this.data.assigned_teacher,
          user_email: this.data.teacher_email,
        };
        this.$axios
          .post(`updateTeacherAdmin/${this.data.id}`, data)
          .then((response) => {
            this.loading = false;
            this.showResponse("Success", response.data.success, "success");
            this.clearInputs();
            EventBus.$emit("updated");
          })
          .catch((error) => {
            this.loading = false;
            if (error.response.status == 422)
              this.setErrors(error.response.data.errors);
            if (
              error.response.data.teacher_isAssigned &&
              error.response.status == 400
            )
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

    close() {
      EventBus.$emit("updated");
      this.clearInputs();
    },

    showResponse(title, message, icon) {
      this.$swal.fire({
        icon: icon,
        title: title,
        text: message,
      });
    },

    clearInputs() {
      this.data.assigned_gr_level = null;
      this.data.assigned_teacher = null;
      this.data.teacher_email = null;
      this.data.username = null;
      EventBus.$emit("save");
      this.$refs.newAdmin.resetValidation();
    },

    setUsername() {
      this.data.username = "TeacherAdmin_" + this.data.assigned_gr_level;
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

.close-icon {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>