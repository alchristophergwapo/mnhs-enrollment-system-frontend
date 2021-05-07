<template>
  <div app>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-card-title class="text-center justify-center">
          <div class="display-1 font-weight-light">
            Edit Schedule for <strong>{{ schedules.Time }}</strong>
          </div>
        </v-card-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
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
    return {
      loading: false,
      errors: {},
    };
  },
  created() {},
  methods: {},
  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
};
</script>