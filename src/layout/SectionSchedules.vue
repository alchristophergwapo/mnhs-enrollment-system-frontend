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
    <br /><br />
    <v-container>
      <v-form ref="scheduleForm" v-model="scheduleValid" lazy-validation>
        <!-- schedule table -->
        <div>
          <v-data-table
            :headers="headers"
            :items="schedules"
            item-key="Time"
            hide-default-footer
            class="elevation-1"
          >
            <template v-slot:item="row">
              <tr class="table-row">
                <td>
                  <span v-if="row.item.Monday">
                    {{ row.item.Monday.subject_name }} <br />
                    <strong>{{ row.item.Monday.teacher_name }}</strong> <br />
                    <p v-if="row.item.Monday.subject_name">
                      {{ row.item.Monday.start_time }} -
                      {{ row.item.Monday.end_time }}
                    </p>
                  </span>
                </td>
                <td>
                  <span v-if="row.item.Tuesday">
                    {{ row.item.Tuesday.subject_name }} <br />
                    <strong>{{ row.item.Tuesday.teacher_name }}</strong> <br />
                    <p v-if="row.item.Tuesday.subject_name">
                      {{ row.item.Tuesday.start_time }} -
                      {{ row.item.Tuesday.end_time }}
                    </p>
                  </span>
                </td>
                <td>
                  <span v-if="row.item.Wednesday">
                    {{ row.item.Wednesday.subject_name }} <br />
                    <strong>{{ row.item.Wednesday.teacher_name }}</strong>
                    <br />
                    <p v-if="row.item.Wednesday.subject_name">
                      {{ row.item.Wednesday.start_time }} -
                      {{ row.item.Wednesday.end_time }}
                    </p>
                  </span>
                </td>
                <td>
                  <span v-if="row.item.Thursday">
                    {{ row.item.Thursday.subject_name }} <br />
                    <strong>{{ row.item.Thursday.teacher_name }}</strong> <br />
                    <p v-if="row.item.Thursday.subject_name">
                      {{ row.item.Thursday.start_time }} -
                      {{ row.item.Thursday.end_time }}
                    </p>
                  </span>
                </td>
                <td>
                  <span v-if="row.item.Friday">
                    {{ row.item.Friday.subject_name }} <br />
                    <strong>{{ row.item.Friday.teacher_name }}</strong> <br />
                    <p v-if="row.item.Friday.subject_name">
                      {{ row.item.Friday.start_time }} -
                      {{ row.item.Friday.end_time }}
                    </p>
                  </span>
                </td>
                <td>
                  <v-icon
                    color="primary"
                    @click="editSched(row.item, row.index)"
                  >
                    mdi-pencil
                  </v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-dialog v-model="scheduleDialog" width="800px">
            <v-card>
              <v-card-title>
                <v-row>
                  <v-icon>mdi-pencil</v-icon>
                  <h3>{{ mode }} SCHEDULE</h3>
                </v-row>
                <v-btn icon @click="closeDialog()">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <hr />
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <div>Span of each schedule of classes</div>
                  </v-col>
                  <v-col cols="3">
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
                      dense
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
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
                      dense
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col sm="3">
                    <label for="startTime">Start Time</label>
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="scheduleInputs.startTime"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="scheduleInputs.startTime"
                          name="startTime"
                          prepend-inner-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                          outlined
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="modal"
                        v-model="scheduleInputs.startTime"
                        :min="minOnMax"
                        @click:hour="inputStartTime($event)"
                        @click:minute="inputStartTime($event)"
                        full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog.save(scheduleInputs.startTime)"
                        >
                          OK
                        </v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-col>

                  <v-col sm="3">
                    <label for="endTime">End Time</label>
                    <v-dialog
                      ref="dialog2"
                      v-model="modal2"
                      :return-value.sync="scheduleInputs.endTime"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="scheduleInputs.endTime"
                          name="endTime"
                          dense
                          outlined
                          prepend-inner-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="modal2"
                        v-model="scheduleInputs.endTime"
                        :min="minTime"
                        full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal2 = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog2.save(scheduleInputs.endTime)"
                        >
                          OK
                        </v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend_icon="
                        scheduleInputs.Monday.subject_id
                          ? 'mdi-check-underline'
                          : 'mdi-help'
                      "
                      request="gradelevelSubject"
                      :gradelevel="gradelevel"
                      :edit="editSchedule ? true : false"
                      day="Monday"
                      property="subject_name"
                    >
                      <template v-slot:label
                        >Monday<strong
                          v-if="scheduleInputs.Monday.subject_name"
                        >
                          ({{ scheduleInputs.Monday.subject_name }})</strong
                        ></template
                      >
                    </autocomplete>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend_icon="
                        scheduleInputs.Tuesday.subject_id
                          ? 'mdi-check-underline'
                          : 'mdi-help'
                      "
                      request="gradelevelSubject"
                      :gradelevel="gradelevel"
                      :edit="editSchedule ? true : false"
                      day="Tuesday"
                      property="subject_name"
                    >
                      <template v-slot:label
                        >Tuesday<strong
                          v-if="scheduleInputs.Tuesday.subject_name"
                        >
                          ({{ scheduleInputs.Tuesday.subject_name }})</strong
                        ></template
                      >
                    </autocomplete>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend_icon="
                        scheduleInputs.Wednesday.subject_id
                          ? 'mdi-check-underline'
                          : 'mdi-help'
                      "
                      request="gradelevelSubject"
                      :gradelevel="gradelevel"
                      :edit="editSchedule ? true : false"
                      day="Wednesday"
                      property="subject_name"
                    >
                      <template v-slot:label
                        >Wednesday<strong
                          v-if="scheduleInputs.Wednesday.subject_name"
                        >
                          ({{ scheduleInputs.Wednesday.subject_name }})</strong
                        ></template
                      >
                    </autocomplete>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend_icon="
                        scheduleInputs.Thursday.subject_id
                          ? 'mdi-check-underline'
                          : 'mdi-help'
                      "
                      request="gradelevelSubject"
                      :gradelevel="gradelevel"
                      :edit="editSchedule ? true : false"
                      day="Thursday"
                      property="subject_name"
                    >
                      <template v-slot:label
                        >Thursday<strong
                          v-if="scheduleInputs.Thursday.subject_name"
                        >
                          ({{ scheduleInputs.Thursday.subject_name }})</strong
                        ></template
                      >
                    </autocomplete>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend_icon="
                        scheduleInputs.Friday.subject_id
                          ? 'mdi-check-underline'
                          : 'mdi-help'
                      "
                      request="gradelevelSubject"
                      :gradelevel="gradelevel"
                      :edit="editSchedule ? true : false"
                      day="Friday"
                      property="subject_name"
                    >
                      <template v-slot:label
                        >Friday<strong
                          v-if="scheduleInputs.Friday.subject_name"
                        >
                          ({{ scheduleInputs.Friday.subject_name }})</strong
                        ></template
                      >
                    </autocomplete>
                  </v-col>
                  <br />
                </v-row>
              </v-container>
              <hr />
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  @click="saveSchedule(scheduleInputs.index)"
                  :loading="loading"
                  >save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-form>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="openDialog()" color="primary">add</v-btn>
      </v-card-actions>
    </v-container>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
      readonly: false,
      modal: false,
      modal2: false,
      maxTime: null,
      maxOnMin: null,
      minTime: null,
      minOnMax: null,
      headers: [
        { text: "Monday", value: "Monday", sortable: false },
        { text: "Tuesday", value: "Tuesday", sortable: false },
        { text: "Wednesday", value: "Wednesday", sortable: false },
        { text: "Thursday", value: "Thursday", sortable: false },
        { text: "Friday", value: "Friday", sortable: false },
        { text: "Update", sortable: false },
      ],
      scheduleInput: [{}],
      scheduleInputs: {
        startTime: null,
        endTime: null,
        Monday: {
          day: "Monday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
        Tuesday: {
          day: "Tuesday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
        Wednesday: {
          day: "Wednesday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
        Thursday: {
          day: "Thursday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
        Friday: {
          day: "Friday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
      },
      sched: {
        startTime: null,
        endTime: null,
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null,
      },
      schedulesToAdd: [],
      schedules: [],
      loading: false,
      isLoading: false,
      schedule: false,
      editSchedule: false,
      scheduleDialog: false,
      scheduleValid: false,
      overlay: false,
      spanOfClasses: {
        hour: 1,
        minutes: 0,
      },
      mode: "ADD",
    };
  },
  created() {
    console.log(this.section_id);
    this.retrieveSchedules();
    EventBus.$on("gradelevelSubject", (data) => {
      let startTime = this.scheduleInputs.startTime;
      let endTime = this.scheduleInputs.endTime;
      var sched = {
        day: data.day,
        start_time: startTime,
        end_time: endTime,
        subject_name: data.data.subject_name,
        teacher_name: data.data.teacher_name,
        teacher_id: data.data.teacher_id,
        subject_id: data.data.id,
        section_id: this.section_id,
      };
      this.scheduleInputs[data.day] = sched;
      for (const key in this.scheduleInputs) {
        if (this.scheduleInputs.hasOwnProperty.call(this.scheduleInputs, key)) {
          if (key != "startTime" && key != "endTime") {
            this.scheduleInputs[key].start_time = this.scheduleInputs.startTime;
            this.scheduleInputs[key].end_time = this.scheduleInputs.endTime;
          }
        }
      }
    });

    EventBus.$on("editgradelevelSubject", (data) => {
      let startTime =
        this.$moment(new Date()).format("YYYY/MM/DD") +
        " " +
        this.scheduleInputs.startTime;
      let endTime =
        this.$moment(new Date()).format("YYYY/MM/DD") +
        " " +
        this.scheduleInputs.endTime;
      this.scheduleInputs[data.day]
        ? ((this.scheduleInputs[data.day].subject_id = data.data.id),
          (this.scheduleInputs[data.day].subject_name = data.data.subject_name),
          (this.scheduleInputs[data.day].teacher_id = data.data.teacher_id),
          (this.scheduleInputs[data.day].teacher_name = data.data.teacher_name),
          (this.scheduleInputs[data.day].start_time = this.$moment(
            startTime
          ).format("hh:mm")),
          (this.scheduleInputs[data.day].end_time = this.$moment(
            endTime
          ).format("hh:mm")))
        : (this.scheduleInputs[data.day] = {
            day: data.day,
            subject_id: data.data.id,
            subject_name: data.data.subject_name,
            teacher_id: data.data.teacher_id,
            teacher_name: data.data.teacher_name,
          });
      // console.log(this.scheduleInputs[data.day]);
    });

    EventBus.$on("clearData", (data) => {
      this.scheduleInputs[data.day].subject_id = null;
      this.scheduleInputs[data.day].subject_name = null;
      this.scheduleInputs[data.day].teacher_id = null;
      this.scheduleInputs[data.day].teacher_name = null;
    });
  },
  methods: {
    retrieveSchedules() {
      console.log(this.section_id);
      this.schedules = [];
      this.$axios.get(`classSchedules/${this.section_id}`).then((response) => {
        this.overlay = true;
        const schedRes = response.data.sectionSchedules;
        console.log(schedRes);
        this.overlay = false;

        let count = 0;
        let next = false;
        for (const index in schedRes) {
          if (schedRes.hasOwnProperty.call(schedRes, index)) {
            const element = schedRes[index];
            // this.sched.Time = `${element.start_time}-${element.end_time}`;
            // console.log(element);
            if (!this.sched[element.day] || index != schedRes.length - 1) {
              count += 1;
              this.sched[element.day] = element;
            }
            if (index == schedRes.length - 1) {
              // console.log("here");
              next = true;
            }
          }
          // console.log(this.sched);
          if (count >= 5 || next) {
            this.schedules.push(this.sched);
            this.sched = {
              startTime: null,
              endTime: null,
              Monday: null,
              Tuesday: null,
              Wednesday: null,
              Thursday: null,
              Friday: null,
            };
            count = 0;
          }
        }
        console.log(this.schedules);
        console.log(this.schedules.length);
        if (this.schedules.length > 0) {
          console.log(
            this.schedules[this.schedules.length - 1].Monday.end_time
          );
          var time = this.schedules[this.schedules.length - 1].Monday.end_time;
          // console.log(time);
          var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
          let newEndTime = this.addTimes(time, span);
          this.scheduleInputs.startTime = time;
          this.scheduleInputs.endTime = newEndTime;
        } else {
          this.scheduleInputs.startTime = "08:00:00";
          this.scheduleInputs.endTime = this.addTimes(
            this.scheduleInputs.startTime,
            span
          );
        }
      });
    },
    saveSchedule(index) {
      // console.log(index);
      if (this.editSchedule) {
        this.saveEditSchedChanges(index);
        this.readonly = false;
      } else {
        this.addSchedule();
      }
    },

    /**
     * Method for adding schedule
     * returns void
     */
    addSchedule() {
      this.loading = true;
      let schedInput = this.scheduleInputs;
      console.log(schedInput);
      let schedCount = 0;
      for (const key in schedInput) {
        if (schedInput.hasOwnProperty.call(schedInput, key)) {
          const element = schedInput[key];
          if (key != "startTime" && key != "endTime") {
            this.schedulesToAdd.push(element);
          }
          element != null && element.subject_id
            ? (schedCount += 1)
            : (schedCount += 0);
        }
      }
      if (schedCount > 0) {
        this.$axios
          .post("addSchedules", this.schedulesToAdd)
          .then((response) => {
            this.loading = false;
            this.schedules.push(this.schedulesToAdd);
            this.showResponse("", response.data.success, "success");
            this.clearData();
            EventBus.$emit("save");
            this.retrieveSchedules();
            this.$refs.scheduleForm.resetValidation();
          })
          .catch((error) => {
            this.loading = false;
            this.schedulesToAdd = [];
            if (error.response.data.error && error.response.status == 500)
              this.showResponse(
                "Ooops...",
                "An error encountered! If this is a mistake, please retry. If error persist, please reload the page.",
                "error"
              );
            if (error.response.status == 400)
              this.showResponse(
                "Ooops...",
                error.response.data.has_sched,
                "error"
              );
          })
          .finally((this.loading = false));
      } else {
        this.showResponse(
          "Ooops...",
          "Please add at least one schedule.",
          "info"
        );
        this.loading = false;
      }
    },

    showResponse(title, message, icon) {
      this.$swal.fire({
        title: title,
        text: message,
        icon: icon,
      });
    },

    editSched(item, index) {
      console.log(item);
      this.mode = "EDIT";
      this.editSchedule = true;
      this.scheduleDialog = true;
      this.readonly = true;
      this.scheduleInputs = item;
      console.log("Inputs => ", this.scheduleInputs);
      this.scheduleInputs.startTime = item.Monday.start_time;
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      let newEndTime = this.addTimes(item.Monday.start_time, span);
      this.scheduleInputs.endTime = newEndTime;
      this.scheduleInputs["index"] = index;
    },

    openDialog() {
      var time = this.schedules[this.schedules.length - 1].Monday.end_time;
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      if (this.schedules.length > 0) {
        this.minTime = this.addTimes(time, span);
        this.maxTime = this.addTimes(time, "0:45");
        this.maxOnMin = this.addTimes(this.scheduleInputs.startTime, span);
        this.minOnMax = time;
      } else {
        this.minTime = this.addTimes(this.scheduleInputs.startTime, span);
        this.maxOnMin = this.addTimes(this.scheduleInputs.startTime, span);
        this.minOnMax = time;
      }
      this.scheduleDialog = true;
      this.mode = "ADD";
    },

    inputStartTime(time) {
      let isTimeComplete = false;
      for (let i = 0; i < time.length; i++) {
        if (time[i] === ":") (isTimeComplete = true), (i = time.length - 1);
      }
      console.log(isTimeComplete);
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      if (isTimeComplete)
        this.scheduleInputs.endTime = this.addTimes(time, span);
      else this.scheduleInputs.endTime = this.addTimes(`${time}:00`, span);
    },

    closeDialog() {
      this.clearData();
      const length = this.schedules.length;
      let schedToBase = this.schedules[length - 1];
      console.log(schedToBase);
      for (const key in schedToBase) {
        if (schedToBase.hasOwnProperty.call(schedToBase, key)) {
          const element = schedToBase[key];
          if (element != null)
            (this.scheduleInputs.startTime = element.end_time),
              (schedToBase = []);
        }
      }
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      let newEndTime = this.addTimes(this.scheduleInputs.startTime, span);
      this.scheduleInputs.endTime = newEndTime;
      this.readonly = false;
      this.scheduleDialog = false;
    },

    saveEditSchedChanges(index) {
      // console.log(index);
      this.schedules[index] = this.scheduleInputs;
      const edited = {
        Monday: this.scheduleInputs.Monday,
        Tuesday: this.scheduleInputs.Tuesday,
        Wednesday: this.scheduleInputs.Wednesday,
        Thursday: this.scheduleInputs.Thursday,
        Friday: this.scheduleInputs.Friday,
      };
      let forEditCount = 0;
      for (const key in edited) {
        if (edited.hasOwnProperty.call(edited, key)) {
          const element = edited[key];
          element.subject_id ? (forEditCount += 1) : (forEditCount += 0);
        }
      }
      if (forEditCount > 0) {
        this.$axios
          .post("editSchedules", edited)
          .then((response) => {
            this.scheduleDialog = false;
            this.editSchedule = false;
            this.clearData();
            EventBus.$emit("save");
            this.retrieveSchedules();
            this.showResponse("Success", response.data.success, "success");
          })
          .catch((error) => {
            console.log(error.response);
            this.showResponse("Success", error.response.data.error, "success");
          });
      } else {
        this.showResponse(
          "Ooops...",
          "It seems you emptied it all. It cannot be empty.",
          "info"
        );
        this.loading = false;
      }
    },

    clearData() {
      this.schedulesToAdd = [];
      this.scheduleInputs = {
        startTime: null,
        endTime: null,
        Monday: {
          day: "Monday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
        Tuesday: {
          day: "Tuesday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
        Wednesday: {
          day: "Wednesday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
        Thursday: {
          day: "Thursday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
        Friday: {
          day: "Friday",
          start_time: null,
          end_time: null,
          subject_name: null,
          teacher_name: null,
          teacher_id: null,
          subject_id: null,
          section_id: this.section_id,
        },
      };
    },

    changeSpanOfClassess(hour, minutes) {
      // console.log(hour, minutes);
      var time = null;
      time = this.scheduleInputs.startTime;
      var span = hour + ":" + minutes;
      let newEndTime = this.addTimes(time, span);
      this.scheduleInputs.startTime = time;
      this.scheduleInputs.endTime = newEndTime;
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

      for (const key in this.scheduleInputs) {
        if (this.scheduleInputs.hasOwnProperty.call(this.scheduleInputs, key)) {
          if (key != "Time") {
            this.scheduleInputs[key].start_time = this.$moment(
              start_time
            ).format("hh:mm");
            this.scheduleInputs[key].end_time = this.$moment(end_time).format(
              "hh:mm"
            );
          }
        }
      }
      console.log(this.scheduleInputs);
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