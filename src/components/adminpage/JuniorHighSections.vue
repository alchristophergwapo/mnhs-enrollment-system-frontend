<template>
  <div>
    <bread-crumb :item="items" :page_name="page_name"></bread-crumb>
    <br /><br />
    <div v-if="admin">
      <v-tabs
        v-model="tab"
        fixed-tabs
        background-color="#2e856e"
        color="black"
        show-arrows
      >
        <v-tab
          v-for="(item, index) in junior_high"
          :key="index"
          @click="selected(item.text)"
          >{{ item.text }}</v-tab
        >
      </v-tabs>
      <v-container>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, index) in junior_high" :key="index">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn color="secondary" small dark @click="retrieveSubjects()"
                >subject(s)</v-btn
              >
              <v-btn
                color="primary"
                small
                dark
                @click="open(item.text)"
                style="margin-left: 10px"
                class="add-btn"
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
                  :teacher="dta.adviser == null ? '' : dta.adviser.teacher_name"
                  :progress_color="'#006a4e'"
                  class="section_card"
                >
                  <template v-slot:btns>
                    <div class="action-btns">
                      <v-btn
                        dark
                        small
                        color="green"
                        @click="viewSchedules(dta.id)"
                      >
                        <span v-if="$vuetify.breakpoint.mdAndUp"
                          >schedules</span
                        >
                        <v-icon v-else>mdi-table-clock</v-icon>
                      </v-btn>
                      <v-btn
                        dark
                        small
                        @click="editSection(dta)"
                        color="#006a4e"
                      >
                        <span v-if="$vuetify.breakpoint.mdAndUp"
                          >edit section</span
                        >
                        <v-icon v-else>mdi-pencil</v-icon>
                      </v-btn>
                    </div>
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
      </v-container>
    </div>
    <div v-else>
      <div v-for="(item, index) in junior_high" :key="index">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="secondary" small dark @click="retrieveSubjects()"
            >subject(s)</v-btn
          >
          <v-btn
            color="primary"
            small
            dark
            @click="open(item.text)"
            style="margin-left: 10px"
            class="add-btn"
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
            <SectionsCard
              :section="dta.name"
              :capacity="dta.capacity"
              :total_students="dta.total_students"
              :teacher="dta.adviser == null ? '' : dta.adviser.teacher_name"
              :progress_color="'#006a4e'"
              class="section_card"
            >
              <template v-slot:btns>
                <v-btn dark small color="green" @click="viewSchedules(dta.id)">
                  schedules
                </v-btn>
                <v-btn dark small @click="editSection(dta)" color="#006a4e">
                  edit section
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </SectionsCard>
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
      </div>
    </div>
    <v-container>
      <v-row justify="center" class="add_btn">
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
        <div v-if="viewSubject=='true'">
        <v-dialog v-model="addSubject" persistent max-width="800px">
          <add-subject-dialog
            :gradeLevel="addOrEdit.name.split(' ')[2]"
            :subjectsInGradeLevel="gradelevelSubjects"
          ></add-subject-dialog>
        </v-dialog>
        </div>
      <div v-if="viewScheds=='true'">
        <v-dialog
          fullscreen
          v-model="openSched"
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <SectionSchedules
            :gradelevel="Number(addOrEdit.name.split(' ')[2])"
            :section_id="sectionId"
          ></SectionSchedules>
        </v-dialog>
      </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { EventBus } from "../../bus/bus";
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
    SectionsCard: () => import("@/layout/SectionsCard.vue"),
    SectionDialog: () => import("@/layout/SectionDialog.vue"),
    AddSubjectDialog: () => import("@/layout/AddSubjectDialog.vue"),
    SectionSchedules: () => import("@/layout/SectionSchedules.vue"),
  },
  data() {
    return {
      overlay: false,
      viewSubject:'false',
      addSubject: false,
      actionDialog: false,
      viewScheds:'false',
      openSched:false,
      edit: false,
      admin: false,
      tab: null,
      sectionId: null,
      page_name: null,
      items: [
        { text: "Home", disabled: false, href: "/admin" },
        { text: "Sections", disabled: true },
        { text: "Junior High Sections", disabled: true },
      ],
      junior_high: [],
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
      allsections: [],
      gradelevelSubjects: [],
      gradelevel: null,
      addOrEdit: { name: "Add Grade 7" },
    };
  },
  
  created() {
    if (this.$user.user_type == "admin") {
      this.page_name = "Junior High Sections";
      this.gradelevel = "7";
      this.admin = true;
      this.junior_high = [
        {
          text: "Grade 7",
          content: [],
        },
        { text: "Grade 8", content: [] },
        { text: "Grade 9", content: [] },
        { text: "Grade 10", content: [] },
      ];
    } else {
      this.admin = false;
      let adminLevel = null;
      let temp = this.$user.username.split("_");
      adminLevel = temp[1];
      this.gradelevel = adminLevel;
      this.page_name = "Grade " + adminLevel + " Sections";
      this.items[2].text = this.page_name;

      this.junior_high = [
        {
          text: "Grade " + adminLevel,
          content: [],
        },
      ];
    }
    this.allsections = this.$store.getters.allsections;
    this.displayAllsection(this.gradelevel);

    EventBus.$on("closeModal", () => {
      this.close();
    });

    EventBus.$on("displayAllsection", (data) => {
      console.log(data);
      this.displayAllsection(data.data1.split(" ")[2]);
    });

    EventBus.$on("closeSubjectModal", (data) => {
      this.addSubject = data;
      this.viewSubject=false;
    });

    EventBus.$on("closeSectionScheduleModal", () => {
      this.viewScheds = false;
    });
  },
  methods: {
    displayAllsection(gradelevel) {
      this.$axios
        // .get("allGradeLevelSections")
        .get("allSections")
        .then((response) => {
          this.allsections = response.data.sections;
          this.junior_high.forEach((junior) => {
            if (junior.text.split(" ")[1] == gradelevel) {
              junior.content = this.allsections.filter(function (val) {
                return val.gradelevel.grade_level == gradelevel;
              });
              // console.log(junior.content);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    viewSchedules(sectionId) {
      this.viewScheds ='true';
      this.openSched=true;
      this.sectionId = sectionId;
    },
    selected(item) {
      this.addOrEdit.name = "Add " + item;
      this.viewScheds='false';
      this.junior_high.forEach((junior) => {
        if (junior.text.split(" ")[1] == item.split(" ")[1]) {
          junior.content = this.allsections.filter(function (val) {
            return val.gradelevel.grade_level == item.split(" ")[1];
          });
        }
      });
    },
    retrieveSubjects() {
      // this.subjects = [];
      // console.log(this.subjects);
      this.overlay = true;
      this.$axios
        .get(`gradelevelSubject/${Number(this.addOrEdit.name.split(" ")[2])}`)
        .then((response) => {
          console.log(response);
          this.gradelevelSubjects = response.data.subject;
          this.viewSubject='true';
          this.addSubject = true;
          this.overlay = false;
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
      if (data.adviser) {
        this.Section.teacher = data.adviser.teacher_name;
      }
      this.Section.teacher_id = data.teacher_id;
      this.Section.section = data.name;
      this.Section.capacity = data.capacity;
      this.Section.id = data.id;
    },
  },
};
</script>

<style lang="scss">
.action-btns {
  width: 100%;
  display: flex;

  .v-btn {
    margin: 0 3px 0 3px;
  }
}

@media (max-width: 768px) {
  .action-btns {
    display: inline;

    .v-btn {
      float: right;
    }
  }
}
</style>