<template>
  <div>
    <bread-crumb :item="items" page_name="All Sections"></bread-crumb>
    <br />
    <br />
    <div>
      <v-row>
        <v-container>
          <!--------- Dialog For Junior High School Category ----------------------------------------------------- ------------------------------------->
          <div class="add_btn">
            <v-dialog v-model="juniordialog" persistent max-width="350px">
              <v-card>
                <v-card-title class="headlineSection">
                  <span>Add {{ juniorSection.name }} Sections</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
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
                    color="primary darken-1"
                    :disabled="hasAnyErors"
                    @click="addJunior(juniorSection.name)"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <!----------------------------------------------Modal For Junior High Dialog--------------------------------------------------->
          <!--------- Dialog For Junior High School Category ----------------------------------------------------- ------------------------------------->
          <div class="add_btn">
            <v-dialog v-model="juniordialog" persistent max-width="350px">
              <v-card>
                <v-card-title class="headlineSection">
                  <span>Add {{ juniorSection.name }} Sections</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
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
                              @click="openJunior"
                            >
                              <v-icon>mdi-plus</v-icon>Add Section
                            </v-btn>
                          </v-card-title>
                          <!-- <v-container> -->
                          <v-row dense>
                            <v-col
                              v-for="(dta, index) in item.content"
                              :key="index"
                              cols="12"
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
                                    @click="juniorEdit(dta.id)"
                                    outlined
                                    color="#006a4e"
                                  >
                                    edit section
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                              </sections-card>
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
                          <!-- </v-container> -->
                        </v-tab-item>
                      </v-tabs-items>
                    </div>
                  </div>

                  <!-- Else -->
                  <div v-else>
                    <div class="add_btn">
                      <v-dialog
                        v-model="seniorDialog"
                        persistent
                        max-width="300px"
                      >
                        <v-card>
                          <v-card-title class="headlineSection">
                            <span>Add {{ sectionSenior.name }} Sections</span>
                          </v-card-title>
                          <v-card-text>
                            <v-container>
                              <v-text-field
                                label="Section name"
                                v-model="Senior.section"
                                @keydown="clearError"
                                name="name"
                                :error="hasError('name')"
                              ></v-text-field>
                              <p
                                v-if="hasError('name')"
                                class="invalid-feedback"
                              >
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
                              <p
                                v-if="hasError('capacity')"
                                class="invalid-feedback"
                              >
                                {{ getError("capacity") }}
                              </p>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
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
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>

                    <!-- ---------------------------------End Of The Dialog Of A Senior High School--------------------------------------------- -->

                    <v-tabs-items v-model="tab2">
                      <v-tab-item
                        v-for="(item, index) in senior_high"
                        :key="index"
                      >
                        <v-card-title>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" small dark @click="openSenior">
                            <v-icon>mdi-plus</v-icon>Add Section
                          </v-btn>
                        </v-card-title>
                        <v-container>
                          <v-row dense>
                            <v-col
                              v-for="(i, index) in item.content"
                              :key="index"
                              cols="12"
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
                                    @click="seniorEdit(i.id)"
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
                        </v-container>
                      </v-tab-item>
                    </v-tabs-items>
                  </div>
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
  },
  data: () => ({
    juniordialog: false,
    seniorDialog: false,
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
      name: "Grade 7",
    },
    sectionSenior: {
      name: "Grade 11",
    },

    Junior: {
      id: null,
      section: null,
      capacity: null,
    },
    Senior: {
      id: null,
      section: null,
      capacity: null,
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
  }),
  mounted: function () {
    //Function For Getting All Grade 7 Sections
    this.$axios
      .get(`grade7Section/` + `${this.junior_high[0].text.split(" ")[1]}`)
      .then((response) => {
        this.junior_high[0].content = response.data.sections;
      })
      .catch((error) => {
        console.log(error);
      });
    //Function For Getting All Grade 12 Sections
    this.$axios
      .get(`grade12Section/` + `${this.senior_high[0].text.split(" ")[1]}`)
      .then((response) => {
        this.senior_high[0].content = response.data.sections;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(this.senior_high);
    console.log(this.junior_high);
  },
  methods: {
    // Select and Getting The Sections For The Selected Grade Level In Junior High School
    selectedJHS(item) {
      this.juniorSection.name = item;
      this.$axios
        .get(`getSection/` + `${item.split(" ")[1]}`)
        .then((response) => {
          if (response.data.grade < 11) {
            this.junior_high.forEach((junior) => {
              if (junior.text.split(" ")[1] == item.split(" ")[1]) {
                junior.content = response.data.sections;
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //Selected Senior High School Section In V-For
    selectedSHS(value) {
      this.sectionSenior.name = value;
      this.$axios
        .get(`getSection/` + `${value.split(" ")[1]}`)
        .then((response) => {
          if (response.data.grade > 10) {
            this.senior_high.forEach((senior) => {
              if (senior.text.split(" ")[1] == value.split(" ")[1]) {
                senior.content = response.data.sections;
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //Method For Opening The Junior High School Dialog
    openJunior() {
      this.juniordialog = true;
      this.edit = false;
    },

    //Method For Opening The Dialog Of Senior High School
    openSenior() {
      this.seniorDialog = true;
      this.edit = false;
    },

    //Close The Modal IN Junior High School When Cancel is click
    closeJunior() {
      this.Junior.section = null;
      this.Junior.capacity = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
      this.juniordialog = false;
    },

    //Close The Modal IN Senior High School When Cancel is click
    closeSenior() {
      this.Senior.section = null;
      this.Senior.capacity = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
      }
      this.seniorDialog = false;
    },

    //Method For Adding A Section In Junior High School Category
    async addJunior(grades) {
      if (this.edit == false) {
        this.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        this.loading = false;
        this.$axios
          .post(`addSection`, {
            grade: grades.split(" ")[1],
            name: this.Junior.section,
            capacity: this.Junior.capacity,
            total_students: 0,
          })
          .then((response) => {
            if (response.data.message) {
              this.selectedJHS(grades);
              this.juniordialog = false;
              // alert("Successfully Save");
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Sections successfully added.",
              });
            } else {
              alert("Not Successfully Save");
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              alert("something went wrong!");
            }
          });
      } else {
        this.$axios
          .post(`updateSection/` + `${this.Junior.id}`, {
            name: this.Junior.section,
            capacity: this.Junior.capacity,
          })
          .then((response) => {
            console.log(response);
            if (response.data.message) {
              // alert("successfully update!");
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Sections successfully updated.",
              });
              this.selectedJHS(grades);
              this.juniordialog = false;
            } else {
              alert("NoTE SUCCESSFUL!");
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              alert("something went wrong!");
            }
          });
      }
    },

    //Method For Editing The Section In Junior High
    async juniorEdit(id) {
      this.edit = true;
      this.juniordialog = true;
      this.$axios
        .get(`editSection/` + `${id}`)
        .then((response) => {
          if (response.data) {
            this.Junior.id = response.data.section.id;
            this.Junior.section = response.data.section.name;
            this.Junior.capacity = response.data.section.capacity;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //Method For Editing The Section In Senior High School
    async seniorEdit(id) {
      this.edit = true;
      this.seniorDialog = true;
      this.$axios
        .get(`editSection/` + `${id}`)
        .then((response) => {
          if (response.data) {
            this.Senior.id = response.data.section.id;
            this.Senior.section = response.data.section.name;
            this.Senior.capacity = response.data.section.capacity;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //Method For Removing The Section In Junior High Category
    juniorRemove(sec) {
      this.$axios
        .get(`delAnySection/` + `${sec}`)
        .then((response) => {
          if (response.data.message) {
            this.selectedJHS(response.data.section);
            alert("Successfully Deleted!");
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
        alert("adding!");
        this.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        this.loading = false;
        this.$axios
          .post(`addSection`, {
            grade: item.split(" ")[1],
            name: this.Senior.section,
            capacity: this.Senior.capacity,
          })
          .then((response) => {
            if (response.data.message) {
              this.selectedSHS(item);
              this.seniorDialog = false;
              alert("Successfully Save");
            } else {
              alert("Not Successfully Save");
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              alert("something went wrong!");
            }
          });
      } else {
        // alert("updated");
        this.$axios
          .post(`updateSection/` + `${this.Senior.id}`, {
            name: this.Senior.section,
            capacity: this.Senior.capacity,
          })
          .then((response) => {
            if (response.data.message) {
              // alert("successfully update!");
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Sections successfully updated.",
              });
              this.selectedSHS(item);
              this.seniorDialog = false;
            }
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              alert("something went wrong!");
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

      // this.Target[event.target.name] = false;
    },

    getError(fieldName) {
      // for (let key in this.Target) {
      //   if (key == fieldName) {
      //     this.Target[key] = true;
      //   }
      // }
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
