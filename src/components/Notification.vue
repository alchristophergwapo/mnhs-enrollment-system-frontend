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
            <v-btn icon @click="openDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
        </template>
        <template v-slot:actions>
          <v-btn
            @click="
              filterSections(
                notification.grade_level,
                notification.enrollment.id
              )
            "
            >Approve</v-btn
          >
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
            @click="approveEnrollment(id, index)"
            :loading="loading"
          >
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- notifications card list -->
    <v-card elevation="2" outlined tile>
      <v-virtual-scroll :items="notifications" :item-height="70" height="700">
        <template v-slot:default="{ item }">
          <v-list class="transparent">
            <v-list-item @click="markAsOpened(item.data.enrollment, item.id)">
              <v-icon>mdi-plus</v-icon>

              <v-list-item-content>
                <v-list-item-title>
                  <v-card-text
                    >{{ item.data.enrollment.firstname }}
                    {{ item.data.enrollment.lastname }} submitted a new
                    enrollment application for
                    {{ item.data.enrollment.grade_level }}.</v-card-text
                  >
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
      </v-virtual-scroll>
    </v-card>
  </div>
</template>

<script>
// import { EventBus } from "../bus/bus.js";
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
    EnrollmentDataDialog: () => import("@/layout/EnrollmentDataDialog.vue"),
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
      notification: null,
      openDialog: false,
      dialog: false,
      sections: [],
      section: null,
      loading: false,
      id: null,
      date: new Date(),
    };
  },
  methods: {
    filterSections(gradelevel, id) {
      this.id = id;
      // console.log(index);
      this.dialog = true;
      this.sections = [];
      let sections = this.$store.getters.allSections;
      // console.log(grade_level);
      for (const key in sections) {
        if (sections.hasOwnProperty.call(sections, key)) {
          const element = sections[key];
          const grade_levelData = element["gradelevel"];
          for (const glKey in grade_levelData) {
            let section = element["name"];
            if (grade_levelData.hasOwnProperty.call(grade_levelData, glKey)) {
              const element1 = grade_levelData[glKey];
              // console.log(glKey);
              if (glKey == "grade_level") {
                // console.log("here");
                if (element1 == gradelevel) {
                  // console.log("here");
                  this.sections.push(section);
                }
              }
            }
          }
        }
      }
      // console.log(this.sections);
    },
    approveEnrollment(id) {
      console.log(this.section);
      this.loading = true;
      if (this.section) {
        this.$axios
          .post("approveEnrollment/" + id, { student_section: this.section })
          .then((response) => {
            console.log(response);
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Enrollment approved.",
            });
            this.dialog = false;
            this.openDialog = false;
            this.loading = false;
            // window.location.reload(true);
          })
          .catch((error) => {
            console.log(error);
            this.$swal.fire({
              icon: "error",
              title: "Ooops....",
              text: error.response.data.message,
            });
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
      }
    },
    markAsOpened(notif, id) {
      this.notification = notif;
      this.openDialog = true;
      this.$axios
        .post("mark-as-opened/" + id, { opened_at: this.date })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    let storedInfo = localStorage.getItem("user");
    let userData = JSON.parse(storedInfo);
    console.log(userData);
    let notificationsData = userData.user.notifications;
    // console.log(notificationsData);
    for (let index = 0; index < notificationsData.length; index++) {
      const element = notificationsData[index];
      // console.log(index);
      this.notifications.push(element);
    }
  },
};
</script>