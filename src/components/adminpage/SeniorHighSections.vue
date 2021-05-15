<template>
  <div>
    <bread-crumb :item="items" page_name="Senior High Sections"></bread-crumb>
    <br /><br />

    <v-container>
      <v-tabs
        v-model="tab"
        fixed-tabs
        background-color="#2e856e"
        color="black"
        show-arrows
      >
        <v-tab
          v-for="(item, index) in senior_high"
          :key="index"
          @click="selected(item.text)"
          >{{ item.text }}</v-tab
        >
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(item, index) in senior_high" :key="index">
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
              class="add-btn"
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
                :teacher="i.adviser == null ? '' : i.adviser.teacher_name"
                class="section_card"
              >
                <template v-slot:btns>
                  <v-btn @click="viewSchedules(i.id)" color="primary" small
                    >schedules</v-btn
                  >
                  <v-btn @click="editSection(i)" outlined color="primary" small>
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
    </v-container>
    <v-container>
      <v-row justify="center" class="add_btn">
        <v-overlay :value="overlay">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
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
        <div v-if="viewSubject == 'true'">
          <v-dialog v-model="addSubject" persistent max-width="800px">
            <add-subject-dialog
              :gradeLevel="addOrEdit.name.split(' ')[2]"
              :subjectsInGradeLevel="subjects"
            ></add-subject-dialog>
          </v-dialog>
        </div>
        <div v-if="viewScheds">
          <v-dialog
            v-model="openSched"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <section-schedules
              :gradelevel="Number(addOrEdit.name.split(' ')[2])"
              :section_id="sectionId"
            ></section-schedules>
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
    BreadCrumb: () =>
      import(/* webpackChunkName: "BreadCrumb" */ "@/layout/BreadCrumb.vue"),
    SectionsCard: () =>
      import(/* webpackChunkName: "SectionsCard"*/ "@/layout/SectionsCard.vue"),
    SectionDialog: () =>
      import(
        /* webpackChunkName: "SectionDialog" */ "@/layout/SectionDialog.vue"
      ),
    AddSubjectDialog: () =>
      import(
        /* webpackChunkName: "AddSubjectDialog" */ "@/layout/AddSubjectDialog.vue"
      ),
    SectionSchedules: () =>
      import(
        /* webpackChunkName: "SectionSchedules" */ "@/layout/SectionSchedules.vue"
      ),
  },
  data() {
    return {
      overlay: false,
      viewSubject: "false",
      addSubject: false,
      actionDialog: false,
      viewScheds: false,
      openSched: false,
      edit: false,
      tab: null,
      sectionId: null,
      items: [
        { text: "Home", disabled: false, href: "/admin" },
        { text: "Sections", disabled: true },
        { text: "Senior High Sections", disabled: true },
      ],
      senior_high: [
        { text: "Grade 11", content: [] },
        { text: "Grade 12", content: [] },
      ],
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
      subjects: [],
      gradelevel: "11",
      addOrEdit: { name: "Add Grade 11" },
    };
  },
  created() {
    this.allsections = this.$store.getters.allsections;
    this.displayAllsection(this.gradelevel);

    EventBus.$on("closeModal", () => {
      this.close();
    });

    EventBus.$on("displayAllsection", (data) => {
      this.displayAllsection(data.data1.split(" ")[2]);
    });

    EventBus.$on("closeSubjectModal", (data) => {
      this.addSubject = data;
      this.viewSubject = false;
    });

    EventBus.$on("closeSectionScheduleModal", () => {
      this.viewScheds = false;
    });
  },
  methods: {
    displayAllsection(gradelevel) {
      let adminLevel = null;
      if (this.$user.user_type == "teacher_admin") {
        let temp = this.$user.username.split("_");
        adminLevel = temp[1];
      }
      this.$axios
        // .get("allGradeLevelSections")
        .get("allSections/" + adminLevel)
        .then((response) => {
          this.allsections = response.data.sections;
          this.senior_high.forEach((senior) => {
            if (senior.text.split(" ")[1] == gradelevel) {
              senior.content = this.allsections.filter(function (val) {
                return val.gradelevel.grade_level == gradelevel;
              });
            }
          });
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "Ooops...",
            text: "An error encountered!",
          });
        });
    },
    viewSchedules(sectionId) {
      this.viewScheds = true;
      this.openSched = true;
      this.sectionId = sectionId;
    },
    selected(item) {
      this.addOrEdit.name = "Add " + item;
      this.senior_high.forEach((senior) => {
        if (senior.text.split(" ")[1] == item.split(" ")[1]) {
          senior.content = this.allsections.filter(function (val) {
            return val.gradelevel.grade_level == item.split(" ")[1];
          });
        }
      });
    },
    retrieveSubjects() {
      this.subjects = [];
      this.overlay = true;
      this.$axios
        .get(`gradelevelSubject/${Number(this.addOrEdit.name.split(" ")[2])}`)
        .then((response) => {
          this.subjects = response.data.subject;
          this.viewSubject = "true";
          this.addSubject = true;
          this.overlay = false;
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

    //Method For Editing The Section
    async editSection(data) {
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
  },
};
</script>