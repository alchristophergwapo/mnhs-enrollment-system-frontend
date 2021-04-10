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
        <v-form ref="basicInfo" v-model="basicInfoValid" lazy-validation>
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
                    @click="isNotSeniorHigh = !isNotSeniorHigh"
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
                    label="Applying as Transferee or Balik Aral?"
                    value="true"
                  ></v-checkbox>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-form
          ref="balikAralorTransferInfo"
          v-model="transfereeValid"
          lazy-validation
          v-if="isTransfereeOrBalikAral"
        >
          <v-container>
            <balik-or-transfer
              ref="balikAralorTransferInfoData"
            ></balik-or-transfer>
          </v-container>
        </v-form>
        <v-form
          v-if="isSeniorHigh"
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
        <div class="text-center">
          <!-- review enrollment -->
          <v-form ref="submitEnrollment" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-file-input
                    v-model="card_image"
                    label="Card Picture"
                    :rules="[(value) => !!value || 'Required.']"
                    accept="image/*"
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
                    :rules="[(v) => !!v || 'Required']"
                    label="Select Grade Level"
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
                  :loading="submitting"
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-container>
          </v-form>
        </div>
        <br />
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
      isNotSeniorHigh: true,
      isTransfereeOrBalikAral: false,
      isNotTransfereeOrBalikAral: true,
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

      grade_level: null,
      card_image: null,
      student: null,
      parentGuardian: null,
      balikOrTransfer: null,
      seniorHigh: null,
      enrollmentDate: Date.now(),
    };
  },
  computed: {},
  mounted: () => {},
  methods: {
    submitEnrollment() {
      if (
        this.$refs.submitEnrollment.validate() &&
        this.$refs.basicInfo.validate()
      ) {
        this.submitting = true;
        this.student = JSON.parse(this.$refs.studentInfoData.getData);
        let formdata = new FormData();
        let parent = JSON.parse(this.$refs.parentGuardianInfoData.getData);
        // let noError = false;
        // console.log(parent);
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
        }

        if (this.isSeniorHigh) {
          let seniorHigh = JSON.parse(this.$refs.seniorHighData.getData);
          if (this.$refs.seniorHigh.validate()) {
            for (const key in seniorHigh) {
              if (seniorHigh[key]) {
                const element = seniorHigh[key];
                this.student[key] = element;
              }
            }

            formdata.append("isSeniorHigh", true);
          }
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
        // if (noError) {
        this.$axios
          .post(`addStudent`, formdata)
          .then((response) => {
            console.log(response);
            this.$swal.fire({
              title: 'Success',
              text: response.data.success,
              icon: 'success'
            })
            this.submitting = false;
            const userInfo = localStorage.getItem("user");
            if (userInfo) {
              this.$router.push({ path: "/admin" });
            } else {
              this.$router.push({ path: "/" });
            }
          })
          .catch((error) => {
            console.log(error.response);
            this.submitting = false;
            if (error.response.data.currentEnrollment) {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.error,
              });
            }
          });
        // }
      }
    },
  },
};
</script>
