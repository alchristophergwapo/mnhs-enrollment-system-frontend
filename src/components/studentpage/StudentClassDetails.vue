<template>
  <div app>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <span>Adviser: Aileen Becher</span>
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
</template>

<script>
export default {
  props: ["classmates"],
  data() {
    return {
      search: "",
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
      students: this.classmates,
    };
  },
};
</script>