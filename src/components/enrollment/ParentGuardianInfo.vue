<template>
  <v-row>
    <div class="form-head">Parent/guardian information</div>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="father"
        label="Father's Name"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="mother"
        label="Mother's Maiden Name"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="guardian"
        :rules="[(guardian) => !!guardian || 'Guardian is required']"
        label="Guardian's Name"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="parent_number"
        label="Contact Number"
        required
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      father: "",
      mother: "",
      guardian: "",
      parent_number: "",
    };
  },
};
</script>