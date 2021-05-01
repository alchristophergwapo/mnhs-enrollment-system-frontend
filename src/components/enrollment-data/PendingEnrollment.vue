<template>
  <div app>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        dense
        outlined
      ></v-text-field>
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
            <v-dialog transition="dialog-top-transition" max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on">View Details</v-btn>
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.value = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6" sm="6">
                        PSA No.:&nbsp;&nbsp;<strong>{{ row.item.PSA }}</strong>
                      </v-col>
                      <v-col cols="12" md="6" sm="6">
                        LRN:&nbsp;&nbsp;<strong>{{ row.item.LRN }}</strong>
                      </v-col>
                      <v-col cols="12" md="6" sm="6">
                        Average:&nbsp;&nbsp;<strong>{{
                          row.item.average
                        }}</strong>
                      </v-col>
                      <v-col cols="12" md="6" sm="6">
                        Full Name:&nbsp;&nbsp;<strong
                          >{{ row.item.firstname }}
                          {{ row.item.lastname }}</strong
                        >
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Birth Date:&nbsp;&nbsp;<strong>{{
                          row.item.birthdate
                        }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="2">
                        Age:&nbsp;&nbsp;<strong>{{ row.item.age }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        Gender:&nbsp;&nbsp;<strong>{{
                          row.item.gender
                        }}</strong>
                      </v-col>
                      <v-col cols="12">
                        Belonging to any Indigenous Peoples (IP)<br />Community
                        /Indigenous Cultural Community ?
                        <strong>&nbsp;&nbsp;{{ row.item.IP }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Mother Tongue:&nbsp;&nbsp;<strong>{{
                          row.item.mother_tongue
                        }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Contact Number:&nbsp;&nbsp;<strong>{{
                          row.item.contact
                        }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Adress:&nbsp;&nbsp;<strong>{{
                          row.item.address
                        }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Zip Code:&nbsp;&nbsp;<strong>{{
                          row.item.zipcode
                        }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Father's Name:&nbsp;&nbsp;<strong>{{
                          row.item.father
                        }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Mother's Name:&nbsp;&nbsp;<strong>{{
                          row.item.mother
                        }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Guardian's Name:&nbsp;&nbsp;<strong>{{
                          row.item.guardian
                        }}</strong>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Contact Number:&nbsp;&nbsp;<strong>{{
                          row.item.parent_number
                        }}</strong>
                      </v-col>
                      <v-img :src="imageUrl + row.item.card_image"></v-img>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
            </v-dialog>
          </td>
          <td>
            <v-speed-dial
              direction="left"
              open-on-hover
              transition="slide-y-transition"
            >
              <template v-slot:activator>
                <v-btn color="blue darken-2" dark>
                  <span> action </span>
                </v-btn>
              </template>
              <v-btn
                color="primary"
                @click="
                  filterSections(row.item.grade_level, row.item.id, row.index)
                "
                icon
                x-large
              >
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
              <v-btn
                color="error"
                @click="opendeclineModal(row.item.id, row.index)"
                icon
                x-large
              >
                <v-icon>mdi-account-minus</v-icon>
              </v-btn>
            </v-speed-dial>
          </td>
        </tr>
      </template>
    </v-data-table>
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
              label="Section"
              outlined
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
              Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- REASON FOR DECLINING THE ENROLLMENT -->
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="declineModal"
    >
      <template>
        <v-card>
          <v-card-title>
            <v-row>
              <h3>Reason For Declining</h3>
            </v-row>
            <v-btn icon @click="closeDeclineModal()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-textarea
              v-model="remarks"
              outlined
              full-width
              single-line
              placeholder="Write the reason for declining here......."
              name="remarks"
              :rules="[
                (remarks) => !!remarks || 'Reason for declining is required',
              ]"
            ></v-textarea>
            <!-- <v-divider></v-divider> -->
            <v-card-actions class="justify-end" id="textarea">
              <v-btn :disabled="!valid" color="blue" @click="declineEnrollment"
                >done</v-btn
              >
            </v-card-actions>
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
      valid: true,
      remarks: null,
      dialog: false,
      loading: false,
      imageUrl: "https://mnhs-enrollment-system.herokuapp.com/images/",
      //imageUrl: "http://localhost:8000/images/",
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
      let adminLevel = null;
      let userData = this.$user;
      console.log(userData);
      if (userData.user_type != "admin") {
        let temp = this.$user.username.split("_");
        adminLevel = temp[1];
        console.log(adminLevel);
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

    filterSections(gradelevel, id, index) {
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
                // console.log(glKey);
                if (glKey == "grade_level") {
                  // console.log("here");
                  if (element1 == gradelevel) {
                    // console.log("here");
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

    //Method For Approving the enrollment
    approveEnrollment(id, index) {
      console.log(this.section);
      this.loading = true;
      if (this.section) {
        this.$axios
          .post("approveEnrollment/" + id, { student_section: this.section })
          .then((response) => {
            console.log(response);
            this.students.splice(index, 1);
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Enrollment approved.",
            });
            this.dialog = false;
            this.loading = false;
            // this.sendSms(id);
            // window.location.reload(true);
          })
          .catch((error) => {
            console.log(error);
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
      }
    },

    //Method For Opending the Modal OF REASON FOR DECLINING
    opendeclineModal(id, index) {
      console.log(index);
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
          .then((response) => {
            console.log(response);
            this.$swal.fire({
              icon: "info",
              title: "Success",
              text: "Enrollment declined.",
            });
            this.retrieveData();
            this.$refs.form.reset();
            this.declineModal = false;
          })
          .catch((error) => {
            console.log(error);
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