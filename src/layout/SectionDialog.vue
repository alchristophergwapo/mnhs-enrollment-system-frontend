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
          color="white darken-5"
          @click="addSection(type)"
          >Save</v-btn
        >
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text>
      <v-form ref="sectionForm" v-model="sectionValid" lazy-validation>
        <v-container>
          <v-row>
            <v-col cols="12" sm="4">
              <label for="name">Section name</label>
              <v-text-field
                v-model="Section.section"
                :rules="[(value) => !!value || 'This field is required']"
                required
                @keydown="clearError"
                name="name"
                :error="hasError('name')"
              ></v-text-field>
              <p v-if="hasError('name')" class="invalid-feedback">
                {{ getError("name") }}
              </p>
            </v-col>
            <v-col cols="12" sm="4">
              <label for="capacity">Max Capacity</label>
              <v-text-field
                type="number"
                name="capacity"
                @keydown="clearError"
                v-model="Section.capacity"
                :rules="[(value) => !!value || 'This field is required']"
                required
                :error="hasError('capacity')"
                min="0"
              ></v-text-field>
              <p v-if="hasError('capacity')" class="invalid-feedback">
                {{ getError("capacity") }}
              </p>
            </v-col>
            <v-col>
              <autocomplete
                request="allTeacher"
                :gradelevel="Number(type.split(' ')[2])"
                :teacher="Section.teacher_name"
                property="teacher_name"
              >
                <template v-slot:label>
                  <span>Adviser</span>
                </template>
              </autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <div>
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold display-1 basil--text">
          Class schedule (Optional)
        </h1>
      </v-card-title>
      <v-form ref="scheduleForm" v-model="scheduleValid" lazy-validation>
        <!-- schedule table -->
        <div>
          <v-container>
            <v-row>
              <v-col cols="4">
                <div>Span of each schedule of classes</div>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="spanOfClasses.hour"
                  label="Hour(s)"
                  type="number"
                  @change="
                    changeSpanOfClassess(
                      spanOfClasses.hour,
                      spanOfClasses.minutes
                    )
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="spanOfClasses.minutes"
                  label="Minutes"
                  type="number"
                  @change="
                    changeSpanOfClassess(
                      spanOfClasses.hour,
                      spanOfClasses.minutes
                    )
                  "
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-data-table
            :headers="headers"
            :items="schedules"
            item-key="Time"
            hide-default-footer
            class="elevation-1"
          >
            <template v-slot:item="row">
              <tr>
                <td>{{ row.item.Time }}</td>
                <td>
                  {{ row.item.Monday.subject_name }}<br />
                  {{ row.item.Monday.teacher_name }}
                </td>
                <td>
                  {{ row.item.Tuesday.subject_name }}<br />
                  {{ row.item.Tuesday.teacher_name }}
                </td>
                <td>
                  {{ row.item.Wednesday.subject_name }}<br />
                  {{ row.item.Wednesday.teacher_name }}
                </td>
                <td>
                  {{ row.item.Thursday.subject_name }}<br />
                  {{ row.item.Thursday.teacher_name }}
                </td>
                <td>
                  {{ row.item.Friday.subject_name }}<br />
                  {{ row.item.Friday.teacher_name }}
                </td>
                <td>
                  <v-icon
                    color="primary"
                    @click="openEditSub(row.item, row.index)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon color="error" @click="deleteData(row.index)">
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-data-table
            :headers="headers"
            :items="scheduleInput"
            hide-default-header
            hide-default-footer
            class="elevation-1 add_sched"
          >
            <template v-slot:item="row">
              <tr hidden>
                <td>{{ row }}</td>
              </tr>
              <tr>
                <td>
                  <v-text-field
                    v-model="scheduleInputs.Time"
                    name="Time"
                  ></v-text-field>
                </td>
                <td>
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="Number(type.split(' ')[2])"
                    day="Monday"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete>
                </td>
                <td>
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="Number(type.split(' ')[2])"
                    day="Tuesday"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete>
                </td>
                <td>
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="Number(type.split(' ')[2])"
                    day="Wednesday"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete>
                </td>
                <td>
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="Number(type.split(' ')[2])"
                    day="Thursday"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete>
                </td>
                <td>
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="Number(type.split(' ')[2])"
                    day="Friday"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete>
                </td>
                <td>
                  <v-btn @click="addSchedule()">add</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-form>
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
    // AddScheduleForm: () => import("@/layout/AddScheduleForm.vue"),
    Autocomplete: () => import("@/layout/Autocomplete.vue"),
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
      schedules: [],
      scheduleInput: [{}],
      scheduleInputs: {
        Time: null,
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null,
      },

      newSched: {
        day: null,
        start_time: null,
        end_time: null,
        teacher_id: null,
        subject_id: null,
        section_id: this.Section.id,
      },

      schedulesToAdd: [],
      teachers: [],
      errors: {},
      loading: false,
      isLoading: false,
      schedule: false,
      scheduleValid: false,
      sectionValid: false,
      search: "",
      spanOfClasses: {
        hour: 1,
        minutes: 0,
      },
    };
  },
  watch: {},
  created() {
    console.log(this.Section);
    if (this.schedules.length > 0) {
      var time = this.schedules[this.schedules.length - 1].Time.split("-")[1];
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      let newEndTime = this.addTimes(time, span);
      this.scheduleInputs.Time = time + "-" + newEndTime;
    } else {
      this.scheduleInputs.Time = "8:00-9:00";
    }

    EventBus.$on("allSubjectsInGradeLevel", (data) => {
      console.log(data);
      var sched = {
        day: data.day,
        start_time: this.scheduleInputs.Time.split("-")[0],
        end_time: this.scheduleInputs.Time.split("-")[1],
        subject_name: data.data.subject_name,
        teacher_name: data.data.teacher_name,
        teacher_id: data.data.teacher_id,
        subject_id: data.data.id,
        section_id: this.Section.id,
      };
      this.scheduleInputs[data.day] = sched;
    });

    EventBus.$on("allTeacher", (data) => {
      console.log(data);
      this.Section.teacher = data.data.id;
      console.log(this.Section);
    });
  },
  methods: {
    //Method For Adding A Section In Junior High School Category
    async addSection(grades) {
      if (this.$refs.sectionForm.validate()) {
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
              schedules: this.schedulesToAdd,
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
              schedules: this.schedulesToAdd,
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
        this.schedules.push(this.scheduleInputs);
        for (const index in this.scheduleInputs) {
          if (
            this.scheduleInputs.hasOwnProperty.call(this.scheduleInputs, index)
          ) {
            const element = this.scheduleInputs[index];
            if (index != "Time") {
              // console.log(element);
              var filter = this.schedulesToAdd.filter((el) => {
                return (
                  el.day == element.day &&
                  el.start_time == element.start_time &&
                  el.end_time == element.end_time
                );
              });
              if (filter.length == 0) {
                this.schedulesToAdd.push(element);
                // added += 1;
              }
            }
          }
        }
        this.clearScheduleInputs();
        EventBus.$emit("save");
        this.$refs.scheduleForm.resetValidation();
      }
    },

    clearScheduleInputs() {
      var time = this.schedules[this.schedules.length - 1].Time.split("-")[1];
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      let newEndTime = this.addTimes(time, span);
      this.scheduleInputs = {
        Time: time + "-" + newEndTime,
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null,
      };
    },

    changeSpanOfClassess(hour, minutes) {
      console.log(hour, minutes);
      var time = null;
      if (this.schedules.length > 0) {
        time = this.schedules[this.schedules.length - 1].Time.split("-")[1];
      } else {
        time = this.scheduleInputs.Time.split("-")[0];
      }
      var span = hour + ":" + minutes;
      let newEndTime = this.addTimes(time, span);
      this.scheduleInputs.Time = time + "-" + newEndTime;
    },
    addTimes(time, timeSpan) {
      var times = [0, 0];
      var length = times.length;

      var timeArray = (time || "").split(":");
      var timeSpanArray = (timeSpan || "").split(":");

      for (let index = 0; index < length; index++) {
        timeArray[index] = isNaN(parseInt(timeArray[index]))
          ? 0
          : parseInt(timeArray[index]);
        timeSpanArray[index] = isNaN(parseInt(timeSpanArray[index]))
          ? 0
          : parseInt(timeSpanArray[index]);
      }

      for (let index = 0; index < length; index++) {
        times[index] = timeArray[index] + timeSpanArray[index];
      }

      var hours = times[0];
      var minutes = times[1];

      if (minutes >= 60) {
        var hour = (minutes / 60) | 0;
        hours += hour;
        minutes -= 60 * hour;
      }

      return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
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