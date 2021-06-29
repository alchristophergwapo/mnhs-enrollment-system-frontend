<template>
  <div app>
    <v-card-title>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        dense
        outlined
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      :items-per-page="10"
      class="elevation-1"
      :loading="isDataLoaded ? false : true"
      loading-text="Loading... Please wait"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.grade_level }}</td>
          <td>{{ row.item.firstname }} {{ row.item.lastname }}</td>
          <td>{{ row.item.average }}</td>
          <td>
            <v-btn
              text
              @click="viewStudentDetails(row.item)"
            >
              View Details
            </v-btn>
          </td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  color="primary"
                  icon
                  x-large
                  v-on="on"
                  @click="
                    filterSections(row.item.grade_level, row.item.id, row.index)
                  "
                >
                  <v-icon>mdi-account-plus</v-icon>
                </v-btn>
              </template>
              <span>Approve Admission</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  color="error"
                  icon
                  x-large
                  v-on="on"
                  @click="opendeclineModal(row.item.id, row.index)"
                >
                  <v-icon>mdi-account-minus</v-icon>
                </v-btn>
              </template>
              <span>Decline Enrollment</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">Select Student Sections</span>
            <v-spacer />
            <v-btn
              icon
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="section"
              :items="sections"
              label="Section"
              outlined
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              :loading="loading"
              @click="approveEnrollment(id)"
            >
              Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="studentDetailsDialog"
        transition="dialog-top-transition"
        max-width="715"
      >
        <v-card>
          <v-card-title>
            <v-spacer />
            <v-btn
              icon
              @click="studentDetailsDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                Full Name:&nbsp;&nbsp;<strong>{{ studentToView.firstname }} {{ studentToView.lastname }}</strong>
              </v-col>
              <v-col cols="4">
                PSA No.:&nbsp;&nbsp;<strong>
                  {{ studentToView.PSA ? studentToView.PSA : "N/A" }}
                </strong>
              </v-col>
              <v-col cols="4">
                LRN:&nbsp;&nbsp;<strong>{{ studentToView.LRN }}</strong>
              </v-col>
              <v-col cols="3">
                Average:&nbsp;&nbsp;<strong>{{ studentToView.average }}</strong>
              </v-col>
              <v-col cols="3">
                Birth Date:&nbsp;&nbsp;<strong>{{ studentToView.birthdate }}</strong>
              </v-col>
              <v-col cols="3">
                Age:&nbsp;&nbsp;<strong>{{ studentToView.age }}</strong>
              </v-col>
              <v-col cols="3">
                Gender:&nbsp;&nbsp;<strong>{{ studentToView.gender }}</strong>
              </v-col>
              <v-col cols="12">
                Belonging to any Indigenous Peoples (IP) Community /Indigenous
                Cultural Community ?
                <strong>&nbsp;&nbsp;{{ studentToView.IP }}</strong>
                <strong
                  v-if="studentToView.IP == 'Yes'"
                >&nbsp;&nbsp;({{ studentToView.IP_community }})</strong>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                Mother Tongue:&nbsp;&nbsp;<strong>{{
                  studentToView.mother_tongue
                }}</strong>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                Contact Number:&nbsp;&nbsp;<strong>{{
                  studentToView.contact
                }}</strong>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                Adress:&nbsp;&nbsp;<strong>{{ studentToView.address }}</strong>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                Zip Code:&nbsp;&nbsp;<strong>{{ studentToView.zipcode }}</strong>
              </v-col>
              <v-col
                v-if="studentToView.grade_level === 9 || studentToView.grade_level === 10"
                cols="6"
              >
                Specialization:&nbsp;&nbsp;<strong>{{
                  studentToView.specialization ? studentToView.specialization : "N/A"
                }}</strong>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                Father's Name:&nbsp;&nbsp;<strong>{{
                  studentToView.father ? studentToView.father : "N/A"
                }}</strong>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                Mother's Name:&nbsp;&nbsp;<strong>{{
                  studentToView.mother ? studentToView.mother : "N/A"
                }}</strong>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                Guardian's Name:&nbsp;&nbsp;<strong>{{
                  studentToView.guardian
                }}</strong>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                Parents/Guardian Contact Number:&nbsp;&nbsp;<strong>{{
                  studentToView.parent_number
                }}</strong>
              </v-col>
              <!-- Senior High -->

              <v-col
                v-if="studentToView.semester != null"
                cols="12"
                sm="6"
                md="6"
              >
                Semester:&nbsp;&nbsp;<strong>{{ studentToView.semester }}</strong>
              </v-col>
              <v-col
                v-if="studentToView.track != null"
                cols="12"
                sm="6"
                md="6"
              >
                Track:&nbsp;&nbsp;<strong>{{ studentToView.track }}</strong>
              </v-col>
              <v-col
                v-if="studentToView.strand != null"
                cols="12"
              >
                Strand:&nbsp;&nbsp;<strong>{{ studentToView.strand }}</strong>
              </v-col>
              <!-- Transferees or Balik Aral-->
              <v-col
                v-if="studentToView.last_grade_completed"
                cols="12"
                sm="6"
                md="6"
              >
                Last_grade_completed:&nbsp;&nbsp;<strong>{{
                  studentToView.last_grade_completed
                }}</strong>
              </v-col>
              <v-col
                v-if="studentToView.last_year_completed != null"
                cols="12"
                sm="6"
                md="6"
              >
                Last_year_completed:&nbsp;&nbsp;<strong>{{
                  studentToView.last_year_completed
                }}</strong>
              </v-col>
              <v-col
                v-if="studentToView.Last_school_attended != null"
                cols="12"
                sm="6"
                md="6"
              >
                Last_school_attended:&nbsp;&nbsp;<strong>{{
                  studentToView.last_school_attended
                }}</strong>
              </v-col>
              <v-col
                v-if="studentToView.last_school_ID != null"
                cols="12"
                sm="6"
                md="6"
              >
                Last_school_ID :&nbsp;&nbsp;<strong>{{
                  studentToView.last_school_ID
                }}</strong>
              </v-col>
              <v-col
                v-if="studentToView.last_school_address != null"
                cols="12"
              >
                Last_school_address:&nbsp;&nbsp;<strong>{{
                  studentToView.last_school_address
                }}</strong>
              </v-col>
              <v-img :src="imageUrl + studentToView.card_image">
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="teal darken-4"
                    />
                  </v-row>
                </template>
              </v-img>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- REASON FOR DECLINING THE ENROLLMENT -->
    <v-dialog
      v-model="declineModal"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <template>
        <v-card>
          <v-card-title>
            <v-row>
              <h3>Reason For Declining</h3>
            </v-row>
            <v-btn
              icon
              @click="closeDeclineModal()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-container>
              <v-textarea
                v-model="remarks"
                outlined
                full-width
                single-line
                placeholder="Write the reason for declining here......."
                name="remarks"
                :rules="[
                  (remarks) =>
                    (!!remarks && remarks.trim() != '') ||
                    'Reason for declining is required',
                  (remarks) =>
                    (remarks != null && remarks.length >= 10) ||
                    'Remarks cannot be lesser than 10 characters.',
                ]"
              />
              <!-- <v-divider></v-divider> -->
              <v-card-actions
                id="textarea"
                class="justify-end"
              >
                <v-btn
                  :disabled="!valid"
                  color="blue"
                  @click="declineEnrollment"
                >
                  done
                </v-btn>
              </v-card-actions>
            </v-container>
          </v-form>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
