<template>
  <InputCard
    :card_properties="{
      max_width: '500px',
      icon: 'mdi-account',
      title: 'ADD NEW ADMIN',
    }"
  >
    <template v-slot:card_form>
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
        ></v-select>
        <Autocomplete
          request="allTeacher"
          :gradelevel="Number(assigned_gr_level)"
          :edit="false"
          :prepend_icon="assigned_teacher ? 'mdi-check-underline' : 'mdi-help'"
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
          :readonly="true"
          dense
          outlined
        ></v-text-field>
        <label for="username">Default Username</label>
        <v-text-field
          v-model="username"
          placeholder="Username"
          name="username"
          :readonly="true"
          dense
          outlined
        ></v-text-field>
        <label for="password">Default Password</label>
        <v-text-field
          v-model="password"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          placeholder="Enter password"
          name="password"
          @click:append="showPass = !showPass"
          dense
          outlined
        ></v-text-field>
      </v-form>
    </template>
    <template v-slot:card_btns>
      <v-btn class="mr-4" color="green" :loading="loading" @click="submit"
        >submit</v-btn
      >
    </template>
  </InputCard>
</template>

<script>
import { EventBus } from "../../bus/bus";
export default {
  components: {
    InputCard: () =>
      import("@/components/card-components/InputCardComponent.vue"),
    Autocomplete: () =>
      import("@/components/input-components/Autocomplete.vue"),
  },
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

    clear() {
      this.currentPass = null;
      this.newpassword = null;
      this.confirmPass = null;
    },
  },

  computed: {},
};
</script>
