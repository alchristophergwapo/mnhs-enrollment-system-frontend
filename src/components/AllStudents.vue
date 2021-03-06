<template>
  <div>
    <bread-crumb :item="items" page_name="All Students"></bread-crumb>
    <br /><br />
    <div>
      <v-card-title>
        Sort By&nbsp;&nbsp;
        <v-select
          :items="grade_level"
          menu-props="auto"
          label="Grade Level"
          hide-details
          v-model="selectedGrade"
          @change="gradeLevel($event)"
          dense
          outlined
        ></v-select>
        &nbsp;&nbsp;
        <v-select
          :items="section"
          menu-props="auto"
          label="Section"
          hide-details
          @change="selectedSection($event)"
          dense
          outlined
        ></v-select>
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
            <td>{{ row.item.gradelevel}}</td>
            <td>{{ row.item.section }}</td>
            <td>{{ row.item.student }}</td>
            <td>{{ row.item.firstname }} {{ row.item.lastname }}</td>
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
    HHTP_REQUEST_URL: "http://127.0.0.1:8000/api/",
    search: "",
    selectedGrade:null,
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Students",
        disabled: true,
        href: "admin/students",
      },
    ],
    headers: [
      { text: "GradeLevel", value: "gradelevel" },
       { text: "Section", value: "section" },
      {text: "Student Name", align: "start", sortable: false,value: "student",},
      { text: "Age", value: "age" },
      { text: "Address", value: "address" },
    ],
    students: [],
    grade_level: [7, 8, 9, 10, 11, 12],
    section: [
      "Section1",
      "Section2",
      "Section3",
      "Section4",
      "Section5",
      "Section6",
    ],
  }),

  created() {
    // this.$axios.get("approvedEnrollment").then((response) => {
    //   console.log(response);
    //   let res = response.data.approvedEnrollment;
    //   for (let index = 0; index < res.length; index++) {
    //     const element = res[index];
    //     this.students.push(element.student);
    //   }
    // });
    let students = this.$store.getters.allStudents;

    for (let index = 0; index < students.length; index++) {
      const element = students[index];
      this.students.push(element["student"]);
    }
  },
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
