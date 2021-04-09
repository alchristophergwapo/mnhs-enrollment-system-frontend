<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-toolbar-title>
        <v-card-title class="text-center justify-center py-6">
          <h1 class="font-weight-bold display-1 basil--text">
            Class schedules
          </h1>
        </v-card-title>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          icon
          dark
          :disabled="loading"
          color="error darken-2"
          @click="close()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
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
              <td>
                <v-text-field
                  :value="row.item.Time"
                  v-model="schedToEdit.Time"
                  @change="editScheduleTime(($event = schedToEdit.Time))"
                  v-if="editSchedule"
                ></v-text-field>
                <span v-else>{{ row.item.Time }}</span>
              </td>
              <td>
                <span v-if="editSchedule">
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="gradelevel"
                    :edit="true"
                    day="Monday"
                    :modelValue="row.item.Monday.subject_name"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete
                  ><br />
                  <strong>{{ schedToEdit.Monday.teacher_name }}</strong>
                </span>
                <span v-else
                  >{{ row.item.Monday.subject_name }} <br />
                  {{ row.item.Monday.teacher_name }}</span
                >
              </td>
              <td>
                <span v-if="editSchedule">
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="gradelevel"
                    :edit="true"
                    day="Tuesday"
                    :modelValue="row.item.Tuesday.subject_name"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete
                  ><br />
                  <strong>{{ schedToEdit.Tuesday.teacher_name }}</strong>
                </span>
                <span v-else
                  >{{ row.item.Tuesday.subject_name }} <br />
                  {{ row.item.Tuesday.teacher_name }}</span
                >
              </td>
              <td>
                <span v-if="editSchedule">
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="gradelevel"
                    :edit="true"
                    day="Wednesday"
                    :modelValue="row.item.Wednesday.subject_name"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete
                  ><br />
                  <strong>{{ schedToEdit.Wednesday.teacher_name }}</strong>
                </span>
                <span v-else
                  >{{ row.item.Wednesday.subject_name }} <br />
                  {{ row.item.Wednesday.teacher_name }}</span
                >
              </td>
              <td>
                <span v-if="editSchedule">
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="gradelevel"
                    :edit="true"
                    day="Thursday"
                    :modelValue="row.item.Thursday.subject_name"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete
                  ><br />
                  <strong>{{ schedToEdit.Thursday.teacher_name }}</strong>
                </span>
                <span v-else
                  >{{ row.item.Thursday.subject_name }} <br />
                  {{ row.item.Thursday.teacher_name }}</span
                >
              </td>
              <td>
                <span v-if="editSchedule">
                  <autocomplete
                    request="allSubjectsInGradeLevel"
                    :gradelevel="gradelevel"
                    :edit="true"
                    day="Friday"
                    :modelValue="row.item.Friday.subject_name"
                    property="subject_name"
                    :rules="[(value) => !!value || 'This field is required.']"
                  >
                  </autocomplete
                  ><br />
                  <strong>{{ schedToEdit.Friday.teacher_name }}</strong>
                </span>
                <span v-else
                  >{{ row.item.Friday.subject_name }} <br />
                  {{ row.item.Friday.teacher_name }}</span
                >
              </td>
              <td>
                <v-icon
                  v-if="!editSchedule"
                  color="primary"
                  @click="editSched(row.item, row.index)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  v-else
                  color="success"
                  @click="saveEditSchedChanges(row.index)"
                  >mdi-check</v-icon
                >
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
                  :gradelevel="gradelevel"
                  :edit="false"
                  day="Monday"
                  property="subject_name"
                  :rules="[(value) => !!value || 'This field is required.']"
                >
                </autocomplete>
              </td>
              <td>
                <autocomplete
                  request="allSubjectsInGradeLevel"
                  :gradelevel="gradelevel"
                  :edit="false"
                  day="Tuesday"
                  property="subject_name"
                  :rules="[(value) => !!value || 'This field is required.']"
                >
                </autocomplete>
              </td>
              <td>
                <autocomplete
                  request="allSubjectsInGradeLevel"
                  :gradelevel="gradelevel"
                  day="Wednesday"
                  property="subject_name"
                  :rules="[(value) => !!value || 'This field is required.']"
                >
                </autocomplete>
              </td>
              <td>
                <autocomplete
                  request="allSubjectsInGradeLevel"
                  :gradelevel="gradelevel"
                  :edit="false"
                  day="Thursday"
                  property="subject_name"
                  :rules="[(value) => !!value || 'This field is required.']"
                >
                </autocomplete>
              </td>
              <td>
                <autocomplete
                  request="allSubjectsInGradeLevel"
                  :gradelevel="gradelevel"
                  :edit="false"
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
  </v-card>
