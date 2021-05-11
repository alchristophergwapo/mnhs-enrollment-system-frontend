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
      :loading="isDataLoaded ? false : true"
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
      persistent
      max-width="800"
    >
      <template v-slot:default="dialog">
        <v-form ref="studentDetails" v-model="valid" lazy-validation>
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
                      (LRN) => (!!LRN && LRN.trim() != '') || 'LRN is required',
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
                      (v) => v <= 100 || 'Maximum average is 100',
                    ]"
                    type="number"
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
                    :rules="[
                      (v) => (!!v && v.trim() != '') || 'Firstname is required',
                      (v) =>
                        (v && v.length >= 3) ||
                        'Firstname cannot be lesser than 3 characters.',
                      (v) =>
                        /^[a-zA-Z\s]+$/.test(v) == true ||
                        'Only letters are  allowed!',
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
                    :rules="[
                      (v) =>
                        /^[a-zA-Z\s-]+$/.test(v) == true ||
                        v == '' ||
                        'Only letters are  allowed, except for - !',
                    ]"
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
                      (v) => (!!v && v.trim() != '') || 'Lastname is required',
                      (v) =>
                        (v && v.length >= 3) ||
                        'Firtname cannot be lesser than 3 characters.',
                      (v) =>
                        /^[a-zA-Z\s-]+$/.test(v) == true ||
                        'Only letters are  allowed, except for - !',
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
                    @click="modal = !modal"
                    label="Date of Birth"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                  ></v-text-field>
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="studentInfo.birthdate"
                    persistent
                    width="290px"
                  >
                    <v-date-picker
                      v-model="studentInfo.birthdate"
                      year-icon="mdi-calendar-blank"
                      :min="min_date"
                      :max="max_date"
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="
                          $refs.dialog.save(studentInfo.birthdate),
                            getAge(studentInfo.birthdate)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>

                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field
                    v-model="studentInfo.age"
                    name="age"
                    :rules="[
                      (v) => !!v || 'Age is required',
                      (v) =>
                        /^[0-9]+$/.test(v) == true ||
                        'Only Number is  allowed!',
                      (v) =>
                        v >= 10 ||
                        'You are too young to enroll for high school.',
                      (v) => v <= 50 || 'Please confirm your age.',
                    ]"
                    label="Age"
                    readonly
                    outlined
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
                    type="checkbox"
                    :readonly="readonly"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
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

                <v-col cols="12" xs="6" sm="6" md="6" lg="3">
                  <v-text-field
                    v-model="studentInfo.mother_tongue"
                    name="mother_tongue"
                    :rules="[
                      (v) =>
                        (!!v && v.trim()) != '' || 'Mother tongue is required',
                      (mother_tongue) =>
                        /^[a-zA-Z\s]+$/.test(mother_tongue) == true ||
                        'Only letters are allowed.',
                    ]"
                    label="Mother Tongue"
                    placeholder="e.g Cebuano, Tagalog, Waray"
                    outlined
                    :readonly="readonly"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" xs="6" sm="6" md="6" lg="3">
                  <v-text-field
                    v-model="studentInfo.contact"
                    name="contact"
                    :rules="[
                      (v) => (!!v && v.trim() != '') || 'Contact is required',
                      (v) =>
                        (v.length > 0 &&
                          String(v).charAt(0) === '0' &&
                          String(v).charAt(1) === '9') ||
                        'Contact number is invalid!',
                      (v) =>
                        /^[0-9]+$/.test(v) == true ||
                        'Only Number is  allowed!',
                      (v) =>
                        String(v).length <= 11 ||
                        'Contact number cannot be greater than 11 digits',
                      (v) =>
                        String(v).length == 11 ||
                        'Contact number must be 11 digits',
                    ]"
                    type="text"
                    label="Contact Number"
                    :counter="11"
                    :readonly="readonly"
                    outlined
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" xs="6" sm="6" md="6" lg="3">
                  <v-text-field
                    v-model="studentInfo.address"
                    name="address"
                    :rules="[
                      (address) =>
                        (!!address && address.trim() != '') ||
                        'Address is required',
                      (address) =>
                        (address && address.length >= 4) ||
                        'Address must be at least 4 characters.',
                      (address) =>
                        /^[a-zA-Z0-9\s-,]+$/.test(address) == true ||
                        'Only letters and numbers are allowed excepts - and , .',
                    ]"
                    label="Address"
                    :readonly="readonly"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="3">
                  <v-text-field
                    v-model="studentInfo.zipcode"
                    name="zipcode"
                    :rules="[
                      (zipcode) =>
                        (!!zipcode && zipcode.trim() != '') ||
                        'Zipcode is required',
                      (zipcode) =>
                        /^[0-9]+$/.test(zipcode) == true ||
                        'Only Number is  allowed!',
                      (zipcode) =>
                        String(zipcode).length <= 4 ||
                        'Zipcode cannot be greater than 4 digits',
                      (zipcode) =>
                        String(zipcode).length == 4 ||
                        'Zipcode must be 4 digits',
                    ]"
                    :counter="4"
                    label="Zipcode"
                    :readonly="readonly"
                    outlined
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" xs="6" sm="6" md="6" lg="3">
                  <v-text-field
                    v-model="studentInfo.father"
                    label="Father's Name"
                    :rules="[
                      (v) =>
                        /^[a-zA-Z\s-]+$/.test(v) == true ||
                        v == '' ||
                        'Only letters are  allowed, except for - !',
                    ]"
                    :readonly="readonly"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="3">
                  <v-text-field
                    v-model="studentInfo.mother"
                    label="Mother's Maiden Name"
                    :rules="[
                      (v) =>
                        /^[a-zA-Z\s-\s]+$/.test(v) == true ||
                        v == '' ||
                        'Only letters are  allowed, except for - !',
                    ]"
                    outlined
                    :readonly="readonly"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="3">
                  <v-text-field
                    v-model="studentInfo.guardian"
                    :rules="[
                      (guardian) =>
                        (!!guardian && guardian.trim() != '') ||
                        'Guardian name is required',
                      (v) =>
                        /^[a-zA-Z\s-]+$/.test(v) == true ||
                        'Only letters are  allowed, except for - !',
                    ]"
                    label="Guardian's Name"
                    outlined
                    :readonly="readonly"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="3">
                  <v-text-field
                    v-model="studentInfo.parent_number"
                    :rules="[
                      (contact) =>
                        (!!contact && contact.trim() != '') ||
                        'Parent/Guardian contact number is required.',
                      (contact) =>
                        (studentInfo.contact.length > 0 &&
                          String(contact).charAt(0) === '0' &&
                          String(contact).charAt(1) === '9') ||
                        'Contact number is invalid!',
                      (parent_number) =>
                        /^[0-9]+$/.test(parent_number) == true ||
                        'Only Number is  allowed!',
                      (parent_number) =>
                        String(parent_number).length <= 11 ||
                        'Parent/Guardian cannot be greater than 11 digits',
                      (parent_number) =>
                        String(parent_number).length == 11 ||
                        'Parent/Guardian contact number must be 11 digits',
                    ]"
                    label="Parent/Guardian Contact Number"
                    :counter="11"
                    outlined
                    :readonly="readonly"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  style="margin-top: -15px"
                >
                  <v-textarea
                    outlined
                    name="remarks"
                    label="Reason For Declining"
                    placeholder="Write the reason for declining here......."
                    v-model="studentInfo.remark"
                    readonly
                  ></v-textarea>
                </v-col>
                <!----------------------------------THIS IS FOR SENIOR HIGH STUDENT DATA INFORMATION------------------------------------------->
                <v-col
                  cols="12"
                  xs="12"
                  sm="12"
                  md="12"
                  lg="12"
                  v-if="studentInfo.semester != null"
                >
                  <p style="text-align: center; font-size: 20px">
                    <b>SENIOR HIGH LEARNER</b>
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  xs="6"
                  sm="4"
                  md="4"
                  lg="4"
                  v-if="studentInfo.semester != null"
                >
                  <v-select
                    v-model="studentInfo.semester"
                    :rules="[
                      (semester) => !!semester || 'Semester is required.',
                    ]"
                    :items="['Second Semester', 'First Semester']"
                    label="Select semester"
                    outlined
                    :readonly="readonly"
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  xs="6"
                  sm="6"
                  md="6"
                  lg="4"
                  v-if="studentInfo.track != null"
                >
                  <v-select
                    v-model="studentInfo.track"
                    :rules="[(track) => !!track || 'Track is required.']"
                    :items="tracks"
                    label="Track"
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
                  lg="4"
                  v-if="studentInfo.strand != null"
                >
                  <v-select
                    v-model="studentInfo.strand"
                    :items="strands[0][studentInfo.track]"
                    :rules="[(strand) => !!strand || 'Strand is required.']"
                    label="Strand"
                    outlined
                    :readonly="readonly"
                    required
                  ></v-select>
                </v-col>

                <!-------------------------------THIS------------IS---------FOR------BALIK----ARAL--- STUDENT----SIDE --------------- -->
                <v-col
                  cols="12"
                  xs="12"
                  sm="12"
                  md="12"
                  lg="12"
                  v-if="studentInfo.last_school_ID != null"
                >
                  <p style="text-align: center; font-size: 20px">
                    <b>Balik Aral/Transferee</b>
                  </p>
                </v-col>
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
                  v-if="studentInfo.last_grade_completed != null"
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
                    type="number"
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
                        (last_school_ID &&
                          String(last_school_ID).length <= 6) ||
                        'School ID cannot be greater than 6 digits',
                      (last_school_ID) =>
                        (last_school_ID &&
                          String(last_school_ID).length == 6) ||
                        'School ID must be 6 digits',
                    ]"
                    label="School ID"
                    :counter="6"
                    :readonly="readonly"
                    type="number"
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
                      (last_school_attended) =>
                        (last_school_attended &&
                          last_school_attended.length >= 8) ||
                        'School name must be at least 8 characters.',
                      (v) =>
                        /^[a-zA-Z\s]+$/.test(v) == true ||
                        'Only letters are allowed.',
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
                          last_school_address.trim() != '') ||
                        'School adress is required',
                      (last_school_address) =>
                        (last_school_address &&
                          last_school_address.length >= 4) ||
                        'School address must be at least 4 characters.',
                      (v) =>
                        /^[a-zA-Z0-9\s-,]+$/.test(v) == true ||
                        'Only letters and numbers are allowed excepts - and , .',
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
                  :disabled="!valid"
                  color="blue darken-1"
                  @click="
                    readonly
                      ? ((readonly = false), (statusLevel = false))
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
      <v-dialog v-model="dialog" max-width="500px" persistent>
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
              @click="approveEnrollment(id)"
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
      max_date: null,
      min_date: null,
      modal: false,
      dialog: false,
      loading: false,
      valid: true,
      readonly: true,
      statusLevel: true,
      studentInfo: {},
      isDataLoaded: false,
      section: "",
      search: "",
      declinedEnrollments: [],
      sections: [],
      selectLevel: [],
      GradeLevel: [],
    };
  },

  created() {
    let todayDate = new Date();
    this.max_date = this.$moment(
      new Date(`${todayDate.getFullYear() - 8}-12-31`)
    ).format("YYYY-MM-DD");
    this.min_date = this.$moment(
      new Date(`${todayDate.getFullYear() - 50}-12-31`)
    ).format("YYYY-MM-DD");
    this.retrieveData();
    EventBus.$on("refresh", () => {
      this.retrieveData();
    });
  },
  methods: {
    retrieveData() {
      let adminLevel = null;
      let userData = this.$user;
      if (userData.user_type != "admin") {
        let temp = this.$user.username.split("_");
        adminLevel = temp[1];
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
        });
    },

    filterSections(gradelevel, id, index) {
      this.id = id;
      this.index = index;
      this.dialog = true;
      this.sections = [];
      this.$store.dispatch("allSections").then((res) => {
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
    //get THE  AGE OF THE STUDENT
    getAge(bday) {
      var today = new Date();
      var birthDate = new Date(bday);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (bday) {
        this.studentInfo.age = age;
      }
    },
    //Select Community turns to null
    ipCommunity() {
      this.studentInfo.IP_community = null;
    },
    //Change GradeLevel
    lastGradeLevel(grade) {
      this.statusLevel = true;
      this.studentInfo.grade_level = Number(grade.last_grade_completed) + 1;
    },
    //Method For Updating The Student Account
    viewDetails(student) {
      if (student.track != null && student.last_school_attended == null) {
        this.selectLevel = ["10", "11"];
        this.GradeLevel = [11, 12];
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
      } else if (
        student.track != null &&
        student.last_school_attended != null
      ) {
        this.selectLevel = ["10", "11"];
        this.GradeLevel = [11, 12];
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
      } else if (
        student.track == null &&
        student.last_school_attended != null
      ) {
        this.selectLevel = ["6", "7", "8", "9"];
        this.GradeLevel = [7, 8, 9, 10];
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
      } else {
        this.GradeLevel = [7, 8, 9, 10];
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
      }
    },

    updateStudent(formdata, gradelevel, id, index) {
      if (this.$refs.studentDetails.validate()) {
        this.$axios
          .post(`updatedeclineEnrollment/` + formdata.student_id, formdata)
          .then((response) => {
            if (response.data.updated) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Student details is successfully updated!",
              });
              this.declinedEnrollments = [];
              this.retrieveData();
              this.studentDialog = false;
              this.$refs.studentDetails.resetValidation();
              this.filterSections(gradelevel, id, index);
              this.readonly = true;
              this.statusLevel = true;
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Failed",
                text: "Student details is unsuccessfully updated!",
              });
            }
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

    //Method For Approving the enrollment
    approveEnrollment(id) {
      this.loading = true;
      if (this.section) {
        this.loading = true;
        this.$axios
          .post("approveEnrollment/" + id, { student_section: this.section })
          .then((response) => {
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: response.data.message,
            });
            this.declinedEnrollments = [];
            this.retrieveData();
            this.dialog = false;
            this.loading = false;
          })
          .catch(() => {
            this.$swal.fire({
              icon: "error",
              title: "Ooops....",
              text: "An error encountered!",
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
        this.loading = false;
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