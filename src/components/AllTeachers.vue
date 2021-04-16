
<template>
  <div>
    <bread-crumb :item="items" page_name="All Teachers"></bread-crumb>
    <br />
    <br />
    <div>
      <v-container>
        <!-- <v-card outlined> -->
        <v-card class="table-header" color="orange">
          <v-card-title class="text-center justify-center">
            <div class="display-2 font-weight-light">All Teachers</div>
          </v-card-title>

          <div class="subtitle-1 font-weight-light text-center justify-center">
            All teachers as of year {{ year }}
          </div>
        </v-card>
        <v-card-title>
          <v-select
            v-model="selectedYear"
            :items="schoolYear"
            @change="filterByYear(($event = selectedYear))"
            menu-props="auto"
            label="School Year"
            hide-details
            dense
            outlined
          ></v-select>
          <v-spacer></v-spacer>
          <!-- Adding A Teacher!-->
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
                  >
                    <v-icon>mdi-plus</v-icon>Add Teacher
                  </v-btn>
                </template>
                <br />
                <v-form>
                  <v-card>
                    <v-card-title class="text-center justify-center headline">
                      <div class="font-weight-light">
                        {{ status }}
                      </div>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-text-field
                          @keydown="clearError"
                          label="Teacher's Fullname"
                          type="text"
                          class="form-control"
                          v-model="Teacher"
                          :error="hasError('teacher_name')"
                          name="teacher_name"
                          outlined
                        ></v-text-field>
                        <p
                          v-if="hasError('teacher_name')"
                          class="invalid-feedback"
                        >
                          {{ getError("name") }}
                        </p>
                        <v-text-field
                          @keydown="clearError"
                          label="Email"
                          type="email"
                          :error="hasError('email')"
                          v-model="Email"
                          name="email"
                          outlined
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
                          outlined
                        ></v-text-field>
                        <p v-if="hasError('contact')" class="invalid-feedback">
                          {{ getError("contact") }}
                        </p>
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
              <td>{{ row.item.teacher_name }}</td>
              <td>
                <v-dialog transition="dialog-top-transition" max-width="400">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text small v-bind="attrs" v-on="on"
                      >View Details</v-btn
                    >
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
                            Name:&nbsp;&nbsp;<br /><strong>{{
                              row.item.teacher_name
                            }}</strong>
                          </v-col>
                          <v-col cols="12">
                            Email:&nbsp;&nbsp;<br /><strong>{{
                              row.item.email
                            }}</strong>
                          </v-col>
                          <v-col cols="12">
                            Contact:&nbsp;&nbsp;<br /><strong>{{
                              row.item.contact
                            }}</strong>
                          </v-col>
                          <v-col cols="12">
                            AssignedSection:&nbsp;&nbsp;<br /><strong>{{
                              row.item.section_id
                                ? row.item.section_id
                                : "No Section"
                            }}</strong>
                          </v-col>
                          <v-col cols="12">
                            School Year:&nbsp;&nbsp;<br /><strong>{{
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
                            }}</strong>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </template>
                </v-dialog>
              </td>
              <td>
                <v-dialog max-width="1000px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      small
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="getTeacherSchedule(row.item.id)"
                      >View Schedules</v-btn
                    >
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-card-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialog.value = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-card-title>
                      <br />
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
                                <span
                                  >Time: <strong>{{ row.item.Monday.start_time }}-{{
                                    row.item.Monday.end_time
                                  }}</strong> </span
                                ><br />
                                <span
                                  >Subject:
                                  <strong>{{ row.item.Monday.subject_name }}</strong> </span
                                ><br />
                                <span>Section: <strong>{{ row.item.Monday.name }}</strong> </span>
                              </div>
                            </td>
                            <td>
                              <div v-if="row.item.Tuesday">
                                <span
                                  >Time: <strong>{{ row.item.Tuesday.start_time }}-{{
                                    row.item.Tuesday.end_time
                                  }}</strong> </span
                                ><br />
                                <span
                                  >Subject:
                                  <strong>{{ row.item.Tuesday.subject_name }}</strong> </span
                                ><br />
                                <span
                                  >Section: <strong>{{ row.item.Tuesday.name }}</strong> </span
                                >
                              </div>
                            </td>
                            <td>
                              <div v-if="row.item.Wednesday">
                                <span
                                  >Time: <strong>{{ row.item.Wednesday.start_time }}-{{
                                    row.item.Wednesday.end_time
                                  }}</strong> </span
                                ><br />
                                <span
                                  >Subject:
                                  <strong>{{ row.item.Wednesday.subject_name }}</strong> </span
                                ><br />
                                <span
                                  >Section: <strong>{{ row.item.Wednesday.name }}</strong> </span
                                >
                              </div>
                            </td>
                            <td>
                              <div v-if="row.item.Thursday">
                                <span
                                  >Time: <strong>{{ row.item.Thursday.start_time }}-{{
                                    row.item.Thursday.end_time
                                  }}</strong> </span
                                ><br />
                                <span>
                                  Subject:
                                  <strong>{{ row.item.Thursday.subject_name }}</strong>  </span
                                ><br />
                                <span
                                  >Section: <strong>{{ row.item.Thursday.name }}</strong> </span
                                >
                              </div>
                            </td>
                            <td>
                              <div v-if="row.item.Friday">
                                <span
                                  >Time: <strong>{{ row.item.Friday.start_time }}-{{
                                    row.item.Friday.end_time
                                  }}</strong> </span
                                ><br />
                                <span
                                  >Subject:
                                  <strong>{{ row.item.Friday.subject_name }}</strong> </span
                                ><br />
                                <span>Section: <strong>{{ row.item.Friday.name }}</strong> </span>
                              </div>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                      <br />
                    </v-card>
                    <v-spacer></v-spacer>
                  </template>
                </v-dialog>
              </td>

              <td>{{ row.item.section_id }}</td>
              <td>
                <v-icon @click="editTeacher(row.item)" color="primary"
                  >mdi-pencil</v-icon
                >
                <v-icon @click="removeTeacher(row.item.id)" color="error"
                  >mdi-delete</v-icon
                >
              </td>
            </tr>
          </template>
        </v-data-table>
        <!-- </v-card> -->
      </v-container>
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
      year: new Date().getFullYear(),
      selectedYear: null,
      schoolYear: ["All"],
      loading: false,
      statusdialog: false,
      booleanStatus: false,
      status: null,
      Id: null,
      Teacher: null,
      Email: null,
      Contact: null,
      selected_section: null,
      sections: [],
      dialog: false,
      tab: null,
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
          // sortable: false,
          value: "name",
        },
        { text: "Details", value: "detatils" },
        { text: "Schedules", value: "schedules" },
        { text: "Assigned Section", value: "section_id" },
        { text: "Action", value: "action" },
      ],
      schedules_headers: [
        { text: "Monday", sortable: false },
        { text: "Tuesday", sortable: false },
        { text: "Wednesday", sortable: false },
        { text: "Thursday", sortable: false },
        { text: "Friday", sortable: false },
      ],

      teachers: [],
      filterTeachers: [],
      errors: {},
      schedules: [],
      spanOfClasses: {
        hour: 1,
        minutes: 0,
      },
      sched: {
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null,
      },
      // monday_sched: [],
      // tuesday_sched: [],
      // wednesday_sched: [],
      // thursday_sched: [],
      // friday_sched: [],
    };
  },
  created() {
    //this.teachers =this.$store.getters.allTeacher;
    // let sections =this.$store.getters.allSections;
    // for (const key in sections) {
    //   if (sections.hasOwnProperty.call(sections, key)) {
    //     const element = sections[key];
    //     this.sections.push({id:element["id"],name:element["name"]});
    //   }
    // }
    this.allNoAdviserSections();
    // this.retrieveSchedule();
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
        this.teachers = this.filterTeachers.filter((val) => {
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
        .then((response) => {
          let sections = response.data.sections;
          for (const key in sections) {
            if (sections.hasOwnProperty.call(sections, key)) {
              const element = sections[key];
              this.sections.push({ id: element["id"], name: element["name"] });
            }
            //console.log(this.sections);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //Method for displaying schedules
    getTeacherSchedule(id) {
      this.schedules = [];
      this.sched = {
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null,
      };
      this.$axios.get(`getTeacherSchedule/${id}`).then((res) => {
        const schedules = res.data.schedules;
        console.log(schedules);
        let count = 0;
        for (let index = 0; index < schedules.length; index++) {
          const element = schedules[index];
          // if (this.schedules[element.day]) {
          // console.log(this.sched[element.day]);
          if (this.sched[element.day] == null)
            (this.sched[element.day] = element), (count += 1);
          // if (this.sched[element.day] != null)
          //   this.schedules.push(this.sched),
          //     (this.sched = {
          //       Monday: null,
          //       Tuesday: null,
          //       Wednesday: null,
          //       Thursday: null,
          //       Friday: null,
          //     });
          if (count == 5 || count == schedules.length)
            this.schedules.push(this.sched),
              (this.sched = {
                Monday: null,
                Tuesday: null,
                Wednesday: null,
                Thursday: null,
                Friday: null,
              });
        }

        // console.log(this.schedules);
      });
    },

    //Methods for displaying all teachers
    display() {
      this.$store
        .dispatch("allTeacher")
        .then(() => {
          this.teachers = this.$store.getters.allTeacher;
          this.filterTeachers = this.$store.getters.allTeacher;
          this.teachers = this.filterTeachers.filter((val) => {
            return (
              val.created_at.substring(0, val.created_at.indexOf("-")) ==
                this.year || val.created_at.includes(this.year)
            );
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //Methods for Deleting A Teacher In Delete Button
    async removeTeacher(dataid) {
      this.$axios
        .get("delTeacher/" + dataid)
        .then((response) => {
          if (response.data.message) {
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Successfully deleted.",
            });
            this.display();
          } else {
            this.$swal.fire({
              icon: "error",
              title: "Error",
              text: "Not Successfully deleted.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    editTeacher(teacher) {
      console.log(teacher);
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
      console.log("section:" + this.selected_section);
      if (this.booleanStatus == false) {
        this.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 700));
        this.loading = false;
        this.$axios
          .post("addNewTeacher", {
            teacher_name: this.Teacher,
            email: this.Email,
            contact: this.Contact,
            section_id: this.selected_section,
          })
          .then((response) => {
            if (response.data.message) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Successfully saved.",
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
                icon: "error",
                title: "Error",
                text:
                  "Section " +
                  response.data.section +
                  " was already assigned to " +
                  response.data.teacher +
                  ".",
              });
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              console.log(error);
            }
          });
      } else {
        //For Updating The  Teachers
        this.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 700));
        this.loading = false;
        this.$axios
          .post("updateTeacher/" + this.Id, {
            teacher_name: this.Teacher,
            email: this.Email,
            contact: this.Contact,
            section_id: this.selected_section,
          })
          .then((response) => {
            if (response.data.message) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: response.data.message,
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
                  confirmButtonText: "Update",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    this.$axios
                      .post("updateTeacher/" + "update", {
                        updateId: this.Id,
                        teacher_name: this.Teacher,
                        email: this.Email,
                        contact: this.Contact,
                        section_id: this.selected_section,
                      })
                      .then((response) => {
                        if (response.data.newSection) {
                          this.$swal.fire({
                            title: "Updated!",
                            text: response.data.newSection,
                            icon: "success",
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
                            icon: "error",
                          });
                          this.statusdialog = false;
                          this.display();
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                });
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              console.log(error);
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
    },

    getError(fieldName) {
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

.headline span {
  text-align: center;
}
.invalid-feedback {
  color: red;
  margin-top: -7%;
  font-size: 14px;
}
</style>