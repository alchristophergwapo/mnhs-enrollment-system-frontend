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
      :items="students"
      :headers="headers"
      :items-per-page="10"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.grade_level }}</td>
          <td>{{ row.item.fullname }}</td>
          <td>{{ row.item.LRN }}</td>
          <td>
            <v-btn
              color="primary"
              @click="resetPassword(row.item)"
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
  name: "StudentPassManagement",
  data() {
    return {
      search: "",
      loading: false,
      headers: [
        {
          text: "Grade Level",
          align: "start",
          sortable: false,
          value: "grade_level",
        },
        { text: "Student Name", value: "fullname" },
        { text: "LRN", value: "LRN" },
        { text: "Action", value: "action" },
      ],
      students: [],
    };
  },
  created() {
    let adminLevel = null;
    let userData = this.$user;
    if (userData.user_type != "admin") {
      let temp = this.$user.username.split("_");
      adminLevel = temp[1];
    }
    this.$store.dispatch("allStudents", adminLevel).then((res) => {
      let students = res;
      for (const key in students) {
        if (students.hasOwnProperty.call(students, key)) {
          const element = students[key];
          let student = [];
          student["fullname"] =
            `${element.firstname}` + " " + `${element.lastname}`;
          student["grade_level"] = element.grade_level;
          student["LRN"] = element.LRN;
          this.students.push(student);
        }
      }
    });
  },
  methods: {
    resetPassword(student) {
      this.loading = true;
      this.$axios
        .post(`reset-password`, { LRN: student.LRN })
        .then((response) => {
          this.loading = false;
          if (response.data.success) {
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Student details is successfully updated!",
            });
          } else {
            this.$swal.fire({
              icon: "error",
              title: "Failed",
              text: "Student details is unsuccessfully updated!",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$swal.fire({
            icon: "error",
            title: "Ooops...",
            text: "An error encountered!. Please try again.",
          });
        });
    },
  },
};
</script>

<style scoped>
</style>