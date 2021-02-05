<template>
  <v-row>
    <div class="form-head">Student information</div>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="PSA"
        label="PSA Birth Certificate No."
      ></v-text-field>
    </v-col>

    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="LRN"
        :rules="[
          (LRN) => !!LRN || 'LRN is required',
          (LRN) =>
            String(LRN).length <= 12 ||
            'LRN cannot be greater than 12 characters',
          (LRN) => String(LRN).length == 12 || 'LRN must be 12 characters',
        ]"
        :counter="12"
        label="Learners Reference No. (LRN)"
        type="number"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="average"
        :rules="[
          (v) => !!v || 'Average is required',
          (v) => v <= 100 || 'Maximum average is 100',
        ]"
        type="number"
        label="Average"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="firstname"
        :rules="[(v) => !!v || 'Firstname is required']"
        label="Firstname"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="middlename"
        :rules="[(v) => !!v || 'Middlename is required']"
        label="Middlename"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="lastname"
        :rules="[(v) => !!v || 'Lastname is required']"
        label="Lastname"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="birthdate"
        :rules="[(v) => !!v || 'Birthdate is required']"
        label="Date of Birth"
        type="date"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="age"
        :rules="[(v) => !!v || 'Age is required']"
        label="Age"
        type="number"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
      <v-checkbox
        v-model="gender"
        :rules="[(gender) => !!gender || 'Gender is required']"
        value="Male"
        label="Male"
        type="checkbox"
        :required="!gender ? true : false"
      ></v-checkbox>
      <v-spacer></v-spacer>
    </v-col>
    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
      <v-checkbox
        v-model="gender"
        :rules="[(gender) => !!gender || 'Gender is required']"
        value="Female"
        label="Female"
        type="checkbox"
        required
      ></v-checkbox>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <p>
        Belonging to any Indegenous People (IP) Community/Indegenous Cultural
        Community?
      </p>
    </v-col>
    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
      <v-checkbox
        v-model="IP"
        :rules="[(IP) => !!IP || 'This field is required']"
        value="Yes"
        label="Yes"
        type="checkbox"
      ></v-checkbox>
    </v-col>
    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
      <v-checkbox
        v-model="IP"
        :rules="[(IP) => !!IP || 'This field is required']"
        value="No"
        label="No"
        type="checkbox"
      ></v-checkbox>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="IP_community"
        :rules="[IP === 'No' || 'This field is required']"
        label="If yes, please specify"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="mother_tongue"
        :rules="[
          (mother_tongue) => !!mother_tongue || 'Mother tongue is required',
        ]"
        label="Mother Tongue"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="contact"
        :rules="[(contact) => !!contact || 'Contact is required']"
        type="number"
        label="Contact Number"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="address"
        :rules="[(address) => !!address || 'Address is required']"
        label="Address"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="6">
      <v-text-field
        v-model="zipcode"
        :rules="[(zipcode) => !!zipcode || 'Zipcode is required']"
        label="Zipcode"
        required
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    PSA: "",
    LRN: "",
    average: "",
    firstname: "",
    middlename: "",
    lastname: "",
    birthdate: "",
    age: "",
    gender: "",
    IP: "",
    IP_community: "",
    mother_tongue: "",
    contact: "",
    address: "",
    zipcode: "",
  }),
};
</script>
