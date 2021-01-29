<template>
  <v-row>
    <div class="form-head">For Senior High Learners</div>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <p class="checkbox-label" style="padding-top: 28px">Semester</p>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-checkbox label="First Semester" type="checkbox"></v-checkbox>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-checkbox label="Second Semester" type="checkbox"></v-checkbox>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-select
        v-model="track_selected"
        :items="tracks"
        label="Track"
        required
      ></v-select>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-select
        v-model="strand_selected"
        :items="strands"
        label="Strand (if any)"
        required
      ></v-select>
    </v-col>
    <v-col cols="12" md="4" lg="4"></v-col>
    <v-col cols="12" md="4" lg="4"></v-col>
    <v-col cols="12" md="4" lg="4">
      <v-text-field type="date" label="Date"></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SeniorHigh",
  props: ["track", "strand"],
  data() {
    return {
      track_selected: null,
      tracks: this.track,
      strand_selected: null,
      strands: this.strand,
    }
  },

  mounted(){
  },
  computed: {},
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