</template>

<script>
import { EventBus } from "../bus/bus";
export default {
  props: {
    gradelevel: {
      type: Number,
      required: true,
    },
    schedules: {
      type: Array,
      required: true,
    },
    section_id: {
      type: Number,
      required: true,
    },
  },
  components: {
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
      scheduleInput: [{}],
      scheduleInputs: {
        Time: null,
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null,
      },
      schedToEdit: null,
      schedulesToAdd: [],
      loading: false,
      isLoading: false,
      schedule: false,
      editSchedule: false,
      scheduleValid: false,
      spanOfClasses: {
        hour: 1,
        minutes: 0,
      },
    };
  },
  created() {
    if (this.schedules.length > 0) {
      var time = this.schedules[this.schedules.length - 1].Time.split("-")[1];
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      let newEndTime = this.addTimes(time, span);
      this.scheduleInputs.Time = time + "-" + newEndTime;
    } else {
      this.scheduleInputs.Time = "08:00-09:00";
    }
    EventBus.$on("allSubjectsInGradeLevel", (data) => {
      console.log(data);
      let startTime =
        this.$moment(new Date()).format("YYYY/MM/DD") +
        " " +
        this.scheduleInputs.Time.split("-")[0];
      let endTime =
        this.$moment(new Date()).format("YYYY/MM/DD") +
        " " +
        this.scheduleInputs.Time.split("-")[1];
      var sched = {
        day: data.day,
        start_time: this.$moment(startTime).format("hh:mm"),
        end_time: this.$moment(endTime).format("hh:mm"),
        subject_name: data.data.subject_name,
        teacher_name: data.data.teacher_name,
        teacher_id: data.data.teacher_id,
        subject_id: data.data.id,
        section_id: this.section_id,
      };
      this.scheduleInputs[data.day] = sched;
    });

    EventBus.$on("editallSubjectsInGradeLevel", (data) => {
      // console.log(this.schedToEdit, data);
      this.schedToEdit[data.day].subject_id = data.data.id;
      this.schedToEdit[data.day].subject_name = data.data.subject_name;
      this.schedToEdit[data.day].teacher_id = data.data.teacher_id;
      this.schedToEdit[data.day].teacher_name = data.data.teacher_name;
      console.log(this.schedToEdit[data.day]);
    });
  },
  methods: {
    addSchedule() {
      if (this.$refs.scheduleForm.validate()) {
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
        console.log(this.schedulesToAdd);
        this.$axios
          .post("addSchedules", this.schedulesToAdd)
          .then((response) => {
            this.schedules.push(this.scheduleInputs);
            this.showResponse("", response.data.success, "success");
            this.this.clearScheduleInputs();
            EventBus.$emit("save");
            this.$refs.scheduleForm.resetValidation();
          });
      }
    },

    showResponse(title, message, icon) {
      this.$swal.fire({
        title: title,
        text: message,
        icon: icon,
      });
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

    editSched(item) {
      this.editSchedule = true;
      this.schedToEdit = item;
      console.log(this.schedToEdit);
    },

    saveEditSchedChanges(index) {
      this.schedules[index] = this.schedToEdit;
      const edited = {
        Monday: this.schedToEdit.Monday,
        Tuesday: this.schedToEdit.Tuesday,
        Wednesday: this.schedToEdit.Wednesday,
        Thursday: this.schedToEdit.Thursday,
        Friday: this.schedToEdit.Friday,
      };
      this.$axios
        .post("editSchedules", edited)
        .then((response) => {
          console.log(response);
          this.editSchedule = false;
          // this.schedToEdit = null;
        })
        .catch((error) => {
          console.log(error.response);
        });
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

    editScheduleTime(time) {
      const start_time =
        this.$moment(new Date()).format("YYYY/MM/DD") +
        " " +
        time.split("-")[0];
      const end_time =
        this.$moment(new Date()).format("YYYY/MM/DD") +
        " " +
        time.split("-")[1];

      for (const key in this.schedToEdit) {
        if (this.schedToEdit.hasOwnProperty.call(this.schedToEdit, key)) {
          if (key != "Time") {
            this.schedToEdit[key].start_time = this.$moment(start_time).format(
              "hh:mm"
            );
            this.schedToEdit[key].end_time = this.$moment(end_time).format(
              "hh:mm"
            );
          }
        }
      }
      console.log(this.schedToEdit);
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
    close() {
      EventBus.$emit("closeSectionScheduleModal");
    },
  },
};
</script>