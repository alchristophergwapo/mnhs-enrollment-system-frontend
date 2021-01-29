<template>
  <div id="app">
    <bread-crumb :item="items" page_name="Notification Settings"></bread-crumb>
    <br /><br />
    <v-card elevation="2" outlined tile>
      <v-list class="transparent">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-card-text
            >Chilla Jean Cabungcag submitted a new enrollment application gor
            Grade 7.</v-card-text
          >

          <v-row align="center" justify="end">
            <v-btn color="#64D8FD">View</v-btn>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
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
    };
  },
};
</script>