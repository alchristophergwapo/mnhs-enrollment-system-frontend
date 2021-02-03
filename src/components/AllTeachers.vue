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
      <br />
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
            ></v-card-title
          >
          <v-form v-model="valid">
            <v-container>
              <student-info-form></student-info-form>
              <parent-guardian-info></parent-guardian-info>
              <balik-or-transfer></balik-or-transfer>
              <senior-high v-bind:track="tracks" v-bind:strand="strands"></senior-high>
              <v-btn class="submit">Submit</v-btn>
            </v-container>
          </v-form>
        </v-card>
      </div>
    </div>
  </v-app>
</template>

<script>
import StudentInfoForm from "../components/enrollment/StudentInfoForm.vue";
import ParentGuardianInfo from "../components/enrollment/ParentGuardianInfo.vue";
import BalikOrTransfer from "../components/enrollment/BalikOrTransfer.vue";
import SeniorHigh from "../components/enrollment/SeniorHigh.vue";

export default {
  components: {
    StudentInfoForm,
    ParentGuardianInfo,
    BalikOrTransfer,
    SeniorHigh,
  },
  data() {
    return {
      valid: false,
      tracks: ["Track 1", "Track 2", "Track 3", "Track 4"],
      strands: ["Strand 1", "Strand 2", "Strand 3", "Strand 4"],
    };
  },
  mounted: () => {
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