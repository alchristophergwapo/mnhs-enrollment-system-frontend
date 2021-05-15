<template>
  <div id="app">
    <bread-crumb :item="items" page_name="Notification Settings"></bread-crumb>
    <br /><br />

    <!-- notification details dialog -->
    <v-dialog
      v-model="openDialog"
      transition="dialog-top-transition"
      max-width="600"
    >
      <enrollment-data-dialog :enrollment="notification">
        <template v-slot:header_action>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
        </template>
        <template v-slot:actions>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              @click="opendeclineModal(notification.enrollment.id)"
              :loading="declining"
              :disabled="
                notification.enrollment.enrollment_status === 'Approved'
                  ? true
                  : false
              "
              >decline</v-btn
            >
            <v-btn
              color="primary"
              @click="
                filterSections(
                  notification.enrollment.grade_level,
                  notification.enrollment.id
                )
              "
              :disabled="
                notification.enrollment.enrollment_status === 'Approved'
                  ? true
                  : false
              "
              >{{ text }}</v-btn
            >
          </v-card-actions>
        </template>
      </enrollment-data-dialog>
    </v-dialog>

    <!-- select section dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Select Student Sections</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select
            :items="sections"
            v-model="section"
            label="Section*"
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            @click="approveEnrollment(id)"
            :loading="loading"
          >
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- notifications card list -->
    <v-card elevation="2" outlined tile v-if="notifications.length > 0">
      <v-virtual-scroll :items="notifications" :item-height="70" height="700">
        <template v-slot:default="{ item }">
          <v-list class="transparent">
            <v-list-item
              @click="markAsOpened(item.data.enrollment, item.id, item.index)"
            >
              <v-icon>mdi-information-variant</v-icon>

              <v-list-item-content>
                <v-list-item-title>
                  <v-card-text
                    >{{ item.data.enrollment.firstname }}
                    {{ item.data.enrollment.lastname }} submitted a new
                    enrollment application for grade &nbsp;
                    {{
                      item.data.enrollment.enrollment.grade_level
                    }}.</v-card-text
                  >
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
      </v-virtual-scroll>
    </v-card>
    <v-card v-else elevation="2" outlined tile>
      <v-card-text>
        <h1>No notifications</h1>
      </v-card-text>
    </v-card>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!-- REASON FOR DECLINING THE ENROLLMENT -->
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="declineModal"
    >
      <template>
        <v-card>
          <v-card-title>
            <v-row>
              <h3>Reason For Declining</h3>
            </v-row>
            <v-btn icon @click="closeDeclineModal()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-textarea
                v-model="remarks"
                outlined
                full-width
                single-line
                placeholder="Write the reason for declining here......."
                name="remarks"
                :rules="[
                  (remarks) => !!remarks || 'Reason for declining is required',
                ]"
              ></v-textarea>
              <!-- <v-divider></v-divider> -->
              <v-card-actions class="justify-end" id="textarea">
                <v-btn
                  :disabled="!valid"
                  color="blue"
                  @click="declineEnrollment(declineId)"
                  >done</v-btn
                >
              </v-card-actions>
            </v-container>
          </v-form>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
