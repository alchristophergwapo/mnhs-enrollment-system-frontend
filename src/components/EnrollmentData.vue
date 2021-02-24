<template>
  <div>
    <bread-crumb :item="items" page_name="Enrollment"></bread-crumb>
    <br /><br />
    <v-container>
      <v-row align="center" justify="end">
        <v-btn color="primary" rounded link to="/enroll">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <div>
      <v-card-title>
        Sort By&nbsp;&nbsp;
        <v-select
          :items="grade_level"
          menu-props="auto"
          label="Grade Level"
          hide-details
          dense
          outlined
        ></v-select>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-simple-table :seanch="search">
        <thead>
          <tr>
            <th>Grade Level</th>
            <th>Student Name</th>
            <th>Details</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in students" :key="index">
            <td>{{ item.student.grade_level }}</td>
            <td>{{ item.student.firstname }} {{ item.student.lastname }}</td>
            <td>
              <v-dialog transition="dialog-top-transition" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text v-bind="attrs" v-on="on">View Details</v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-card-title>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="dialog.value = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6" sm="6">
                          PSA No.:&nbsp;&nbsp;<strong>{{
                            item.student.PSA
                          }}</strong>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          LRN:&nbsp;&nbsp;<strong>{{
                            item.student.LRN
                          }}</strong>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          Average:&nbsp;&nbsp;<strong>{{
                            item.student.average
                          }}</strong>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          Full Name:&nbsp;&nbsp;<strong
                            >{{ item.student.firstname }}
                            {{ item.student.lastname }}</strong
                          >
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Birth Date:&nbsp;&nbsp;<strong>{{
                            item.student.birthdate
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                          Age:&nbsp;&nbsp;<strong>{{
                            item.student.age
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          Gender:&nbsp;&nbsp;<strong>{{
                            item.student.gender
                          }}</strong>
                        </v-col>
                        <v-col cols="12">
                          Belonging to any Indigenous Peoples (IP)<br />Community
                          /Indigenous Cultural Community ?
                          <strong>&nbsp;&nbsp;{{ item.student.IP }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Mother Tongue:&nbsp;&nbsp;<strong>Bisaya</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Contact Number:&nbsp;&nbsp;<strong>{{
                            item.student.contact
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Adress:&nbsp;&nbsp;<strong>{{
                            item.student.address
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Zip Code:&nbsp;&nbsp;<strong>{{
                            item.student.zipcode
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Father's Name:&nbsp;&nbsp;<strong>{{
                            item.student.father
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Mother's Name:&nbsp;&nbsp;<strong>{{
                            item.student.mother
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Guardian's Name:&nbsp;&nbsp;<strong>{{
                            item.student.guardian
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Contact Number:&nbsp;&nbsp;<strong>{{
                            item.student.parent_number
                          }}</strong>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </template>
              </v-dialog>
            </td>
            <td>
              <v-row align="center" justify="space-around">
                <v-btn color="primary" @click="dialog = true"> approve </v-btn>
                <v-row justify="center">
                  <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                      <v-card-title>
                        <span class="headline">Select Student Section</span>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialog = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <v-select
                          :items="[
                            'Section 1',
                            'Section 2',
                            'Section 3',
                            'Section 4',
                          ]"
                          v-model="section"
                          label="Section*"
                          required
                        ></v-select>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          @click="approveEnrollment(item.id, index)"
                        >
                          Done
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>
                <v-btn color="error" @click="declineEnrollment(item.id, index)">
                  decline
                </v-btn>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <!-- <v-data-table
        :headers="headers"
        :items="students"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.grade_level }}</td>
            <td>{{ row.item.student }}</td>
            <td>
              <v-dialog transition="dialog-top-transition" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text v-bind="attrs" v-on="on">View Details</v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-card-title>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="dialog.value = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6" sm="6">
                          PSA No.:&nbsp;&nbsp;<strong>123-45-678910</strong>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          LRN:&nbsp;&nbsp;<strong>30300123456</strong>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          Average:&nbsp;&nbsp;<strong>95</strong>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          Full Name:&nbsp;&nbsp;<strong>{{
                            row.item.student
                          }}</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Birth Date:&nbsp;&nbsp;<strong
                            >January 1, 1999</strong
                          >
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                          Age:&nbsp;&nbsp;<strong>21</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          Gender:&nbsp;&nbsp;<strong>NA</strong>
                        </v-col>
                        <v-col cols="12">
                          Belonging to any Indigenous Peoples (IP)<br />Community
                          /Indigenous Cultural Community ?
                          <strong>&nbsp;&nbsp;No</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Mother Tongue:&nbsp;&nbsp;<strong>Bisaya</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Contact Number:&nbsp;&nbsp;<strong
                            >639123456789</strong
                          >
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Adress:&nbsp;&nbsp;<strong>Cebu</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Zip Code:&nbsp;&nbsp;<strong>6000</strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Father's Name:&nbsp;&nbsp;<strong></strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Mother's Name:&nbsp;&nbsp;<strong></strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Guardian's Name:&nbsp;&nbsp;<strong></strong>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          Contact Number:&nbsp;&nbsp;<strong
                            >639123456789</strong
                          >
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </template>
              </v-dialog>
            </td>
            <td>
              <v-btn x-small color="success" dark>Approve</v-btn>
              <v-btn x-small color="error" dark>Decline</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table> -->
    </div>
  </div>
</template>
<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
  },
  data: () => ({
    toggle_exclusive: undefined,
    dialog: false,
    section: "",
    search: "",
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Enrollment",
        disabled: true,
        href: "admin/enrollment",
      },
    ],

    headers: [
      {
        text: "Grade Level",
        align: "start",
        sortable: false,
        value: "grade_level",
      },
      { text: "Student Name", value: "student" },
      { text: "Details", value: "details" },
      { text: "Action", value: "action" },
    ],
    students: null,
    grade_level: [7, 8, 9, 10, 11, 12],
  }),

  created() {
    this.$axios.get("pendingEnrollment").then((response) => {
      this.students = response.data.pendingEnrollment;
      console.log(this.students);
    });
  },

  methods: {
    approveEnrollment(id, index) {
      this.$axios
        .post("approveEnrollment/" + id, this.section)
        .then((response) => {
          console.log(response);
          this.students.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    declineEnrollment(id, index) {
      this.$axios
        .post("declineEnrollment/" + id)
        .then((response) => {
          console.log(response);
          this.students.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.view_dtls_btn {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;

  color: #48d3ff;
}
</style>