<template>
  <div>
    <bread-crumb :item="items" page_name="All Sections"></bread-crumb>
    <br />
    <br />
    <div>
      <v-row>
        <v-container>
          <div class="add_btn">
            <!-- Dialog -->
            <v-dialog v-model="actionDialog" persistent max-width="300px">
              <section-dialog :type="addOrEdit.name">
                <template v-slot:input-field>
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
                </template>
                <template v-slot:actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="loading"
                    color="error darken-1"
                    @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn
                    :loading="loading"
                    :disabled="hasAnyErors"
                    color="blue darken-1"
                    @click="addSection(addOrEdit.name)"
                    >Save</v-btn
                  >
                </template>
              </section-dialog>
            </v-dialog>
          </div>
          <div>
            <v-card>
              <v-card class="table-header" color="#2e856e">
                <v-card-title class="text-center justify-center">
                  <div class="display-2 font-weight-light"></div>
                </v-card-title>
                <v-container>
                  <v-tabs
                    v-model="levelTab"
                    fixed-tabs
                    background-color="#2e856e"
                    color="white"
                    show-arrows
                  >
                    <v-tab
                      v-for="(item, index) in ['Junior High', 'Senior High']"
                      :key="index"
                      >{{ item }}</v-tab
                    >
                  </v-tabs>
                </v-container>
                <v-container v-if="levelTab == 0">
                  <v-tabs
                    v-model="tab1"
                    fixed-tabs
                    background-color="#2e856e"
                    color="primary darken-2"
                    show-arrows
                  >
                    <v-tab
                      v-for="item in junior_high"
                      :key="item.text"
                      @click="selectedJHS(item.text)"
                      >{{ item.text }}</v-tab
                    >
                  </v-tabs>
                </v-container>
                <v-container v-else>
                  <v-tabs
                    v-model="tab2"
                    fixed-tabs
                    background-color="#2e856e"
                    color="black"
                    show-arrows
                  >
                    <v-tab
                      v-for="(item, index) in senior_high"
                      :key="index"
                      @click="selectedSHS(item.text)"
                      >{{ item.text }}</v-tab
                    >
                  </v-tabs>
                </v-container>
              </v-card>
              <v-tabs-items v-model="levelTab">
                <v-tab-item
                  v-for="(item, index) in ['Junior High', 'Senior High']"
                  :key="index"
                >
                  <div v-if="levelTab == 0">
                    <div>
                      <v-tabs-items v-model="tab1">
                        <v-tab-item
                          v-for="(item, index) in junior_high"
                          :key="index"
                        >
                          <v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              small
                              dark
                              @click="open(item.text)"
                            >
                              <v-icon>mdi-plus</v-icon>Add Section
                            </v-btn>
                          </v-card-title>
                          <v-row dense>
                            <v-col
                              v-for="(dta, index) in item.content"
                              :key="index"
                              cols="12"
                              sm="6"
                              md="6"
                              lg="4"
                            >
                              <sections-card
                                :section="dta.name"
                                :capacity="dta.capacity"
                                :total_students="dta.total_students"
                                :teacher="dta.teacher_id"
                                :progress_color="'#006a4e'"
                                class="section_card"
                              >
                                <template v-slot:edit>
                                  <v-btn
                                    @click="edit(dta)"
                                    outlined
                                    color="#006a4e"
                                  >
                                    edit section
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                              </sections-card>
                              <!-- <v-card-text>
                            <v-icon @click="juniorRemove(dta.id)"
                              color="red">mdi-delete</v-icon
                            >
                          </v-card-text> -->
                            </v-col>
                            <v-card-title
                              class="text-center justify-center py-6"
                            >
                              <h1
                                class="font-weight-bold display-1 basil--text"
                                v-if="item.content.length == 0"
                              >
                                No {{ item.text }} Sections created yet.
                              </h1>
                            </v-card-title>
                          </v-row>
                        </v-tab-item>
                      </v-tabs-items>
                    </div>
                  </div>

                  <!-- Else -->
                  <div v-else>
                    <v-tabs-items v-model="tab2">
                      <v-tab-item
                        v-for="(item, index) in senior_high"
                        :key="index"
                      >
                        <v-card-title>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            small
                            dark
                            @click="open(item.text)"
                          >
                            <v-icon>mdi-plus</v-icon>Add Section
                          </v-btn>
                        </v-card-title>
                        <!-- <v-container> -->
                        <v-row dense>
                          <v-col
                            v-for="(i, index) in item.content"
                            :key="index"
                            cols="12"
                            sm="6"
                            md="6"
                            lg="4"
                          >
                            <sections-card
                              :section="i.name"
                              :capacity="i.capacity"
                              :total_students="i.total_students"
                              :teacher="i.teacher_id"
                              class="section_card"
                            >
                              <template v-slot:edit>
                                <v-btn
                                  @click="editSection(i)"
                                  outlined
                                  color="primary"
                                >
                                  edit section
                                  <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                              </template>
                            </sections-card>
                          </v-col>
                          <v-col>
                            <v-card-title
                              class="text-center justify-center py-6"
                              v-if="item.content.length == 0"
                            >
                              <h1
                                class="font-weight-bold display-1 basil--text"
                              >
                                No {{ item.text }} Sections created yet.
                              </h1>
                            </v-card-title>
                          </v-col>
                        </v-row>
                        <!-- </v-container> -->
                      </v-tab-item>
                    </v-tabs-items>
                  </div>
                  <!-- End of else -->
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </div>
        </v-container>
      </v-row>
    </div>
  </div>
</template>

