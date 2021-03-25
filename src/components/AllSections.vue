<template>
  <div>
    <bread-crumb :item="items" page_name="All Sections"></bread-crumb>
    <br />
    <br />
    <div>
      <v-row>
        <v-container>
          <!-- ------- Dialog For Junior High School Category ----------------------------------------------------- -->
          <div class="add_btn">
            <v-dialog v-model="juniordialog" persistent max-width="300px">
              <v-card>
                <v-card-title class="headlineSection">
                  <span :type="'Add'">{{juniorSection.name}} Sections</span>
                </v-card-title>
                <v-card-text>
                  <v-container fluid>
                    <v-text-field
                      label="Section name"
                      v-model="Junior.section"
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
                      v-model="Junior.capacity"
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
                        v-model="Junior.teacher"
                        :items="teachers"
                        label="Assigned Teacher"
                      ></v-select>
                    </div>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="loading"
                    color="error darken-1"
                    @click="closeJunior"
                    >Cancel</v-btn
                  >
                  <v-btn
                    :loading="loading"
                    color="blue darken-1"
                    :disabled="hasAnyErors"
                    @click="addJunior(juniorSection.name)"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Dialog for senior high -->
            <v-dialog v-model="seniordialog" persistent max-width="300px">
              <section-dialog :type="sectionSenior.name" >
                <template v-slot:input-field>
                  <v-text-field
                    label="Section name"
                    v-model="Senior.section"
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
                    v-model="Senior.capacity"
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
                      v-model="Senior.teacher"
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
                    @click="closeSenior"
                    >Cancel</v-btn
                  >
                  <v-btn
                    :loading="loading"
                    :disabled="hasAnyErors"
                    color="blue darken-1"
                    @click="addSenior(sectionSenior.name)"
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
                              @click="openJunior(item.text)"
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
                              >
                                <template v-slot:edit>
                                  <v-btn
                                  
                                    @click="juniorEdit(dta)"
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
                          <v-btn color="primary" small dark @click="openSenior(item.text)">
                            <v-icon>mdi-plus</v-icon>Add Section
                          </v-btn>
                        </v-card-title>
                        <v-container>
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
                              >
                                <template v-slot:edit>
                                  <v-btn
                                    @click="seniorEdit(i)"
                                    outlined
                                    color="primary"
                                  >
                                    edit section
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                              </sections-card>
                                         <!-- <v-card-text>
                            <v-icon @click="juniorRemove(i.id)"
                              color="red">mdi-delete</v-icon
                            >
                          </v-card-text> -->
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
                        </v-container>
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
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
    SectionsCard: () => import("@/layout/SectionsCard.vue"),
    SectionDialog: () => import("@/layout/SectionDialog.vue"),
  },
  data: () => ({
    juniordialog: false,
    seniordialog: false,
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
    juniorSection: {
      name: "Add Grade 7",
    },
    sectionSenior: {
      name: "Add Grade 11",
    },

    Junior: {
      id: null,
      section: null,
      capacity: null,
      teacher: null,
    },
    Senior: {
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
  }),
  created() {
    //Getting all teachers
     this.$store.dispatch("allTeacher").then(() => {
           this.$store.getters.allTeacher.forEach(element =>{
                  this.teachers.push({id:element.id,teacher:element.name});
             })
         })
          .catch((error) => {
            console.log(error);        
          });

  this.displayAllsection(this.juniorSection.name,this.sectionSenior.name);

  },

  methods:{
       displayAllsection(juniors,seniors){
      this.$axios
      .get("allGradeLevelSections")
      .then((response) =>{
        console.log(response.data.sections);
        this.allsections=response.data.sections;
        if(juniors!=null && seniors!=null){
               this.junior_high.forEach((junior) => {
               if (junior.text.split(" ")[1]==juniors.split(" ")[1]) {
                   junior.content =this.allsections.filter(function (val){ return val.gradelevel.grade_level == juniors.split(" ")[1];});
                  }
               });
        this.senior_high.forEach((senior) =>{
             if (senior.text.split(" ")[1] == seniors.split(" ")[1]){
                senior.content =this.allsections.filter(function (val){ return val.gradelevel.grade_level == seniors.split(" ")[1];});
              }
            });
          }
       else if(juniors!=null && seniors==null){
             this.junior_high.forEach((junior) => {
              if (junior.text.split(" ")[1]==juniors.split(" ")[1]) {
                   junior.content =this.allsections.filter(function (val){ return val.gradelevel.grade_level == juniors.split(" ")[1];});
                  }
              });
       }
     else{
          this.senior_high.forEach((senior) =>{
             if (senior.text.split(" ")[1] == seniors.split(" ")[1]){
                senior.content =this.allsections.filter(function (val){ return val.gradelevel.grade_level == seniors.split(" ")[1];});
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
      this.sectionSenior.name;
      this.senior_high.forEach((senior) => {
        if (senior.text.split(" ")[1] == value.split(" ")[1]) {
          senior.content = this.allsections.filter(function (val) {
            return val.gradelevel.grade_level == value.split(" ")[1];
          });
        }
      });
    },
    //Method For Opening The Junior High School Dialog
    openJunior(grade) {
      this.juniorSection.name="Add "+grade;
      this.juniordialog = true;
      this.edit = false;
    },
    //Method For Opening The Dialog Of Senior High School
    openSenior(grade) {
      this.sectionSenior.name="Add "+grade;
      this.seniordialog = true;
      this.edit = false;
    },
    //Close The Modal IN Junior High School When Cancel is click
    closeJunior() {
      this.Junior.section = null;
      this.Junior.capacity = null;
      this.Junior.teacher = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
      this.juniordialog = false;
    },

    //Close The Modal IN Senior High School When Cancel is click
    closeSenior() {
      this.Senior.section = null;
      this.Senior.capacity = null;
      this.Senior.teacher = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
      this.seniordialog = false;
    },
    //Method For Adding A Section In Junior High School Category
    async addJunior(grades) {
      if (this.edit == false) {
        console.log("Teacher:" + this.Junior.teacher);
        this.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        this.loading = false;
        this.$axios
          .post("addSection",{
            grade: grades.split(" ")[1],
            name: this.Junior.section,
            capacity: this.Junior.capacity,
            total_students: 0,
            teacher: this.Junior.teacher,
          })
          .then((response) => {
            if (response.data.message) {
              (this.Junior.id = null),
                (this.Junior.section = null),
                (this.Junior.capacity = null),
                (this.Junior.teacher = null);
              this.juniordialog = false;
              this.displayAllsection(grades, null);
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Sections successfully added.",
              });
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text:
                  response.data.teacher +
                  " was already assigned to section " +
                  response.data.failed +
                  ".",
              });
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              console.log(error);
            }
          });
      } else {
        //update
        console.log("updateteacher:" + this.Junior.teacher);
        this.$axios
          .post(
            "updateSection/"+this.Junior.id,
            {
              name: this.Junior.section,
              capacity: this.Junior.capacity,
              teacher:this.Junior.teacher
            }
          )
          .then((response) => {
            if (response.data.message) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Sections successfully updated.",
              });
              this.juniordialog = false;
              this.displayAllsection(grades, null);
              this.Junior.section = null
              this.Junior.capacity= null
              this.Junior.teacher = null
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
                        updateId: this.Junior.id,
                        name: this.Junior.section,
                        capacity: this.Junior.capacity,
                        teacher: this.Junior.teacher,
                      })
                      .then((response) => {
                        if (response.data.newTeacher) {
                          this.$swal.fire({
                            title: "Updated!",
                            text: response.data.newTeacher,
                            icon: "success",
                          });
                          (this.Junior.id = null),
                            (this.Junior.section = null),
                            (this.Junior.capacity = null),
                            (this.Junior.teacher = null);
                          this.juniordialog = false;
                          this.displayAllsection(grades, null);
                        } else {
                          this.$swal.fire({
                            title: "NotUpdated!",
                            text: "Not successfully updated!",
                            icon: "error",
                          });
                          this.juniordialog = false;
                          this.displayAllsection(grades, null);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                });
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              console.log(error);
            }
          });
      }
    },
    //Method For Editing The Section In Junior High
    async juniorEdit(item) {
      this.juniorSection.name="Edit Grade "+item.gradelevel.grade_level;
      this.Junior.teacher = item.gradelevel_id;
      this.edit = true;
      this.juniordialog = true;
      this.Junior.section = item.name;
      this.Junior.capacity = item.capacity;
      this.Junior.id = item.id;
    },
    //Method For Editing The Section In Senior High School
    async seniorEdit(data) {
      this.sectionSenior.name="Edit Grade "+data.gradelevel.grade_level;
      this.Senior.teacher = data.gradelevel_id;
      this.edit = true;
      this.seniordialog = true;
      this.Senior.section = data.name;
      this.Senior.capacity = data.capacity;
      this.Senior.id = data.id;
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
    //Methods For Adding A Section In Senior High School
    async addSenior(item) {
      if (this.edit == false) {
        console.log("Teacher:" + this.Senior.teacher);
        this.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        this.loading = false;
        this.$axios
          .post("addSection", {
            grade: item.split(" ")[1],
            name: this.Senior.section,
            capacity: this.Senior.capacity,
            total_students: 0,
            teacher: this.Senior.teacher,
          })
          .then((response) => {
            if (response.data.message) {
              (this.Senior.id = null),
                (this.Senior.section = null),
                (this.Senior.capacity = null),
                (this.Senior.teacher = null);
              this.seniordialog = false;
              this.displayAllsection(null, item);
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Sections successfully added.",
              });
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text:
                  this.Senior.teacher +
                  " was already assigned by section " +
                  response.data.failed +
                  ".",
              });
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              console.log(error);
            }
          });
      } else {
        //update
        console.log("Teacher:" + this.Senior.teacher);
        this.$axios
          .post("updateSection/" + this.Senior.id, {
            name: this.Senior.section,
            capacity: this.Senior.capacity,
            teacher: this.Senior.teacher,
          })
          .then((response) => {
            if (response.data.message) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Sections successfully updated.",
              });
              this.seniordialog = false;
              this.displayAllsection(null, item);
              this.Senior.section = null
              this.Senior.capacity= null
              this.Senior.teacher = null
              
            } else {
              this.$swal
                .fire({
                  title:
                    this.Senior.teacher +
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
                        updateId: this.Senior.id,
                        name: this.Senior.section,
                        capacity: this.Senior.capacity,
                        teacher: this.Senior.teacher,
                      })
                      .then((response) => {
                        if (response.data.newTeacher) {
                          this.$swal.fire({
                            title: "Updated!",
                            text: response.data.newTeacher,
                            icon: "success",
                          });
                          (this.Senior.id = null),
                            (this.Senior.section = null),
                            (this.Senior.capacity = null),
                            (this.Senior.teacher = null);
                          this.seniordialog = false;
                          this.displayAllsection(null, item);
                        } else {
                          this.$swal.fire({
                            title: "NotUpdated!",
                            text: "Not successfully updated!",
                            icon: "error",
                          });
                          this.seniordialog = false;
                          this.displayAllsection(null, item);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                });
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              console.log(error);
            }
          });
      }
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

