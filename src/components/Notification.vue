<template>
  <div id="app">
    <bread-crumb :item="items" page_name="Notification Settings"></bread-crumb>
    <br /><br />

    <!-- <v-dialog
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
          <v-btn>Approve</v-btn>
        </template>
      </enrollment-data-dialog>
    </v-dialog> -->
    <v-card elevation="2" outlined tile>
      <v-virtual-scroll :items="notifications" :item-height="70" height="700">
        <template v-slot:default="{ item }">
          <v-list class="transparent">
            <v-list-item
              @click="filterFromEnrollment(item.data.enrollment.firstname)"
            >
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
import { EventBus } from "../bus/bus.js";
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
    // EnrollmentDataDialog: () => import("@/layout/EnrollmentDataDialog.vue"),
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
    };
  },
  methods: {
    openDetails(notif) {
      this.notification = notif;
      this.openDialog = true;
    },
    filterFromEnrollment(name) {
      EventBus.$emit("filterData", name);
      this.$router.push({ path: "/admin/enrollment" });
    },
  },
  created() {
    let storedInfo = localStorage.getItem("user");
    let userData = JSON.parse(storedInfo);
    // console.log(userData);
    let notificationsData = userData.user.notifications;
    // console.log(notificationsData);
    for (let index = notificationsData.length - 1; index >= 0; index--) {
      const element = notificationsData[index];
      // console.log(index);
      this.notifications.push(element);
    }
  },
};
</script>