<script>
// import { EventBus } from "../bus/bus.js";
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
    SectionsCard: () => import("@/layout/SectionsCard.vue"),
    SectionDialog: () => import("@/layout/SectionDialog.vue"),
  },
  data: () => ({
    actionDialog: false,
    edit: null,
    loading: false,
    state: null,
    items: [
      { text: "Home", disabled: false, href: "/admin" },
      { text: "Sections", disabled: true, href: "admin/all_sections" },
    ],
    tab1: null,
    tab2: null,
    levelTab: null,
    errors: {},
    Section: {
      id: null,
      section: null,
      capacity: null,
      teacher: null,
    },
    junior_high: [
      {
        text: "Grade 7",
        content: [],
      },
      { text: "Grade 8", content: [] },
      { text: "Grade 9", content: [] },
      { text: "Grade 10", content: [] },
    ],
    senior_high: [
      { text: "Grade 11", content: [] },
      { text: "Grade 12", content: [] },
    ],
    allsections: [],
    teachers: [],
    addOrEdit: { name: "Add Grade 7" },
  }),
  created() {
    //Getting all teachers
    this.displayAllsection(this.addOrEdit.name, this.addOrEdit.name);

    this.$store
      .dispatch("allTeacher")
      .then(() => {
        this.$store.getters.allTeacher.forEach((element) => {
          this.teachers.push({ id: element.id, teacher: element.name });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },

  methods: {
    displayAllsection(juniors, seniors) {
      this.$axios
        .get("allGradeLevelSections")
        .then((response) => {
          this.allsections = response.data.sections;
          if (juniors != null && seniors != null) {
            this.junior_high.forEach((junior) => {
              if (junior.text.split(" ")[1] == juniors.split(" ")[2]) {
                junior.content = this.allsections.filter(function (val) {
                  return val.gradelevel.grade_level == juniors.split(" ")[2];
                });
              }
            });
            this.senior_high.forEach((senior) => {
              if (senior.text.split(" ")[1] == seniors.split(" ")[2]) {
                senior.content = this.allsections.filter(function (val) {
                  return val.gradelevel.grade_level == seniors.split(" ")[2];
                });
              }
            });
          } else if (juniors != null && seniors == null) {
            this.junior_high.forEach((junior) => {
              if (junior.text.split(" ")[1] == juniors.split(" ")[2]) {
                junior.content = this.allsections.filter(function (val) {
                  return val.gradelevel.grade_level == juniors.split(" ")[2];
                });
              }
            });
          } else {
            this.senior_high.forEach((senior) => {
              if (senior.text.split(" ")[1] == seniors.split(" ")[1]) {
                senior.content = this.allsections.filter(function (val) {
                  return val.gradelevel.grade_level == seniors.split(" ")[1];
                });
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //Select and Getting The Sections For The Selected Grade Level In Junior High School
    selectedJHS(item) {
      this.junior_high.forEach((junior) => {
        if (junior.text.split(" ")[1] == item.split(" ")[1]) {
          junior.content = this.allsections.filter(function (val) {
            return val.gradelevel.grade_level == item.split(" ")[1];
          });
        }
      });
    },

    //Selected Senior High School Section In V-For
    selectedSHS(value) {
      this.addOrEdit.name;
      this.senior_high.forEach((senior) => {
        if (senior.text.split(" ")[1] == value.split(" ")[1]) {
          senior.content = this.allsections.filter(function (val) {
            return val.gradelevel.grade_level == value.split(" ")[1];
          });
        }
      });
    },
    //Method For Opening Dialog
    open(grade) {
      this.addOrEdit.name = "Add " + grade;
      this.actionDialog = true;
      this.edit = false;
    },

    //Close The Modal IN Junior High School When Cancel is click
    close() {
      this.Section.section = null;
      this.Section.capacity = null;
      this.Section.teacher = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
      this.actionDialog = false;
    },

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
              this.displayAllsection(grades, null);
              this.showResponse("Success", response.data.message, "success");
              this.loading = false;
              this.actionDialog = false;
              console.log(response);
            } else {
              let text =
                response.data.teacher +
                " was already assigned to section " +
                response.data.failed +
                ".";
              this.showResponse("Ooops...", text, 'info');
              this.loading = false;
            }
          })
          .catch((error) => {
            this.loading = false
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
              this.actionDialog = false;
              this.displayAllsection(grades, null);
              this.clear();
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
                          this.actionDialog = false;
                          this.clear();
                          this.displayAllsection(grades, null);
                        } else {
                          let text = "Not successfully updated!";
                          this.showResponse("Not Updated!", text, "error");
                          this.actionDialog = false;
                          this.displayAllsection(grades, null);
                          this.clear();
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        this.clear();
                        this.actionDialog = false;
                      });
                  }
                });
            }
          })
          .catch((error) => {
            this.actionDialog = false;
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
    clear() {
      this.Section.id = null;
      this.Section.section = null;
      this.Section.capacity = null;
      this.Section.teacher = null;
    },

    //Method For Editing The Section
    async editSection(data) {
      this.addOrEdit.name = "Edit Grade " + data.gradelevel.grade_level;
      this.Section.teacher = data.gradelevel_id;
      this.edit = true;
      this.actionDialog = true;
      this.Section.section = data.name;
      this.Section.capacity = data.capacity;
      this.Section.id = data.id;
    },
    //Method For Removing The Section In Junior High Category
    juniorRemove(sec) {
      this.$axios
        .get("delAnySection/" + sec)
        .then((response) => {
          if (response.data.message) {
            if (response.data.section.split(" ")[1] < 11) {
              this.displayAllsection(response.data.section, null);
              alert("Successfully Deleted!");
            } else {
              this.displayAllsection(null, response.data.section);
              alert("Successfully Deleted!");
            }
          } else {
            alert("Not successfully deleted!");
          }
        })
        .catch((error) => {
          console.log(error);
        });
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

