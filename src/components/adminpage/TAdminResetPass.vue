<template>
  <div app>
    <v-card-title>
      <v-spacer></v-spacer>
      <!-- @keyup="filterByName(($event = search))" -->
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        dense
        style="width: 0px"
        outlined
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :items="teacher_admins"
      :headers="headers"
      :items-per-page="10"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.grade_level }}</td>
          <td>{{ row.item.user_fullname }}</td>
          <td>
            <v-btn
              color="primary"
              @click="resetPassword(row.item.id)"
              :loading="loading"
              >Reset Password</v-btn
            >
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      loading: false,
      headers: [
        { text: "Grade Level", align: "start", value: "grade_level" },
        { text: "Admin Name", value: "user_fullname" },
        { text: "Action", value: "action" },
      ],
      teacher_admins: [],
    };
  },
  created() {
    this.$axios
      .get("/allTeacherAdmin")
      .then((response) => {
        let teacherAdmins = response.data.teacher_admins;
        for (const key in teacherAdmins) {
          if (teacherAdmins.hasOwnProperty.call(teacherAdmins, key)) {
            const element = teacherAdmins[key];
            const tAdmin = {
              grade_level: Number(element.username.split("_")[1]),
              user_fullname: element.user_fullname,
              id: element.id,
            };
            this.teacher_admins.push(tAdmin);
          }
        }
      })
      .catch(() => {
        this.$swal.fire({
          icon: "error",
          title: "Ooops...",
          text: "An error encountered.",
        });
      });
  },
  methods: {
    resetPassword(id) {
      this.$axios
        .get(`resetPassword/${id}`)
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: "Successs",
            text: response.data.success,
          });
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "Error",
            text: "An error encountered!",
          });
        });
    },
  },
};
</script>

<style scoped>
</style>