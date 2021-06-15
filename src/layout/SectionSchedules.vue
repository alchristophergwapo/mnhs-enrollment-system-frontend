<template>
  <v-card>
    <v-toolbar
      dark
      color="primary"
    >
      <v-toolbar-title>
        <v-card-title class="text-center justify-center py-6">
          <h1 class="font-weight-bold display-1 basil--text">
            Class schedules
          </h1>
        </v-card-title>
      </v-toolbar-title>
      <v-spacer />
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
    <br><br>
    <v-container>
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
                  {{ row.item.Monday.subject_name }} <br>
                  <strong>{{ row.item.Monday.teacher_name }}</strong> <br>
                  <p v-if="row.item.Monday.subject_name">
                    {{ row.item.Monday.start_time }} -
                    {{ row.item.Monday.end_time }}
                  </p>
                </span>
              </td>
              <td>
                <span v-if="row.item.Tuesday">
                  {{ row.item.Tuesday.subject_name }} <br>
                  <strong>{{ row.item.Tuesday.teacher_name }}</strong> <br>
                  <p v-if="row.item.Tuesday.subject_name">
                    {{ row.item.Tuesday.start_time }} -
                    {{ row.item.Tuesday.end_time }}
                  </p>
                </span>
              </td>
              <td>
                <span v-if="row.item.Wednesday">
                  {{ row.item.Wednesday.subject_name }} <br>
                  <strong>{{ row.item.Wednesday.teacher_name }}</strong>
                  <br>
                  <p v-if="row.item.Wednesday.subject_name">
                    {{ row.item.Wednesday.start_time }} -
                    {{ row.item.Wednesday.end_time }}
                  </p>
                </span>
              </td>
              <td>
                <span v-if="row.item.Thursday">
                  {{ row.item.Thursday.subject_name }} <br>
                  <strong>{{ row.item.Thursday.teacher_name }}</strong> <br>
                  <p v-if="row.item.Thursday.subject_name">
                    {{ row.item.Thursday.start_time }} -
                    {{ row.item.Thursday.end_time }}
                  </p>
                </span>
              </td>
              <td>
                <span v-if="row.item.Friday">
                  {{ row.item.Friday.subject_name }} <br>
                  <strong>{{ row.item.Friday.teacher_name }}</strong> <br>
                  <p v-if="row.item.Friday.subject_name">
                    {{ row.item.Friday.start_time }} -
                    {{ row.item.Friday.end_time }}
                  </p>
                </span>
              </td>
              <td>
                <v-icon
                  color="red"
                  @click="deleteSched(row.item)"
                >
                  mdi-delete
                </v-icon>
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
        <v-dialog
          v-model="scheduleDialog"
          width="800px"
        >
          <v-card>
            <v-card-title>
              <v-row>
                <v-icon>mdi-pencil</v-icon>
                <h3>{{ mode }} SCHEDULE</h3>
              </v-row>
              <v-btn
                icon
                @click="closeDialog()"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <hr>
            <v-container>
              <v-form
                ref="scheduleInputForm"
                v-model="scheduleValid"
                lazy-validation
              >
                <v-row>
                  <v-col cols="6">
                    <div>Span of each schedule of classes</div>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="spanOfClasses.hour"
                      :rules="[
                        (v) => !!v || 'Time cannot be empty. Put 0 instead.',
                        (v) =>
                          (v >= 0 && v <= 4) ||
                          'Time should not be greater than 4 and lesser than 0',
                      ]"
                      label="Hour(s)"
                      type="number"
                      dense
                      outlined
                      @keyup="changeSpanOfClassess($event, (isMinute = false))"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="spanOfClasses.minutes"
                      :rules="[
                        (v) => v >= 0 || 'Minutes cannot be lesser than 0.',
                        (v) =>
                          spanOfClasses.hour > 0 ||
                          v >= 15 ||
                          'If hour is equal to 0, minutes cannot be lesser than to 15.',
                      ]"
                      label="Minutes"
                      type="number"
                      dense
                      outlined
                      @keyup="changeSpanOfClassess($event, (isMinute = true))"
                    />
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
                          dense
                          outlined
                          v-on="on"
                        />
                      </template>
                      <v-time-picker
                        v-if="modal"
                        v-model="scheduleInputs.startTime"
                        :min="minOnMax"
                        max="17:00"
                        full-width
                        @click:hour="inputStartTime($event)"
                        @click:minute="inputStartTime($event)"
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
                        />
                      </template>
                      <v-time-picker
                        v-if="modal2"
                        v-model="scheduleInputs.endTime"
                        :min="minTime"
                        max="18:00"
                        full-width
                      >
                        <v-spacer />
                        <v-btn
                          text
                          color="primary"
                          @click="modal2 = false"
                        >
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
                      :prepend-icon="
                        scheduleInputs.Monday != null &&
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
                      <template
                        v-slot:label
                      >
                        Monday<strong
                          v-if="
                            scheduleInputs.Monday &&
                              scheduleInputs.Monday.subject_name
                          "
                        >
                          ({{ scheduleInputs.Monday.subject_name }})</strong>
                      </template>
                    </autocomplete>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend-icon="
                        scheduleInputs.Tuesday != null &&
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
                      <template
                        v-slot:label
                      >
                        Tuesday<strong
                          v-if="
                            scheduleInputs.Tuesday &&
                              scheduleInputs.Tuesday.subject_name
                          "
                        >
                          ({{ scheduleInputs.Tuesday.subject_name }})</strong>
                      </template>
                    </autocomplete>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend-icon="
                        scheduleInputs.Wednesday != null &&
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
                      <template
                        v-slot:label
                      >
                        Wednesday<strong
                          v-if="scheduleInputs.Wednesday.subject_name"
                        >
                          ({{ scheduleInputs.Wednesday.subject_name }})</strong>
                      </template>
                    </autocomplete>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend-icon="
                        scheduleInputs.Thursday != null &&
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
                      <template
                        v-slot:label
                      >
                        Thursday<strong
                          v-if="
                            scheduleInputs.Thursday &&
                              scheduleInputs.Thursday.subject_name
                          "
                        >
                          ({{ scheduleInputs.Thursday.subject_name }})</strong>
                      </template>
                    </autocomplete>
                  </v-col>
                  <v-col sm="6">
                    <autocomplete
                      :prepend-icon="
                        scheduleInputs.Friday != null &&
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
                      <template
                        v-slot:label
                      >
                        Friday<strong
                          v-if="scheduleInputs.Friday.subject_name"
                        >
                          ({{ scheduleInputs.Friday.subject_name }})</strong>
                      </template>
                    </autocomplete>
                  </v-col>
                  <br>
                </v-row>
              </v-form>
            </v-container>
            <hr>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="success"
                :loading="loading"
                @click="saveSchedule(scheduleInputs.index)"
              >
                save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          @click="openDialog()"
        >
          add
        </v-btn>
      </v-card-actions>
    </v-container>

    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-card>
