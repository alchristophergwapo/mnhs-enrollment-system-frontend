<template>
  <v-app>
    <div class="enrollment">
      <v-toolbar dark color="primary">
        <v-avatar>
          <v-img :src="require('../assets/images/logo.jpg')"></v-img>
        </v-avatar>
        <v-toolbar-title class="toolbar-title"
          >Welcome to Mantalongon, Dalaguete NHS</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn text link to="/sign-in">Login</v-btn>
      </v-toolbar>
      <div class="form-container">
        <v-card-title
          ><span style="width: 100%; text-align: center"
            >Please fill out the information below and SUBMIT.</span
          >
        </v-card-title>
        <v-container id="stepper-container">
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step :complete="step > 1" step="1">
                Student Information
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="step > 2" step="2">
                Parent/Guardian
              </v-stepper-step>

              <v-divider v-if="isTransfereeOrBalikAral == 'true'"></v-divider>

              <v-stepper-step
                v-if="isTransfereeOrBalikAral == 'true'"
                :complete="step > 3"
                step="3"
              >
                Balik Aral/Transferee
              </v-stepper-step>

              <v-divider v-if="isSeniorHigh == 'true'"></v-divider>

              <v-stepper-step
                v-if="isSeniorHigh == 'true'"
                :step="isTransfereeOrBalikAral == 'true' ? 4 : 3"
                >Senior High</v-stepper-step
              >
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-form
                  ref="studentInfo"
                  v-model="studentInfoValid"
                  lazy-validation
                >
                  <v-container>
                    <student-info-form
                      ref="studentInfoData"
                    ></student-info-form>
                  </v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="12">
                            <div class="font-weight-bold text-center">
                              <h4>Are you applying for Senior High?</h4>
                            </div>
                          </v-col>
                          <v-col sm="6" md="6">
                            <v-checkbox
                              class="checkbox-input"
                              v-model="isSeniorHigh"
                              :rules="[
                                (isSeniorHigh) =>
                                  !!isSeniorHigh || 'Select no if not.',
                              ]"
                              label="Yes"
                              @click="
                                if (isSeniorHigh == 'true') {
                                  numberOfSteps += 1;
                                } else {
                                  numberOfSteps -= 1;
                                }
                              "
                              value="true"
                              type="checkbox"
                            >
                            </v-checkbox>
                          </v-col>
                          <v-col sm="6" md="6">
                            <v-checkbox
                              class="checkbox-input"
                              v-model="isSeniorHigh"
                              :rules="[
                                (isSeniorHigh) =>
                                  !!isSeniorHigh || 'Select no if not.',
                              ]"
                              label="No"
                              @click="
                                if (
                                  numberOfSteps > 2 &&
                                  isTransfereeOrBalikAral != 'true'
                                ) {
                                  numberOfSteps -= 1;
                                }
                              "
                              value="false"
                              type="checkbox"
                            ></v-checkbox
                          ></v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="12">
                            <div class="font-weight-bold text-center">
                              <h4>
                                Are you applying as Transferee or Balik Aral?
                              </h4>
                            </div>
                          </v-col>
                          <v-col sm="6" md="6" class="ch">
                            <v-checkbox
                              class="checkbox-input"
                              v-model="isTransfereeOrBalikAral"
                              :rules="[
                                (isTransfereeOrBalikAral) =>
                                  !!isTransfereeOrBalikAral ||
                                  'Select no if not.',
                              ]"
                              label="Yes"
                              @click="
                                if (isTransfereeOrBalikAral == 'true') {
                                  numberOfSteps += 1;
                                } else {
                                  numberOfSteps -= 1;
                                }
                              "
                              value="true"
                            ></v-checkbox>
                          </v-col>
                          <v-col sm="6" md="6" class="ch">
                            <v-checkbox
                              class="checkbox-input"
                              v-model="isTransfereeOrBalikAral"
                              :rules="[
                                (isTransfereeOrBalikAral) =>
                                  !!isTransfereeOrBalikAral ||
                                  'Select no if not.',
                              ]"
                              label="No"
                              @click="
                                if (
                                  numberOfSteps > 2 &&
                                  isSeniorHigh != 'true'
                                ) {
                                  numberOfSteps -= 1;
                                }
                              "
                              value="false"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-form>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-form
                  ref="parentGuardianInfo"
                  v-model="parentGuardianValid"
                  lazy-validation
                >
                  <v-container>
                    <parent-guardian-info
                      ref="parentGuardianInfoData"
                    ></parent-guardian-info>
                  </v-container>
                </v-form>
              </v-stepper-content>

              <v-stepper-content
                v-if="isTransfereeOrBalikAral == 'true'"
                step="3"
              >
                <v-form
                  ref="balikAralorTransferInfo"
                  v-model="transfereeValid"
                  lazy-validation
                >
                  <v-container>
                    <balik-or-transfer
                      ref="balikAralorTransferInfoData"
                    ></balik-or-transfer>
                  </v-container>
                </v-form>
              </v-stepper-content>

              <v-stepper-content
                v-if="isSeniorHigh == 'true'"
                :step="isTransfereeOrBalikAral == 'true' ? 4 : 3"
              >
                <v-form
                  ref="seniorHigh"
                  v-model="seniorHighValid"
                  lazy-validation
                >
                  <v-container>
                    <senior-high
                      ref="seniorHighData"
                      v-bind:track="tracks"
                      v-bind:strand="strands"
                    ></senior-high>
                  </v-container>
                </v-form>
              </v-stepper-content>

              <!-- Start of Pagination buttons -->
              <div class="text-center">
                <v-btn
                  elevation="2"
                  outlined
                  color="error"
                  @click="
                    if (step != 1) {
                      step -= 1;
                    }
                  "
                  >Previous</v-btn
                >
                <v-btn
                  @click="step = 1"
                  :outlined="step != 1 ? true : false"
                  :color="step == 1 ? 'primary' : ''"
                  >1</v-btn
                >
                <v-btn
                  :outlined="step != 2 ? true : false"
                  :color="step == 2 ? 'primary' : ''"
                  @click="
                    if (step == 1) {
                      validateStudentInfo(step);
                    } else {
                      step = 2;
                    }
                  "
                  :disabled="studentInfoValid == false ? true : false"
                  >2</v-btn
                >
                <v-btn
                  :outlined="step != 3 ? true : false"
                  :color="step == 3 ? 'primary' : ''"
                  :disabled="step == 1 && step != 3 ? true : false"
                  v-if="isTransfereeOrBalikAral == 'true'"
                  @click="
                    if (step == 2) {
                      validatePGInfo(step);
                    } else {
                      step = 3;
                    }
                  "
                  >3</v-btn
                >
                <v-btn
                  :outlined="step != numberOfSteps ? true : false"
                  :color="step == numberOfSteps ? 'primary' : ''"
                  :disabled="
                    (step == 2 && isTransfereeOrBalikAral == 'true') ||
                    step == 1
                      ? true
                      : false
                  "
                  v-if="isSeniorHigh == 'true'"
                  @click="
                    if (
                      isSeniorHigh == 'true' &&
                      isTransfereeOrBalikAral == 'true'
                    ) {
                      validateBAorTInfo(step);
                    }
                    if (
                      isSeniorHigh == 'true' &&
                      isTransfereeOrBalikAral == 'false'
                    ) {
                      validatePGInfo(step);
                    } else {
                      step = numberOfSteps;
                    }
                  "
                  >{{ numberOfSteps }}</v-btn
                >
                <v-btn
                  v-if="step != numberOfSteps"
                  elevation="2"
                  outlined
                  color="success"
                  @click="
                    if (step == 1) {
                      validateStudentInfo(step);
                    }
                    if (step == 2) {
                      validatePGInfo(step);
                    }
                    if (step == 3 && isTransfereeOrBalikAral == 'true') {
                      validateBAorTInfo(step);
                    }
                  "
                >
                  Next
                </v-btn>
                <v-btn
                  v-if="step == numberOfSteps"
                  color="success"
                  dark
                  @click="reviewEnrollmentData()"
                >
                  Review
                </v-btn>
                <v-dialog
                  v-model="dialog"
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <v-card class="overflow-hidden">
                    <v-app-bar
                      style="position: fixed"
                      dark
                      color="primary"
                      absolute
                      elevate-on-scroll
                      scroll-target="#scrolling-techniques-7"
                    >
                      <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-toolbar-title>Review Enrollment</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn
                          dark
                          text
                          @click="submitEnrollment"
                          :loading="submitting"
                          :disabled="submitting"
                        >
                          Submit
                        </v-btn>
                      </v-toolbar-items>
                    </v-app-bar>
                    <br /><br /><br />
                    <v-sheet id="scrolling-techniques-7" class="overflow-y-auto"
                      ><review-form ref="reviewForm"></review-form>
                      <v-form ref="submitEnrollment" lazy-validation>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-file-input
                                v-model="card_image"
                                label="Card Picture"
                                :rules="[(value) => !!value || 'Required.']"
                                accept="image/*"
                                prepend-icon="mdi-camera"
                              ></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="grade_level"
                                :items="grade_levels"
                                :rules="[(v) => !!v || 'Required']"
                                label="Select Grade Level"
                                required
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </v-sheet>
                  </v-card>
                </v-dialog>
              </div>
              <br />
            </v-stepper-items>
          </v-stepper>
        </v-container>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  components: {
    StudentInfoForm: () =>
      import("@/components/enrollment/StudentInfoForm.vue"),
    ParentGuardianInfo: () =>
      import("@/components/enrollment/ParentGuardianInfo.vue"),
    BalikOrTransfer: () =>
      import("@/components/enrollment/BalikOrTransfer.vue"),
    SeniorHigh: () => import("@/components/enrollment/SeniorHigh.vue"),
    ReviewForm: () => import("@/components/enrollment/ReviewForm.vue"),
  },
  data() {
    return {
      dialog: false,
      submitting: false,
      studentInfoValid: true,
      parentGuardianValid: true,
      transfereeValid: true,
      seniorHighValid: false,
      isSeniorHigh: null,
      isTransfereeOrBalikAral: null,
      step: 1,
      numberOfSteps: 2,
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

      grade_levels: [7, 8, 9, 10, 11, 12],

      grade_level: null,
      card_image: null,
      student: null,
      parentGuardian: null,
      balikOrTransfer: null,
      seniorHigh: null,
      enrollmentDate: Date.now(),
    };
  },
  computed: {
    buttonDisable() {
      return this.step + 1;
    },
  },
  mounted: () => {},
  methods: {
    validateStudentInfo(step) {
      if (this.$refs.studentInfo.validate()) {
        if (this.isSeniorHigh != null && this.isTransfereeOrBalikAral != null) {
          this.step = step + 1;
          this.student = JSON.parse(this.$refs.studentInfoData.getData);
          console.log(this.numberOfSteps);
        }
      }
    },
    validatePGInfo(step) {
      var pgValid = false;
      if (this.$refs.parentGuardianInfo.validate()) {
        if (
          this.isTransfereeOrBalikAral == "true" ||
          this.isSeniorHigh == "true"
        ) {
          this.step = step + 1;
        } else {
          this.step = this.numberOfSteps;
          pgValid = true;
        }
        this.parentGuardian = this.$refs.parentGuardianInfoData.getData;
        return pgValid;
      }
    },

    validateBAorTInfo(step) {
      var baOrTvalid = false;
      if (this.$refs.balikAralorTransferInfo.validate()) {
        if (this.isSeniorHigh == "true") {
          this.step = step + 1;
        } else {
          this.step = step;
          baOrTvalid = true;
        }
        this.balikOrTransfer = this.$refs.balikAralorTransferInfoData.getData;
        return baOrTvalid;
      }
    },

    validateSeniorHigh(step) {
      if (this.$refs.seniorHigh.validate()) {
        this.dialog = true;
        this.step = step;
        this.seniorHigh = this.$refs.seniorHighData.getData;
      }
    },
    reviewEnrollmentData() {
      if (
        this.isTransfereeOrBalikAral == "true" &&
        this.isSeniorHigh == "false"
      ) {
        if (this.validateBAorTInfo(this.step)) {
          this.dialog = true;
        } else {
          this.dialog = false;
        }
      }
      if (this.isSeniorHigh == "true") {
        this.validateSeniorHigh(this.numberOfSteps);
      } else {
        if (this.validatePGInfo(this.numberOfSteps)) {
          this.dialog = true;
          this.balikOrTransfer = null;
          this.seniorHigh = null;
        }
      }

      let data = {
        studentInfo: JSON.stringify(this.student),
        parentGuardianInfo: this.parentGuardian,
        balikOrTransferInfo: this.balikOrTransfer,
        seniorHighInfo: this.seniorHigh,
      };
      this.$store.dispatch("reviewEnrollment", data);
    },

    submitEnrollment() {
      if (this.$refs.submitEnrollment.validate()) {
        this.submitting = true;
        let formdata = new FormData();
        let parent = JSON.parse(this.parentGuardian);
        // console.log(parent);
        for (const key in parent) {
          if (parent[key]) {
            const element = parent[key];
            this.student[key] = element;
          }
        }

        if (this.isTransfereeOrBalikAral == "true") {
          let balikOrTransfer = JSON.parse(this.balikOrTransfer);
          for (const key in balikOrTransfer) {
            if (balikOrTransfer[key]) {
              const element = balikOrTransfer[key];
              this.student[key] = element;
            }
          }

          formdata.append("isBalikOrTransfer", true);
        }

        if (this.isSeniorHigh == "true") {
          let seniorHigh = JSON.parse(this.seniorHigh);
          for (const key in seniorHigh) {
            if (seniorHigh[key]) {
              const element = seniorHigh[key];
              this.student[key] = element;
            }
          }

          formdata.append("isSeniorHigh", true);
        }

        for (const key in this.student) {
          if (this.student[key]) {
            const element = this.student[key];
            formdata.append(key, element);
          }
        }

        formdata.append("grade_level", this.grade_level);
        formdata.append("enrollment_status", "Pending");
        formdata.append(
          "card_image",
          this.card_image,
          Date.now() + "_" + this.card_image.name
        );

        for (let [key, value] of formdata.entries()) {
          console.log(key, value);
        }
        this.$axios
          .post(`addStudent`, formdata)
          .then((response) => {
            console.log(response);
            this.submitting = false;
            this.$notification.show(
              "Hello World",
              {
                body: "This is an example",
              },
              {}
            );
            const userInfo = localStorage.getItem("user");
            if (userInfo) {
              this.$router.push({ path: "/admin" });
            } else {
              this.$router.push({ path: "/" });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>
