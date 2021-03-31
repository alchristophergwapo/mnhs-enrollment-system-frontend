<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn
        icon
        dark
        :disabled="loading"
        color="error darken-1"
        @click="close"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ type }} Section</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          dark
          text
          :loading="loading"
          :disabled="hasAnyErors"
          color="blue darken-1"
          @click="addSection(type)"
          >Save</v-btn
        >
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Section name"
              v-model="Section.section"
              @keydown="clearError"
              name="name"
              :error="hasError('name')"
            ></v-text-field>
            <p v-if="hasError('name')" class="invalid-feedback">
              {{ getError("name") }}
            </p>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Capacity"
              type="number"
              name="capacity"
              @keydown="clearError"
              v-model="Section.capacity"
              :error="hasError('capacity')"
              min="0"
            ></v-text-field>
            <p v-if="hasError('capacity')" class="invalid-feedback">
              {{ getError("capacity") }}
            </p>
          </v-col>
        </v-row>
        <div>
          <!-- <v-select
                item-text="teacher"
                item-value="id"
                v-model="Section.teacher"
              ></v-select> -->
          <label for="teacher">Select Adviser</label>
          <v-autocomplete
            v-model="Section.teacher"
            :items="teachers"
            :loading="isLoading"
            :search-input.sync="search"
            chips
            clearable
            hide-details
            hide-selected
            item-text="name"
            item-value="symbol"
            label="Search for a teacher..."
            solo
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  No
                  <strong>Teacher</strong>
                </v-list-item-title>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attr, on, item, selected }">
              <v-chip
                v-bind="attr"
                :input-value="selected"
                color="blue-grey"
                class="white--text"
                v-on="on"
              >
                <!-- <v-icon left> mdi-bitcoin </v-icon> -->
                <span v-text="item.teacher_name"></span>
              </v-chip>
            </template>
            <template v-slot:item="{ item }" click>
              <v-list-item-avatar
                color="indigo"
                class="headline font-weight-light white--text"
              >
                {{ item.teacher_name.charAt(0) }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.teacher_name"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="schedule = true">add schedules</v-btn>
          </v-card-actions>
        </div>
      </v-container>
    </v-card-text>

    <!-- schedule table -->
    <div v-if="schedule">
      <v-container>
        <v-row>
          <v-col cols="4">
            <div>Span of each schedule of classes</div>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="spanOfClasses.hour"
              label="Hours"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="spanOfClasses.minutes"
              label="Minutes"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        :headers="headers"
        :items="schedules"
        item-key="name"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.Time }}</td>
            <td>{{ row.item.Monday }})</td>
            <td>{{ row.item.Tuesday }}</td>
            <td>{{ row.item.Wednesday }}</td>
            <td>{{ row.item.Thursday }}</td>
            <td>{{ row.item.Friday }}</td>
            <td>
              <v-icon color="primary" @click="openEditSub(row.item, row.index)"
                >mdi-pencil</v-icon
              >
              <v-icon color="error" @click="deleteData(row.index)"
                >mdi-delete</v-icon
              >
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field></v-text-field>
            </td>
            <td>
              <v-text-field></v-text-field>
            </td>
            <td>
              <v-text-field></v-text-field>
            </td>
            <td>
              <v-text-field></v-text-field>
            </td>
            <td>
              <v-text-field></v-text-field>
            </td>
            <td>
              <v-text-field></v-text-field>
            </td>
            <td>
              <v-btn>add</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-container>
        <v-form ref="scheduleForm" v-model="scheduleValid" lazy-validation>
          <add-schedule-form
            :gradelevel="Number(type.split(' ')[2])"
            day="Monday"
            :sched="schedules"
            :spanOfClasses="Number(spanOfClasses)"
          ></add-schedule-form>
          <br />
          <add-schedule-form
            :gradelevel="Number(type.split(' ')[2])"
            day="Tuesday"
            :sched="schedules"
            :spanOfClasses="Number(spanOfClasses)"
          ></add-schedule-form>
          <br />
          <add-schedule-form
            :gradelevel="Number(type.split(' ')[2])"
            day="Wednesday"
            :sched="schedules"
            :spanOfClasses="Number(spanOfClasses)"
          ></add-schedule-form>
          <br />
          <add-schedule-form
            :gradelevel="Number(type.split(' ')[2])"
            day="Thursday"
            :sched="schedules"
            :spanOfClasses="Number(spanOfClasses)"
          ></add-schedule-form>
          <br />
          <add-schedule-form
            :gradelevel="Number(type.split(' ')[2])"
            day="Friday"
            :sched="schedules"
            :spanOfClasses="Number(spanOfClasses)"
          ></add-schedule-form>
          <br />
          <v-btn color="primary" @click="addSchedule()">Add Schedule</v-btn>
        </v-form>
      </v-container>
    </div>
  </v-card>
