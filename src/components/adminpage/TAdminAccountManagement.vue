<template>
  <div app>
    <v-card-title>
      <v-spacer></v-spacer>
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
      :loading="isDataLoaded ? false : true"
      class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.assigned_gr_level }}</td>
          <td>{{ row.item.user_fullname }}</td>
          <td>
            <v-btn @click="openEdit(row.item)">Edit</v-btn>
            &nbsp;&nbsp;&nbsp;
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
    <v-dialog v-model="edit" max-width="500px">
      <EditAdminDetails :data="tAdminToEdit" />
    </v-dialog>
  </div>
</template>

<script>
import { EventBus } from "../../bus/bus";
export default {
  components: {
    EditAdminDetails: () =>
      import("@/components/adminpage/EditTAdminDetails.vue"),
  },
  data() {
    return {
      search: "",
      isDataLoaded:false, 
      loading: false,
      edit: false,
      headers: [
        { text: "Grade Level", align: "start", value: "grade_level" },
        { text: "Admin Name", value: "user_fullname" },
        { text: "Manage", sortable: false },
      ],
      teacher_admins: [],
      tAdminToEdit: null,
    };
  },
  created() {
    this.initializeData();
    EventBus.$on("updated", () => {
      this.initializeData();
    });
  },
  methods: {
    initializeData() {
      this.teacher_admins = [];
      this.$axios
        .get("/allTeacherAdmin")
        .then((response) => {
          this.isDataLoaded= true;
          let teacherAdmins = response.data.teacher_admins;
          for (const key in teacherAdmins) {
            if (teacherAdmins.hasOwnProperty.call(teacherAdmins, key)) {
              const element = teacherAdmins[key];
              // console.log(element);
              const tAdmin = {
                assigned_gr_level: Number(element.username.split("_")[1]),
                user_fullname: element.user_fullname,
                assigned_teacher: element.user_fullname,
                username: element.username,
                user_email: "",
                id: element.id,
              };
              this.teacher_admins.push(tAdmin);
              console.log(this.teacher_admins);
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
    resetPassword(id) {
      this.loading = true;
      this.$axios
        .get(`resetPassword/${id}`)
        .then((response) => {
          this.loading = false;
          this.$swal.fire({
            icon: "success",
            title: "Successs",
            text: response.data.success,
          });
        })
        .catch(() => {
          this.loading = false;
          this.$swal.fire({
            icon: "error",
            title: "Error",
            text: "An error encountered!",
          });
        });
    },
    openEdit(toEdit) {
      this.edit = true;
      this.tAdminToEdit = toEdit;
    },
  },
};
</script>

<style scoped>
</style>