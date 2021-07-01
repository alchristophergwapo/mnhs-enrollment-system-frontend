<template>
  <v-app>
    <v-dialog
      v-model="emailDialog"
      persistent
      max-width="500px"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <br />
        <v-container>
          <center>
            <img
              id="icons"
              :src="require('@/assets/images/enroll.png')"
              alt=""
            />
          </center>
          <h3>MNHS Enrollment System</h3>
          <br />
          <div class="text-center">
            We're gonna need your email for us to send notifications regarding
            your application for admission. For now we only accept gmail
            account. If you don't have an active gmail account, please leave it
            blank. We advise you to have one for you to use not only in this
            matter but for other purposes as well. Thank you.
          </div>
          <v-card-text>
            <v-text-field v-model="email" label="Email" dense outlined/>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn class="white--text" color="danger" @click="emailDialog = false">Cancel</v-btn>
            <v-btn :loading="submitting" color="primary" @click="submitAdmission()">Save</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <div class="enrollment">
      <v-toolbar dark color="primary" class="toolbar-content">
        <v-avatar
          @click="
            !user
              ? $router.push({ path: '/' })
              : $router.push({ path: '/admin' })
          "
        >
          <v-img :src="require('../assets/images/logo.jpg')" />
        </v-avatar>
        <v-toolbar-title class="toolbar-title">
          <h4>Mantalongon National High School</h4>
          <span>Mantalongon, Dalaguete Cebu</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn v-if="!user" text link to="/sign-in">
          Login
        </v-btn>
        <v-btn
          icon
          @click="
            !user
              ? $router.push({ path: '/' })
              : $router.push({ path: '/admin' })
          "
        >
          <v-icon color="red">
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>
      <div class="form-container">
        <v-card-title>
          <span style="width: 100%; text-align: center"
            >Please fill out the information below and SUBMIT. <br />
            Fields with * indicates required fields.</span
          >
        </v-card-title>
        <v-form
          ref="basicInfo"
          v-model="basicInfoValid"
          lazy-validation
          @submit.prevent=""
        >
          <v-container>
            <student-info-form ref="studentInfoData" />
            <parent-guardian-info ref="parentGuardianInfoData" />
            <v-row>
              <v-col cols="12" sm="6">
                <v-container>
                  <v-checkbox
                    v-model="isSeniorHigh"
                    class="checkbox-input"
                    label="Applying for Senior High?"
                    type="checkbox"
                    @click="applyForSeniorHigh()"
                  />
                </v-container>
              </v-col>
              <v-col cols="12" sm="6">
                <v-container>
                  <v-checkbox
                    v-model="isTransfereeOrBalikAral"
                    class="checkbox-input"
                    label="Applying as Transferee or Balik Aral? (If you are a continuing student, please disregard.)"
                    @click="isNew = false"
                  />
                </v-container>
              </v-col>
              <v-container v-if="isTransfereeOrBalikAral">
                <balik-or-transfer
                  ref="balikAralorTransferInfoData"
                  :g-level="grade_level"
                  :grade_level_options="options"
                />
              </v-container>
              <v-container v-if="isSeniorHigh">
                <senior-high
                  ref="seniorHighData"
                  :track="tracks"
                  :strand="strands"
                />
              </v-container>
              <v-col
                cols="12"
                :sm="grade_level === 9 || grade_level === 10 ? '4' : '6'"
              >
                <v-file-input
                  v-model="card_image"
                  label="Card Picture"
                  :rules="[(value) => !!value || 'Required.']"
                  accept="image/*"
                  outlined
                  prepend-icon="mdi-camera"
                  @keyup="enterKeyTriggered()"
                >
                  <v-icon slot="prepend-inner" color="red" x-small>
                    mdi-asterisk
                  </v-icon>
                </v-file-input>
              </v-col>
              <v-col
                cols="12"
                :sm="grade_level === 9 || grade_level === 10 ? '4' : '6'"
              >
                <v-select
                  v-model="grade_level"
                  :items="
                    isSeniorHigh == true ? grade_levels[1] : grade_levels[0]
                  "
                  :rules="[(v) => !!v || 'Required']"
                  :readonly="passEnrolled || isNew"
                  label="Select Grade Level"
                  :clearable="clearable"
                  outlined
                  required
                  @change="selectGradeLevel($event)"
                  @click:clear="clearSelected()"
                  @keyup="enterKeyTriggered()"
                >
                  <v-icon slot="prepend-inner" color="red" x-small>
                    mdi-asterisk
                  </v-icon>
                </v-select>
              </v-col>
              <v-col
                v-if="grade_level === 9 || grade_level === 10"
                cols="12"
                sm="4"
              >
                <v-select
                  v-model="specialization"
                  :items="specializations"
                  :rules="[(v) => !!v || 'Required']"
                  :label="
                    grade_level === 9
                      ? 'Select Specialization'
                      : 'Grade 9 Specialization'
                  "
                  :clearable="clearable"
                  outlined
                  required
                  @click:clear="specialization = null"
                >
                  <v-icon slot="prepend-inner" color="red" x-small>
                    mdi-asterisk
                  </v-icon>
                </v-select>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-spacer />
              <v-btn large dark color="primary" @click="applyNow()">
                Submit
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </div>
    </div>
  </v-app>
