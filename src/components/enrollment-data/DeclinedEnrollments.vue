<template>
  <v-container>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        style="width: 0px"
        outlined
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="declinedEnrollments"
      :search="search"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.grade_level }}</td>
          <td>{{ row.item.fullname }}</td>
          <td>{{ row.item.average }}</td>
          <td>
            <v-btn text @click="viewDetails(row.item)">View Details</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <!-----------------------------THIS IS FOR UPDATING THE STUDENT DETAILS-------------------------------- -->
    <v-dialog
      v-model="studentDialog"
      transition="dialog-top-transition"
      max-width="800"
    >
      <template v-slot:default="dialog">
        <v-form ref="studentDetails" lazy-validation>
          <v-card>
            <v-card-title class="text-center justify-center">
              <v-spacer></v-spacer>
              <v-row>
                <h2>Student Details</h2>
              </v-row>
              <v-btn icon @click="dialog.value = false">
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
                        String(LRN).length == 12 || 'LRN must be 12 characters',
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
                      (v) =>
                        /^[0-9]+$/.test(v) == true || 'Only Number is allowed!',
                      (v) => v <= 100 || 'Maximum average is 100',
                    ]"
                    label="Average"
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
                        /^[0-9]+$/.test(v) == true || 'Only Number is allowed!',
                    ]"
                    label="Age"
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
                    Belonging to any Indegenous People (IP) Community/Indegenous
                    Cultural Community?
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
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="studentInfo.IP === 'Yes'"
                    v-model="studentInfo.IP_community"
                    name="IP_Community"
                    :rules="[
                      (IP_Community) =>
                        !!IP_Community || 'This field is required',
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
                    :rules="[(address) => !!address || 'Address is required']"
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
                      (guardian) => !!guardian || 'Guardian name is required',
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
                <v-col cols="12" sm="12" md="12" lg="12">
                  <v-textarea
                    outlined
                    name="remarks"
                    label="Reason For Declining"
                    placeholder="Write the reason for declining here......."
                    v-model="studentInfo.remark"
                    readonly
                  ></v-textarea>
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
                      : updateStudent(
                          studentInfo,
                          studentInfo.grade_level,
                          studentInfo.id,
                          studentInfo.index
                        )
                  "
                >
                  {{ btnTexts }}
                </v-btn>
              </v-container>
            </v-card-actions>
            <br />
          </v-card>
        </v-form>
      </template>
    </v-dialog>
    <!-- THIS IS FOR APPROVING  AND THEN SELECTING A CERTAIN SECTION -->
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Select Student Sections</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-select
              :items="sections"
              v-model="section"
              label="Section*"
              outlined
              :loading="isDataLoaded ? false : true"
              loading-text="Loading... Please wait"
              required
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              @click="approveEnrollment(id, index)"
              :loading="loading"
            >
              Approve
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
import { EventBus } from "../../bus/bus";
export default {
  data() {
    return {
      headers: [
        {
          text: "Grade Level",
          align: "start",
          sortable: false,
          value: "grade_level",
        },
        { text: "Student Name", value: "fullname" },
        { text: "Average", value: "average" },
        { text: "Details", value: "details" },
      ],
      id: null,
      index: null,
      studentDialog: false,
      dialog: false,
      loading: false,
      readonly: true,
      studentInfo: {},
      isDataLoaded: false,
      section: "",
      search: "",
      declinedEnrollments: [],
      sections: [],
    };
  },

  created() {
    this.retrieveData();
    EventBus.$on("refresh", () => {
      this.retrieveData();
    });
  },
  methods: {
    retrieveData() {
      let adminLevel = null;
      let userData = this.$user;
      console.log(userData);
      if (userData.user_type != "admin") {
        let temp = this.$user.username.split("_");
        adminLevel = temp[1];
        console.log(adminLevel);
      }
      let declined = this.$store.getters.allDeclinedEnrollments;
      this.$store
        .dispatch("allDeclinedEnrollments", adminLevel)
        .then((response) => {
          this.isDataLoaded = true;
          declined = response;
          let declinedEnrollmentData = [];
          for (var index in declined) {
            let element = declined[index];
            element["index"] = index;
            element["fullname"] = element["firstname"].concat(
              " ",
              element["lastname"]
            );
            declinedEnrollmentData.push(element);
          }
          this.declinedEnrollments = declinedEnrollmentData;
          console.log(this.declinedEnrollments);
        });
    },

    filterSections(gradelevel, id, index) {
      console.log("filterSectionsGradelvel:" + gradelevel);
      console.log("filterSectionsGradeId:" + id);
      console.log("filterSectionsGradeIndex:" + index);
      this.id = id;
      this.index = index;
      // console.log(index);
      this.dialog = true;
      this.sections = [];
      this.$store.dispatch("allSections").then((res) => {
        let sections = res;
        // console.log(grade_level);
        for (const key in sections) {
          if (sections.hasOwnProperty.call(sections, key)) {
            const element = sections[key];
            const grade_levelData = element["gradelevel"];
            for (const glKey in grade_levelData) {
              let section = element["name"];
              if (grade_levelData.hasOwnProperty.call(grade_levelData, glKey)) {
                const element1 = grade_levelData[glKey];
                //console.log(glKey);
                if (glKey == "grade_level") {
                  //console.log("here");
                  if (element1 == gradelevel) {
                    //console.log("here");
                    this.sections.push(section);
                  }
                }
              }
            }
          }
        }
        // console.log(this.sections);
      });
    },

    //Select Community turns to null
    ipCommunity() {
      this.studentInfo.IP_community = null;
    },
    //Method For Updating The Student Account
    viewDetails(student) {
      let studentInfo = student;
      const endyear =
        parseInt(
          student.created_at.substring(0, student.created_at.indexOf("-"))
        ) + 1;
      studentInfo["school_year"] =
        student.created_at
          .substring(0, student.created_at.indexOf("-"))
          .toString() +
        "-" +
        endyear.toString();
      this.studentInfo = studentInfo;
      this.studentDialog = true;
    },

    updateStudent(formdata, gradelevel, id, index) {
      console.log("updateStudentGradelvel:" + gradelevel);
      console.log("updateStudentGradeId:" + id);
      console.log("updateStudentGradeIndex:" + index);
      if (this.$refs.studentDetails.validate()) {
        // console.log("id:" + formdata.id);
        this.$axios
          .post(`updateStudent/` + formdata.id, formdata)
          .then((response) => {
            if (response.data.updated) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Student details is successfully updated!",
              });
              this.studentDialog = false;
              this.$refs.studentDetails.resetValidation();
              this.filterSections(gradelevel, id, index);
              this.readonly = true;
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Failed",
                text: "Student details is unsuccessfully updated!",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    //Method For Approving the enrollment
    approveEnrollment(id, index) {
      console.log("section:" + this.section);
      this.loading = true;
      if (this.section) {
        this.$axios
          .post("approveEnrollment/" + id, { student_section: this.section })
          .then((response) => {
            console.log(response);
            this.declinedEnrollments.splice(index, 1);
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: response.data.message,
            });
            this.dialog = false;
            this.loading = false;
            // window.location.reload(true);
          })
          .catch((error) => {
            console.log(error);
            this.$swal.fire({
              icon: "error",
              title: "Ooops....",
              text: error,
            });
            this.loading = false;
            this.dialog = true;
          });
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Ooops....",
          text: "Please select a section.",
        });
        this.dialog = true;
      }
    },
  },

  computed: {
    btnTexts() {
      let texts = "update";

      if (this.readonly) {
        texts = "update";
      } else {
        texts = "save";
      }
      return texts;
    },
  },
};
</script>