<template>
  <v-row>
    <div class="form-head">Parent/guardian information</div>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="parentGuardianInfo.father"
        label="Father's Name"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="parentGuardianInfo.mother"
        label="Mother's Maiden Name"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="parentGuardianInfo.guardian"
        :rules="[(guardian) => !!guardian || 'Guardian name is required']"
        label="Guardian's Name"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6" md="6" lg="3">
      <v-text-field
        v-model="parentGuardianInfo.parent_number"
        :rules="[
          (parent_number) =>
            !!parent_number || 'Parent/Guardian contact number is required.',
          (parent_number) =>
            /^[0-9]+$/.test(parent_number) == true ||
            'Only Number is  allowed!',
          (parent_number) =>
            String(parent_number).length <= 11 ||
            'Parent/Guardian cannot be greater than 11 digits',
          (parent_number) =>
            String(parent_number).length == 11 ||
            'Parent/Guardian contact number must be 11 digits',
        ]"
        label="Parent/Guardian Contact Number"
        :counter="11"
        outlined
        required
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      parentGuardianInfo: {
        father: null,
        mother: null,
        guardian: null,
        parent_number: null,
      },
    };
  },

  computed: {
    getData() {
      return JSON.stringify(this.parentGuardianInfo);
    },
  },
};
</script>