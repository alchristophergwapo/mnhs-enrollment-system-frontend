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
        ]"
        label="Contact Number"
        type="number"
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
        father: "",
        mother: "Ma. Vilma De Guzman",
        guardian: "Corazon Alonzo",
        parent_number: "09101981042",
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