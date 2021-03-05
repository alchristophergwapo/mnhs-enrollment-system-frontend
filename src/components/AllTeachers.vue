
<template>
  <div>
    <bread-crumb :item="items" page_name="All Teachers"></bread-crumb>
    <br />
    <br />
    <div>
      <v-card-title>
        <v-spacer></v-spacer>
        <!-- Adding A Teacher!-->
        <v-card-title>
          <v-spacer></v-spacer>
          <div class="add_btn">
            <v-dialog v-model="statusdialog" persistent max-width="300px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="showTeacher"
                >
                  <v-icon>mdi-plus</v-icon>Add Teacher
                </v-btn>
              </template>
              <v-form>
                <v-card>
                  <v-card-title class="headline">
                    <span>{{ status }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                        @keydown="clearError"
                        label="Teacher's Fullname"
                        type="text"
                        class="form-control"
                        v-model="Teacher"
                        :error="hasError('name')"
                        name="name"
                      ></v-text-field>
                      <p v-if="hasError('name')" class="invalid-feedback">
                        {{ getError("name") }}
                      </p>
                      <v-text-field
                        @keydown="clearError"
                        label="Email"
                        type="email"
                        :error="hasError('email')"
                        v-model="Email"
                        name="email"
                      ></v-text-field>
                      <p v-if="hasError('email')" class="invalid-feedback">
                        {{ getError("email") }}
                      </p>
                      <v-text-field
                        @keydown="clearError"
                        label="Phone Number"
                        type="number"
                        min="0"
                        v-model="Contact"
                        name="contact"
                        :error="hasError('contact')"
                      ></v-text-field>
                      <p v-if="hasError('contact')" class="invalid-feedback">
                        {{ getError("contact") }}
                      </p>
                      <v-select
                        v-model="selected_section"
                        :items="sections"
                        type="text"
                        label="Assigned Section Area"
                        :disabled="disableSection"
                      ></v-select>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error darken-1" @click="dialogs"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      :loading="loading"
                      :disabled="hasAnyErors"
                      @click="addTeacher()"
                      >Save</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </div>
        </v-card-title>
        <!-- Adding A Teacher!-->
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="teachers"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.name }}</td>
            <td>{{ row.item.email }}</td>
            <td>{{ row.item.contact }}</td>
            <td>{{ row.item.section_id }}</td>
            <td>
              <v-icon @click="showsTeacherById(row.item.id)">mdi-pencil</v-icon>
              <v-icon @click="removeTeacher(row.item.id)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
  },

  data() {
    return {
      search: "",
      loading: false,
      statusdialog: false,
      booleanStatus: false,
      status: null,
      Id: null,
      Teacher: null,
      Email: null,
      Contact: null,
      selected_section: null,
      disableSection: false,
      sections: [],
      // Target: { name: null, email: null, contact: null },
      items: [
        {
          text: "Home",
          disabled: false,
          href: "/admin",
        },
        {
          text: "Teachers",
          disabled: true,
          href: "admin/all_teachers",
        },
      ],
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "contact" },
        { text: "Assigned Section", value: "section_id" },
        { text: "Action", value: "action" },
      ],

      teachers: [],
      errors: {},
    };
  },

  created() {
    this.teachers = this.$store.getters.allTeacher;
  },

  mounted: function () {
    // this.display();
  },

  methods: {
    //Methods For Getting All Available Section
    Section() {
      this.$axios
        .get(`sections`)
        .then((response) => {
          this.sections = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //Methods for Deleting A Teacher In Delete Button
    async removeTeacher(dataid) {
      this.$axios
        .get(`delTeacher/` + `${dataid}`)
        .then((response) => {
          if (response.data.message) {
            this.teachers = [];
            this.display();
            alert("Successfully Deleted!");
          } else {
            alert("Not successfully deleted!");
          }
        })
        .catch((error) => {
          if (error.response.status == 422) {
            alert("Invalid data");
          } else {
            alert("something Went Wrong!");
          }
        });
    },
    //Methods for showing  a teacher by id
    showsTeacherById(id) {
      this.status = "Update Teacher";
      this.statusdialog = true;
      this.booleanStatus = true;
      this.$axios
        .get(`showByIdTeacher/` + `${id}`)
        .then((response) => {
          if (response.data.section_id == null) {
            this.Teacher = response.data.name;
            this.Email = response.data.email;
            this.Contact = response.data.contact;
            this.Id = response.data.id;
            this.disableSection = false;
            this.Section();
          } else {
            this.Teacher = response.data.name;
            this.Email = response.data.email;
            this.Contact = response.data.contact;
            this.sections = [];
            this.sections.push(response.data.section_id);
            this.selected_section = this.sections[0];
            this.disableSection = true;
            this.Id = response.data.id;
          }
        })
        .catch((error) => {
          if (error.response.status == 422) {
            alert("Invalid data");
          } else {
            alert("something Went Wrong!");
          }
        });
    },

    //Methods for showing the  Add Teacher
    showTeacher() {
      this.status = "Add Teacher";
      this.statusdialog = true;
      this.booleanStatus = false;
    },

    //Reseting the validation in cancel button
    async dialogs() {
      //This is for Add Teacher Reset Validation
      if (this.booleanStatus == false) {
        (this.Teacher = null),
          (this.Email = null),
          (this.Contact = null),
          (this.selected_section = null);
        for (let key in this.errors) {
          this.$delete(this.errors, key);
          //this.Target[key]=false;
        }
        this.statusdialog = false;
      }
      //This is for Update Teacher Reset Validation
      else {
        (this.Teacher = null),
          (this.Email = null),
          (this.Contact = null),
          (this.selected_section = null);
        for (let key in this.errors) {
          this.$delete(this.errors, key);
          //this.Target[key] = false;
        }
        this.statusdialog = false;
      }
    },

    //Method for Adding A Teacher in save button
    async addTeacher() {
      if (this.booleanStatus == false) {
        this.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 700));
        this.loading = false;
        this.$axios
          .post(`addNewTeacher`, {
            name: this.Teacher,
            email: this.Email,
            contact: this.Contact,
            section_id: this.selected_section,
          })
          .then((response) => {
            if (response.data.message) {
              alert("Successfully added!");
              this.teachers = [];
              this.display();
              this.Teacher = null;
              this.Email = null;
              this.Contact = null;
              this.selected_section = null;
              this.statusdialog = false;
            } else {
              alert("Not successfully added!");
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              alert("something went wrong!");
            }
          });
      } else {
        //For Updating The  Teachers
        this.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 700));
        this.loading = false;
        this.$axios
          .post(`updateTeacher/` + `${this.Id}`, {
            name: this.Teacher,
            email: this.Email,
            contact: this.Contact,
            section_id: this.selected_section,
          })
          .then((response) => {
            if (response.data.message) {
              alert("Successfully updated!");
              this.teachers = [];
              this.display();
              this.Teacher = null;
              this.Email = null;
              this.Contact = null;
              this.selected_section = null;
              this.statusdialog = false;
            } else {
              alert("Not successfully updated!");
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              alert("something went wrong!");
            }
          });
      }
    },

    //Methods For All Errors
    setErrors(error) {
      this.errors = error;
    },

    hasError(fieldname) {
      return fieldname in this.errors;
    },

    clearError(event) {
      this.$delete(this.errors, event.target.name);
      // this.Target[event.target.name] = false;
    },

    getError(fieldName) {
      // for (let key in this.Target) {
      //   if (key == fieldName) {
      //     this.Target[key] = true;
      //   }
      // }
      return this.errors[fieldName][0];
    },
  },

  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
};
</script>


<style>
.headline {
  background-color: rgb(57, 151, 206);
}

.invalid-feedback {
  color: red;
  margin-top: -7%;
  font-size: 14px;
}
</style>