<template>
  <v-row>
    <div class="form-head">
      For Senior High Learners
    </div>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="2"
    >
      <p
        class="checkbox-label"
        style="padding-top: 28px"
      >
        <v-icon
          slot="start"
          color="red"
          x-small
        >
          mdi-asterisk
        </v-icon>
        Semester
      </p>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="2"
    >
      <v-checkbox
        v-model="senior_high.semester"
        :rules="[(semester) => !!semester || 'Semester is required.']"
        label="First Semester"
        value="First Semester"
        type="checkbox"
        :required="senior_high.semester ? false : true"
      />
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="2"
    >
      <v-checkbox
        v-model="senior_high.semester"
        :rules="[(semester) => !!semester || 'Semester is required.']"
        label="Second Semester"
        value="Second Semester"
        type="checkbox"
        :required="senior_high.semester ? false : true"
      />
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="6"
      md="6"
      lg="3"
    >
      <v-select
        v-model="senior_high.track"
        :rules="[(track) => !!track || 'Track is required.']"
        :items="tracks"
        label="Track"
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
      </v-select>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="6"
      md="6"
      lg="3"
    >
      <v-select
        v-model="senior_high.strand"
        :items="strands[0][senior_high.track]"
        :rules="[(strand) => !!strand || 'Strand is required.']"
        label="Strand"
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
      </v-select>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SeniorHigh",
  props: {
    track: {
      type: Array,
      default: () => {
        return [];
      }
  }, 
  strand: {
    type: Array,
    default: () => {
      return [];
    }
  }
  },
  data() {
    return {
      tracks: this.track,
      strands: this.strand,
      senior_high: {
        semester: "",
        track: "",
        strand: "",
      },
    };
  },

  computed: {
    getData() {
      return JSON.stringify(this.senior_high);
    },
  },
  methods: {},
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
</style>