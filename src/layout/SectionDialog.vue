<template>
  <div>
    <div class="add_btn">
      <v-card>
        <v-card-title class="headlineSection">
          <span>{{ type }} Section</span>
        </v-card-title>
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
                    <span v-text="item.name"></span>
                  </v-chip>
                </template>
                <template v-slot:item="{ item }" click>
                  <v-list-item-avatar
                    color="indigo"
                    class="headline font-weight-light white--text"
                  >
                    {{ item.name.charAt(0) }}
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
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
        <div v-if="schedule">
          <v-data-table
            :headers="headers"
            :items="schedules"
            item-key="name"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-dialog
                  ref="dialog"
                  v-model="pickStartTime"
                  :return-value.sync="start_time"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="start_time"
                      label="Start time"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="pickStartTime"
                    v-model="start_time"
                    full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="pickStartTime = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(start_time)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>
              <v-col cols="12" sm="6">
                <v-dialog
                  ref="dialog"
                  v-model="pickEndTime"
                  :return-value.sync="end_time"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="end_time"
                      label="Start time"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="pickEndTime"
                    v-model="end_time"
                    full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="pickEndTime = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(end_time)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>
              <v-col cols="12" sm="6">
                <!-- Auto complete for all subject in a grade level -->
                <autocomplete
                  request="allSubjectsInGradeLevel"
                  :gradelevel="Number(type.split(' ')[2])"
                >
                  <template v-slot:label>
                    <label for="">Select Subject</label>
                  </template>
                </autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="day"
                  :items="[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                  ]"
                  :rules="[(v) => !!v || 'Day is required']"
                  label="Day"
                  required
                ></v-select>
              </v-col>
            </v-row>
            <br />
            <v-btn color="primary">Add to {{ day }}</v-btn>
          </v-container>
        </div>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" color="error darken-1" @click="close"
            >Cancel</v-btn
          >
          <v-btn
            :loading="loading"
            :disabled="hasAnyErors"
            color="blue darken-1"
            @click="addSection(type)"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </div>
  </div>
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
    Autocomplete: () => import("@/layout/Autocomplete.vue"),
  },
  data() {
    return {
      headers: [
        { text: "Time" },
        { text: "Monday" },
        { text: "Tuesday" },
        { text: "Wednesday" },
        { text: "Thursday" },
        { text: "Friday" },
        { text: "Update", sortable: false },
      ],
      schedules: [],
      teachers: [],
      errors: {},
      loading: false,
      isLoading: false,
      pickStartTime: false,
      pickEndTime: false,
      schedule: false,
      search: "",
      timeSpan: null,
      start_time: null,
      end_time: null,
      day: null,
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