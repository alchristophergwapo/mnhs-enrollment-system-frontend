<template>
  <div>
    <bread-crumb :item="items" page_name="All Students"></bread-crumb>
    <br /><br />
    <div>
      <v-container>
        <v-card outlined>
          <v-card class="table-header" color="#00b4cc">
            <v-card-title class="text-center justify-center">
              <div class="display-2 font-weight-light">Students Data</div>
            </v-card-title>

            <div
              class="subtitle-1 font-weight-light text-center justify-center"
            >
              All students as of year {{ year }}
            </div>
          </v-card>
          <v-card-title>
            <div>Sort By&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <v-select
              :items="grade_level"
              menu-props="auto"
              label="Grade Level"
              hide-details
              v-model="search"
              @change="filterByGradeLevel($event)"
              dense
            ></v-select>
            <v-spacer></v-spacer>
            <v-select
              :items="section"
              menu-props="auto"
              label="Section"
              hide-details
              @change="selectedSection($event)"
              dense
            ></v-select>
            <v-spacer></v-spacer>
            <!-- <span>Adviser: Aileen Becher</span> -->
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
                <td>{{ row.item.grade_level }}</td>
                <td>{{ row.item.student_section }}</td>
                <td>{{ row.item.firstname }} {{ row.item.lastname }}</td>
                <td>{{ row.item.age }}</td>
                <td>{{ row.item.address }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </div>
  </div>
</template>
<script>
// import { EventBus } from "../bus/bus.js";
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
  },
  data: () => ({
    year: new Date().getFullYear(),
    search: "",
    selectedGrade: null,
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
      { text: "Student Name", value: "student" },
      { text: "Age", value: "age" },
      { text: "Address", value: "address" },
    ],
    grade_level: ["7", "8", "9", "10", "11", "12"],
    section: [
      "Section1",
      "Section2",
      "Section3",
      "Section4",
      "Section5",
      "Section6",
    ],
    filteredStudents: [],
    students: [],
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
    // console.log(students);
    this.initialializeData(students);
  },

  mounted() {
    // EventBus.$on("newApprovedStudent", (data) => {
    //   console.log(data);
    //   this.$swal.fire({
    //     icon: "success",
    //     title: "Success",
    //     text: "New Enrollment is Approved.",
    //   });
    // });
  },

  methods: {
    initialializeData(data) {
      let students = data;

      for (let index = 0; index < students.length; index++) {
        const element = students[index];
        element["student"]["student_section"] = element["student_section"];
        this.students.push(element["student"]);
        // console.log(element);
      }
      this.filteredStudents = this.students;
    },

    filterByGradeLevel(grade) {
      this.students.filter(function (val) {
        return (val.grade_level = grade);
      });
    },
  },
};
</script>
