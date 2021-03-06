<template>
  <v-app>
    <v-container>
      <v-form v-model="enrollmentValid" ref="enrollment" lazy-validation>
        <v-row>
          <v-col cols="12" md="12">
            <div class="font-weight-bold text-center">
              <h3>Student Information</h3>
            </div>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>PSA Birth Certificate No.</h4>
            </div>
            <v-text-field
              name="PSA"
              :value="studentInformation.PSA"
              disabled
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Learners Reference No. (LRN)</h4>
            </div>
            <v-text-field
              name="LRN"
              :value="studentInformation.LRN"
              disabled
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Average</h4>
            </div>
            <v-text-field
              name="average"
              :value="studentInformation.average"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Firstname</h4>
            </div>
            <v-text-field
              name="firstname"
              :value="studentInformation.firstname"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Middlename</h4>
            </div>
            <v-text-field
              name="middlename"
              :value="studentInformation.middlename"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Lastname</h4>
            </div>
            <v-text-field
              name="lastname"
              :value="studentInformation.lastname"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Date of Birth</h4>
            </div>
            <v-text-field
              name="birthdate"
              :value="studentInformation.birthdate"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2" md="2" lg="2">
            <div class="font-weight-bold">
              <h4>Age</h4>
            </div>
            <v-text-field
              name="age"
              :value="studentInformation.age"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2" md="2" lg="2">
            <div class="font-weight-bold">
              <h4>Gender</h4>
            </div>
            <v-text-field
              name="gender"
              :value="studentInformation.gender"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" v-if="studentInformation.IP != 'No'">
            <div class="font-weight-bold">
              <h4>Community</h4>
            </div>
            <v-text-field
              required
              :value="studentInformation.IP_Community"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Mother Tongue</h4>
            </div>
            <v-text-field
              name="mother_tongue"
              :value="studentInformation.mother_tongue"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Contact Number</h4>
            </div>
            <v-text-field
              name="contact"
              :value="studentInformation.contact"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Address</h4>
            </div>
            <v-text-field
              name="address"
              :value="studentInformation.address"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4">
            <div class="font-weight-bold">
              <h4>Zipcode</h4>
            </div>
            <v-text-field
              name="zipcode"
              :value="studentInformation.zipcode"
              disabled
            ></v-text-field>
          </v-col>

          <div
            style="width: 100%; height: 2px; background: rgba(0, 0, 0, 0.5)"
          ></div>

          <!-- Start parent/guardian information -->
          <v-col cols="12" md="12">
            <div class="font-weight-bold text-center">
              <h3>Parent/Guardian Information</h3>
            </div>
          </v-col>
          <v-col cols="12" sm="4" md="3" lg="3">
            <div class="font-weight-bold">
              <h4>Father's Name</h4>
            </div>
            <v-text-field
              name="father"
              :value="parentGuardianInfo.father"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="3" lg="3">
            <div class="font-weight-bold">
              <h4>Mother's Name</h4>
            </div>
            <v-text-field
              name="mother"
              :value="parentGuardianInfo.mother"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="3" lg="3">
            <div class="font-weight-bold">
              <h4>Guardian Name</h4>
            </div>
            <v-text-field
              name="guardian"
              :value="parentGuardianInfo.guardian"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="3" lg="3">
            <div class="font-weight-bold">
              <h4>Parent/Guardian Number</h4>
            </div>
            <v-text-field
              name="parent_number"
              :value="parentGuardianInfo.parent_number"
              disabled
            ></v-text-field>
          </v-col>

          <div
            v-if="balikAralOrTransfereeInfo"
            style="width: 100%; height: 2px; background: rgba(0, 0, 0, 0.5)"
          ></div>

          <!-- start balik aral/transferee information -->
          <v-col cols="12" sm="12" v-if="balikAralOrTransfereeInfo">
            <v-row>
              <v-col cols="12" md="12">
                <div class="font-weight-bold text-center">
                  <h3>Balik Aral/Transferee Information</h3>
                </div>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <div class="font-weight-bold">
                  <h4>Last Grade Completed</h4>
                </div>
                <v-text-field
                  :value="balikAralOrTransfereeInfo.last_grade_completed"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <div class="font-weight-bold">
                  <h4>Last School ID Number</h4>
                </div>
                <v-text-field
                  :value="balikAralOrTransfereeInfo.last_school_ID"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <div class="font-weight-bold">
                  <h4>Last Grade Completed</h4>
                </div>
                <v-text-field
                  :value="balikAralOrTransfereeInfo.last_grade_completed"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <div class="font-weight-bold">
                  <h4>Last School Address</h4>
                </div>
                <v-text-field
                  :value="balikAralOrTransfereeInfo.last_school_attended"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <div class="font-weight-bold">
                  <h4>Last Grade Completed</h4>
                </div>
                <v-text-field
                  :value="balikAralOrTransfereeInfo.last_school_address"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <div class="font-weight-bold">
                  <h4>Last Year Completed</h4>
                </div>
                <v-text-field
                  :value="balikAralOrTransfereeInfo.last_year_completed"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <div
            v-if="seniorHighInfo"
            style="width: 100%; height: 2px; background: rgba(0, 0, 0, 0.5)"
          ></div>

          <!-- start senior high information -->
          <v-col cols="12" sm="12" v-if="seniorHighInfo">
            <v-row>
              <v-col cols="12" md="12">
                <div class="font-weight-bold text-center">
                  <h3>Senior High Information</h3>
                </div>
              </v-col>
              <v-col cols="12" sm="4" md="4" lg="4">
                <div class="font-weight-bold">
                  <h4>Semester</h4>
                </div>
                <v-text-field
                  :value="seniorHighInfo.semester"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4" lg="4">
                <div class="font-weight-bold">
                  <h4>Track</h4>
                </div>
                <v-text-field
                  :value="seniorHighInfo.track"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4" lg="4">
                <div class="font-weight-bold">
                  <h4>Strand</h4>
                </div>
                <v-text-field
                  :value="seniorHighInfo.strand"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      enrollmentValid: true,
      studentInformation: null,
      parentGuardianInfo: null,
      balikAralOrTransfereeInfo: null,
      seniorHighInfo: null,
    };
  },

  methods: {
    initialize() {
      this.studentInformation = JSON.parse(this.$store.getters.student);
      this.parentGuardianInfo = JSON.parse(this.$store.getters.parentGuardian);
      this.balikAralOrTransfereeInfo = JSON.parse(
        this.$store.getters.balikOrTransfer
      );
      this.seniorHighInfo = JSON.parse(this.$store.getters.seniorHigh);
    },
  },

  created() {
    this.initialize();
  },
};
</script>