<template>
  <v-card>
    <v-container>
      <div class="subtitle-1 font-weight-light text-center justify-center">
        <h1>Add Subject(s)</h1>
      </div>
      <br />
      <v-data-table
        :headers="headers"
        :items="subjects"
        item-key="name"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.name }}</td>
            <td>{{ row.item.teacher_id }}</td>
          </tr>
        </template>
      </v-data-table>
      <v-card-text>
        <v-container>
          <v-form ref="subject" v-model="subjectValid" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Subject name"
                  v-model="name"
                  :rules="[(name) => !!name || 'Subject name is required']"
                  @keydown="clearError"
                  name="name"
                  :error="hasError('name')"
                ></v-text-field>
                <p v-if="hasError('name')" class="invalid-feedback">
                  {{ getError("name") }}
                </p>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="teacher"
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
                  @click="itemSelected()"
                  @keydown="clearError"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        Search for
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
                <p v-if="hasError('teacher')" class="invalid-feedback">
                  {{ getError("teacher") }}
                </p>
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="add()">add</v-btn>
          </v-card-actions>
        </v-container>
      </v-card-text>
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
          @click="addSectionToDB()"
          >Save</v-btn
        >
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
import { EventBus } from "../bus/bus";
export default {
  props: {
    gradeLevel: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      errors: {},
      name: "",
      teacher: null,
      teacher_id: null,
      isLoading: false,
      loading: false,
      subjectValid: false,
      headers: [
        { text: "Subject", value: "subjects.name" },
        { text: "Teacher", value: "subjects.teacher" },
      ],
      subjects: [],
      teachers: [],
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
          this.teachers = res;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  methods: {
    add() {
      //   console.log(this.teacher_id);
      if (this.$refs.subject.validate()) {
        let subject = {
          name: this.name,
          teacher_id: this.teacher,
          grade_level_id: Number(this.gradeLevel),
        };
        this.subjects.push(subject);
        // console.log(this.subjects);
        this.clear();
      }
    },
    addSectionToDB() {
      this.loading = true;
      this.$axios
        .post("/addSubject", this.subjects)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    clear() {
      this.name = null;
      this.teacher = null;
      this.$refs.subject.resetValidation();
    },
    close() {
      EventBus.$emit("closeSubjectModal", false);

      (this.name = null), (this.teacher = null);
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
  created() {
    console.log(this.gradeLevel);
  },
  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
};
</script>