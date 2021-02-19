<template>
  <div>
    <bread-crumb :item="items" page_name="Reports"></bread-crumb>
    <br /><br />
    <div>
      <v-card-title>
        Sort By: &nbsp;&nbsp;
         <v-select
          :items="school_year"
          menu-props="auto"
          label="School Year"
          hide-details
          dense
          outlined
        ></v-select>
         &nbsp;&nbsp;
        <v-select
          :items="grade_level"
          menu-props="auto"
          label="Grade Level"
          hide-details
          dense
          outlined
        ></v-select>
        <v-spacer></v-spacer>
       
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="students"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.student }}</td>
            <td>{{ row.item.age }}</td>
            <td>{{ row.item.address }}</td>
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
        text: "Reports",
        disabled: true,
        href: "admin/students",
      },
    ],
    headers: [
      {
        text: "Student Name",
        align: "start",
        sortable: false,
        value: "student",
      },
      { text: "Age", value: "age" },
      { text: "Address", value: "address" },
    ],
    students: [
      {
        student: "Danica Caballero",
        age: 21,
        address: "Moalboal",
      },
      {
        student: "Chilla Jean Cabungcag",
        age: 21,
        address: "Badian",
      },
      {
        student: "Jericho James Villahermosa",
        age: 21,
        address: "Bulac",
      },
      {
        student: "Christopher Alonzo",
        age: 21,
        address: "Salug",
      },
    ],
    grade_level: [7, 8, 9, 10, 11, 12],
    school_year: [
      "2020-2021",
      "2021-2022",
      "2022-2023",
      "2023-2024",
      "2024-2025",
      "2025-2026",
    ],
  }),
};
</script>

<style>
.gl_filter {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 25px;
  /* or 179% */

  text-align: center;

  color: #646468;
}
</style>
