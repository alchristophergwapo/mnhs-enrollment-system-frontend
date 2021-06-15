<template>
  <v-row>
    <div class="form-head">
      For Returning Learners (Balik Aral) and Those Who Shall Transfer/ Move In
    </div>
    <v-col
      cols="12"
      sm="4"
    >
      <v-select
        v-model="balikOrTransferInfo.last_grade_completed"
        :items="gradeLevelOptions"
        :rules="[
          (last_grade_completed) =>
            !!last_grade_completed || 'Last Grade Level Completed is required',
        ]"
        label="Last Grade Level Completed"
        type="number"
        outlined
        required
        @change="balikAral(($event = balikOrTransferInfo.last_grade_completed))"
      >
        <v-icon
          slot="prepend-inner"
          color="red"
          x-small
        >
          mdi-asterisk
        </v-icon>
      </v-select>
    </v-col>
    <v-col
      cols="12"
      sm="4"
    >
      <v-text-field
        v-model="balikOrTransferInfo.last_year_completed"
        onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
        min="0"
        :rules="[
          (v) =>
            (!!v && v.trim() != '') || 'Last School Year Completed is required',
          (v) => /^[0-9]+$/.test(v) == true || 'Only numbers are allowed.',
          (v) => v < year,
        ]"
        type="number"
        label="Last School Year Completed"
        outlined
        required
      >
        <v-icon
          slot="prepend-inner"
          color="red"
          x-small
        >
          mdi-asterisk
        </v-icon>
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      sm="4"
    >
      <v-text-field
        v-model="balikOrTransferInfo.last_school_ID"
        onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
        min="0"
        :rules="[
          (last_school_ID) =>
            (!!last_school_ID && last_school_ID.trim() != '') ||
            'School ID is required',
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
        type="number"
        label="School ID"
        :counter="6"
        outlined
        required
      >
        <v-icon
          slot="prepend-inner"
          color="red"
          x-small
        >
          mdi-asterisk
        </v-icon>
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      sm="6"
    >
      <v-text-field
        v-model="balikOrTransferInfo.last_school_attended"
        :rules="[
          (last_school_attended) =>
            (!!last_school_attended && last_school_attended.trim() != '') ||
            'School name is required',
          (last_school_attended) =>
            (last_school_attended && last_school_attended.length >= 8) ||
            'School name must be at least 8 characters.',
          (v) => /^[a-zA-Z\s]+$/.test(v) == true || 'Only letters are allowed.',
        ]"
        label="School Name"
        outlined
        required
      >
        <v-icon
          slot="prepend-inner"
          color="red"
          x-small
        >
          mdi-asterisk
        </v-icon>
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      sm="6"
    >
      <v-text-field
        v-model="balikOrTransferInfo.last_school_address"
        :rules="[
          (last_school_address) =>
            (!!last_school_address && last_school_address.trim() != '') ||
            'School adress is required',
          (last_school_address) =>
            (last_school_address && last_school_address.length >= 4) ||
            'School address must be at least 4 characters.',
          (v) =>
            /^[a-zA-Z0-9\s-,.]+$/.test(v) == true ||
            'Only letters and numbers are allowed excepts -,.',
        ]"
        label="School Address"
        outlined
        required
      >
        <v-icon
          slot="prepend-inner"
          color="red"
          x-small
        >
          mdi-asterisk
        </v-icon>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { EventBus } from "../../bus/bus";
export default {
  props: {
    gLevel: {
      type: Number,
      default: null
    },
    gradeLevelOptions: {
      type: Array,
      default: function(){
        return [];
      },
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
  computed: {
    getData() {
      return JSON.stringify(this.balikOrTransferInfo);
    },
  },
  created() {
    let date = new Date();
    this.year = date.getFullYear();
  },
  methods: {
    balikAral(grade) {
      EventBus.$emit("previousGradeLevel", grade);
    },
  },
};
</script>