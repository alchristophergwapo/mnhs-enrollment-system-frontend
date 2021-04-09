<template>
  <div>
    <bread-crumb :item="items" page_name="All Sections"></bread-crumb>
    <br />
    <br />
    <div>
      <v-row>
        <v-container>
          <v-row justify="center" class="add_btn">
            <!-- Dialog for add and edit section-->
            <v-dialog
              v-model="actionDialog"
              persistent
              max-width="500px"
              transition="dialog-bottom-transition"
            >
              <section-dialog
                :type="addOrEdit.name"
                :Section="Section"
                :edit="edit"
              >
              </section-dialog>
            </v-dialog>
            <v-dialog v-model="addSubject" persistent max-width="700px">
              <add-subject-dialog
                :gradeLevel="addOrEdit.name.split(' ')[2]"
                :subjectsInGradeLevel="subjects"
              ></add-subject-dialog>
            </v-dialog>
            <v-dialog
              v-model="viewScheds"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <section-schedules
                :gradelevel="Number(addOrEdit.name.split(' ')[2])"
                :schedules="schedules"
                :section_id="sectionId"
              ></section-schedules>
            </v-dialog>
            <v-overlay :value="overlay">
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
          </v-row>
          <div>
            <!-- <v-card> -->
            <v-card color="#2e856e">
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
            <v-tabs-items v-model="levelTab" style="background-color: '#eee'">
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
                            color="secondary"
                            small
                            dark
                            @click="retrieveSubjects()"
                            >subject(s)</v-btn
                          >
                          <v-btn
                            color="primary"
                            small
                            dark
                            @click="open(item.text)"
                            style="margin-left: 10px"
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
                              :teacher="
                                dta.adviser == null
                                  ? ''
                                  : dta.adviser.teacher_name
                              "
                              :progress_color="'#006a4e'"
                              class="section_card"
                            >
                              <template v-slot:btns>
                                <v-speed-dial
                                  v-model="openAction"
                                  :direction="'top'"
                                  :open-on-hover="true"
                                  :transition="'slide-y-reverse-transition'"
                                >
                                  <template v-slot:activator>
                                    <v-btn
                                      v-model="openAction"
                                      color="blue darken-2"
                                      dark
                                      fab
                                    >
                                      <v-icon v-if="openAction">
                                        mdi-close
                                      </v-icon>
                                      <v-icon v-else>
                                        mdi-account-circle
                                      </v-icon>
                                    </v-btn>
                                  </template>
                                  <v-btn fab dark small color="green">
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                  <v-btn fab dark small color="indigo">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                  <v-btn fab dark small color="red">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </v-speed-dial>
                                <v-btn
                                  @click="viewSchedules(dta.id)"
                                  color="primary"
                                  small
                                >
                                  schedules
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                  @click="editSection(dta)"
                                  outlined
                                  color="#006a4e"
                                  small
                                >
                                  edit section
                                  <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                              </template>
                            </sections-card>
                          </v-col>
                          <v-card-title class="text-center justify-center py-6">
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
                            :teacher="
                              i.adviser == null ? '' : i.adviser.teacher_name
                            "
                            class="section_card"
                          >
                            <template v-slot:btns>
                              <v-btn
                                @click="viewSchedules(i.id)"
                                color="primary"
                                small
                                >schedules</v-btn
                              >
                              <v-btn
                                @click="editSection(i)"
                                outlined
                                color="primary"
                                small
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
                            <h1 class="font-weight-bold display-1 basil--text">
                              No {{ item.text }} Sections created yet.
                            </h1>
                          </v-card-title>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                  </v-tabs-items>
                </div>
                <!-- End of else -->
              </v-tab-item>
            </v-tabs-items>
            <!-- </v-card> -->
          </div>
        </v-container>
      </v-row>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../bus/bus";
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
    SectionsCard: () => import("@/layout/SectionsCard.vue"),
    SectionDialog: () => import("@/layout/SectionDialog.vue"),
    AddSubjectDialog: () => import("@/layout/AddSubjectDialog.vue"),
    SectionSchedules: () => import("@/layout/SectionSchedules.vue"),
  },
  data: () => ({
    actionDialog: false,
    addSubject: false,
    viewScheds: false,
    overlay: false,
    openAction: false,
    hover: false,
    left: false,
    edit: false,
    state: null,
    sectionId: null,
    items: [
      { text: "Home", disabled: false, href: "/admin" },
      { text: "Sections", disabled: true, href: "admin/all_sections" },
    ],
    tab1: null,
    tab2: null,
    levelTab: null,
    Section: {
      id: null,
      section: null,
      capacity: null,
      teacher: null,
      teacher_id: null,
    },
    sched: {
      Time: null,
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
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
    schedules: [],
    subjects: [],
    addOrEdit: { name: "Add Grade 7" },
  }),
  created() {
    //Getting all teachers
    this.displayAllsection(this.addOrEdit.name, this.addOrEdit.name);

    EventBus.$on("closeModal", () => {
      this.close();
    });

    EventBus.$on("displayAllsection", (data) => {
      this.displayAllsection(data.data1, data.data2);
    });

    EventBus.$on("closeSubjectModal", (data) => {
      this.addSubject = data;
    });

    EventBus.$on("closeSectionScheduleModal", () => {
      this.viewScheds = false;
    });
  },

  methods: {
    displayAllsection(juniors, seniors) {
      this.$axios
        // .get("allGradeLevelSections")
        .get("allSections")
        .then((response) => {
          this.allsections = response.data.sections;
          //console.log(this.allsections);
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
    viewSchedules(sectionId) {
      this.overlay = true;
      this.schedules = [];
      this.sectionId = sectionId;
      this.$axios.get(`classSchedules/${sectionId}`).then((response) => {
        this.viewScheds = true;
        this.overlay = false;
        const schedulesOnDB = response.data.schedules;
        console.log(schedulesOnDB);

        let count = 0;
        let friday = false;
        for (const index in schedulesOnDB) {
          if (schedulesOnDB.hasOwnProperty.call(schedulesOnDB, index)) {
            const element = schedulesOnDB[index];
            this.sched.Time = `${element.start_time}-${element.end_time}`;

            this.sched[element.day] = element;
            if (element.day == "Friday") {
              friday = true;
            }
            count += 1;
          }
          if (count == 5 && friday) {
            this.schedules.push(this.sched);
            this.sched = {
              Time: null,
              Monday: null,
              Tuesday: null,
              Wednesday: null,
              Thursday: null,
              Friday: null,
            };
          }
        }
      });
    },

    retrieveSubjects() {
      this.subjects = [];
      console.log(this.subjects);
      this.overlay = true;
      this.$axios
        .get(`gradelevelSubject/${Number(this.addOrEdit.name.split(" ")[2])}`)
        .then((response) => {
          this.subjects = response.data.subjects;
          this.addSubject = true;
          this.overlay = false;
        });
    },

    //Select and Getting The Sections For The Selected Grade Level In Junior High School
    selectedJHS(item) {
      this.addOrEdit.name = "Add " + item;
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
      console.log(grade);
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

    //Method For Editing The Section
    async editSection(data) {
      console.log(data);
      this.addOrEdit.name = "Edit Grade " + data.gradelevel.grade_level;
      this.edit = true;
      this.actionDialog = true;
      if (data.adviser != null) {
        this.Section.teacher = data.adviser.teacher_name;
      }
      this.Section.teacher_id = data.teacher_id;
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
  },
};
</script>

