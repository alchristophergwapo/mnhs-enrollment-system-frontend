<template>
  <div app>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
      <v-spacer />
      <span>Adviser: {{ teacherName }}</span>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      :items-per-page="5"
      :loading="isDataLoaded"
      class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td>
            {{ row.item.firstname.split(" ")[0] }}
            {{ row.item.middlename }}
            {{ row.item.lastname }}
          </td>
          <td>{{ row.item.address }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {teacherName: {
    type: String,
    default: '',
  }},
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Student Name",
          align: "start",
          value: "firstname",
        },
        { text: "Address", value: "address" },
      ],
      isDataLoaded: true,
      students: [],
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      let storedInfo = localStorage.getItem("user");
      let userData = JSON.parse(storedInfo);
      let user = userData.userInfo;

      const section = user.enrollment.student_section;
      this.isDataLoaded = true;
      this.$axios.get(`student/classmates/${section}`).then((res) => {
        this.isDataLoaded = false;
        this.students = res.data.classmates;
        this.students.sort(this.sortData("lastname"));
      });
    },
    sortData(property) {
      return function (data1, data2) {
        return data1[property].localeCompare(data2[property]);
      };
    },
  },
};
</script>