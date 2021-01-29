<template>
  <div>
    <bread-crumb :item="items" page_name="All Teachers"></bread-crumb>
    <br /><br />
    <div>
      <v-card-title>
        <v-spacer></v-spacer>
        <div class="add_btn">
            <v-btn color="primary"><v-icon>mdi-plus</v-icon>Add New</v-btn>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="teachers"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.name }}</td>
            <td>{{ row.item.email }}</td>
            <td>{{ row.item.phone }}</td>
            <td>
              <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
     components: {
      BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
  },
  data: () => ({
    search: "",
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Teachers",
        disabled: true,
        href: "admin/all_teachers",
      },
    ],
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Email", value: "email" },
      { text: "Phone Number", value: "phone" },
      { text: "Action", value: "action" },
    ],
    teachers: [
      {
        name: "Aileen Becher",
        email: "becher@mnhs.edu.ph",
        phone: "639123456789",
      },
    ],
  }),
};
</script>

<style>
</style>