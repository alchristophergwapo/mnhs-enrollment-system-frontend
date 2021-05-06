<template>
  <v-row>
    <div class="form-head">
      For Returning Learners (Balik Aral) and Those Who Shall Transfer/ Move In
    </div>
    <v-col cols="12" xs="6" sm="4" md="4" lg="2">
      <v-select
        v-model="balikOrTransferInfo.last_grade_completed"
        :items="grade_level_options"
        @change="balikAral(($event = balikOrTransferInfo.last_grade_completed))"
        :rules="[
          (last_grade_completed) =>
            !!last_grade_completed || 'Last Grade Level Completed is required',
        ]"
        label="Last Grade Level Completed"
        type="number"
        outlined
        required
      ></v-select>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="2">
      <v-text-field
        v-model="balikOrTransferInfo.last_year_completed"
        :rules="[
          (v) => !!v || 'Last School Year Completed is required',
          (v) => /^[0-9]+$/.test(v) == true || 'Only numbers are allowed.',
          (v) => v < year,
        ]"
        label="Last School Year Completed"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="2">
      <v-text-field
        v-model="balikOrTransferInfo.last_school_ID"
        :rules="[
          (last_school_ID) => !!last_school_ID || 'School ID is required',
          (last_school_ID) =>
            /^[0-9]+$/.test(last_school_ID) == true ||
            'Only Number is  allowed!',
          (last_school_ID) =>
            (last_school_ID && String(last_school_ID).length <= 6) ||
            'School ID cannot be greater than 6 digits',
          (last_school_ID) =>
            (last_school_ID && String(last_school_ID).length == 6) ||
            'School ID must be 6 digits',
        ]"
        label="School ID"
        :counter="6"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="balikOrTransferInfo.last_school_attended"
        :rules="[
          (last_school_attended) =>
            !!last_school_attended || 'School name is required',
          (last_school_attended) =>
            (last_school_attended && last_school_attended.length >= 8) ||
            'School name must be at least 8 characters.',
          (v) => /^[a-zA-z/s]+$/.test(v) == true || 'Only letters are allowed.',
        ]"
        label="School Name"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="balikOrTransferInfo.last_school_address"
        :rules="[
          (last_school_address) =>
            !!last_school_address || 'School adress is required',

          (last_school_address) =>
            (last_school_address && last_school_address.length >= 4) ||
            'School address must be at least 4 characters.',
          (v) =>
            /^[a-zA-z0-9/s-]+$/.test(v) == true ||
            'Only letters and numbers are allowed excepts -.',
        ]"
        label="School Address"
        outlined
        required
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { EventBus } from "../../bus/bus";
export default {
  props: {
    gLevel: {
      type: Number,
    },
    grade_level_options: {
      type: Array,
    },
  },
  data() {
    return {
      balikOrTransferInfo: {
        last_grade_completed: null,
        last_year_completed: null,
        last_school_attended: null,
        last_school_ID: null,
        last_school_address: null,
      },
      year: null,
    };
  },
  created() {
    let date = new Date();
    console.log(date);
    this.year = date.getFullYear();
  },
  methods: {
    balikAral(grade) {
      EventBus.$emit("previousGradeLevel", grade);
    },
  },
  computed: {
    getData() {
      return JSON.stringify(this.balikOrTransferInfo);
    },
  },
};
</script>