<template>
  <div>
    <bread-crumb :item="items" page_name="All Students"></bread-crumb>
    <br /><br />
    <div>
      <v-container>
        <!-- <v-card outlined> -->
        <v-card class="table-header" color="#00b4cc">
          <v-card-title class="text-center justify-center">
            <div class="display-2 font-weight-light">Enrolled Students</div>
          </v-card-title>
          <div class="subtitle-1 font-weight-light text-center justify-center">
            All students enrolled as of year {{ year }}
          </div>
          <br />
        </v-card>
        <v-card-title>
          <v-select
            v-model="selectedYear"
            :items="schoolYear"
            @change="filterByYear(($event = selectedYear))"
            menu-props="auto"
            label="School Year"
            hide-details
            dense
            outlined
          ></v-select>
          <v-spacer></v-spacer>
          <v-select
            v-model="gradelevel"
            :items="grade_level"
            @change="filterByGradeLevel(($event = gradelevel))"
            menu-props="auto"
            label="Grade Level"
            hide-details
            dense
            outlined
          ></v-select>
          <v-spacer></v-spacer>
          <v-select
            v-model="selectedSection"
            @change="filterBySection(($event = selectedSection))"
            :items="section"
            menu-props="auto"
            label="Section"
            hide-details
            dense
            outlined
          ></v-select>
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
              <td>{{ row.item.student.grade_level }}</td>
              <td>{{ row.item.student_section }}</td>
              <td>
                {{ row.item.student.firstname }}
                {{ row.item.student.lastname }}
              </td>
              <td>{{ row.item.student.age }}</td>
              <td>{{ row.item.student.address }}</td>
              <td>
                <v-btn text @click="editDetails(row.item)">Edit Details</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <!-- </v-card> -->
        <v-dialog
          v-model="studentDialog"
          transition="dialog-top-transition"
          max-width="800"
        >
          <template>
            <v-form ref="studentDetails" lazy-validation>
              <v-card>
                <v-card-title class="text-center justify-center">
                  <v-spacer></v-spacer>
                  <v-row>
                    <h2>Student Details</h2>
                  </v-row>
                  <v-btn icon @click="closestudentDetails()">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <hr />
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-row>S.Y. {{ studentInfo.school_year }}</v-row>
                </v-card-title>
                <br />
                <v-card-text>
                  <v-row>
                    <v-col cols="12" xs="3" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.PSA"
                        name="PSA"
                        label="PSA Birth Certificate No."
                        outlined
                        :readonly="readonly"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="3" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.LRN"
                        name="LRN"
                        :rules="[
                          (LRN) => !!LRN || 'LRN is required',
                          (LRN) =>
                            (/^[0-9]+$/.test(LRN) == true &&
                              String(LRN).length <= 12) ||
                            'LRN cannot be greater than 12 characters & must contain all numbers only!',
                          (LRN) =>
                            (/^[0-9]+$/.test(LRN) == true &&
                              String(LRN).length == 12) ||
                            'LRN must be 12 characters & must contain all numbers only!',
                        ]"
                        :counter="12"
                        label="Learners Reference No. (LRN)"
                        type="number"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="3" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.average"
                        name="average"
                        :rules="[
                          (v) => !!v || 'Average is required',
                          (v) => v <= 100 || 'Maximum average is 100',
                          (v) =>
                            /^[0-9]+$/.test(v) == true ||
                            'Average must be a number!',
                        ]"
                        label="Average"
                        type="number"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" xs="3" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.firstname"
                        name="firstname"
                        :rules="[(v) => !!v || 'Firstname is required']"
                        label="Firstname"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.middlename"
                        name="middlename"
                        :rules="[(v) => !!v || 'Middlename is required']"
                        label="Middlename"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.lastname"
                        name="lastname"
                        :rules="[(v) => !!v || 'Lastname is required']"
                        label="Lastname"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.birthdate"
                        name="birthdate"
                        :rules="[(v) => !!v || 'Birthdate is required']"
                        label="Date of Birth"
                        type="date"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.age"
                        name="age"
                        :rules="[
                          (v) => !!v || 'Age is required',
                          (v) =>
                            /^[0-9]+$/.test(v) == true ||
                            'Age must be a number!',
                        ]"
                        label="Age"
                        type="number"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
                      <v-checkbox
                        v-model="studentInfo.gender"
                        name="gender"
                        :rules="[(gender) => !!gender || 'Gender is required']"
                        value="Male"
                        label="Male"
                        type="checkbox"
                        :readonly="readonly"
                        :required="!studentInfo.gender ? true : false"
                      ></v-checkbox>
                      <v-spacer></v-spacer>
                    </v-col>

                    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
                      <v-checkbox
                        v-model="studentInfo.gender"
                        name="gender"
                        :rules="[(gender) => !!gender || 'Gender is required']"
                        value="Female"
                        label="Female"
                        type="checkbox"
                        :readonly="readonly"
                        required
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                      <p>
                        Belonging to any Indegenous People (IP)
                        Community/Indegenous Cultural Community?
                      </p>
                    </v-col>
                    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
                      <v-checkbox
                        v-model="studentInfo.IP"
                        name="IP"
                        :rules="[(IP) => !!IP || 'This field is required']"
                        value="Yes"
                        label="Yes"
                        :readonly="readonly"
                        type="checkbox"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
                      <v-checkbox
                        v-model="studentInfo.IP"
                        name="IP"
                        :rules="[(IP) => !!IP || 'This field is required']"
                        value="No"
                        label="No"
                        @change="ipCommunity()"
                        :readonly="readonly"
                        type="checkbox"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                      <v-text-field
                        v-if="studentInfo.IP === 'No'"
                        v-model="studentInfo.IP_community"
                        label="If yes, please specify"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-if="studentInfo.IP === 'Yes'"
                        v-model="studentInfo.IP_community"
                        name="IP_Community"
                        :rules="[
                          (IP_Community) =>
                            !!IP_Community || 'This field is required',
                          (IP_Community) =>
                            (/^[a-z]/.test(IP_Community) == true &&
                              /[^a-zA-Z.ñÑ| ]/.test(IP_Community) == false) ||
                            'This special character is not allowed!',
                        ]"
                        label="If yes, please specify"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                      <v-text-field
                        v-model="studentInfo.mother_tongue"
                        name="mother_tongue"
                        :rules="[
                          (mother_tongue) =>
                            !!mother_tongue || 'Mother tongue is required',
                        ]"
                        label="Mother Tongue"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                      <v-text-field
                        v-model="studentInfo.contact"
                        name="contact"
                        :rules="[
                          (contact) => !!contact || 'Contact is required',
                        ]"
                        type="number"
                        label="Contact Number"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                      <v-text-field
                        v-model="studentInfo.address"
                        name="address"
                        :rules="[
                          (address) => !!address || 'Address is required',
                        ]"
                        label="Address"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                      <v-text-field
                        v-model="studentInfo.zipcode"
                        name="zipcode"
                        :rules="[
                          (zipcode) => !!zipcode || 'Zipcode is required',
                          (zipcode) =>
                            /^[0-9]+$/.test(zipcode) == true ||
                            'Only Number is  allowed!',
                        ]"
                        label="Zipcode"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                      <v-text-field
                        v-model="studentInfo.father"
                        label="Father's Name"
                        outlined
                        :readonly="readonly"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                      <v-text-field
                        v-model="studentInfo.mother"
                        label="Mother's Maiden Name"
                        outlined
                        :readonly="readonly"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                      <v-text-field
                        v-model="studentInfo.guardian"
                        name="guardian"
                        :rules="[
                          (guardian) =>
                            !!guardian || 'Guardian name is required',
                        ]"
                        label="Guardian's Name"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-text-field
                        v-model="studentInfo.parent_number"
                        :rules="[
                          (parent_number) =>
                            !!parent_number ||
                            'Parent/Guardian contact number is required.',
                        ]"
                        label="Contact Number"
                        type="number"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-container>
                    <v-spacer></v-spacer>
                    <v-btn
                      elevation="5"
                      block
                      color="blue darken-1"
                      @click="
                        readonly
                          ? (readonly = false)
                          : updateStudent(studentInfo)
                      "
                    >
                      {{ btnText }}
                    </v-btn>
                  </v-container>
                </v-card-actions>
                <br />
              </v-card>
            </v-form>
          </template>
        </v-dialog>
      </v-container>
      <v-btn @click="csvExport(csvData)" dark color="teal">Download File</v-btn>
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
    studentDialog: false,
    readonly: true,
    studentInfo: {},
    search: "",
    gradelevel: null,
    selectGrade: "Allstudent",
    selectedSection: null,
    adviser: null,
    selectedYear: null,
    schoolYear: ["All"],
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
      { text: "GradeLevel", value: "student.grade_level" },
      { text: "Section", value: "student_section" },
      {
        text: "Student Name",
        align: "start",
        sortable: false,
        value: "student.firstname",
      },
      { text: "Age", value: "student.age" },
      { text: "Address", value: "student.address" },
      { text: "Edit", value: "Edit" },
    ],
    students: [],
    filteredStudents: [],
    grade_level: [7, 8, 9, 10, 11, 12, "All"],
    section: [],
    filteredSections: [],
  }),
  created() {
    this.$store
      .dispatch("allStudents")
      .then((response) => {
        this.students = response;
        this.filteredStudents = response;
        // this.students = this.filteredStudents.filter((val) => {
        //   return (
        //     val.student.created_at.substring(0, val.created_at.indexOf("-")) ==
        //       this.year || val.student.created_at.includes(this.year)
        //   );
        // });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  mounted() {
    this.$axios
      .get("allGradeLevelSections")
      .then((response) => {
        this.filteredSections = response.data.sections;
      })
      .catch((error) => {
        console.log(error);
      });
    for (let i = 2021; i <= this.year; i++) {
      this.schoolYear.push(i);
    }
  },
  methods: {
    //Filter The Studentr By School Year
    filterByYear(year) {
      if (year == "All") {
        this.students = this.filteredStudents;
        this.year = new Date().getFullYear();
      } else {
        this.students = this.filteredStudents.filter((val) => {
          return (
            val.student.created_at.substring(0, val.created_at.indexOf("-")) ==
              year || val.student.created_at.includes(year)
          );
        });
        this.year = year;
      }
    },
    //Method For Filtering By Grade Level
    filterByGradeLevel(grade) {
      if (grade == "All") {
        this.selectGrade = "Allstudent";
        this.students = this.filteredStudents;
        let arraySection = [];
        this.filteredSections.filter((val) => {
          arraySection.push(val.name);
        });
        this.section = arraySection;
        this.selectedSection = null;
        this.adviser = null;
      } else {
        this.selectGrade = "Grade-" + grade;
        let arraySection = [];
        this.students = this.filteredStudents.filter((val) => {
          return val.student.grade_level == grade;
        });
        this.filteredSections.filter((val) => {
          if (val.gradelevel != null) {
            if (val.gradelevel.grade_level == grade) {
              arraySection.push(val.name);
            }
          }
        });
        this.section = arraySection;
        this.selectedSection = null;
        this.adviser = null;
      }
    },

    //Method For Filtering By Section In Every Grade Level
    filterBySection(section) {
      if (this.gradelevel == "All") {
        this.students = this.filteredStudents.filter((val) => {
          return val.student_section == section;
        });
        this.filteredSections.filter((val) => {
          if (val.name == section) {
            this.adviser =
              val.teacher_id + ",GradeLevel:" + val.gradelevel.grade_level;
          }
        });
      } else {
        this.students = this.filteredStudents.filter((val) => {
          return val.student_section == section;
        });
        this.filteredSections.filter((val) => {
          if (val.name == section) {
            this.adviser = val.teacher_id;
          }
        });
      }
    },

    //Select Community turns to null
    ipCommunity() {
      this.studentInfo.IP_community = null;
    },
    //Open Or View Student Details
    editDetails(student) {
      console.log(student);
      let studentInfo = student.student;
      studentInfo["school_year"] =
        student.start_school_year + " - " + student.end_school_year;

      this.studentInfo = studentInfo;

      this.studentDialog = true;
    },
    //Close The Student Details Dialog
    closestudentDetails() {
      //this.$refs.studentDetails.resetValidation();
      this.studentDialog = false;
    },
    //UPDATE A STUDENT DETAILS
    updateStudent(formdata) {
      if (this.$refs.studentDetails.validate()) {
        console.log("id:" + formdata.id);
        this.$axios
          .post(`updateStudent/` + formdata.id, formdata)
          .then((response) => {
            if (response.data.updated) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Student details successfully updated!",
              });

              this.studentDialog = false;
              this.$refs.studentDetails.resetValidation();
            } else {
              alert("Unsuccessfully Updated!");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    //Dowloadcsv
    csvExport(arrData) {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(arrData[0]),
        ...arrData.map((item) => Object.values(item)),
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");
      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", this.selectGrade + ".csv");
      link.click();
    },
  },
  computed: {
    csvData() {
      return this.students.map((item) => ({
        SchoolYear: item.student.created_at
          .substring(0, item.student.created_at.indexOf("-"))
          .concat(
            "-",
            parseInt(
              item.student.created_at.substring(
                0,
                item.student.created_at.indexOf("-")
              )
            ) + 1
          ),
        GradeLevel: item.student.grade_level,
        Section: item.student_section,
        StudentName: item.student.firstname + " " + item.student.lastname,
        Age: item.student.age,
        Address: item.student.address.replace(/[^a-zA-Z ]/g, " "),
        //Address:item.student.address.replaceAll(","," ").replaceAll(/\s+/g," ")
      }));
    },

    btnText() {
      let text = "update";

      if (this.readonly) {
        text = "update";
      } else {
        text = "save";
      }

      return text;
    },
  },
};
</script>