</template>

<script>
import { EventBus } from "../bus/bus";
import Autocomplete from /* webpackChunkName: "Autocomplete" */ "@/layout/Autocomplete.vue";
export default {
  components: {
    Autocomplete,
  },
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
    this.retrieveSchedules();
    EventBus.$on("gradelevelSubject", (data) => {
      let startTime = this.scheduleInputs.startTime;
      let endTime = this.scheduleInputs.endTime;
      var sched = {
        day: data.day,
        start_time: startTime,
        end_time: endTime,
        subject_name: data.data ? data.data.subject_name : null,
        teacher_name: data.data ? data.data.teacher_name : null,
        teacher_id: data.data ? data.data.teacher_id : null,
        subject_id: data.data ? data.data.id : null,
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
      let startTime = this.scheduleInputs.startTime;
      let endTime = this.scheduleInputs.endTime;
      this.scheduleInputs[data.day]
        ? ((this.scheduleInputs[data.day].subject_id = data.data.id),
          (this.scheduleInputs[data.day].subject_name = data.data.subject_name),
          (this.scheduleInputs[data.day].teacher_id = data.data.teacher_id),
          (this.scheduleInputs[data.day].teacher_name = data.data.teacher_name),
          (this.scheduleInputs[data.day].start_time = startTime),
          (this.scheduleInputs[data.day].end_time = endTime))
        : (this.scheduleInputs[data.day] = {
            day: data.day,
            subject_id: data.data.id,
            subject_name: data.data.subject_name,
            teacher_id: data.data.teacher_id,
            teacher_name: data.data.teacher_name,
          });
    });

    // EventBus.$on("clearData", (data) => {
    // });
  },
  methods: {
    retrieveSchedules() {
      this.schedules = [];
      this.overlay = true;
      this.$axios.get(`classSchedules/${this.section_id}`).then((response) => {
        const schedRes = response.data.sectionSchedules;
        this.overlay = false;

        let count = 0;
        let next = false;
        for (const index in schedRes) {
          if (schedRes.hasOwnProperty.call(schedRes, index)) {
            const element = schedRes[index];
            if (!this.sched[element.day] || index != schedRes.length - 1) {
              count += 1;
              this.sched[element.day] = element;
            }
            if (index == schedRes.length - 1) {
              next = true;
            }
          }
          if (count >= 5 || next) {
            count = 0;
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
          }
        }
        var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
        if (this.schedules.length > 0) {
          var time = this.schedules[this.schedules.length - 1].Monday.end_time;
          let newEndTime = this.addTimes(time, span);
          this.scheduleInputs.startTime = time;
          this.scheduleInputs.endTime = newEndTime;
        } else {
          this.scheduleInputs.startTime = "08:00:00";
          this.scheduleInputs.endTime = this.addTimes("08:00:00", span);
        }
      });
    },
    saveSchedule(index) {
      if (this.editSchedule === true) {
        this.saveEditSchedChanges(index);
        this.readonly = false;
      } else {
        this.addSchedule();
      }
    },

    /**
     * Method for adding schedule
     * @returns void
     */
    addSchedule() {
      let schedInput = this.scheduleInputs;
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
      if (this.$refs.scheduleInputForm.validate()) {
        this.loading = true;
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
          this.schedulesToAdd = [];
          this.clearData();
          this.showResponse(
            "Ooops...",
            "Please add at least one schedule.",
            "info"
          );
          this.loading = false;
        }
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
      this.mode = "EDIT";
      this.editSchedule = true;
      this.scheduleDialog = true;
      this.readonly = true;
      this.scheduleInputs = item;
      this.scheduleInputs.startTime = item.Monday
        ? item.Monday.start_time
        : "08:00:00";
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      let newEndTime = this.addTimes(
        item.Monday ? item.Monday.start_time : this.scheduleInputs.startTime,
        span
      );
      this.scheduleInputs.endTime = newEndTime;
      this.scheduleInputs["index"] = index;
    },

    openDialog() {
      var time =
        this.schedules.length > 0
          ? this.schedules[this.schedules.length - 1].Monday.end_time
          : "09:00:00";
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      if (this.schedules.length > 0) {
        this.minTime = this.addTimes(time, span);
        this.maxTime = this.addTimes(time, "0:45");
        this.maxOnMin = this.addTimes(this.scheduleInputs.startTime, span);
        this.minOnMax = time;
      } else {
        this.minTime = this.addTimes(this.scheduleInputs.startTime, span);
        this.maxOnMin = this.addTimes(this.scheduleInputs.startTime, span);
        this.minOnMax = "06:00";
      }
      this.editSchedule = false;
      this.scheduleDialog = true;
      this.mode = "ADD";
    },

    inputStartTime(time) {
      let isTimeComplete = false;
      for (let i = 0; i < time.length; i++) {
        if (time[i] === ":") (isTimeComplete = true), (i = time.length - 1);
      }
      var span = this.spanOfClasses.hour + ":" + this.spanOfClasses.minutes;
      if (isTimeComplete)
        (this.scheduleInputs.startTime = this.addTimes(`${time}:00`, "00:00")),
          (this.scheduleInputs.endTime = this.addTimes(time, span));
      else
        (this.scheduleInputs.startTime = this.addTimes(`${time}:00`, "00:00")),
          (this.scheduleInputs.endTime = this.addTimes(`${time}:00`, span));
      // this.startTime = this.addTimes(`${time}:00`, "00:00");
    },

    closeDialog() {
      this.clearData();
      const length = this.schedules.length;
      let schedToBase = this.schedules[length - 1];
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
      EventBus.$emit("save");
    },

    saveEditSchedChanges(index) {
      this.schedules[index] = this.scheduleInputs;
      const edited = {
        Monday: this.scheduleInputs.Monday,
        Tuesday: this.scheduleInputs.Tuesday,
        Wednesday: this.scheduleInputs.Wednesday,
        Thursday: this.scheduleInputs.Thursday,
        Friday: this.scheduleInputs.Friday,
      };
      let forEditCount = 0;
      let error = false;
      for (const key in edited) {
        if (edited.hasOwnProperty.call(edited, key)) {
          const element = edited[key];
          if (
            (element && element.start_time === null) ||
            (element && element.end_time === null)
          )
            this.showResponse(
              "Oops!",
              "It seems that your input time is invalid. If this is a mistake please retry.",
              "warning"
            ),
              (error = true);
          element && element.subject_id
            ? (forEditCount += 1)
            : (forEditCount += 0);
        }
      }
      if (forEditCount > 0 && error === false) {
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
          .catch(() => {
            this.showResponse(
              "Oops!",
              "An error encountered! If this is a mistake, please try again.",
              "warning"
            );
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

    deleteSched(scheds) {
      let schedToDelete = [];
      for (const key in scheds) {
        if (scheds.hasOwnProperty.call(scheds, key)) {
          const element = scheds[key];
          console.log(element);
          if (element && element.id) schedToDelete.push(element.id);
        }
      }
      this.$axios.post("deleteScheds", schedToDelete).then((res) => {
        console.log(res);
        this.retrieveSchedules();
      });
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

    changeSpanOfClassess(e, isMinute) {
      let hour = this.spanOfClasses.hour;
      let minutes = this.spanOfClasses.minutes;

      if (e.keyCode === 8 && isMinute) this.spanOfClasses.hour = 0;
      else {
        if (hour > 0 || minutes >= 15)
          this.$refs.scheduleInputForm.resetValidation();
        if (minutes >= 60)
          (this.spanOfClasses.hour += Math.floor(minutes / 60)),
            (this.spanOfClasses.minutes = minutes % 60);
      }
      var time = null;
      time = this.scheduleInputs.startTime;
      var span = hour + ":" + minutes;
      let newEndTime = this.addTimes(time, span);
      this.scheduleInputs.startTime = time;
      this.scheduleInputs.endTime = newEndTime;
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

      return (
        ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + "00"
      );
    },

    close() {
      EventBus.$emit("closeSectionScheduleModal");
    },
  },
};
</script>