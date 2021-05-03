<template>
  <v-card>
    <!-- <v-toolbar color="primary" dark
      > -->
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-light display-1 basil--text">
        {{ type }}
      </h1>
    </v-card-title>
    <!-- </v-toolbar> -->
    <v-card-text>
      <v-form ref="sectionForm" v-model="sectionValid" lazy-validation>
        <v-container>
          <v-text-field
            v-model="sectionData.section"
            label="Section name"
            :rules="[(value) => !!value || 'This field is required']"
            required
            @keydown="clearError"
            name="name"
            :error="hasError('name')"
            outlined
          ></v-text-field>
          <p v-if="hasError('name')" class="invalid-feedback">
            {{ getError("name") }}
          </p>
          <v-text-field
            type="number"
            name="capacity"
            label="Max Capacity"
            @keydown="clearError"
            v-model="sectionData.capacity"
            :rules="[(value) => !!value || 'This field is required']"
            required
            :error="hasError('capacity')"
            min="0"
            outlined
          ></v-text-field>
          <p v-if="hasError('capacity')" class="invalid-feedback">
            {{ getError("capacity") }}
          </p>
          <autocomplete
            request="allNoneAdvisoryTeacher"
            :gradelevel="Number(type.split(' ')[2])"
            :edit="type.split(' ')[0] == 'Edit' ? true : false"
            :teacher="Section.teacher"
            :modelValue="Section.teacher"
            :prepend_icon="
              sectionData.teacher != null ? 'mdi-check-underline' : 'mdi-help'
            "
            property="teacher_name"
          >
            <template v-slot:label>
              <span
                >Adviser : <strong>{{ Section.teacher }}</strong></span
              >
            </template>
          </autocomplete>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn dark :disabled="loading" color="error darken-1" @click="close()">
        cancel
      </v-btn>
      <v-btn
        dark
        :loading="loading"
        :disabled="hasAnyErors"
        color="primary"
        @click="addSection(type)"
        >Save</v-btn
      >
    </v-card-actions>
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
    // EditScheduleForm: () => import("@/layout/EditSchedule"),
  },
  data() {
    return {
      loading: false,
      teachers: [],
      errors: {},
      sectionData: this.Section,
      sectionValid: false,
      search: "",
    };
  },
  watch: {},
  created() {
    console.log(this.Section);

    EventBus.$on("allNoneAdvisoryTeacher", (data) => {
      console.log(data);
      this.sectionData.teacher = data.data ? data.data.teacher_name : "";
      this.sectionData.teacher_id = data.data ? data.data.id : "";
    });

    EventBus.$on("editallNoneAdvisoryTeacher", (data) => {
      // console.log(data);
      this.sectionData.teacher = data.data.teacher_name;
      this.sectionData.teacher_id = data.data.id;
      console.log(this.sectionData);
    });

    EventBus.$on("clearData", () => {
      this.Section.teacher = null;
      this.Section.teacher_id = null;
    });
  },
  mounted() {},
  methods: {
    //Method For Adding A Section In Junior High School Category
    async addSection(grades) {
      if (this.$refs.sectionForm.validate()) {
        this.loading = true;
        if (this.edit == false) {
          // console.log(grades.split(" ")[2]);
          console.log(this.sectionData);
          this.$axios
            .post("addSection", {
              grade: grades.split(" ")[2],
              name: this.sectionData.section,
              capacity: this.sectionData.capacity,
              total_students: 0,
              teacher: this.sectionData.teacher,
              teacher_id: this.sectionData.teacher_id,
            })
            .then((response) => {
              if (response.data.message) {
                this.clear();
                // this.displayAllsection(grades, null);
                EventBus.$emit("displayAllsection", {
                  data1: grades,
                });
                this.showResponse("Success", response.data.message, "success");
                EventBus.$emit("reloadData");
                this.loading = false;
                this.close();
              }
              if (response.data.failed) {
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
              // this.showResponse("Ooops...", error.response.error, "error");
              // this.clear();
              // this.close();
              this.loading = false;
              if (error.response.status == 422) {
                this.setErrors(error.response.data.errors);
              } else {
                console.log(error);
              }
            });
        } else {
          //console.log("Teacher:"+this.Section.teacher);

          this.loading = true;
          this.$axios
            .post("updateSection/" + this.sectionData.id, {
              name: this.sectionData.section,
              capacity: this.sectionData.capacity,
              teacher_id: this.sectionData.teacher_id,
            })
            .then((response) => {
              if (response.data.message) {
                this.loading = false;
                this.showResponse("Success", response.data.message, "success");
                EventBus.$emit("displayAllsection", {
                  data1: grades,
                });
                this.clear();
                this.close();
              } else {
                this.loading = false;
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
                      this.loading = true;
                      this.$axios
                        .post("updateSection/" + "update", {
                          updateId: this.sectionData.id,
                          name: this.sectionData.section,
                          capacity: this.sectionData.capacity,
                          teacher_id: this.sectionData.teacher_id,
                        })
                        .then((response) => {
                          this.loading = false;
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
                            });
                          } else {
                            let text = "Not successfully updated!";
                            this.showResponse("Not Updated!", text, "error");
                            EventBus.$emit("displayAllsection", {
                              data1: grades,
                            });
                            this.clear();
                            this.close();
                          }
                        })
                        .catch(() => {
                          this.loading = false;
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
                this.showResponse("Ooops...", "An error encountered!", "error");
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

    close() {
      this.$refs.sectionForm.resetValidation();
      EventBus.$emit("save");
      EventBus.$emit("closeModal", "close-modal");
    },
    clear() {
      this.sectionData.id = null;
      this.sectionData.section = null;
      this.sectionData.capacity = null;
      this.sectionData.teacher = null;
      this.$refs.sectionForm.resetValidation();
      EventBus.$emit("save");
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