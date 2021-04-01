<template>
  <div>
    <!-- <v-row> -->
    <!-- <v-col cols="12" sm="6"> -->
    <!-- Auto complete for all subject in a grade level -->
    <autocomplete request="allSubjectsInGradeLevel" :gradelevel="gradelevel">
      <!-- <template v-slot:label>
        <label for="">{{ day }}</label>
      </template> -->
    </autocomplete>
    <!-- </v-col> -->
    <!-- <v-col cols="12" sm="3">
        <v-dialog
          ref="startTime"
          v-model="pickStartTime"
          :return-value.sync="schedule.start_time"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <label for="startTime">Start time</label>
            <v-text-field
              v-model="schedule.start_time"
              :rules="[(value) => !!value || 'This field is required.']"
              name="startTime"
              required
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="pickStartTime"
            v-model="schedule.start_time"
            full-width
            @change="onInput()"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="pickStartTime = false">
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.startTime.save(schedule.start_time)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
      <v-col cols="12" sm="3">
        <v-dialog
          ref="dialog"
          v-model="pickEndTime"
          :return-value.sync="schedule.end_time"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <label for="endTime">End time</label>
            <v-text-field
              v-model="schedule.end_time"
              :rules="[
                (value) => !!value || 'This field is required.',
                (value) =>
                  schedule.start_time != schedule.end_time ||
                  'Start time and end time must not be the same.',
              ]"
              name="endTime"
              required
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="pickEndTime"
            v-model="schedule.end_time"
            full-width
            @change="onInput()"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="pickEndTime = false">
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(schedule.end_time)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col> -->
    <!-- </v-row> -->
  </div>
</template>

<script>
import { EventBus } from "../bus/bus";
export default {
  props: {
    gradelevel: {
      type: Number,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    spanOfClasses: {
      type: Number,
    },
    sched: {
      type: Array,
      required: true,
    },
  },
  components: {
    Autocomplete: () => import("@/layout/Autocomplete.vue"),
  },
  data() {
    return {
      pickStartTime: false,
      pickEndTime: false,
      schedule: {
        start_time: null,
        end_time: null,
        subject: null,
        teacher: null,
        subject_id: null,
        teacher_id: null,
      },
    };
  },
  created() {
    console.log(this.sched);
    if (this.sched.length == 0) {
      this.sched.start_time = "8:00";
    } else {
      // this.start_time = this.sched[this.day].start_time;
    }
    // console.log(this.schedule);
  },
  methods: {
    onInput() {
      EventBus.$emit("inputTrigger", {
        day: this.day,
        schedule: this.schedule,
      });
    },
  },
};
</script>