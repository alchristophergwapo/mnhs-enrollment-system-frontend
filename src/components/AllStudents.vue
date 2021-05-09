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
          <v-row>
            <v-col sm="3">
              <v-select
                v-model="selectedYear"
                :items="schoolYear"
                prepend-inner-icon="mdi-filter-outline"
                @change="filterByYear(($event = selectedYear))"
                label="School Year"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col sm="3" v-if="isAdmin">
              <v-select
                v-model="gradelevel"
                :items="grade_level"
                prepend-inner-icon="mdi-filter-outline"
                @change="filterByGradeLevel(($event = gradelevel))"
                menu-props="auto"
                label="Grade Level"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col sm="3">
              <v-select
                v-model="selectedSection"
                prepend-inner-icon="mdi-filter-outline"
                @change="filterBySection(($event = selectedSection))"
                :items="sections"
                menu-props="auto"
                label="Section"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col sm="3">
              <v-text-field
                class="search"
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                dense
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
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
              <td>{{ row.item.section_name }}</td>
              <td>{{ row.item.fullname }}</td>
              <td>{{ row.item.LRN }}</td>
              <td>{{ row.item.address }}</td>
              <td>
                <v-btn text @click="editDetails(row.item, row.index)"
                  >Edit Details</v-btn
                >
              </td>
            </tr>
          </template>
        </v-data-table>
        <!-- </v-card> -->
        <v-dialog
          v-model="studentDialog"
          transition="dialog-top-transition"
          persistent
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
                            /^[0-9]+$/.test(LRN) == true ||
                            'Only Number is  allowed!',
                          (LRN) =>
                            String(LRN).length <= 12 ||
                            'LRN cannot be greater than 12 characters',
                          (LRN) =>
                            String(LRN).length == 12 ||
                            'LRN must be 12 characters',
                        ]"
                        :counter="12"
                        label="Learners Reference No. (LRN)"
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
                        ]"
                        label="Average"
                        outlined
                        :readonly="readonly"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" xs="3" sm="4" md="4" lg="4">
                      <v-text-field
                        v-model="studentInfo.firstname"
                        name="firstname"
                        :rules="[
                          (v) =>
                            (!!v && v.trim() != '') || 'Firstname is required',
                        ]"
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
                        :rules="[
                          (v) =>
                            (!!v && v.trim() != '') || 'Lastname is required',
                        ]"
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
                        :rules="[(v) => !!v || 'Age is required']"
                        label="Age"
                        outlined
                        :readonly="readonly"
                        type="number"
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
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-if="studentInfo.IP === 'Yes'"
                        v-model="studentInfo.IP_community"
                        name="IP_Community"
                        :rules="[
                          (IP_Community) =>
                            (!!IP_Community && IP_Community.trim() != '') ||
                            'This field is required',
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
                            (!!mother_tongue && mother_tongue.trim() != '') ||
                            'Mother tongue is required',
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
                          (contact) =>
                            /^[0-9]+$/.test(contact) == true ||
                            'Only Number is  allowed!',
                          (contact) =>
                            String(contact).length <= 11 ||
                            'Student Contact Number cannot be greater than 11 digits',
                          (contact) =>
                            String(contact).length == 11 ||
                            'Student Contact Number contact number must be 11 digits',
                        ]"
                        label="Student Contact Number"
                        :counter="11"
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
                          (address) =>
                            (!!address && address.trim() != '') ||
                            'Address is required',
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
                            (!!guardian && guardian.trim() != '') ||
                            'Guardian name is required',
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
                        name="contact"
                        :rules="[
                          (contact) =>
                            !!contact ||
                            'Parent/Guardian contact number is required.',
                          (contact) =>
                            /^[0-9]+$/.test(contact) == true ||
                            'Only Number is  allowed!',
                          (contact) =>
                            String(contact).length <= 11 ||
                            'Parent/Guardian cannot be greater than 11 digits',
                          (contact) =>
                            String(contact).length == 11 ||
                            'Parent/Guardian contact number must be 11 digits',
                        ]"
                        label="Parent/Guardian Contact Number"
                        outlined
                        :readonly="readonly"
                        required
                      ></v-text-field>
                    </v-col>
                    <!----------------------------------THIS IS FOR SENIOR HIGH STUDENT DATA INFORMATION------------------------------------------->
                    <v-col cols="12" sm="6" v-if="studentInfo.semester != null">
                      <v-select
                        v-model="studentInfo.semester"
                        name="semester"
                        :rules="[
                          (semester) => !!semester || 'Semester is required.',
                        ]"
                        label="Select a semester"
                        :items="['First Semester', 'Second Semester']"
                        type="checkbox"
                        required
                        outlined
                        :readonly="readonly"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="12"
                      xs="6"
                      sm="6"
                      md="6"
                      lg="3"
                      v-if="studentInfo.track != null"
                    >
                      <v-select
                        name="track"
                        v-model="studentInfo.track"
                        :rules="[(track) => !!track || 'Track is required.']"
                        :items="tracks"
                        label="Track"
                        outlined
                        required
                        :readonly="readonly"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="12"
                      xs="6"
                      sm="6"
                      md="6"
                      lg="3"
                      v-if="studentInfo.strand != null"
                    >
                      <v-select
                        name="strand"
                        v-model="studentInfo.strand"
                        :items="strands[0][studentInfo.track]"
                        :rules="[(strand) => !!strand || 'Strand is required.']"
                        label="Strand"
                        outlined
                        required
                        :readonly="readonly"
                      ></v-select>
                    </v-col>
                    <!-------------------------------THIS------------IS---------FOR------BALIK----ARAL--- STUDENT----SIDE --------------- -->
                    <v-col
                      cols="12"
                      xs="6"
                      sm="6"
                      md="6"
                      lg="6"
                      v-if="studentInfo.last_grade_completed != null"
                    >
                      <v-select
                        v-model="studentInfo.last_grade_completed"
                        :items="selectLevel"
                        @change="
                          lastGradeLevel(
                            ($event = studentInfo),
                            ($event = studentInfo.index)
                          )
                        "
                        :rules="[
                          (last_grade_completed) =>
                            !!last_grade_completed ||
                            'Last Grade Level Completed is required',
                        ]"
                        label="Last Grade Level Completed"
                        :readonly="readonly"
                        outlined
                        required
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="12"
                      xs="6"
                      sm="6"
                      md="6"
                      lg="6"
                      v-if="studentInfo.last_year_completed != null"
                    >
                      <v-text-field
                        v-model="studentInfo.last_year_completed"
                        :rules="[
                          (last_year_completed) =>
                            !!last_year_completed ||
                            'Last School Year Completed is required',
                        ]"
                        label="Last School Year Completed"
                        :readonly="readonly"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      xs="6"
                      sm="6"
                      md="6"
                      lg="6"
                      v-if="studentInfo.last_school_ID != null"
                    >
                      <v-text-field
                        v-model="studentInfo.last_school_ID"
                        :rules="[
                          (last_school_ID) =>
                            !!last_school_ID || 'School ID is required',
                          (last_school_ID) =>
                            /^[0-9]+$/.test(last_school_ID) == true ||
                            'Only Number is  allowed!',
                          (last_school_ID) =>
                            String(last_school_ID).length <= 6 ||
                            'School ID cannot be greater than 6 digits',
                          (last_school_ID) =>
                            String(last_school_ID).length == 6 ||
                            'School ID must be 6 digits',
                        ]"
                        label="School ID"
                        :counter="6"
                        :readonly="readonly"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      xs="6"
                      sm="6"
                      md="6"
                      v-if="studentInfo.last_school_attended != null"
                    >
                      <v-text-field
                        v-model="studentInfo.last_school_attended"
                        :rules="[
                          (last_school_attended) =>
                            (!!last_school_attended &&
                              last_school_attended.trim() != '') ||
                            'School name is required',
                        ]"
                        label="School Name"
                        :readonly="readonly"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      xs="6"
                      sm="6"
                      md="6"
                      v-if="studentInfo.last_school_address != null"
                    >
                      <v-text-field
                        v-model="studentInfo.last_school_address"
                        :rules="[
                          (last_school_address) =>
                            (!!last_school_address &&
                              Last_school_address.trim() != '') ||
                            'School adress is required',
                        ]"
                        label="School Address"
                        :readonly="readonly"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="studentInfo.grade_level"
                        :rules="[(v) => !!v || 'Required']"
                        :items="GradeLevel"
                        label="Grade Level"
                        :readonly="statusLevel"
                        outlined
                        required
                      ></v-select>
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
                          ? ((readonly = false), (statusLevel = false))
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
        <!------------- Selected a Section for the selected gradelevel------------>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <template>
            <v-form ref="sectionDetails" lazy-validation>
              <v-card>
                <v-card-title>
                  <span class="headline">Select Student Sections</span>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeApprove()">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-select
                    :items="sections"
                    v-model="section"
                    name="section"
                    @change="theSection(($event = section))"
                    :rules="[(v) => !!v || 'Section name is required!']"
                    label="Section"
                    outlined
                    required
                  ></v-select>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    @click="approveEnrollment(studentInfo)"
                  >
                    Done
                  </v-btn>
                </v-card-actions>
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
    tracks: ["ACADEMIC TRACK", "TECHNICAL-VOCATIONAL LIVELIHOOD (TLV) TRACK"],
    strands: [
      {
        "ACADEMIC TRACK": [
          "ACCOUNTANCY, BUSINESS AND MANAGEMENT (ABM) STRAND",
          "HUMANITIES AND SOCIAL SCIENCES STRAND (HUMSS)",
          "SCIENCE, TECHNOLOGY, ENGINEERING AND MATHEMATICS (STEM) STRAND",
        ],
        "TECHNICAL-VOCATIONAL LIVELIHOOD (TLV) TRACK": ["AGRI-FISHERY ARTS"],
      },
    ],
    year: new Date().getFullYear(),
    studentDialog: false,
    dialog: false,
    readonly: true,
    statusLevel: true,
    studentInfo: {},
    search: "",
    gradelevel: null,
    selectGrade: "Allstudent",
    selectedSection: null,
    adviser: null,
    selectedYear: null,
    gradeLevel: null,
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
      { text: "GradeLevel", value: "grade_level" },
      { text: "Section", value: "section_name" },
      { text: "Student Name", value: "fullname" },
      { text: "LRN", value: "LRN" },
      { text: "Address", value: "address" },
      { text: "Edit", value: "Edit" },
    ],
    students: [],
    filteredStudents: [],
    selectLevel: [],
    GradeLevel: [],
    grade_level: [7, 8, 9, 10, 11, 12, "All"],
    section: null,
    filteredSections: [],
    sections: [],
    backupSection: null,
    backupGrade: null,
    isAdmin: true,
  }),
  created() {
    let adminLevel = null;
    if (this.$user.user_type == "teacher_admin") {
      let temp = this.$user.username.split("_");
      adminLevel = temp[1];
      this.isAdmin = false;
    }
    this.$store
      .dispatch("allStudents", adminLevel)
      .then((response) => {
        let studs = response;
        for (var index in studs) {
          let element = studs[index];
          element["fullname"] = element["firstname"].concat(
            " ",
            element["lastname"]
          );
          this.students.push(element);
          this.filteredStudents.push(element);
        }
      })
      .catch(() => {
        this.$swal.fire({
          icon: "warning",
          title: "Ooops!",
          text: "An error encountered!",
        });
      });
  },
  mounted() {
    this.$axios
      .get("allGradeLevelSections")
      .then((response) => {
        let section = response.data.sections;
        for (const key in section) {
          if (section.hasOwnProperty.call(section, key)) {
            const element = section[key];
            this.sections.push(element.name);
          }
        }
        this.filteredSections = response.data.sections;
      })
      .catch(() => {
        this.$swal.fire({
          icon: "warning",
          title: "Ooops!",
          text: "An error encountered!",
        });
      });
    for (let i = 2021; i <= new Date().getFullYear(); i++) {
      this.schoolYear.push(i);
    }
  },
  methods: {
    //Filter The Studentr By School Year
    filterByYear(year) {
      this.gradelevel = null;
      this.selectedSection = null;
      if (year == "All") {
        this.students = this.filteredStudents;
        this.year = new Date().getFullYear();
      } else {
        this.students = this.filteredStudents.filter((val) => {
          return val.start_school_year == year;
        });
        this.year = year;
      }
    },

    //Method For Filtering By Grade Level
    filterByGradeLevel(grade) {
      this.selectedSection = null;
      let arraySection = [];
      if (grade == "All") {
        this.selectGrade = "Allstudent";
        this.students = this.filteredStudents;
        this.filteredSections.filter((val) => {
          arraySection.push(val.name);
        });
        this.section = arraySection;
        this.selectedSection = null;
      } else {
        this.selectGrade = "Grade-" + grade;
        this.filteredSections.filter((val) => {
          if (val.gradelevel.grade_level === grade) arraySection.push(val.name);
        });
        this.students = this.filteredStudents.filter((val) => {
          return (
            val.grade_level === grade && val.start_school_year === this.year
          );
        });
        this.sections = arraySection;
        this.selectedSection = null;
      }
    },

    //Method For Filtering By Section In Every Grade Level

    filterBySection(section) {
      if (this.gradelevel == "All") {
        this.students = this.filteredStudents.filter((val) => {
          return val.section_name === section;
        });
      } else {
        this.students = this.filteredStudents.filter((val) => {
          return (
            val.section_name == section && val.start_school_year === this.year
          );
        });
      }
    },

    //Select Community turns to null
    ipCommunity() {
      this.studentInfo.IP_community = null;
    },
    //Open Or View Student Details
    editDetails(student, index) {
      this.backupSection = student.section_name;
      this.backupGrade = student.grade_level;
      if (student.track != null && student.last_school_attended == null) {
        let studentInfo = student;
        this.selectLevel = [10, 11];
        this.GradeLevel = [11, 12];
        studentInfo["school_year"] =
          student.start_school_year + " - " + student.end_school_year;
        studentInfo["index"] = index;
        this.studentInfo = studentInfo;
        this.studentDialog = true;
      } else if (
        student.track != null &&
        student.last_school_attended != null
      ) {
        let studentInfo = student;
        this.selectLevel = [10, 11];
        this.GradeLevel = [11, 12];
        studentInfo["school_year"] =
          student.start_school_year + " - " + student.end_school_year;
        studentInfo["index"] = index;
        this.studentInfo = studentInfo;
        this.studentDialog = true;
      } else if (
        student.track == null &&
        student.last_school_attended != null
      ) {
        let studentInfo = student;
        this.selectLevel = [6, 7, 8, 9];
        this.GradeLevel = [7, 8, 9, 10];
        studentInfo["school_year"] =
          student.start_school_year + " - " + student.end_school_year;
        studentInfo["index"] = index;
        this.studentInfo = studentInfo;
        this.studentDialog = true;
      } else {
        let studentInfo = student;
        this.GradeLevel = [7, 8, 9, 10];
        studentInfo["school_year"] =
          student.start_school_year + " - " + student.end_school_year;
        studentInfo["index"] = index;
        this.studentInfo = studentInfo;
        this.studentDialog = true;
      }
    },

    //Change GradeLevel
    lastGradeLevel(grade) {
      this.statusLevel = true;
      this.studentInfo.grade_level = grade.last_grade_completed + 1;
    },

    //Close The Student Details Dialog
    closestudentDetails() {
      this.students = [];
      this.filteredStudents = [];
      let adminLevel = null;
      if (this.$user.user_type == "teacher_admin") {
        let temp = this.$user.username.split("_");
        adminLevel = temp[1];
      }
      this.$store
        .dispatch("allStudents", adminLevel)
        .then((response) => {
          let studs = response;
          for (var index in studs) {
            let element = studs[index];
            element["fullname"] = element["firstname"].concat(
              " ",
              element["lastname"]
            );
            this.students.push(element);
            this.filteredStudents.push(element);
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "warning",
            title: "Oops!",
            text: "An error encountered!",
          });
        });
      this.readonly = true;
      this.statusLevel = true;
      this.studentDialog = false;
    },
    ///
    theSection(secName) {
      this.studentInfo.section_name = secName;
    },
    //Selecting A Section
    filterSections(student) {
      this.section = this.studentInfo.section_name;
      this.dialog = true;
      this.sections = [];
      this.$store
        .dispatch("allSections")
        .then((res) => {
          let sections = res;
          for (const key in sections) {
            if (sections.hasOwnProperty.call(sections, key)) {
              const element = sections[key];
              const grade_levelData = element["gradelevel"];
              for (const glKey in grade_levelData) {
                let section = element["name"];
                if (
                  grade_levelData.hasOwnProperty.call(grade_levelData, glKey)
                ) {
                  const element1 = grade_levelData[glKey];
                  if (glKey == "grade_level") {
                    if (element1 == student.grade_level) {
                      this.sections.push(section);
                    }
                  }
                }
              }
            }
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "warning",
            title: "Oops!",
            text: "An error occured!",
          });
        });
    },

    //Method For Approving the enrollment
    approveEnrollment() {
      this.studentInfo.section_name = this.section;
      if (this.$refs.sectionDetails.validate()) {
        this.$axios
          .post(
            `updateStudent/` + this.studentInfo.student_id,
            this.studentInfo
          )
          .then((response) => {
            if (response.data.updated) {
              this.$swal
                .fire({
                  icon: "success",
                  title: "Success",
                  text: "Student details is successfully updated!",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    this.$refs.sectionDetails.resetValidation();
                    this.$refs.studentDetails.resetValidation();
                  }
                });
              this.dialog = false;
              this.studentDialog = false;
              this.readonly = true;
              this.statusLevel = true;
            } else {
              this.dialog = false;
              this.$swal
                .fire({
                  icon: "error",
                  title: "Failed",
                  text: "Student details is unsuccessfully updated!",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    this.$refs.sectionDetails.resetValidation();
                    this.$refs.studentDetails.resetValidation();
                  }
                });
            }
          })
          .catch((error) => {
            if (error.response.status == 500) {
              this.$swal.fire({
                icon: "error",
                title: "Failed",
                text: "This section has reach its limits!",
              });
            }
          });
      }
    },

    //Close the dialog select for a section
    closeApprove() {
      this.studentInfo.section_name = this.backupSection;
      this.studentInfo.grade_level = this.backupGrade;
      this.dialog = false;
      this.$refs.sectionDetails.resetValidation();
    },

    //UPDATE A STUDENT DETAILS
    updateStudent(formdata) {
      if (this.$refs.studentDetails.validate()) {
        this.studentInfo = formdata;
        this.filterSections(formdata);
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
        SchoolYear: `${item.start_school_year} ${item.end_school_year}`,
        GradeLevel: item.grade_level,
        Section: item.student_section,
        StudentName: `${item.firstname} ${item.lastname}`,
        Age: item.age,
        Address: item.address.replace(/[^a-zA-Z ]/g, " "),
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
<style scoped>
@media screen and (max-width: 767.98px) {
  .a {
    width: 100%;
  }
  .b {
    margin-top: 10px;
    width: 100%;
  }
  .search {
    margin-top: 12px;
    width: 100%;
  }
}
</style>
