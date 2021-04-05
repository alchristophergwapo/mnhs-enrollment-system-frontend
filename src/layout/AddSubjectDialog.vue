<template>
  <v-card>
    <v-container>
      <v-dialog v-model="edit" persistent max-width="500px">
        <v-card>
          <v-container>
            <v-card-text>
              <v-text-field
                label="Subject name"
                v-model="editSubjectDetails.name"
                :rules="[(name) => !!name || 'Subject name is required']"
              >
              </v-text-field>
              <autocomplete
                request="allTeacher"
                :gradelevel="Number(gradeLevel)"
                property="teacher_name"
                :rules="[(value) => !!value || 'This field is required']"
              ></autocomplete>
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
                @click="editSubject()"
                >Save</v-btn
              >
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>
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
            <td>
              {{ row.item.name }}
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
              <v-icon color="error" @click="deleteData(row.index)"
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
                  :rules="[(name) => !!name || 'Subject name is required']"
                  @keydown="clearError"
                  name="name"
                  :error="hasError('name')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <autocomplete
                  request="allTeacher"
                  :gradelevel="Number(gradeLevel)"
                  property="teacher_name"
                  :rules="[(value) => !!value || 'This field is required']"
                ></autocomplete>
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
      subjects: [],
      teachers: [],
      editSubjectDetails: {
        name: null,
        teacher: null,
        index: null,
      },
    };
  },
  watch: {},
  created() {
    console.log(this.gradeLevel);
    EventBus.$on("allTeacher", (data) => {
      console.log(data);
      this.teacher = data.data.teacher_name;
      this.teacher_id = data.data.id;
    });
  },
  methods: {
    add() {
      //   console.log(this.teacher_id);
      if (this.$refs.subject.validate()) {
        let subject = {
          name: this.name,
          teacher_name: this.teacher,
          teacher_id: this.teacher_id,
          grade_level_id: Number(this.gradeLevel),
        };
        this.subjects.push(subject);
        // console.log(this.subjects);
        this.clear();
        EventBus.$emit("save");
      }
    },
    addSectionToDB() {
      if (this.subjects.length != 0) {
        this.loading = true;
        this.$axios
          .post("/addSubject", this.subjects)
          .then((response) => {
            this.showResponse("success", "Success", response.data.success);
            this.subjects = [];
            this.clear();
            this.close();
          })
          .catch((error) => {
            console.log(error.response);
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              this.showResponse("info", "Oooops...", error.response.data.error);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        let text = "Please add at least on subject.";
        this.showResponse("info", "Ooops.....", text);
        this.errors = { error: "no data" };
      }
    },

    openEditSub(itemData, index) {
      console.log(itemData);
      this.editSubjectDetails.name = itemData.name;
      this.editSubjectDetails.teacher_id = itemData.teacher_id;
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
      this.closeEdit();
    },

    deleteData(index) {
      this.subjects.splice(index, 1);
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
  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    },
  },
};
</script>