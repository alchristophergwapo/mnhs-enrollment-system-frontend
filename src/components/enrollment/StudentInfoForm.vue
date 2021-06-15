<template>
  <v-row>
    <div class="form-head">
      Student information
    </div>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-model="studentInfo.PSA"
        name="PSA"
        label="PSA Birth Certificate No."
        outlined
      />
    </v-col>

    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-model="studentInfo.LRN"
        name="LRN"
        :rules="[
          (LRN) => !!LRN || 'LRN is required',
          (LRN) => /^[0-9]+$/.test(LRN) == true || 'Only Number is  allowed!',
          (LRN) =>
            String(LRN).length <= 12 ||
            'LRN cannot be greater than 12 characters',
          (LRN) => String(LRN).length == 12 || 'LRN must be 12 characters',
        ]"
        :counter="12"
        label="Learners Reference No. (LRN)"
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
      </v-text-field>
    </v-col>

    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-model="studentInfo.average"
        onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
        min="0"
        name="average"
        :rules="[
          (v) => (!!v && v != '') || 'Average is required',
          (v) => v <= 100 || 'Maximum average is 100',
        ]"
        type="number"
        label="Average"
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
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-model="studentInfo.firstname"
        name="firstname"
        :rules="[
          (v) => (!!v && v.trim() !== '') || 'Firstname is required',
          (v) =>
            (v && v.length >= 2) ||
            'Firstname cannot be lesser than 2 characters.',
          (v) =>
            /^[a-zA-Z\sÑñ]+$/.test(v) === true || 'Only letters are  allowed!',
        ]"
        label="Firstname"
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
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-model="studentInfo.middlename"
        :rules="[
          (v) =>
            /^[a-zA-Z\sÑñ-]+$/.test(v) == true ||
            v == '' ||
            'Only letters are  allowed, except for - !',
        ]"
        name="middlename"
        label="Middlename"
        outlined
      />
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-model="studentInfo.lastname"
        name="lastname"
        :rules="[
          (v) => (!!v && v.trim() != '') || 'Lastname is required',
          (v) =>
            (v && v.length >= 2) ||
            'Lastname cannot be lesser than 2 characters.',
          (v) =>
            /^[a-zA-Z\s-'Ññ]+$/.test(v) == true ||
            'Only letters are  allowed, except for - !',
        ]"
        label="Lastname"
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
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-model="studentInfo.birthdate"
        name="birthdate"
        :rules="[(v) => !!v || 'Birthdate is required']"
        label="Date of Birth"
        prepend-inner-icon="mdi-calendar"
        required
        readonly
        outlined
        @click="modal = !modal"
      >
        <v-icon
          slot="prepend-inner"
          color="red"
          x-small
        >
          mdi-asterisk
        </v-icon>
      </v-text-field>
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="studentInfo.birthdate"
        persistent
        width="290px"
      >
        <v-date-picker
          v-model="studentInfo.birthdate"
          year-icon="mdi-calendar-blank"
          :min="min_date"
          :max="max_date"
          scrollable
        >
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="modal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="
              $refs.dialog.save(studentInfo.birthdate),
              getAge(studentInfo.birthdate)
            "
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-model="studentInfo.age"
        name="age"
        :rules="[
          (v) => !!v || 'Age is required',
          (v) => v >= 10 || 'You are too young to enroll for high school.',
          (v) => v <= 50 || 'Please confirm your age.',
        ]"
        label="Age"
        readonly
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
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="2"
      md="2"
      lg="2"
    >
      <v-checkbox
        v-model="studentInfo.gender"
        name="gender"
        :rules="[(gender) => !!gender || 'Gender is required']"
        value="Male"
        label="Male"
        type="checkbox"
        :required="!studentInfo.gender ? true : false"
      />
      <v-spacer />
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="2"
      md="2"
      lg="2"
    >
      <v-checkbox
        v-model="studentInfo.gender"
        name="gender"
        :rules="[(gender) => !!gender || 'Gender is required']"
        value="Female"
        label="Female"
        type="checkbox"
        required
      />
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <p>
        <v-icon
          slot="prepend"
          color="red"
          x-small
        >
          mdi-asterisk
        </v-icon>
        Belonging to any Indigenous People (IP) Community/Indigenous Cultural
        Community?
      </p>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="2"
      md="2"
      lg="2"
    >
      <v-checkbox
        v-model="studentInfo.IP"
        name="IP"
        :rules="[(IP) => !!IP || 'This field is required']"
        value="Yes"
        label="Yes"
        type="checkbox"
      />
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="2"
      md="2"
      lg="2"
    >
      <v-checkbox
        v-model="studentInfo.IP"
        name="IP"
        :rules="[(IP) => !!IP || 'This field is required']"
        value="No"
        label="No"
        type="checkbox"
      />
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="4"
      md="4"
      lg="4"
    >
      <v-text-field
        v-if="studentInfo.IP === 'Yes'"
        v-model="studentInfo.IP_community"
        name="IP_Community"
        :rules="[
          (IP_Community) =>
            (!!IP_Community && IP_Community.trim() != '') ||
            'This field is required',
        ]"
        label="If yes, please specify"
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
      </v-text-field>
    </v-col>

    <v-col
      cols="12"
      xs="6"
      sm="6"
      md="6"
      lg="3"
    >
      <v-text-field
        v-model="studentInfo.mother_tongue"
        name="mother_tongue"
        :rules="[
          (mother_tongue) =>
            (!!mother_tongue && mother_tongue.trim() != '') ||
            'Mother tongue is required',
          (mother_tongue) =>
            /^[a-zA-Z\s]+$/.test(mother_tongue) == true ||
            'Only letters are allowed.',
        ]"
        label="Mother Tongue"
        placeholder="e.g Cebuano, Tagalog, Waray"
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
      </v-text-field>
    </v-col>

    <v-col
      cols="12"
      xs="6"
      sm="6"
      md="6"
      lg="3"
    >
      <v-text-field
        v-model="studentInfo.contact"
        name="contact"
        :rules="[
          (contact) => !!contact || 'Contact is required',
          (contact) =>
            (studentInfo.contact.length > 0 &&
              String(contact).charAt(0) === '0' &&
              String(contact).charAt(1) === '9') ||
            'Contact number is invalid!',
          (contact) =>
            /^[0-9]+$/.test(contact) == true || 'Only Number is  allowed!',
          (contact) =>
            String(contact).length <= 11 ||
            'Contact number cannot be greater than 11 digits',
          (contact) =>
            String(contact).length == 11 || 'Contact number must be 11 digits',
        ]"
        type="text"
        label="Contact Number"
        :counter="11"
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
      </v-text-field>
    </v-col>

    <v-col
      cols="12"
      xs="6"
      sm="6"
      md="6"
      lg="3"
    >
      <v-text-field
        v-model="studentInfo.address"
        name="address"
        :rules="[
          (address) =>
            (!!address && address.trim() != '') || 'Address is required',
          (address) =>
            (address && address.length >= 4) ||
            'Address must be at least 4 characters.',
          (address) =>
            /^[a-zA-Z0-9\s-.,]+$/.test(address) == true ||
            'Only letters and numbers are allowed excepts - and , .',
        ]"
        label="Address"
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
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      xs="6"
      sm="6"
      md="6"
      lg="3"
    >
      <v-text-field
        v-model="studentInfo.zipcode"
        min="0"
        name="zipcode"
        onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
        :rules="[
          (zipcode) => (!!zipcode && zipcode != '') || 'Zipcode is required',
          (zipcode) =>
            /^[0-9]+$/.test(zipcode) == true || 'Only Number is  allowed!',
          (zipcode) =>
            String(zipcode).length <= 4 ||
            'Zipcode cannot be greater than 4 digits',
          (zipcode) =>
            String(zipcode).length == 4 || 'Zipcode must be 4 digits',
        ]"
        :counter="4"
        label="Zipcode"
        type="number"
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
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    year: new Date().getFullYear(),
    max_date: null,
    min_date: null,
    modal: false,
    studentInfo: {
      PSA: null,
      LRN: null,
      average: null,
      firstname: null,
      middlename: null,
      lastname: null,
      birthdate: null,
      age: null,
      gender: null,
      IP: null,
      IP_community: null,
      mother_tongue: null,
      contact: "",
      address: null,
      zipcode: null,
    },
  }),
  computed: {
    getData() {
      return this.studentInfo;
    },
  },
  created() {
    let todayDate = new Date();
    this.max_date = this.$moment(
      new Date(`${todayDate.getFullYear() - 8}-12-31`)
    ).format("YYYY-MM-DD");
    this.min_date = this.$moment(
      new Date(`${todayDate.getFullYear() - 50}-12-31`)
    ).format("YYYY-MM-DD");
  },
  methods: {
    getAge(bday) {
      var today = new Date();
      var birthDate = new Date(bday);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (bday) {
        this.studentInfo.age = age;
      }
    },
  },
};
</script>