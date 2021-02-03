<template>
  <v-app>
    <div class="enrollment">
      <v-toolbar dark color="#3bbdda">
        <v-avatar>
          <v-img :src="require('../assets/images/logo.jpg')"></v-img>
        </v-avatar>
        <v-toolbar-title class="toolbar-title">Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text link to="/sign-in">Login</v-btn>
      </v-toolbar>
      <br>
      <div class="form-container">
        <v-card
          color="rgba(255, 255, 255, .9)"
          class="card mx-auto my-12"
          width="100%"
          max-width="800"
        >
          <v-card-title>
            <span
              style="width: 100%; text-align: center"
            >Please fill out the information below and SUBMIT.</span>
          </v-card-title>

          <v-form>
            <v-container>
              <!-- <student-info-form></student-info-form> -->
              <v-row>
                <div class="form-head">Student information</div>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.certificate" label="PSA Birth Certificate No."></v-text-field>
                </v-col>

                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.lrn" label="Learners Reference No. (LRN)"></v-text-field>
                </v-col>

                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.average" type="number" label="Average" min="0"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.firstname" label="Firstname"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.middlename" label="Middlename"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.lastname" label="Lastname"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.birthday" label="Date of Birth" type="date"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.age" label="Age" type="number" min="0"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="2" md="2" lg="2">
                  <v-checkbox
                    v-model="Enroll.male_checkbox"
                    value="Male"
                    label="Male"
                    type="checkbox"
                  ></v-checkbox>
                  <v-spacer></v-spacer>
                </v-col>
                <v-col cols="12" xs="6" sm="2" md="2" lg="2">
                  <v-checkbox
                    v-model="Enroll.female_checkbox"
                    value="Female"
                    label="Female"
                    type="checkbox"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <p>
                    Belonging to any Indegenous People (IP) Community/Indegenous Cultural
                    Community?
                  </p>
                </v-col>
                <v-col cols="12" xs="6" sm="2" md="2" lg="2">
                  <v-checkbox v-model="Enroll.ip_checkbox" value="Yes" label="Yes" type="checkbox"></v-checkbox>
                </v-col>

                <v-col cols="12" xs="6" sm="2" md="2" lg="2">
                  <v-checkbox
                    v-model="Enroll.not_ip_checkbox"
                    value="No"
                    label="No"
                    type="checkbox"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field v-model="Enroll.specify" label="If yes, please specify"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field v-model="Enroll.language" label="Mother Tongue"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field type="number" v-model="Enroll.phoneNumber" label="Contact Number"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field v-model="Enroll.address" label="Address"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field v-model="Enroll.zipcode" label="Zipcode"></v-text-field>
                </v-col>
              </v-row>
              <!-- <student-info-form></student-info-form> -->

              <!-- <parent-guardian-info></parent-guardian-info> -->
              <v-row>
                <div class="form-head">Parent/guardian information</div>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field label="Father's Name" v-model="Enroll.father"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field label="Mother's Maiden Name" v-model="Enroll.motherMaiden"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field label="Guardian's Name" v-model="Enroll.guardian"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field label="Contact Number" v-model="Enroll.guardianContact"></v-text-field>
                </v-col>
              </v-row>
              <!-- <parent-guardian-info></parent-guardian-info> -->

              <!-- <balik-or-transfer></balik-or-transfer> -->
              <v-row>
                <div
                  class="form-head"
                >For Returning Learners (Balik Aral) and Those Who Shall Transfer/ Move In</div>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field label="Last Grade Level Completed" v-model="Enroll.lastGradeLevel"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field label="Last School Year Completed" v-model="Enroll.lastSchoolYear"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-text-field label="School ID" v-model="Enroll.schoolId"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field label="School Name" v-model="Enroll.schoolName"></v-text-field>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-text-field label="School Address" v-model="Enroll.schoolAdress"></v-text-field>
                </v-col>
              </v-row>
              <!-- <balik-or-transfer></balik-or-transfer> -->

              <!-- <senior-high v-bind:track="tracks" v-bind:strand="strands"></senior-high> -->
              <v-row>
                <div class="form-head">For Senior High Learners</div>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <p class="checkbox-label" style="padding-top: 28px">Semester</p>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-checkbox
                    label="First Semester"
                    type="checkbox"
                    value="1"
                    v-model="Enroll.firstSemester"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" xs="6" sm="4" md="4" lg="4">
                  <v-checkbox
                    label="Second Semester"
                    type="checkbox"
                    value="2"
                    v-model="Enroll.secondSemester"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-select v-model="Enroll.track_selected" :items="tracks" label="Track"></v-select>
                </v-col>
                <v-col cols="12" xs="6" sm="6" md="6" lg="6">
                  <v-select
                    v-model="Enroll.strand_selected"
                    :items="strands"
                    label="Strand (if any)"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4" lg="4"></v-col>
                <v-col cols="12" md="4" lg="4"></v-col>
                <v-col cols="12" md="4" lg="4">
                  <v-text-field type="date" label="Date" v-model="Enroll.datenow"></v-text-field>
                </v-col>
              </v-row>
              <!-- <senior-high v-bind:track="tracks" v-bind:strand="strands"></senior-high> -->
              <v-btn class="submit" @click="enrollment">Submit</v-btn>
            </v-container>
          </v-form>
        </v-card>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      HHTP_REQUEST_URL: "http://127.0.0.1:8000/api/",
      tracks: ["Track 1", "Track 2", "Track 3", "Track 4"],
      strands: ["Strand 1", "Strand 2", "Strand 3", "Strand 4"],
      Enroll: {
        certificate: null,
        lrn: null,
        average: null,
        firstname: null,
        middlename: null,
        lastname: null,
        birthday: null,
        age: null,
        male_checkbox: null,
        female_checkbox: null,
        not_ip_checkbox: null,
        ip_checkbox: null,
        specify: null,
        language: null,
        phoneNumber: null,
        address: null,
        zipcode: null,
        father: null,
        motherMaiden: null,
        guardian: null,
        guardianContact: null,
        lastGradeLevel: null,
        lastSchoolYear: null,
        schoolId: null,
        schoolName: null,
        schoolAddress: null,
        firstSemester: null,
        secondSemester: null,
        track_selected: null,
        strand_selected: null,
        datenow: null
      }
    };
  },

  mounted:() =>{},
  methods: {
    enrollment() {
    
    }
  }

};
</script>



<style>

.checkbox-label {
  font-weight: 700;
  font-size: 16px;
  line-height: 110%;
  /* or 13px */

  color: #82869a;
}

.enrollment {
  /* height: 269vh; */
  background: linear-gradient(180deg, #48a7ff 0%, #48a7ff 0.01%, #64d8fd 100%);
}

.v-messages__message {
  color: red;
}

.form-container {
  /* position: absolute; */
  margin-right: 20px;
  margin-bottom: 20px;
  /* width: 100%;
  max-width: 800px; */
}

@media (max-width: 767.98px) {
  .form-container {
    margin-left: 10px;
    margin-right: 10px;
  }
}

.v-card__title {
  font-family: Manrope;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
}

.form-head {
  width: 100%;
  padding: 30px;
  /* margin-bottom: 50px; */
  text-align: center;
  font-family: Manrope;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 110%;
  /* or 20px */

  color: #000000;
  text-transform: uppercase;
}

.v-btn.submit {
  width: 200px;
  background: linear-gradient(180deg, #48a7ff 0%, #48a7ff 0.01%, #64d8fd 100%);
}
</style>