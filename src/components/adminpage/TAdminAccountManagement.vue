<template>
  <div app>
    <v-card-title>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        dense
        style="width: 0px"
        outlined
      />
      <v-btn
        class="add_btn"
        color="primary"
        @click="add = true"
      >
        <v-icon>mdi-plus</v-icon>Add New
      </v-btn>
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
            <v-btn @click="openEdit(row.item)">
              Edit
            </v-btn>
            &nbsp;&nbsp;&nbsp;
            <v-btn
              color="primary"
              @click="resetPassword(row.item.id)"
            >
              Reset Password
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog
      v-model="edit"
      max-width="500px"
    >
      <EditAdminDetails :data="tAdminToEdit" />
    </v-dialog>
    <v-dialog
      v-model="add"
      max-width="500px"
    >
      <AddNewAdmin>
        <template v-slot:close_btn>
          <v-btn
            icon
            class="close-icon"
            @click="add = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </AddNewAdmin>
    </v-dialog>
    <v-overlay
      :value="loading"
      absolute
    >
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </div>
</template>

<script>
import { EventBus } from "../../bus/bus";
import EditAdminDetails from /* webpackChunkName: "EditAdminDetails" */ "@/components/adminpage/EditTAdminDetails.vue";
import AddNewAdmin from /* webpackChunkName: "AddAdmin" */ "@/components/adminpage/AddNewAdmin.vue";

export default {
  components: {
    EditAdminDetails,
    AddNewAdmin,
  },
  data() {
    return {
      search: "",
      isDataLoaded: false,
      loading: false,
      edit: false,
      add: false,
      headers: [
        { text: "Grade Level", align: "start", value: "assigned_gr_level" },
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
      this.edit = false;
      this.initializeData();
    });

    EventBus.$on("newAdminAdded", () => {
      this.add = false;
      this.initializeData();
    });
  },
  methods: {
    initializeData() {
      this.teacher_admins = [];
      this.$axios
        .get("/allTeacherAdmin")
        .then((response) => {
          this.isDataLoaded = true;
          let teacherAdmins = response.data.teacher_admins;
          for (const key in teacherAdmins) {
            if (teacherAdmins.hasOwnProperty.call(teacherAdmins, key)) {
              const element = teacherAdmins[key];
              const tAdmin = {
                assigned_gr_level: Number(element.username.split("_")[1]),
                user_fullname: element.user_fullname,
                assigned_teacher: element.user_fullname,
                username: element.username,
                user_email: element.email,
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

<style scoped lang="scss">
.add_btn {
  margin: -29px 0 0 10px;
}
</style>
