<template>
  <div>
    <div class="add_btn">
      <v-card>
        <v-card-title class="headlineSection">
          <span>{{ type }} Section</span>
        </v-card-title>
        <v-card-text>
          <v-container>
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
            <div>
              <v-select
                item-text="teacher"
                item-value="id"
                v-model="Section.teacher"
                :items="teachers"
                label="Assigned Teacher"
              ></v-select>
            </div>
          </v-container>
        </v-card-text>
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
    teachers: {
      type: Array,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      errors: {},
      loading: false,
    };
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