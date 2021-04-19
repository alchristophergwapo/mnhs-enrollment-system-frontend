<template>
  <v-row>
    <div class="form-head">Student information</div>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="studentInfo.PSA"
        name="PSA"
        label="PSA Birth Certificate No."
        outlined
      ></v-text-field>
    </v-col>

    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="studentInfo.LRN"
        name="LRN"
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
        outlined
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="studentInfo.average"
        name="average"
        :rules="[
          (v) => !!v || 'Average is required',
          (v) => v <= 100 || 'Maximum average is 100',
        ]"
        type="number"
        label="Average"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="studentInfo.firstname"
        name="firstname"
        :rules="[(v) => !!v || 'Firstname is required']"
        label="Firstname"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="studentInfo.middlename"
        name="middlename"
        label="Middlename"
        outlined
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="studentInfo.lastname"
        name="lastname"
        :rules="[(v) => !!v || 'Lastname is required']"
        label="Lastname"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="studentInfo.birthdate"
        name="birthdate"
        :rules="[(v) => !!v || 'Birthdate is required']"
        label="Date of Birth"
        type="date"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-model="studentInfo.age"
        name="age"
        :rules="[(v) => !!v || 'Age is required']"
        label="Age"
        type="number"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
      <v-checkbox
        v-model="studentInfo.gender"
        name="gender"
        :rules="[(gender) => !!gender || 'Gender is required']"
        value="Male"
        label="Male"
        type="checkbox"
        :required="!studentInfo.gender ? true : false"
      ></v-checkbox>
      <v-spacer></v-spacer>
    </v-col>
    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
      <v-checkbox
        v-model="studentInfo.gender"
        name="gender"
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
        v-model="studentInfo.IP"
        name="IP"
        :rules="[(IP) => !!IP || 'This field is required']"
        value="Yes"
        label="Yes"
        type="checkbox"
      ></v-checkbox>
    </v-col>
    <v-col cols="12" xs="6" sm="2" md="2" lg="2">
      <v-checkbox
        v-model="studentInfo.IP"
        name="IP"
        :rules="[(IP) => !!IP || 'This field is required']"
        value="No"
        label="No"
        type="checkbox"
      ></v-checkbox>
    </v-col>
    <v-col cols="12" xs="6" sm="4" md="4" lg="4">
      <v-text-field
        v-if="studentInfo.IP === 'No'"
        v-model="studentInfo.IP_community"
        name="IP_Community"
        readonly
        label="Community"
        placeholder="If yes, please specify"
        outlined
        required
      ></v-text-field>
      <v-text-field
        v-if="studentInfo.IP === 'Yes'"
        v-model="studentInfo.IP_community"
        name="IP_Community"
        :rules="[(IP_Community) => !!IP_Community || 'This field is required']"
        label="If yes, please specify"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="studentInfo.mother_tongue"
        name="mother_tongue"
        :rules="[
          (mother_tongue) => !!mother_tongue || 'Mother tongue is required',
        ]"
        label="Mother Tongue"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="studentInfo.contact"
        name="contact"
        :rules="[(contact) => !!contact || 'Contact is required']"
        type="number"
        label="Contact Number(for receiving enrollment notification)"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="studentInfo.address"
        name="address"
        :rules="[(address) => !!address || 'Address is required']"
        label="Address"
        outlined
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="6" sm="6" md="6" lg="3">
      <v-text-field
        v-model="studentInfo.zipcode"
        name="zipcode"
        :rules="[(zipcode) => !!zipcode || 'Zipcode is required']"
        label="Zipcode"
        outlined
        required
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    studentInfo: {
      PSA: "",
      LRN: 303000123456,
      average: 80,
      firstname: "Christopher",
      middlename: "De Guzman",
      lastname: "Alonzo",
      birthdate: null,
      age: 23,
      gender: "Male",
      IP: "No",
      IP_community: "",
      mother_tongue: "Bisaya",
      contact: "09458562899",
      address: "Salug, Dalaguete, Cebu",
      zipcode: "6022",
    },
  }),

  computed: {
    getData() {
      // console.log(this.studentInfo);
      return this.studentInfo;
    },
  },
};
</script>