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
      <v-form
        ref="sectionForm"
        v-model="sectionValid"
        lazy-validation
      >
        <v-container>
          <v-text-field
            v-model="sectionData.section"
            label="Section name"
            :rules="[
              (value) =>
                (!!value && value.trim() != '') || 'This field is required',
            ]"
            required
            name="name"
            :error="hasError('name')"
            outlined
            @keydown="clearError"
          >
            <v-icon
              slot="prepend-inner"
              color="red"
              x-small
            >
              mdi-asterisk
            </v-icon>
          </v-text-field>
          <p
            v-if="hasError('name')"
            class="invalid-feedback"
          >
            {{ getError("name") }}
          </p>
          <v-text-field
            v-model="sectionData.capacity"
            type="number"
            name="capacity"
            label="Max Capacity"
            onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
            :rules="[(value) => !!value || 'This field is required']"
            required
            :error="hasError('capacity')"
            min="0"
            outlined
            @keydown="clearError"
          >
            <v-icon
              slot="prepend-inner"
              color="red"
              x-small
            >
              mdi-asterisk
            </v-icon>
          </v-text-field>
          <p
            v-if="hasError('capacity')"
            class="invalid-feedback"
          >
            {{ getError("capacity") }}
          </p>
          <Autocomplete
            request="allNoneAdvisoryTeacher"
            :gradelevel="Number(type.split(' ')[2])"
            :edit="type.split(' ')[0] == 'Edit' ? true : false"
            :teacher="sectionDataProps.teacher"
            :model-value="sectionDataProps.teacher"
            :prepend-icon="
              sectionData.teacher != null ? 'mdi-check-underline' : 'mdi-help'
            "
            property="teacher_name"
          >
            <template v-slot:label>
              <span>Adviser : <strong>{{ sectionDataProps.teacher }}</strong></span>
            </template>
          </Autocomplete>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        dark
        :disabled="loading"
        color="error darken-1"
        @click="close()"
      >
        cancel
      </v-btn>
      <v-btn
        :loading="loading"
        :disabled="!sectionValid"
        color="primary"
        @click="addSection(type)"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { EventBus } from "../bus/bus.js";
import Autocomplete from /* webpackChunkName: "Autocomplete" */ "@/layout/Autocomplete.vue";
export default {
  components: {
    Autocomplete,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    sectionDataProps: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      teachers: [],
      errors: {},
      sectionData: this.sectionDataProps,
      sectionValid: false,
      search: "",
    };
  },
  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
  watch: {},
  created() {
    EventBus.$on("allNoneAdvisoryTeacher", (data) => {
      this.sectionData.teacher = data.data ? data.data.teacher_name : "";
      this.sectionData.teacher_id = data.data ? data.data.id : "";
    });

    EventBus.$on("editallNoneAdvisoryTeacher", (data) => {
      this.sectionData.teacher = data.data.teacher_name;
      this.sectionData.teacher_id = data.data.id;
    });

    EventBus.$on("clearData", () => {
      this.sectionDataProps.teacher = null;
      this.sectionDataProps.teacher_id = null;
    });
  },
  mounted() {},
  methods: {
    //Method For Adding A Section In Junior High School Category
    async addSection(grades) {
      if (this.$refs.sectionForm.validate()) {
        this.loading = true;
        if (this.edit == false) {
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
                this.$swal.fire({
                  icon: "warning",
                  title: "Ooops!",
                  text: "An error encountered!",
                });
              }
            });
               this.loading = false;
        } else {
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
                this.showResponse("Ooops...", "An error encountered!", "error");
              }
            });
        }
      }
    },

    showResponse(title, message, icon) {
      this.$swal
        .fire({
          icon: icon,
          title: title,
          text: message,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$refs.sectionForm.resetValidation();
          }
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
  },
};
</script>