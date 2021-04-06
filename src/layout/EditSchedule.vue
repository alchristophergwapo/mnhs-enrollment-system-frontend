<template>
  <div app>
    <v-card>
      <v-card-text>this is edit schedules</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="loading" color="error darken-1">Cancel</v-btn>
        <v-btn :loading="loading" :disabled="hasAnyErors" color="blue darken-1"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "EditScheduleForm",
  props: {
    schedules: {
      type: Object,
      required: true,
    },
    section_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {};
  },
  created() {
    console.log(this.schedules, this.section_id);
  },
  methods: {},
};
</script>