// import { EventBus } from "../bus/bus.js";
export default {
  components: {
    BreadCrumb: () =>
      import(/* webpackChunkName: "BreadCrumb" */ "@/layout/BreadCrumb.vue"),
    EnrollmentDataDialog: () =>
      import(
        /* webpackChunkName: "EnrollmentDataDialog" */ "@/layout/EnrollmentDataDialog.vue"
      ),
  },
  data() {
    return {
      items: [
        {
          text: "Home",
          disabled: false,
          href: "/admin",
        },
        {
          text: "Notifications",
          disabled: true,
          href: "admin/all_sections",
        },
      ],
      notifications: [],
      sections: [],
      openDialog: false,
      dialog: false,
      loading: false,
      approving: false,
      declining: false,
      overlay: false,
      declineModal: false,
      valid: true,
      declineId: null,
      section: null,
      id: null,
      indexToDel: null,
      remarks: null,
      notification: null,
      text: "Approve",
      date: new Date(),
    };
  },
  created() {
    this.overlay = true;
    let storedInfo = localStorage.getItem("user");
    let userData = JSON.parse(storedInfo);
    // this.notifications = userData.user.notifications;
    this.$axios
      .get(`/allNotifications/${userData.user.id}`)
      .then((response) => {
        this.overlay = false;
        this.notifications = response.data.notifications;
      });
  },
  methods: {
    filterSections(gradelevel, id) {
      this.id = id;
      this.dialog = true;
      this.sections = [];
      this.$store.dispatch("allSections").then((res) => {
        let sections = res;
        for (const key in sections) {
          if (sections.hasOwnProperty.call(sections, key)) {
            const element = sections[key];
            const grade_levelData = element["gradelevel"];
            for (const glKey in grade_levelData) {
              let section = element["name"];
              if (grade_levelData.hasOwnProperty.call(grade_levelData, glKey)) {
                const element1 = grade_levelData[glKey];
                if (glKey == "grade_level") {
                  if (element1 == gradelevel) {
                    this.sections.push(section);
                  }
                }
              }
            }
          }
        }
      });
    },

    checkIfExist(data) {
      let exist = false;
      let students = this.$store.getters.allStudents;
      for (const index in students) {
        if (students.hasOwnProperty.call(students, index)) {
          const element = students[index];
          if (element.id == data.id) {
            exist = true;
          } else {
            exist = false;
          }
        }
      }
      if (!exist) {
        students.push(data);
      }

      this.$store.commit("setStudents", students);

      // EventBus.$emit("newApprovedStudent", students);
    },
    approveEnrollment(id) {
      this.loading = true;
      if (this.section) {
        this.$axios
          .post("approveEnrollment/" + id, { student_section: this.section })
          .then((response) => {
            this.deleteNotif();
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: response.data.message,
            });
            this.checkIfExist(response.data.student);
            this.dialog = false;
            this.openDialog = false;
            this.loading = false;
            // window.location.reload(true);
          })
          .catch((error) => {
            if (error.response.status === 400)
              this.$swal.fire({
                icon: "warning",
                title: "Ooops!",
                text: error.response.data.message,
              });
            if (error.response.status === 500)
              this.$swal.fire({
                icon: "warning",
                title: "Ooops!",
                text: "An error encountered!",
              });
            this.loading = false;
            this.dialog = true;
            this.openDialog = true;
          });
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Ooops....",
          text: "Please select a section.",
        });
        this.openDialog = true;
        this.loading = false;
      }
    },

    opendeclineModal(id) {
      this.declineId = id;
      this.declineModal = true;
    },

    closeDeclineModal() {
      this.declineModal = false;
      this.remarks = null;
      this.$refs.form.resetValidation();
    },

    declineEnrollment(id) {
      this.declining = true;
      this.$axios
        .post("declineEnrollment/" + id, { remarks: this.remarks })
        .then((response) => {
          this.declining = false;
          this.deleteNotif();
          this.$swal.fire({
            icon: "info",
            title: "Success",
            text: response.data.success,
          });
          this.declineModal = false;
          this.openDialog = false;
        })
        .catch(() => {
          this.declining = false;
          this.$swal.fire({
            icon: "warning",
            title: "Ooops!",
            text: "An error encountered!",
          });
        });
    },

    markAsOpened(notif, id, index) {
      this.text =
        notif.enrollment.enrollment_status === "Approved"
          ? "Already Enrolled"
          : "Approve";
      this.notification = notif;
      this.openDialog = true;
      this.indexToDel = index;
      this.$axios
        .get("mark-as-opened/" + id)
        .then((response) => {
          this.notification.opened_at = this.date;
          this.notification.data = JSON.parse(response.data.notification.data);
          let index = this.notifications.indexOf(notif);
          this.notifications[index] = response.data.notification;
        })
        .catch(() => {
          this.$swal.fire({
            icon: "warning",
            title: "Ooops!",
            text: "An error encountered!",
          });
        });
    },

    closeDialog() {
      this.openDialog = false;
    },

    deleteNotif() {
      this.notifications.splice(this.indexToDel, 1);
    },
  },
};
</script>

<style>
.opened {
  background-color: white;
}

.not-opened {
  background: #e6fff8;
}
</style>