<template>
  <v-card>
    <v-container>
      <v-dialog v-model="edit" persistent max-width="500px">
        <v-card>
          <v-container>
            <v-card-text>
              <v-text-field
                label="Subject name"
                v-model="editSubjectDetails.subject_name"
                :rules="[(name) => !!name || 'Subject name is required']"
                outlined
              >
              </v-text-field>
              <autocomplete
                request="allTeacher"
                :gradelevel="Number(gradeLevel)"
                :modelValue="editSubjectDetails.teacher_name"
                :edit="true"
                :prepend_icon="
                  editSubjectDetails.teacher_name
                    ? 'mdi-check-underline'
                    : 'mdi-help'
                "
                property="teacher_name"
                :rules="[(value) => !!value || 'This field is required']"
              >
                <template v-slot:label>Teacher</template>
              </autocomplete>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="loading"
                color="error darken-1"
                @click="closeEdit()"
                >Cancel</v-btn
              >
              <v-btn
                :loading="loading"
                :disabled="hasAnyErors"
                color="blue darken-1"
                @click="editSubject(editSubjectDetails)"
                >Save</v-btn
              >
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>
      <div class="subtitle-1 font-weight-light text-center justify-center">
        <h1>Grade {{ gradeLevel }} Subject(s)</h1>
      </div>
      <br />
      <v-data-table
        :headers="headers"
        :items="subjects"
        item-key="name"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>
              {{ row.item.subject_name }}
              <p
                v-if="hasError('name') && row.item.name.length < 2"
                class="invalid-feedback"
              >
                {{ getError("name") }}
              </p>
            </td>
            <td>{{ row.item.teacher_name }}</td>
            <td>
              <v-icon color="primary" @click="openEditSub(row.item, row.index)"
                >mdi-pencil</v-icon
              >
              <v-icon color="error" @click="deleteData(row.item.id, row.index)"
                >mdi-delete</v-icon
              >
            </td>
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
                  :rules="[
                    (name) =>
                      (!!name && name.trim() != '') ||
                      'Subject name is required',
                  ]"
                  @keydown="clearError"
                  name="name"
                  :error="hasError('name')"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <Autocomplete
                  request="allTeacher"
                  :gradelevel="Number(gradeLevel)"
                  :edit="false"
                  :prepend_icon="
                    teacher != null ? 'mdi-check-underline' : 'mdi-help'
                  "
                  property="teacher_name"
                  :rules="[(value) => !!value || 'This field is required']"
                />
              </v-col>
            </v-row>
          </v-form>
          <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="add()">add</v-btn>
          </v-card-actions> -->
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="loading" color="error darken-1" @click="close">
          Cancel
        </v-btn>
        <v-btn color="primary" @click="addSubjectToDB()">add</v-btn>
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
    subjectsInGradeLevel: {
      type: Array,
      required: true,
    },
  },
  components: {
    Autocomplete: () => import("@/layout/Autocomplete.vue"),
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
      edit: false,
      headers: [
        { text: "Subject", value: "subjects.name" },
        { text: "Teacher", value: "subjects.teacher" },
        { text: "Update", sortable: false },
      ],
      subjects: this.subjectsInGradeLevel,
      teachers: [],
      editSubjectDetails: {
        grade_level_id: null,
        id: null,
        subject_name: null,
        teacher_id: null,
        teacher_name: null,
        index: null,
        icon: null,
      },
    };
  },
  watch: {},
  created() {
    EventBus.$on("allTeacher", (data) => {
      this.teacher = data.data.teacher_name;
      this.teacher_id = data.data.id;
    });

    EventBus.$on("editallTeacher", (data) => {
      this.editSubjectDetails.teacher_name = data.data.teacher_name;
      this.editSubjectDetails.teacher_id = data.data.id;
      this.editSubjectDetails.icon = "mdi-check-underline";
    });
  },
  methods: {
    addSubjectToDB() {
      if (this.$refs.subject.validate()) {
        let subject = {
          subject_name: this.name,
          teacher_name: this.teacher,
          teacher_id: this.teacher_id,
          grade_level_id: Number(this.gradeLevel),
        };
        this.loading = true;
        this.$axios
          .post("/addSubject", subject)
          .then((response) => {
            this.showResponse("success", "Success", response.data.success);

            this.subjects.push(subject);
            this.clear();
            EventBus.$emit("save");
            this.clear();
          })
          .catch((error) => {
            this.loading = false;
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              this.showResponse("info", "Oooops...", error.response.data.error);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    openEditSub(itemData, index) {
      this.editSubjectDetails.grade_level_id = itemData.grade_level_id;
      this.editSubjectDetails.subject_name = itemData.subject_name;
      this.editSubjectDetails.teacher_name = itemData.teacher_name;
      this.editSubjectDetails.teacher_id = itemData.teacher_id;
      this.editSubjectDetails.id = itemData.id;
      this.editSubjectDetails.index = index;
      this.edit = true;
    },

    editSubject() {
      this.subjects[
        this.editSubjectDetails.index
      ].name = this.editSubjectDetails.name;
      this.subjects[
        this.editSubjectDetails.index
      ].teacher_id = this.editSubjectDetails.teacher_id;
      this.subjects[
        this.editSubjectDetails.index
      ].teacher_name = this.editSubjectDetails.teacher_name;
      this.$axios
        .post(`updateSubject`, this.editSubjectDetails)
        .then((response) => {
          this.showResponse("success", "", response.data.success);
        })
        .catch((error) => {
          if (error.response.status == 422) {
            let text = error.response.data.failed;
            this.showResponse("info", "Ooops...", text);
          }
        });

      this.closeEdit();
    },

    deleteData(id, index) {
      this.$axios
        .get(`deleteSubject/${id}`)
        .then((response) => {
          this.showResponse("success", "", response.data.success);
          this.subjects.splice(index, 1);
        })
        .catch(() => {
          this.showResponse(
            "error",
            "Ooops...",
            "An error encountered! Please try again or reload the page."
          );
        });
    },

    closeEdit() {
      this.editSubjectDetails.name = null;
      this.editSubjectDetails.teacher_id = null;
      this.edit = false;
    },

    showResponse(icon, title, message) {
      this.$swal.fire({
        icon: icon,
        title: title,
        text: message,
      });
    },
    clear() {
      this.name = null;
      this.teacher = null;
      this.errors = {};
      this.$refs.subject.resetValidation();
    },
    close() {
      // this.subjects = [];

      this.$refs.subject.resetValidation();
      EventBus.$emit("closeSubjectModal", false);

      this.name = null;
      this.teacher = null;
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
  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
};
</script>