</template>

<script>
import { EventBus } from "../bus/bus";
import StudentInfoForm from /* webpackChunkName: "StudentInfoForm" */ "@/components/enrollment/StudentInfoForm.vue";
import ParentGuardianInfo from /* webpackChunkName: "ParentGuardianInfo" */ "@/components/enrollment/ParentGuardianInfo.vue";
import BalikOrTransfer from /* webpackChunkName: "BalikOrTransfer" */ "@/components/enrollment/BalikOrTransfer.vue";
import SeniorHigh from /* webpackChunkName: "SeniorHigh" */ "@/components/enrollment/SeniorHigh.vue";

export default {
  components: {
    StudentInfoForm,
    ParentGuardianInfo,
    BalikOrTransfer,
    SeniorHigh,
  },
  data() {
    return {
      dialog: false,
      emailDialog: false,
      submitting: false,
      basicInfoValid: false,
      parentGuardianValid: false,
      transfereeValid: false,
      seniorHighValid: false,
      isSeniorHigh: false,
      passEnrolled: false,
      isNotSeniorHigh: true,
      isTransfereeOrBalikAral: false,
      isNew: false,
      isNotTransfereeOrBalikAral: true,
      submitDisable: false,
      clearable: true,
      tracks: ["ACADEMIC TRACK", "TECHNICAL-VOCATIONAL LIVELIHOOD (TLV) TRACK"],
      strands: [
        {
          "ACADEMIC TRACK": [
            "ACCOUNTANCY, BUSINESS AND MANAGEMENT (ABM) STRAND",
            "HUMANITIES AND SOCIAL SCIENCES STRAND (HUMSS)",
            "SCIENCE, TECHNOLOGY, ENGINEERING AND MATHEMATICS (STEM) STRAND",
          ],
          "TECHNICAL-VOCATIONAL LIVELIHOOD (TVL) TRACK": ["AGRI-FISHERY ARTS"],
        },
      ],
      specializations: ["Agriculture", "Electricity", "Household", "ICT"],
      grade_levels: [
        [7, 8, 9, 10],
        [11, 12],
      ],
      options: [6, 7, 8, 9, 10, 11],
      email: "",
      grade_level: null,
      card_image: null,
      specialization: null,
      student: null,
      grades: null,
      parentGuardian: null,
      balikOrTransfer: null,
      seniorHigh: null,
      user: null,
      enrollmentDate: Date.now(),
    };
  },
  created: function() {
    this.user = localStorage.getItem("user");
    if (this.isTransfereeOrBalikAral) this.isNew = true;

    EventBus.$on("previousGradeLevel", (prevGradeLevel) => {
      if (prevGradeLevel > 9) this.isSeniorHigh = true;
      else this.isSeniorHigh = false;
      this.grade_level = prevGradeLevel + 1;
      this.isNew = true;
      this.clearable = false;
    });
  },
  methods: {
    applyForSeniorHigh() {
      this.isNotSeniorHigh = !this.isNotSeniorHigh;
      if (this.isSeniorHigh) this.options = [10, 11];
      else this.options = [6, 7, 8, 9, 10, 11];
    },
    enterKeyTriggered(e) {
      e.preventDefault();
      if (e.keyCode === 13) this.submitAdmission();
      else this.options;
    },
    selectGradeLevel(event) {
      if (event == 7 && this.isTransfereeOrBalikAral === false)
        (this.isNew = true),
          (this.options = []),
          ((this.options = [event - 1]), (this.isTransfereeOrBalikAral = true));
      else this.options = [event - 1];
    },
    clearSelected() {
      this.options = [6, 7, 8, 9, 10, 11, 12];
      if (this.isNew)
        (this.isNew = false), (this.isTransfereeOrBalikAral = false);
    },

    applyNow() {
      if (this.$refs.basicInfo.validate()) {
        this.emailDialog = true;
      }
    },

    submitAdmission() {
      const userData = JSON.parse(this.user);
      const isAdmin = userData ? userData.user.user_type != "student" : false;
      if (this.$refs.basicInfo.validate()) {
        this.loading = true;
        let error = false;
        this.student = this.$refs.studentInfoData.getData;
        let formdata = new FormData();
        let parent = JSON.parse(this.$refs.parentGuardianInfoData.getData);
        for (const key in parent) {
          if (parent[key]) {
            const element = parent[key];
            this.student[key] = element;
          }
        }

        if (this.isTransfereeOrBalikAral) {
          let balikOrTransfer = JSON.parse(
            this.$refs.balikAralorTransferInfoData.getData
          );
          for (const key in balikOrTransfer) {
            if (balikOrTransfer[key]) {
              const element = balikOrTransfer[key];
              this.student[key] = element;
            }
          }

          formdata.append("isBalikOrTransfer", true);
        } else formdata.append("isBalikOrTransfer", false);

        if (this.isSeniorHigh) {
          error = false;
          let seniorHigh = JSON.parse(this.$refs.seniorHighData.getData);
          for (const key in seniorHigh) {
            if (seniorHigh[key]) {
              const element = seniorHigh[key];
              this.student[key] = element;
            }
          }

          formdata.append("isSeniorHigh", true);
        } else formdata.append("isSeniorHigh", false);

        for (const key in this.student) {
          if (this.student[key]) {
            const element = this.student[key];
            formdata.append(key, element);
          }
        }

        formdata.append("email", this.email);
        formdata.append("grade_level", this.grade_level);
        if (this.grade_level === 9 || this.grade_level === 10)
          formdata.append("specialization", this.specialization);
        else formdata.append("specialization", null);
        formdata.append("enrollment_status", isAdmin ? "Approved" : "Pending");
        formdata.append(
          "card_image",
          this.card_image,
          Date.now() + "_" + this.card_image.name
        );

        if (error == false) {
          this.submitting = true;
          this.$axios
            .post(`addStudent`, formdata)
            .then((response) => {
              const text = isAdmin
                ? response.data.success
                : `${response.data.success} Once your enrollment will be approved, you can login into your account by using your LRN as your username and Lastname+LRN as password. Example (Username: 303000123456 Password: Roxas303000123456)`;
              this.$swal.fire({
                title: "Success",
                html: text,
                icon: "success",
              });
              this.submitting = false;
              this.emailDialog = false;
              const userInfo = localStorage.getItem("user");
              if (userInfo) {
                this.$router.push({ path: "/admin" });
              } else {
                this.$router.push({ path: "/" });
              }
            })
            .catch((error) => {
              this.submitting = false;
              if (error.response.data.passEnrollment)
                (this.passEnrolled = true),
                  this.$swal.fire({
                    icon: "info",
                    title: "Ooops....",
                    text: error.response.data.error,
                  });
              if (error.response.status == 500)
                this.$swal.fire({
                  icon: "info",
                  title: "Ooops....",
                  text:
                    "An error encountered on the server! Please try again and if error persist, please reload the page.",
                });
            });
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.toolbar-content {
  height: 80px !important;
  padding: 8px;
  position: fixed;
  z-index: 999;
  width: 100%;

  .toolbar-title {
    margin-left: 20px;
    text-align: center;

    h4 {
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
    }

    span {
      font-size: 15px;
      letter-spacing: 0.1rem;
    }
  }

  .form-container {
    padding-top: 64px !important;
  }
}
</style>
