<template>
  <v-app>
    <div class="enrollment">
      <v-toolbar dark color="#3bbdda">
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
        <v-card
          color="rgba(255, 255, 255, .9)"
          class="card mx-auto my-12"
          width="100%"
          max-width="800"
        >
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

                <v-divider></v-divider>

                <v-stepper-step :complete="step > 3" step="3">
                  Balik Aral/Transferee
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="4">Senior High</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-form
                    ref="studentInfo1"
                    v-model="studentInfo1Valid"
                    lazy-validation
                  >
                    <v-container>
                      <student-info-form></student-info-form>
                    </v-container>
                  </v-form>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-form
                    ref="studentInfo2"
                    v-model="studentInfo2Valid"
                    lazy-validation
                  >
                    <v-container>
                      <parent-guardian-info></parent-guardian-info>
                    </v-container>
                  </v-form>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <balik-or-transfer></balik-or-transfer>
                  <v-card-actions>
                    <v-btn text @click="step = 2"> Back to previous </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="step = 4"> Continue </v-btn>
                  </v-card-actions>
                </v-stepper-content>

                <v-stepper-content step="4">
                  <senior-high
                    v-bind:track="tracks"
                    v-bind:strand="strands"
                  ></senior-high>
                  <v-card-actions>
                    <v-btn text @click="step = 3"> Back to previous </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="step = 5"> Continue </v-btn>
                  </v-card-actions>
                </v-stepper-content>
                <div class="text-center">
                  <v-btn elevation="2">Previous</v-btn>
                  <v-btn
                    elevation="2"
                    v-for="(n, index) in 4"
                    :key="index"
                    :color="step == n ? 'primary' : ''"
                    @click="nextStep(n)"
                    >{{ n }}</v-btn
                  >
                  <v-btn elevation="2" @click="nextStep(step)">Next</v-btn>
                </div>
                <br />
              </v-stepper-items>
            </v-stepper>
          </v-container>
        </v-card>
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
      studentInfo1Valid: true,
      studentInfo2Valid: true,
      studentInfo3Valid: true,
      studentInfo4Valid: true,
      step: 1,
      tracks: ["Track 1", "Track 2", "Track 3", "Track 4"],
      strands: ["Strand 1", "Strand 2", "Strand 3", "Strand 4"],
    };
  },
  mounted: () => {},
  methods: {
    nextStep(nxtStep) {
      if (this.$refs.studentInfo.validate()) {
        this.step = nxtStep;
      }
    },
  },
};
</script>

<style>
.enrollment {
  /* height: 269vh; */
  background: linear-gradient(180deg, #48a7ff 0%, #48a7ff 0.01%, #64d8fd 100%);
}

.v-messages__message {
  color: red;
}

.form-container {
  margin-right: 20px;
  margin-bottom: 20px;
}

.stepper-container {
  margin-left: 5px;
  margin-right: 5px;
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
@media (max-width: 767.98px) {
  .form-container {
    margin-left: 5px;
    margin-right: 5px;
  }

  .form-container .container {
    padding: 5px;
  }

  .form-container .v-stepper__content {
    padding: 12px 12px 8px 12px;
  }

  .v-card__title span {
    font-size: 12px;
  }

  .col-12 {
    padding-top: 5px;
    padding-bottom: 5px;
  }
}
</style>