<template>
  <div>
    <bread-crumb
      :item="items"
      :page-name="pageName"
    />
    <br><br>
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
        >
          {{ item.text }}
        </v-tab>
      </v-tabs>
      <v-container>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="(item, jIndex) in junior_high"
            :key="jIndex"
          >
            <v-card-title>
              <v-spacer />
              <v-btn
                color="secondary"
                small
                dark
                @click="retrieveSubjects()"
              >
                subject(s)
              </v-btn>
              <v-btn
                color="primary"
                small
                dark
                style="margin-left: 10px"
                class="add-btn"
                @click="open(item.text)"
              >
                <v-icon>mdi-plus</v-icon>Add Section
              </v-btn>
            </v-card-title>
            <v-row dense>
              <v-col
                v-for="(dta, cIndex) in item.content"
                :key="cIndex"
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
                        <span
                          v-if="$vuetify.breakpoint.mdAndUp"
                        >schedules</span>
                        <v-icon v-else>
                          mdi-table-clock
                        </v-icon>
                      </v-btn>
                      <v-btn
                        dark
                        small
                        color="#006a4e"
                        @click="editSection(dta)"
                      >
                        <span
                          v-if="$vuetify.breakpoint.mdAndUp"
                        >edit section</span>
                        <v-icon v-else>
                          mdi-pencil
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>
                </sections-card>
              </v-col>
              <v-card-title class="text-center justify-center py-6">
                <h1
                  v-if="item.content.length == 0"
                  class="font-weight-bold display-1 basil--text"
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
      <div
        v-for="(item, j2index) in junior_high"
        :key="j2index"
      >
        <v-card-title>
          <v-spacer />
          <v-btn
            color="secondary"
            small
            dark
            @click="retrieveSubjects()"
          >
            subject(s)
          </v-btn>
          <v-btn
            color="primary"
            small
            dark
            style="margin-left: 10px"
            class="add-btn"
            @click="open(item.text)"
          >
            <v-icon>mdi-plus</v-icon>Add Section
          </v-btn>
        </v-card-title>
        <v-row dense>
          <v-col
            v-for="(dta, c2index) in item.content"
            :key="c2index"
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
                <v-btn
                  dark
                  small
                  color="green"
                  @click="viewSchedules(dta.id)"
                >
                  schedules
                </v-btn>
                <v-btn
                  dark
                  small
                  color="#006a4e"
                  @click="editSection(dta)"
                >
                  edit section
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </SectionsCard>
          </v-col>
          <v-card-title class="text-center justify-center py-6">
            <h1
              v-if="item.content.length == 0"
              class="font-weight-bold display-1 basil--text"
            >
              No {{ item.text }} Sections created yet.
            </h1>
          </v-card-title>
        </v-row>
      </div>
    </div>
    <v-container>
      <v-row
        justify="center"
        class="add_btn"
      >
        <v-dialog
          v-model="actionDialog"
          persistent
          max-width="500px"
          transition="dialog-bottom-transition"
        >
          <section-dialog
            :type="addOrEdit.name"
            :section-data-props="sectionData"
            :edit="edit"
          />
        </v-dialog>
        <div v-if="viewSubject == 'true'">
          <v-dialog
            v-model="addSubject"
            persistent
            max-width="800px"
          >
            <add-subject-dialog
              :grade-level="addOrEdit.name.split(' ')[2]"
              :subjects-in-grade-level="gradelevelSubjects"
            />
          </v-dialog>
        </div>
        <div v-if="viewScheds">
          <v-dialog
            v-model="openSched"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <SectionSchedules
              :gradelevel="Number(addOrEdit.name.split(' ')[2])"
              :section_id="sectionId"
            />
          </v-dialog>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { EventBus } from "../../bus/bus";
import BreadCrumb from /* webpackChunkName: "BreadCrumb" */ "@/layout/BreadCrumb.vue";
import SectionsCard from /* webpackChunkName: "SectionsCard" */ "@/layout/SectionsCard.vue";
import SectionDialog from /* webpackChunkName: "SectionDialog" */ "@/layout/SectionDialog.vue";
import AddSubjectDialog from /* webpackChunkName: "AddSubjectDialog" */ "@/layout/AddSubjectDialog.vue";
import SectionSchedules from /* webpackChunkName: "SectionSchedules" */ "@/layout/SectionSchedules.vue";
export default {
  components: {
    BreadCrumb,
    SectionsCard,
    SectionDialog,
    AddSubjectDialog,
    SectionSchedules,
  },
  data() {
    return {
      overlay: false,
      viewSubject: "false",
      viewScheds: false,
      addSubject: false,
      actionDialog: false,
      openSched: false,
      edit: false,
      admin: false,
      tab: null,
      sectionId: null,
      pageName: null,
      items: [
        { text: "Home", disabled: false, href: "/admin" },
        { text: "Sections", disabled: true },
        { text: "Junior High Sections", disabled: true },
      ],
      junior_high: [],
      sectionData: {
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
      this.pageName = "Junior High Sections";
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
      this.pageName = "Grade " + adminLevel + " Sections";
      this.items[2].text = this.pageName;

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

    EventBus.$on("save", () => {
      this.viewSubject = false;
    });

    EventBus.$on("displayAllsection", (data) => {
      this.displayAllsection(data.data1.split(" ")[2]);
    });

    EventBus.$on("closeSubjectModal", (data) => {
      this.addSubject = data;
      this.viewSubject = false;
    });

    EventBus.$on("closeSectionScheduleModal", () => {
      this.openSched = false;
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
          this.junior_high.forEach((junior) => {
            if (junior.text.split(" ")[1] == gradelevel) {
              junior.content = this.allsections.filter(function(val) {
                return val.gradelevel.grade_level == gradelevel;
              });
            }
          });
        })
        .catch(() => {
          this.$swal.filter({
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
      this.viewScheds = false;
      this.junior_high.forEach((junior) => {
        if (junior.text.split(" ")[1] == item.split(" ")[1]) {
          junior.content = this.allsections.filter(function(val) {
            return val.gradelevel.grade_level == item.split(" ")[1];
          });
        }
      });
    },
    retrieveSubjects() {
      this.overlay = true;
      this.$axios
        .get(`gradelevelSubject/${Number(this.addOrEdit.name.split(" ")[2])}`)
        .then((response) => {
          this.gradelevelSubjects = response.data.subject;
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
      this.sectionData.id = null;
      this.sectionData.section = null;
      this.sectionData.capacity = null;
      this.sectionData.teacher = null;
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
      if (data.adviser) {
        this.sectionData.teacher = data.adviser.teacher_name;
      }
      this.sectionData.teacher_id = data.teacher_id;
      this.sectionData.section = data.name;
      this.sectionData.capacity = data.capacity;
      this.sectionData.id = data.id;
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
