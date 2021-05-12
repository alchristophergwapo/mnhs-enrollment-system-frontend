<template>
  <v-app>
    <div class="enrollment">
      <v-toolbar dark color="primary" class="toolbar-content">
        <v-avatar
          @click="
            !user
              ? $router.push({ path: '/' })
              : $router.push({ path: '/admin' })
          "
        >
          <v-img :src="require('../assets/images/logo.jpg')"></v-img>
        </v-avatar>
        <v-toolbar-title class="toolbar-title">
          <h4>Mantalongon National High School</h4>
          <span>Mantalongon, Dalaguete Cebu</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text link to="/sign-in" v-if="!user">Login</v-btn>
        <v-btn
          icon
          @click="
            !user
              ? $router.push({ path: '/' })
              : $router.push({ path: '/admin' })
          "
        >
          <v-icon color="red">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="form-container">
        <v-card-title
          ><span style="width: 100%; text-align: center"
            >Please fill out the information below and SUBMIT.</span
          >
        </v-card-title>
        <v-form
          v-on:submit.prevent=""
          ref="basicInfo"
          v-model="basicInfoValid"
          lazy-validation
        >
          <v-container>
            <student-info-form ref="studentInfoData"></student-info-form>
            <parent-guardian-info
              ref="parentGuardianInfoData"
            ></parent-guardian-info>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-container>
                  <v-checkbox
                    class="checkbox-input"
                    v-model="isSeniorHigh"
                    @click="applyForSeniorHigh()"
                    label="Applying for Senior High?"
                    type="checkbox"
                  >
                  </v-checkbox>
                </v-container>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-container>
                  <v-checkbox
                    class="checkbox-input"
                    v-model="isTransfereeOrBalikAral"
                    @click="isNew = false"
                    label="Applying as Transferee or Balik Aral? (If you are a continuing student, please disregard.)"
                  ></v-checkbox>
                </v-container>
              </v-col>
              <!-- <v-form
                ref="balikAralorTransferInfo"
                v-model="transfereeValid"
                lazy-validation
              > -->
              <v-container v-if="isTransfereeOrBalikAral">
                <balik-or-transfer
                  ref="balikAralorTransferInfoData"
                  :gLevel="grade_level"
                  :grade_level_options="options"
                ></balik-or-transfer>
              </v-container>
              <!-- </v-form> -->
              <!-- <v-form
                ref="seniorHigh"
                v-model="seniorHighValid"
                lazy-validation
              > -->
              <v-container v-if="isSeniorHigh">
                <senior-high
                  ref="seniorHighData"
                  v-bind:track="tracks"
                  v-bind:strand="strands"
                ></senior-high>
              </v-container>
              <!-- </v-form> -->
              <v-col cols="12" sm="6" md="6">
                <v-file-input
                  v-model="card_image"
                  label="Card Picture"
                  :rules="[(value) => !!value || 'Required.']"
                  accept="image/*"
                  v-on:keyup="enterKeyTriggered()"
                  outlined
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  v-model="grade_level"
                  :items="
                    isSeniorHigh == true ? grade_levels[1] : grade_levels[0]
                  "
                  @change="selectGradeLevel($event)"
                  @click:clear="clearSelected()"
                  :rules="[(v) => !!v || 'Required']"
                  :readonly="passEnrolled || isNew"
                  label="Select Grade Level"
                  :clearable="clearable"
                  v-on:keyup="enterKeyTriggered()"
                  outlined
                  required
                ></v-select>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                large
                dark
                color="primary"
                @click="submitEnrollment"
                :disabled="submitDisable"
                :loading="submitting"
              >
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
export default {
  components: {
    StudentInfoForm: () =>
      import("@/components/enrollment/StudentInfoForm.vue"),
    ParentGuardianInfo: () =>
      import("@/components/enrollment/ParentGuardianInfo.vue"),
    BalikOrTransfer: () =>
      import("@/components/enrollment/BalikOrTransfer.vue"),
    SeniorHigh: () => import("@/components/enrollment/SeniorHigh.vue"),
  },
  data() {
    return {
      dialog: false,
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
          "TECHNICAL-VOCATIONAL LIVELIHOOD (TLV) TRACK": ["AGRI-FISHERY ARTS"],
        },
      ],
      grade_levels: [
        [7, 8, 9, 10],
        [11, 12],
      ],
      options: [6, 7, 8, 9, 10, 11],
      grade_level: null,
      card_image: null,
      student: null,
      grades: null,
      parentGuardian: null,
      balikOrTransfer: null,
      seniorHigh: null,
      user: null,
      enrollmentDate: Date.now(),
    };
  },
  created: function () {
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
      if (e.keyCode === 13) this.submitEnrollment();
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
    submitEnrollment() {
      const userData = JSON.parse(this.user);
      const isAdmin = userData.user.user_type != "student";
      if (this.$refs.basicInfo.validate()) {
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

        formdata.append("grade_level", this.grade_level);

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
              this.$swal.fire({
                title: "Success",
                html: `${response.data.success} <br/> Once your enrollment will be approved, you can login into your account by using your LRN as your username and Lastname+LRN as password. 
                    <br/> Example (Username: 303000123456 Password: Roxas303000123456)`,
                icon: "success",
              });
              this.submitting = false;
              const userInfo = localStorage.getItem("user");
              if (userInfo) {
                this.$router.push({ path: "/admin" });
              } else {
                this.$router.push({ path: "/" });
              }
            })
            .catch((error) => {
              this.submitting = false;
              if (error.response.data.currentEnrollment) {
                this.$swal.fire({
                  icon: "info",
                  title: "Ooops....",
                  text: error.response.data.error,
                });
              }
              if (error.response.data.passEnrollment)
                (this.passEnrolled = true),
                  (this.grade_level =
                    error.response.data.passEnrollment.enrollment.grade_level +
                    1),
                  this.$swal.fire({
                    icon: "info",
                    title: "Ooops....",
                    text: error.response.data.error,
                  });
              if (error.response.status == 500)
                this.$swal.fire({
                  icon: "info",
                  title: "Ooops....",
                  text: "An error encountered! Please check your input datas.",
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