</template>
<script>
import { EventBus } from "../bus/bus.js";
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    Section: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    AddScheduleForm: () => import("@/layout/AddScheduleForm.vue"),
  },
  data() {
    return {
      headers: [
        { text: "Time", value: "Time", sortable: false },
        { text: "Monday", value: "Monday", sortable: false },
        { text: "Tuesday", value: "Tuesday", sortable: false },
        { text: "Wednesday", value: "Wednesday", sortable: false },
        { text: "Thursday", value: "Thursday", sortable: false },
        { text: "Friday", value: "Friday", sortable: false },
        { text: "Update", sortable: false },
      ],
      // scheduleData: {
      //   Monday: {
      //     start_time: null,
      //     end_time: null,
      //     subject: null,
      //     teacher: null,
      //     subject_id: null,
      //     teacher_id: null,
      //     day: "Monday",
      //   },
      //   Tuesday: {
      //     start_time: null,
      //     end_time: null,
      //     subject: null,
      //     teacher: null,
      //     subject_id: null,
      //     teacher_id: null,
      //     day: "Tuesday",
      //   },
      //   Wednesday: {
      //     start_time: null,
      //     end_time: null,
      //     subject: null,
      //     teacher: null,
      //     subject_id: null,
      //     teacher_id: null,
      //     day: "Wednesday",
      //   },
      //   Thursday: {
      //     start_time: null,
      //     end_time: null,
      //     subject: null,
      //     teacher: null,
      //     subject_id: null,
      //     teacher_id: null,
      //     day: "Thursday",
      //   },
      //   Friday: {
      //     start_time: null,
      //     end_time: null,
      //     subject: null,
      //     teacher: null,
      //     subject_id: null,
      //     teacher_id: null,
      //     day: "Friday",
      //   },
      // },
      schedules: [
        {
          Time: "08:00-09:00",
          Monday: "English (Raquel Kovacek)",
          Tuesday: "Math (Eliane Gutmann)",
          Wednesday: "Physics (Dr. Theodore Gerlach PhD)",
          Thursday: "P.E. (Barrett McGlynn)",
          Friday: "English (Raquel Kovacek)",
        },
      ],

      scheduleInputs: {
        Time: null,
        Monday: {
          subject: null,
          teacher: null,
          subject_id: null,
          teacher_id: null,
        },
        Tuesday: {
          subject: null,
          teacher: null,
          subject_id: null,
          teacher_id: null,
        },
        Wednesday: {
          subject: null,
          teacher: null,
          subject_id: null,
          teacher_id: null,
        },
        Thursday: {
          subject: null,
          teacher: null,
          subject_id: null,
          teacher_id: null,
        },
        Friday: {
          subject: null,
          teacher: null,
          subject_id: null,
          teacher_id: null,
        },
      },

      teachers: [],
      errors: {},
      loading: false,
      isLoading: false,
      schedule: false,
      scheduleValid: false,
      search: "",
      spanOfClasses: {
        hour: 1,
        minutes: 0,
      },
    };
  },
  watch: {
    search(val) {
      console.log(val);

      if (this.teachers.length > 0) return;
      this.isLoading = true;

      this.$store
        .dispatch("allTeacher")
        .then((res) => {
          // console.log(res);
          this.teachers = res;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    if (this.schedules.length > 0) {
      this.scheduleInputs.start_time = this.schedules[
        this.schedules.length - 1
      ].Time.split("-")[1];
      let hour =
        Number(this.scheduleInputs.start_time.split(":")[0]) +
        this.spanOfClasses.hour;
      let min =
        Number(this.scheduleInputs.start_time.split(":")[1]) +
        this.spanOfClasses.minutes;
      console.log(hour, min);
      // this.scheduleInputs.end_time = hour+;
    }
    EventBus.$on("inputTrigger", (data) => {
      console.log(data);
      // this.scheduleData[data.day].start_time = data.schedule.start_time;
      // this.scheduleData[data.day].end_time = data.schedule.end_time;
      // this.scheduleData[data.day].subject = data.schedule.subject;
      // this.scheduleData[data.day].teacher = data.schedule.teacher;
      // this.scheduleData[data.day].subject_id = data.schedule.subject_id;
      // this.scheduleData[data.day].teacher_id = data.schedule.teacher_id;
      // console.log(this.scheduleData);
    });
  },
  methods: {
    //Method For Adding A Section In Junior High School Category
    async addSection(grades) {
      if (this.edit == false) {
        this.loading = true;
        // console.log(grades.split(" ")[2]);
        this.$axios
          .post("addSection", {
            grade: grades.split(" ")[2],
            name: this.Section.section,
            capacity: this.Section.capacity,
            total_students: 0,
            teacher: this.Section.teacher,
          })
          .then((response) => {
            if (response.data.message) {
              this.clear();
              // this.displayAllsection(grades, null);
              EventBus.$emit("displayAllsection", {
                data1: grades,
                data2: null,
              });
              this.showResponse("Success", response.data.message, "success");
              this.loading = false;
              this.close();
            } else {
              let text =
                response.data.teacher +
                " was already assigned to section " +
                response.data.failed +
                ".";
              this.showResponse("Ooops...", text, "info");
              this.loading = false;
            }
          })
          .catch((error) => {
            this.clear();
            this.close();
            this.loading = false;
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              console.log(error);
            }
          });
      } else {
        this.$axios
          .post("updateSection/" + this.Section.id, {
            name: this.Section.section,
            capacity: this.Section.capacity,
            teacher: this.Section.teacher,
          })
          .then((response) => {
            if (response.data.message) {
              this.showResponse("Success", response.data.message, "success");
              EventBus.$emit("displayAllsection", {
                data1: grades,
                data2: null,
              });
              this.clear();
              this.close();
            } else {
              this.$swal
                .fire({
                  title:
                    response.data.teacher +
                    " was assigned to " +
                    response.data.failed +
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
                      .post("updateSection/" + "update", {
                        updateId: this.Section.id,
                        name: this.Section.section,
                        capacity: this.Section.capacity,
                        teacher: this.Section.teacher,
                      })
                      .then((response) => {
                        console.log(response);
                        if (response.data.newTeacher) {
                          this.showResponse(
                            "Updated!",
                            response.data.newTeacher,
                            "success"
                          );
                          this.close();
                          this.clear();
                          EventBus.$emit("displayAllsection", {
                            data1: grades,
                            data2: null,
                          });
                        } else {
                          let text = "Not successfully updated!";
                          this.showResponse("Not Updated!", text, "error");
                          EventBus.$emit("displayAllsection", {
                            data1: grades,
                            data2: null,
                          });
                          this.clear();
                          this.close();
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        this.clear();
                        this.close();
                      });
                  }
                });
            }
          })
          .catch((error) => {
            this.close();
            this.loading = false;
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              console.log(error);
            }
          });
      }
    },

    showResponse(title, message, icon) {
      this.$swal.fire({
        icon: icon,
        title: title,
        text: message,
      });
    },

    addSchedule() {
      if (this.$refs.scheduleForm.validate()) {
        // this.schedules.push(this.scheduleData);

        console.log(this.schedules);
      }
    },

    close(data) {
      EventBus.$emit("closeModal", data);
    },
    clear() {
      this.Section.id = null;
      this.Section.section = null;
      this.Section.capacity = null;
      this.Section.teacher = null;
    },
    //Methods For All Errors In Junior High School
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
    filter(data) {
      console.log(data);
    },
  },
  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
};
</script>