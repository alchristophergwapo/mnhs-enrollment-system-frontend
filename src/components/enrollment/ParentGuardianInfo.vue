<template>
  <v-row>
    <div class="form-head">Parent/guardian information</div>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="parentGuardianInfo.father"
        label="Father's Name"
        :rules="[
          (v) =>
            /^[a-zA-Z\s-.]+$/.test(v) == true ||
            v == '' ||
            'Only letters are  allowed, except for - and .',
        ]"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="parentGuardianInfo.mother"
        label="Mother's Maiden Name"
        :rules="[
          (v) =>
            /^[a-zA-Z\s-\s.]+$/.test(v) == true ||
            v == '' ||
            'Only letters are  allowed, except for -  and .',
        ]"
        outlined
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="parentGuardianInfo.guardian"
        :rules="[
          (v) => (!!v && v.trim() != '') || 'Guardian name is required',
          (v) => v.length >= 4 || 'Guardian must be at least 4 characters.',
          (v) =>
            /^[a-zA-Z\s-.]+$/.test(v) == true ||
            'Only letters are  allowed, except for -  and .',
        ]"
        label="Guardian's Name"
        outlined
        required
      >
        <v-icon slot="prepend-inner" color="red" x-small>mdi-asterisk</v-icon>
      </v-text-field>
    </v-col>
    <v-col cols="12" sm="6" md="6" lg="3">
      <v-text-field
        v-model="parentGuardianInfo.parent_number"
        :rules="[
          (parent_number) =>
            (!!parent_number && parent_number.trim() != '') ||
            'Parent/Guardian contact number is required.',
          (parent_number) =>
            (parentGuardianInfo.parent_number.length > 0 &&
              String(parent_number).charAt(0) === '0' &&
              String(parent_number).charAt(1) === '9') ||
            'Contact number is invalid!',
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
      >
        <v-icon slot="prepend-inner" color="red" x-small>mdi-asterisk</v-icon>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      parentGuardianInfo: {
        father: "",
        mother: "",
        guardian: "",
        parent_number: "",
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