// import { EventBus } from "../../bus/bus.js";
export default {
  data() {
    return {
      isDataLoaded: false,
      declineModal: false,
      declineId: null,
      declineIndex: null,
      studentToView: {},
      valid: true,
      remarks: null,
      dialog: false,
      studentDetailsDialog: false,
      loading: false,
      imageUrl: "https://mnhs-enrollment-system.herokuapp.com/images/",
      item: null,
      id: null,
      index: null,
      search: "",
      headers: [
        { text: "Grade Level", align: "start", value: "grade_level" },
        { text: "Student Name", value: "fullname" },
        { text: "Average", value: "average" },
        { text: "Details", value: "details" },
        { text: "Action", value: "action" },
      ],
      students: [],
      sections: [],
      section: null,
    };
  },
  created() {
    this.retrieveData();
  },
  methods: {
    retrieveData() {
      this.students = [];
      let adminLevel = null;
      let userData = this.$user;
      if (userData.user_type != "admin") {
        let temp = this.$user.username.split("_");
        adminLevel = temp[1];
      }
      this.section = this.sections[0];
      this.filterStudents = this.students;
      this.$store.dispatch("allPendingEnrollments", adminLevel).then((res) => {
        this.isDataLoaded = true;

        let pending = res;

        for (var index in pending) {
          let element = pending[index];
          element["fullname"] = element["firstname"].concat(
            " ",
            element["lastname"]
          );
          this.students.push(element);
        }
      });
    },
    openDialog(data) {
      this.item = data;
      this.dialog = true;
    },

    viewStudentDetails(data) {
      this.studentDetailsDialog = true;
       this.studentToView = data
    },

    filterSections(gradelevel, id, index) {
      this.id = id;
      this.index = index;
      this.dialog = true;
      this.sections = [];
      let adminLevel = null;
      if (this.$user.user_type == "teacher_admin") {
        let temp = this.$user.username.split("_");
        adminLevel = temp[1];
      }
      this.$store.dispatch("allSections", adminLevel).then((res) => {
        let sections = res;
        for (const key in sections) {
          if (sections.hasOwnProperty.call(sections, key)) {
            const element = sections[key];
            const grade_levelData = element["gradelevel"];
            for (const glKey in grade_levelData) {
              let section = element["name"];
              if (grade_levelData.hasOwnProperty.call(grade_levelData, glKey)) {
                const element1 = grade_levelData[glKey];
                if (glKey == "grade_level") {
                  if (element1 == gradelevel) {
                    this.sections.push(section);
                  }
                }
              }
            }
          }
        }
      });
    },

    //Method For Approving the enrollment
    approveEnrollment(id) {
      this.loading = true;
      if (this.section) {
        this.$axios
          .post("approveEnrollment/" + id, { student_section: this.section })
          .then(() => {
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Application for admission approved.",
            });
            this.retrieveData();
            this.dialog = false;
            this.loading = false;
          })
          .catch((error) => {
            this.$swal.fire({
              icon: "error",
              title: "Ooops....",
              text: error.response.data.message,
            });
            this.loading = false;
            this.dialog = true;
            if (error.response.status != 500) {
              this.$swal.fire({
                icon: "error",
                title: "Ooops....",
                text: error.response.data.message,
              });
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Ooops....",
                text: error.response.data.error,
              });
            }
          });
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Ooops....",
          text: "Please select a section.",
        });
        this.dialog = true;
        this.loading = false;
      }
    },

    //Method For Opending the Modal OF REASON FOR DECLINING
    opendeclineModal(id, index) {
      this.declineId = id;
      this.declineIndex = index;
      this.declineModal = true;
    },

    closeDeclineModal() {
      this.declineModal = false;
      this.remarks = null;
      this.$refs.form.resetValidation();
    },

    declineEnrollment() {
      if (this.$refs.form.validate()) {
        this.$axios
          .post("declineEnrollment/" + this.declineId, {
            remarks: this.remarks,
          })
          .then(() => {
            this.$swal.fire({
              icon: "info",
              title: "Success",
              text: "Application for admission declined.",
            });
            this.retrieveData();
            this.$refs.form.reset();
            this.declineModal = false;
          })
          .catch(() => {
            this.$swal.filter({
              icon: "error",
              title: "Ooops...",
              text: "An error encountered!",
            });
          });
      }
    },
  },
};
</script>

<style scoped>
#textarea {
  margin-top: -4%;
}

@media screen and (max-width: 767.98px) {
  .container {
    padding: 0px;
  }
  #textarea {
    margin-top: -6%;
  }
}
</style>
