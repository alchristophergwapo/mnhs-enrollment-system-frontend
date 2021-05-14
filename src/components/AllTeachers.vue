
<template>
  <div>
    <bread-crumb :item="items" page_name="All Teachers"></bread-crumb>
    <br>
    <br>
    <div>
      <v-container>
        <v-card class="table-header" color="orange">
          <v-card-title class="text-center justify-center">
            <div class="display-2 font-weight-light">All Teachers</div>
          </v-card-title>

          <div
            class="subtitle-1 font-weight-light text-center justify-center"
          >All teachers as of year {{ year }}</div>
        </v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            dense
            label="Search"
            class="search-input-field"
            outlined
          ></v-text-field>
          <v-card-title>
            <v-spacer></v-spacer>
            <div class="add_btn">
              <v-dialog v-model="statusdialog" persistent max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    @click="showTeacher"
                    :disabled="notAdmin"
                  >
                    <v-icon>mdi-plus</v-icon>Add Teacher
                  </v-btn>
                </template>
                <br>
                <v-card>
                  <v-card-title class="text-center justify-center headline">
                    <div class="font-weight-light">{{ status }}</div>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="addTeacher" v-model="valid" lazy-validation>
                      <v-container>
                        <v-text-field
                          @keydown="clearError"
                          label="Teacher's Fullname"
                          :rules="[                    
                           value =>
                          (!!value && value.trim() != '') || 'The teacher name field is required!',
                            (value) =>
                              /^[a-zA-Z\s.-Ññ']+$/.test(value) === true ||
                              'Teacher name is invalid.',
                            (value) =>
                              String(value).length >= 2 ||
                              'Teacher name cannot be lesser than 2!',
                          ]"
                          type="text"
                          class="form-control"
                          v-model="Teacher"
                          :error="hasError('teacher_name')"
                          name="teacher_name"
                          outlined
                        >
                          <v-icon slot="prepend-inner" color="red" x-small>mdi-asterisk</v-icon>
                        </v-text-field>
                        <p
                          v-if="hasError('teacher_name')"
                          class="invalid-feedback"
                        >{{ getError("teacher_name") }}</p>
                        <v-text-field
                          @keydown="clearError"
                          label="Email"
                          type="email"
                          :rules="[
                            value=>
                             (!!value && value.trim() != '') || 'The email field is required!',
                            (value) =>
                              /^\w+([\.-]?\w+)*@\w+([a-z\.-]?\w+)*(\.\w[a-z]{1,3})+$/.test(
                                value
                              ) === true || 'Please enter a valid email!',
                            (value) =>
                            String(value).length <=100 ||
                              'The email may not be greater than 100 characters!',
                          ]"
                          :error="hasError('email')"
                          v-model="Email"
                          name="email"
                          outlined
                        >
                          <v-icon slot="prepend-inner" color="red" x-small>mdi-asterisk</v-icon>
                        </v-text-field>
                        <p v-if="hasError('email')" class="invalid-feedback">{{ getError("email") }}</p>
                        <v-text-field
                          @keydown="clearError"
                          label="Phone Number"
                          type="number"
                          min="0"
                          v-model="Contact"
                          onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                          name="contact"
                          :rules="[
                            contact => (!!contact && contact.trim() != '') || 'The contact field is required!',
                            (contact) =>
                              (String(contact).length > 0 &&
                                String(contact).charAt(0) === '0' &&
                                String(contact).charAt(1) === '9') ||
                              'Contact number is invalid!',
                            (contact) =>
                              String(contact).length <= 11 ||
                              'Contact number cannot be greater than 11 digits',
                            (contact) =>
                              String(contact).length == 11 ||
                              'Contact number must be 11 digits',
                          ]"
                          :error="hasError('contact')"
                          outlined
                        >
                          <v-icon slot="prepend-inner" color="red" x-small>mdi-asterisk</v-icon>
                        </v-text-field>
                        <p
                          v-if="hasError('contact')"
                          class="invalid-feedback"
                        >{{ getError("contact") }}</p>
                        <v-select
                          v-model="selected_section"
                          item-text="name"
                          item-value="id"
                          :items="sections"
                          type="text"
                          label="Assigned Section Area"
                          outlined
                          clearable
                        ></v-select>
                      </v-container>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error darken-1" @click="dialogs">Cancel</v-btn>
                    <v-btn
                      color="blue darken-1"
                      :loading="loading"
                      :disabled="!valid==false ? hasAnyErors:true"
                      @click="addTeacher()"
                    >Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-card-title>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="teachers"
          :search="search"
          :items-per-page="10"
          :loading="teachersIsNotLoaded"
          class="elevation-1"
        >
          <template v-slot:item="row">
            <tr>
              <td>{{ row.item.teacher_name }}</td>
              <td>
                <v-dialog transition="dialog-top-transition" max-width="400">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text small v-bind="attrs" v-on="on">View Details</v-btn>
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
                          <v-col cols="12">
                            Name:&nbsp;&nbsp;
                            <br>
                            <strong>
                              {{
                              row.item.teacher_name
                              }}
                            </strong>
                          </v-col>
                          <v-col cols="12">
                            Email:&nbsp;&nbsp;
                            <br>
                            <strong>
                              {{
                              row.item.email
                              }}
                            </strong>
                          </v-col>
                          <v-col cols="12">
                            Contact:&nbsp;&nbsp;
                            <br>
                            <strong>
                              {{
                              row.item.contact
                              }}
                            </strong>
                          </v-col>
                          <v-col cols="12">
                            AssignedSection:&nbsp;&nbsp;
                            <br>
                            <strong>
                              {{
                              row.item.section_id
                              ? row.item.section_id
                              : "No Section"
                              }}
                            </strong>
                          </v-col>
                          <v-col cols="12">
                            School Year:&nbsp;&nbsp;
                            <br>
                            <strong>
                              {{
                              row.item.created_at
                              .substring(0, row.item.created_at.indexOf("-"))
                              .concat(
                              "-",
                              parseInt(
                              row.item.created_at.substring(
                              0,
                              row.item.created_at.indexOf("-")
                              )
                              ) + 1
                              )
                              }}
                            </strong>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </template>
                </v-dialog>
              </td>
              <td>
                <v-btn small text @click="getTeacherSchedule(row.item.id)">View Schedules</v-btn>
              </td>

              <td>{{ row.item.section_id }}</td>
              <td>
                <v-icon
                  @click="editTeacher(row.item)"
                  color="primary"
                  :disabled="notAdmin"
                >mdi-pencil</v-icon>
                <v-icon
                  @click="removeTeacher(row.item.id)"
                  color="error"
                  :disabled="notAdmin"
                >mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>

        <!-- Schedule dialog -->
        <v-dialog max-width="1000px" v-model="teacherSchedDialog">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="teacherSchedDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <br>
            <v-data-table
              :headers="schedules_headers"
              :items="schedules"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:item="row">
                <tr>
                  <td>
                    <div v-if="row.item.Monday">
                      <span>
                        Time:
                        <strong>
                          {{ row.item.Monday.start_time }}-{{
                          row.item.Monday.end_time
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Subject:
                        <strong>
                          {{
                          row.item.Monday.subject_name
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Section:
                        <strong>{{ row.item.Monday.name }}</strong>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div v-if="row.item.Tuesday">
                      <span>
                        Time:
                        <strong>
                          {{ row.item.Tuesday.start_time }}-{{
                          row.item.Tuesday.end_time
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Subject:
                        <strong>
                          {{
                          row.item.Tuesday.subject_name
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Section:
                        <strong>{{ row.item.Tuesday.name }}</strong>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div v-if="row.item.Wednesday">
                      <span>
                        Time:
                        <strong>
                          {{ row.item.Wednesday.start_time }}-{{
                          row.item.Wednesday.end_time
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Subject:
                        <strong>
                          {{
                          row.item.Wednesday.subject_name
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Section:
                        <strong>{{ row.item.Wednesday.name }}</strong>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div v-if="row.item.Thursday">
                      <span>
                        Time:
                        <strong>
                          {{ row.item.Thursday.start_time }}-{{
                          row.item.Thursday.end_time
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Subject:
                        <strong>
                          {{
                          row.item.Thursday.subject_name
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Section:
                        <strong>{{ row.item.Thursday.name }}</strong>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div v-if="row.item.Friday">
                      <span>
                        Time:
                        <strong>
                          {{ row.item.Friday.start_time }}-{{
                          row.item.Friday.end_time
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Subject:
                        <strong>
                          {{
                          row.item.Friday.subject_name
                          }}
                        </strong>
                      </span>
                      <br>
                      <span>
                        Section:
                        <strong>{{ row.item.Friday.name }}</strong>
                      </span>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <br>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue")
  },

  data() {
    return {
      search: "",
      valid: true,
      year: new Date().getFullYear(),
      selectedYear: null,
      schoolYear: ["All"],
      loading: false,
      statusdialog: false,
      booleanStatus: false,
      notAdmin: this.$user.user_type != "admin",
      status: null,
      Id: null,
      Teacher: null,
      Email: null,
      Contact: null,
      selected_section: null,
      sections: [],
      dialog: false,
      teacherSchedDialog: false,
      teachersIsNotLoaded: false,
      tab: null,
      items: [
        {
          text: "Home",
          disabled: false,
          href: "/admin"
        },
        {
          text: "Teachers",
          disabled: true,
          href: "admin/all_teachers"
        }
      ],
      headers: [
        {
          text: "Name",
          value: "teacher_name"
        },
        { text: "Details", value: "detatils" },
        { text: "Schedules", value: "schedules" },
        { text: "Assigned Section", value: "section_id" },
        { text: "Action", value: "action" }
      ],
      schedules_headers: [
        { text: "Monday", sortable: false },
        { text: "Tuesday", sortable: false },
        { text: "Wednesday", sortable: false },
        { text: "Thursday", sortable: false },
        { text: "Friday", sortable: false }
      ],

      teachers: [],
      filterTeachers: [],
      errors: {},
      schedules: [],
      spanOfClasses: {
        hour: 1,
        minutes: 0
      },
      sched: {
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null
      }
    };
  },
  created() {
    this.allNoAdviserSections();
  },
  mounted() {
    this.display();
    for (let i = 2021; i <= this.year; i++) {
      this.schoolYear.push(i);
    }
  },

  methods: {
    //Filtery The Teacher By School Year
    filterByYear(year) {
      if (year == "All") {
        this.teachers = this.filterTeachers;
        this.year = new Date().getFullYear();
      } else {
        this.teachers = this.filterTeachers.filter(val => {
          return (
            val.created_at.substring(0, val.created_at.indexOf("-")) == year ||
            val.created_at.includes(year)
          );
        });
        this.year = year;
      }
    },
    //Methods for displaying All Sections
    allNoAdviserSections() {
      this.$axios
        .get("noAdviserSections")
        .then(response => {
          let sections = response.data.sections;
          for (const key in sections) {
            if (sections.hasOwnProperty.call(sections, key)) {
              const element = sections[key];
              this.sections.push(element);
            }
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "warning",
            title: "Ooops!",
            text: "An error encountered!"
          });
        });
    },
    //Method for displaying schedules
    getTeacherSchedule(id) {
      this.teacherSchedDialog = true;
      this.schedules = [];
      this.sched = {
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null
      };
      this.$axios.get(`getTeacherSchedule/${id}`).then(res => {
        // this.schedules = res.data.schedules;
        const schedulesRes = res.data.schedules;
        let count = 0;
        let next = false;
        for (let index = 0; index < schedulesRes.length; index++) {
          const element = schedulesRes[index];

          count += 1;
          if (this.sched[element.day] == null)
            this.sched[element.day] = element;
          if (this.sched[element.day]) next = true;
          if (
            count == 5 ||
            count == schedulesRes.length ||
            index == schedulesRes.length - 1 ||
            next
          )
            this.schedules.push(this.sched),
              (this.sched = {
                Monday: null,
                Tuesday: null,
                Wednesday: null,
                Thursday: null,
                Friday: null
              }),
              (count = 0);
        }
      });
    },

    //Methods for displaying all teachers
    display() {
      this.teachersIsNotLoaded = true;
      this.$store
        .dispatch("allTeacher")
        .then(res => {
          this.teachers = res.teacher;
          this.filterTeachers = this.teachers;
          this.teachers = this.filterTeachers.filter(val => {
            return (
              val.created_at.substring(0, val.created_at.indexOf("-")) ==
                this.year || val.created_at.includes(this.year)
            );
          });

          this.teachersIsNotLoaded = false;
        })
        .catch(() => {
          this.$swal.fire({
            icon: "warning",
            title: "Ooops!",
            text: "An error encountered!"
          });
        });
    },

    //Methods for Deleting A Teacher In Delete Button
    async removeTeacher(dataid) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm"
        })
        .then(result => {
          if (result.isConfirmed) {
            this.$axios
              .get("delTeacher/" + dataid)
              .then(response => {
                if (response.data.message) {
                  this.$swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Successfully deleted."
                  });
                  this.display();
                } else {
                  this.$swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Not Successfully deleted."
                  });
                }
              })
              .catch(() => {
                this.$swal.fire({
                  icon: "warning",
                  title: "Ooops!",
                  text: "An error encountered!"
                });
              });
          }
        });
    },

    editTeacher(teacher) {
      this.status = "Update Teacher";
      this.statusdialog = true;
      this.booleanStatus = true;
      this.Teacher = teacher.teacher_name;
      this.Email = teacher.email;
      this.Contact = teacher.contact;
      this.Id = teacher.id;
      this.selected_section = teacher.student_id;
    },

    //Methods for showing the  Add Teacher
    showTeacher() {
      this.status = "Add Teacher";
      this.statusdialog = true;
      this.booleanStatus = false;
      this.disableSection = false;
    },

    //Resetting the validation in cancel button
    async dialogs() {
      //This is for Add Teacher Reset Validation
      this.$refs.addTeacher.resetValidation();
      if (this.booleanStatus == false) {
        for (let key in this.errors) {
          this.$delete(this.errors, key);
        }
        (this.Teacher = null),
          (this.Email = null),
          (this.Contact = null),
          (this.selected_section = null),
          (this.Id = null);
        this.statusdialog = false;
      } else {
        for (let key in this.errors) {
          this.$delete(this.errors, key);
        }
        (this.Teacher = null),
          (this.Email = null),
          (this.Contact = null),
          (this.selected_section = null),
          (this.Id = null);
        this.statusdialog = false;
      }
    },

    //Method for Adding A Teacher in save button
    async addTeacher() {
      if (this.$refs.addTeacher.validate()) {
        if (this.booleanStatus == false) {
          this.loading = true;
          this.$axios
            .post("addNewTeacher", {
              teacher_name: this.Teacher,
              email: this.Email,
              contact: this.Contact,
              section_id: this.selected_section
            })
            .then(response => {
              this.loading = false;
              if (response.data.message) {
                this.$swal
                  .fire({
                    icon: "success",
                    title: "Success",
                    text: "Successfully saved."
                  })
                  .then(result => {
                    if (result.isConfirmed) {
                      this.$refs.addTeacher.resetValidation();
                    }
                  });
                (this.statusdialog = false),
                  (this.Teacher = null),
                  (this.Email = null),
                  (this.Contact = null),
                  (this.selected_section = null),
                  (this.Id = null),
                  this.display();
              } else {
                this.$swal
                  .fire({
                    icon: "error",
                    title: "Error",
                    text:
                      "Section " +
                      response.data.section +
                      " was already assigned to " +
                      response.data.teacher +
                      "."
                  })
                  .then(result => {
                    if (result.isConfirmed) {
                      this.$refs.addTeacher.resetValidation();
                    }
                  });
              }
            })
            .catch(error => {
              if (error.response.status == 422) {
                this.setErrors(error.response.data.errors);
              } else {
                this.$swal.fire({
                  icon: "warning",
                  title: "Ooops!",
                  text: "An error encountered!"
                });
              }
              this.loading = false;
            });
        }
      } else {
        //For Updating The  Teachers
        this.loading = true;
        this.$axios
          .post("updateTeacher/" + this.Id, {
            teacher_name: this.Teacher,
            email: this.Email,
            contact: this.Contact,
            section_id: this.selected_section
          })
          .then(response => {
            this.loading = false;
            if (response.data.message) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: response.data.message
              });
              this.display();
              (this.Teacher = null),
                (this.Email = null),
                (this.Contact = null),
                (this.selected_section = null),
                (this.Id = null);
              this.statusdialog = false;
              this.display();
            } else {
              this.$swal
                .fire({
                  title:
                    response.data.section +
                    " section was assigned to " +
                    response.data.teacher +
                    ".",
                  text: "Are you sure to update this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Update"
                })
                .then(result => {
                  if (result.isConfirmed) {
                    this.loading = true;
                    this.$axios
                      .post("updateTeacher/" + "update", {
                        updateId: this.Id,
                        teacher_name: this.Teacher,
                        email: this.Email,
                        contact: this.Contact,
                        section_id: this.selected_section
                      })
                      .then(response => {
                        this.loading = false;
                        if (response.data.newSection) {
                          this.$swal
                            .fire({
                              title: "Updated!",
                              text: response.data.newSection,
                              icon: "success"
                            })
                            .then(result => {
                              if (result.isConfirmed) {
                                this.$refs.addTeacher.resetValidation();
                              }
                            });
                          this.statusdialog = false;
                          (this.Teacher = null),
                            (this.Email = null),
                            (this.Contact = null),
                            (this.selected_section = null),
                            (this.Id = null);
                          this.display();
                        } else {
                          this.$swal.fire({
                            title: "NotUpdated!",
                            text: "Not successfully updated!",
                            icon: "error"
                          });
                          this.statusdialog = false;
                          this.display();
                        }
                      })
                      .catch(() => {
                        this.loading = false;
                        this.$swal.fire({
                          icon: "warning",
                          title: "Ooops!",
                          text: "An error encountered!"
                        });
                      });
                  }
                });
            }
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
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
    },

    getError(fieldName) {
      return this.errors[fieldName][0];
    }
  },

  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    }
  }
};
</script>


<style scoped>
.headline {
  background-color: rgb(57, 151, 206);
}

.headline span {
  text-align: center;
}
.invalid-feedback {
  color: red;
  margin-top: -7%;
  font-size: 14px;
}

.search-input-field {
  margin-top: 29px;
}
</style>