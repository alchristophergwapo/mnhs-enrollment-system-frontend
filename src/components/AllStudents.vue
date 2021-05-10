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
          :loading="isDataLoaded ? false : true"
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
            <v-form ref="studentDetails" v-model="valid" lazy-validation>
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
                          (v) =>
                            (!!v && v.trim() != '') || 'Lastname is required',
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
                            v >= 10 ||
                            'You are too young to enroll for high school.',
                          (v) => v <= 50 || 'Please confirm your age.',
                        ]"
                        label="Age"
                        readonly
                        outlined
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
                            (!!IP_Community && IP_Community.trim() != '') ||
                            'This field is required',
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
                          (mother_tongue) =>
                            (!!mother_tongue && mother_tongue.trim() != '') ||
                            'Mother tongue is required',
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
                          (contact) => !!contact || 'Contact is required',
                          (contact) =>
                            /^[0-9]+$/.test(contact) == true ||
                            'Only Number is  allowed!',
                          (contact) =>
                            String(contact).length <= 11 ||
                            'Contact number cannot be greater than 11 digits',
                          (contact) =>
                            String(contact).length == 11 ||
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
                          (zipcode) => !!zipcode || 'Zipcode is required',
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
                          (v) =>
                            (!!v && v.trim() != '') ||
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
                          (parent_number) =>
                            !!parent_number ||
                            'Parent/Guardian contact number is required.',
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
                          (v) =>
                            !!v || 'Last Grade Level Completed is required',
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
                          (v) =>
                            !!v || 'Last School Year Completed is required',
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
                          (v) => !!v || 'School ID is required',
                          (v) =>
                            /^[0-9]+$/.test(v) == true ||
                            'Only Number is  allowed!',
                          (v) =>
                            (v && String(v).length <= 6) ||
                            'School ID cannot be greater than 6 digits',
                          (v) =>
                            (v && String(v).length == 6) ||
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
                          (v) =>
                            (!!v && v.trim() != '') ||
                            'School name is required',
                          (v) =>
                            (v && v.length >= 8) ||
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
                          (v) =>
                            (!!v && v.trim() != '') ||
                            'School adress is required',
                          (v) =>
                            (v && v.length >= 4) ||
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
                      color="blue darken-1"
                      :disabled="!valid"
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
    max_date: null,
    min_date: null,
    modal: false,
    dialog: false,
    isDataLoaded: false,
    readonly: true,
    valid: true,
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
    let todayDate = new Date();
    this.max_date = this.$moment(
      new Date(`${todayDate.getFullYear() - 8}-12-31`)
    ).format("YYYY-MM-DD");
    this.min_date = this.$moment(
      new Date(`${todayDate.getFullYear() - 50}-12-31`)
    ).format("YYYY-MM-DD");
    let adminLevel = null;
    if (this.$user.user_type == "teacher_admin") {
      let temp = this.$user.username.split("_");
      adminLevel = temp[1];
      this.isAdmin = false;
    }
    this.$store
      .dispatch("allStudents", adminLevel)
      .then((response) => {
        this.isDataLoaded = true;
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
    //Open Or View Student Details
    editDetails(student, index) {
      this.backupSection = student.section_name;
      this.backupGrade = student.grade_level;
      if (student.track != null && student.last_school_attended == null) {
        let studentInfo = student;
        this.selectLevel = ["10", "11"];
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
        this.selectLevel = ["10", "11"];
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
        this.selectLevel = ["6", "7", "8", "9"];
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
      this.studentInfo.grade_level = Number(grade.last_grade_completed) + 1;
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
      if (this.sections.includes(this.section)) {
        this.studentInfo.section_name = this.section;
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