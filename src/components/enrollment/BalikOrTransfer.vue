<template>
  <v-row>
    <div class="form-head">
      For Returning Learners (Balik Aral) and Those Who Shall Transfer/ Move In
    </div>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="balikOrTransferInfo.last_grade_completed"
        :rules="[
          (last_grade_completed) =>
            !!last_grade_completed || 'Last Grade Level Completed is required',
        ]"
        label="Last Grade Level Completed"
        type="number"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="balikOrTransferInfo.last_year_completed"
        :rules="[
          (last_year_completed) =>
            !!last_year_completed || 'Last School Year Completed is required',
        ]"
        label="Last School Year Completed"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="balikOrTransferInfo.last_school_ID"
        :rules="[
          (last_school_ID) => !!last_school_ID || 'School ID is required',
        ]"
        label="School ID"
        type="number"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="balikOrTransferInfo.last_school_attended"
        :rules="[
          (last_school_attended) =>
            !!last_school_attended || 'School name is required',
        ]"
        label="School Name"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="balikOrTransferInfo.last_school_address"
        :rules="[
          (last_school_address) =>
            !!last_school_address || 'Scholl adress is required',
        ]"
        label="School Address"
        required
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      balikOrTransferInfo: {
        last_grade_completed: "9",
        last_year_completed: "2017-2018",
        last_school_attended: "Mantalongon National High School",
        last_school_ID: "14135346",
        last_school_address: "Mantalongon, Dalaguete, Cebu",
      },
    };
  },

  computed: {
    getData() {
      return JSON.stringify(this.balikOrTransferInfo);
    },
  },
};
</script>