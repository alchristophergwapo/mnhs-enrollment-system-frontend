<template>
  <div>
    <bread-crumb :item="items" page_name="All Sections"></bread-crumb>
    <br>
    <br>
    <div>
      <v-row>
        <v-col cols="12" md="7" lg="8">
          <v-card color="basil">
            <v-card-title class="text-center justify-center py-6">
              <h1 class="font-weight-bold display-2 basil--text">Junior High</h1>
            </v-card-title>
            <div>
              <!--------- Dialog For Junior High School Category ----------------------------------------------------- ------------------------------------->
              <div class="add_btn">
                <v-dialog v-model="juniordialog" persistent max-width="300px">
                  <v-card>
                    <v-card-title class="headlineSection">
                      <span>Add {{juniorSection.name}} Sections</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-text-field
                          label="Section name"
                          v-model="Junior.section"
                          @keydown="clearError"
                          name="name"
                          :error="Target.name"
                        ></v-text-field>
                        <p v-if="hasError('name')" class="invalid-feedback">{{getError('name')}}</p>
                        <v-text-field
                          label="Capacity"
                          type="number"
                          name="capacity"
                          @keydown="clearError"
                          v-model="Junior.capacity"
                          :error="Target.capacity"
                          min="0"
                        ></v-text-field>
                        <p
                          v-if="hasError('capacity')"
                          class="invalid-feedback"
                        >{{getError('capacity')}}</p>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn :disabled="loading" color="error darken-1" @click="closeJunior">Cancel</v-btn>
                      <v-btn
                        :loading="loading"
                        color="blue darken-1"
                        :disabled="hasAnyErors"
                        @click="addJunior(juniorSection.name)"
                      >Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
     <!----------------------------------------------Modal For Junior High Dialog--------------------------------------------------->
              <v-tabs v-model="tab1" background-color="#C4C4C4" color="basil" fixed-tabs>
                <v-tab
                  v-for="item in junior_high"
                  :key="item.text"
                  @click="selectedJHS(item.text)"
                >{{item.text}}</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab1">
                <v-tab-item v-for="(item,index) in junior_high" :key="index">
                  <v-card-title>
                    {{item.text}} Sections
                    <v-spacer></v-spacer>
                    <v-btn color="primary" small dark @click="openJunior">
                      <v-icon>mdi-plus</v-icon>Add Section
                    </v-btn>
                  </v-card-title>
                  <v-container>
                    <v-row dense>
                      <v-col
                        v-for="(dta,index) in item.content"
                        :key="index"
                        cols="12"
                        lg="4"
                        md="6"
                        sm="6"
                      >
                        <v-card>
                          <v-card-title>
                            <v-icon>mdi-home-group</v-icon>
                            {{ dta.name}}
                          </v-card-title>
                          <v-card-text>
                            <v-icon>mdi-home-account</v-icon>
                            {{dta.capacity}}
                          </v-card-text>
                          <v-card-text>
                            <v-icon>mdi-account-box</v-icon>
                            {{dta.teacher_id}}
                          </v-card-text>
                          <v-card-text>
                            <v-icon @click="juniorEdit(dta.id)">mdi-pencil-box</v-icon>
                          </v-card-text>
                            <v-card-text>
                            <v-icon @click="juniorRemove(dta.id)">mdi-delete</v-icon>
                          </v-card-text>
                          <v-card-actions>
                            <v-progress-linear
                              :value="
                              (dta.total_students / dta.capacity) * 100
                            "
                              height="25"
                            >
                              <strong>
                                {{ dta.total_students}} Students
                                Enrolled
                              </strong>
                            </v-progress-linear>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                      <v-card-title class="text-center justify-center py-6">
                        <h1
                          class="font-weight-bold display-1 basil--text"
                          v-if="item.content.length==0"
                        >No {{item.text}} Sections created yet.</h1>
                      </v-card-title>
                    </v-row>
                  </v-container>
                </v-tab-item>
              </v-tabs-items>
            </div>
          </v-card>
        </v-col>
        <!-----------------------------------End OF The Modal For All Junior High-------------------------------------------------->

        <v-col cols="12" md="5" lg="4">
          <v-card color="basil">
            <v-card-title class="text-center justify-center py-6">
              <h1 class="font-weight-bold display-2 basil--text">Senior High</h1>
            </v-card-title>
            <!------------- ----------- ----------Dialog For Senior High School ------------------------------------------------->
            <div class="add_btn">
              <v-dialog v-model="seniorDialog" persistent max-width="300px">
                <v-card>
                  <v-card-title class="headlineSection">
                    <span>Add {{sectionSenior.name}} Sections</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                        label="Section name"
                        v-model="Senior.section"
                        @keydown="clearError"
                        name="name"
                        :error="Target.name"
                      ></v-text-field>
                      <p v-if="hasError('name')" class="invalid-feedback">{{getError('name')}}</p>
                      <v-text-field
                        label="Capacity"
                        type="number"
                        name="capacity"
                        @keydown="clearError"
                        v-model="Senior.capacity"
                        :error="Target.capacity"
                        min="0"
                      ></v-text-field>
                      <p
                        v-if="hasError('capacity')"
                        class="invalid-feedback"
                      >{{getError('capacity')}}</p>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="loading" color="error darken-1" @click="closeSenior">Cancel</v-btn>
                    <v-btn
                      :loading="loading"
                      :disabled="hasAnyErors"
                      color="blue darken-1"
                      @click="addSenior(sectionSenior.name)"
                    >Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <!-- ---------------------------------End Of The Dialog Of A Senior High School--------------------------------------------- -->
            <v-tabs v-model="tab2" background-color="#C4C4C4" color="basil" fixed-tabs>
              <v-tab
                v-for="(item,index) in senior_high"
                :key="index"
                @click="selectedSHS(item.text)"
              >{{item.text}}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab2">
              <v-tab-item v-for="(item, index) in senior_high" :key="index">
                <v-card-title>
                  {{item.text}} Sections
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
                      lg="6"
                      md="12"
                      sm="6"
                    >
                      <v-card>
                        <v-card-title>
                          <v-icon>mdi-home-group</v-icon>
                          {{ i.name }}
                        </v-card-title>
                        <v-card-text>
                          <div>
                            <v-icon>mdi-home-account</v-icon>
                            {{ i.capacity}}
                          </div>
                        </v-card-text>
                        <v-card-text>
                            <v-icon>mdi-account-box</v-icon>
                            {{i.teacher_id}}
                          </v-card-text>
                           <v-card-text>
                            <v-icon @click="seniorEdit(i.id)">mdi-pencil-box</v-icon>
                          </v-card-text>
                        <v-card-actions>
                          <v-progress-linear
                            :value="(i.total_students / i.capacity) * 100"
                            height="25"
                          >
                            <strong>
                              {{ i.total_students}} Students
                              Enrolled
                            </strong>
                          </v-progress-linear>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                    <v-col>
                      <v-card-title
                        class="text-center justify-center py-6"
                        v-if="item.content.length==0"
                      >
                        <h1
                          class="font-weight-bold display-1 basil--text"
                        >No {{item.text}} Sections created yet.</h1>
                      </v-card-title>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue")
    // InputCard: () => import("@/layout/InputCardDialog.vue"),
  },
  data: () => ({
    HHTP_REQUEST_URL: "http://127.0.0.1:8000/api/",
    juniordialog: false,
    seniorDialog: false,
    edit:null,
    loading: false,
    state: null,
    items: [
      { text: "Home", disabled: false, href: "/admin" },
      { text: "Sections", disabled: true, href: "admin/all_sections" }
    ],
    tab1: null,
    tab2: null,
    errors: {},
    //seniorErrors:{},
    Target: { name: null, capacity: null },
    //TargetSenior:{ name: null, capacity: null },
    juniorSection: {
      name: "Grade 7"
    },
    sectionSenior: {
      name: "Grade 11"
    },
    
    Junior: {
      id:null,
      section: null,
      capacity: null
    },
    Senior: {
      id:null,
      section: null,
      capacity: null
    },
    junior_high: [
      {
        text: "Grade 7",
        content: []
      },
      { text: "Grade 8", content: [] },
      { text: "Grade 9", content: [] },
      { text: "Grade 10", content: [] }
    ],
    senior_high: [
      { text: "Grade 11", content: [] },
      { text: "Grade 12", content: [] }
    ]
  }),
  mounted: function() {
    //Function For Getting All Grade 7 Sections
    this.$axios
      .get(
        `${this.HHTP_REQUEST_URL}grade7Section/` +
          `${this.junior_high[0].text.split(" ")[1]}`
      )
      .then(response => {
        this.junior_high[0].content = response.data.sections;
      })
      .catch(error => {
        console.log(error);
      });

    this.$axios
      .get(
        `${this.HHTP_REQUEST_URL}grade12Section/` +
          `${this.senior_high[0].text.split(" ")[1]}`
      )
      .then(response => {
        this.senior_high[0].content = response.data.sections;
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {

    // Select and Getting The Sections For The Selected Grade Level In Junior High School
    selectedJHS(item) {
      this.juniorSection.name = item;
      this.$axios
        .get(`${this.HHTP_REQUEST_URL}getSection/` + `${item.split(" ")[1]}`)
        .then(response => {
          if (response.data.grade < 11) {
            this.junior_high.forEach(junior => {
            if(junior.text.split(" ")[1] == item.split(" ")[1]) {
                junior.content = response.data.sections;
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

//Selected Senior High School Section In V-For
    selectedSHS(value) {
      this.sectionSenior.name = value;
       this.$axios
        .get(`${this.HHTP_REQUEST_URL}getSection/` + `${value.split(" ")[1]}`)
        .then(response => {
          if (response.data.grade>10){
            this.senior_high.forEach(senior => {
            if(senior.text.split(" ")[1] ==value.split(" ")[1]) {
                senior.content = response.data.sections;
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //Method For Opening The Junior High School Dialog
    openJunior() {
      this.juniordialog=true;
      this.edit=false;
    },

    //Method For Opening The Dialog Of Senior High School
    openSenior(){
      this.seniorDialog=true;
      this.edit=false;
    },

   //Close The Modal IN Junior High School When Cancel is click
    closeJunior() {
      this.Junior.section = null;
      this.Junior.capacity = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
        this.Target[key] = false;
      }
      this.juniordialog = false;
    },

//Close The Modal IN Senior High School When Cancel is click
    closeSenior() {
      this.Senior.section = null;
      this.Senior.capacity = null;
      for (let key in this.errors) {
        this.$delete(this.errors, key);
        this.Target[key] = false;
      }
      this.seniorDialog = false;
    },

    //Method For Adding A Section In Junior High School Category
    async addJunior(grades) {
      if(this.edit==false){
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve,3000));
      this.loading =false;
      this.$axios
        .post(`${this.HHTP_REQUEST_URL}addSection`, {
          grade:grades.split(" ")[1],
          name: this.Junior.section,
          capacity: this.Junior.capacity
        })
        .then(response => {
          if (response.data.message) {
            this.selectedJHS(grades);
            this.juniordialog=false;
            alert("Successfully Save");
          } else {
            alert("Not Successfully Save");
          }
        })
        .catch(error => {
          if (error.response.status == 422) {
            this.setErrors(error.response.data.errors);
          } else {
            alert("something went wrong!");
          }
        });
      }
    else{
        this.$axios
        .post(`${this.HHTP_REQUEST_URL}updateSection/`+`${this.Junior.id}`,{
          name: this.Junior.section,
          capacity: this.Junior.capacity
        })
        .then(response =>{
          if (response.data.message){
             alert("successfully update!")
             this.selectedJHS(grades);
             this.juniordialog=false;
          } 
          else{
          alert("NoTE SUCCESSFUL!")
          }
        })
        .catch(error => {
         if (error.response.status == 422) {
            this.setErrors(error.response.data.errors);
          }else {
            alert("something went wrong!");
          }
        });
      }
   
    },

//Method For Editing The Section In Junior High
async juniorEdit(id){
     this.edit=true;
     this.juniordialog=true;
     this.$axios
        .get(`${this.HHTP_REQUEST_URL}editSection/`+`${id}`)
        .then(response => {
          if (response.data){
            this.Junior.id=response.data.section.id;
            this.Junior.section=response.data.section.name;
            this.Junior.capacity=response.data.section.capacity;
          } 
        })
        .catch(error => {
          console.log(error);
        });
  },

//Method For Editing The Section In Senior High School
async seniorEdit(id){
     this.edit=true;
     this.seniorDialog=true;
     this.$axios
        .get(`${this.HHTP_REQUEST_URL}editSection/`+`${id}`)
        .then(response => {
          if (response.data){
            this.Senior.id=response.data.section.id;
            this.Senior.section=response.data.section.name;
            this.Senior.capacity=response.data.section.capacity;
          } 
        })
        .catch(error => {
          console.log(error);
        });
  },


//Method For Removing The Section In Junior High Category
    juniorRemove(sec) {
      this.$axios
        .get(`${this.HHTP_REQUEST_URL}delAnySection/`+`${sec}`)
        .then(response => {
          if (response.data.message){
             this.selectedJHS(response.data.section);
            alert("Successfully Deleted!");
          } else {
            alert("Not successfully deleted!");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

//Methods For Adding A Section In Senior High School
    async addSenior(item) {
      if(this.edit==false){
        alert("adding!")
         this.loading=true;
        await new Promise(resolve => setTimeout(resolve, 3000));
          this.loading = false;
        this.$axios
        .post(`${this.HHTP_REQUEST_URL}addSection`, {
          grade: item.split(" ")[1],
          name: this.Senior.section,
          capacity: this.Senior.capacity
        })
        .then(response => {
          if (response.data.message) {
            this.selectedSHS(item);
            this.seniorDialog = false;
            alert("Successfully Save");
          } else {
            alert("Not Successfully Save");
          }
        })
        .catch(error => {
          if (error.response.status == 422) {
            this.setErrors(error.response.data.errors);
          } else {
            alert("something went wrong!");
          }
        });
      }
      else{
        alert("updated")
         this.$axios
        .post(`${this.HHTP_REQUEST_URL}updateSection/`+`${this.Senior.id}`,{
          name: this.Senior.section,
          capacity: this.Senior.capacity
        })
        .then(response =>{
          if (response.data.message){
             alert("successfully update!")
             this.selectedSHS(item);
             this.seniorDialog=false;
          } 
        })
        .catch(error => {
         if (error.response.status == 422) {
            this.setErrors(error.response.data.errors);
          }else {
            alert("something went wrong!");
          }
        });
      }
  
    },

  //Methods For All Errors In Junior High School
    setErrors(error) {
      this.errors=error;
    },

    hasError(fieldname) {
      return fieldname in this.errors;
    },

    clearError(event) {
      this.$delete(this.errors, event.target.name);
      this.Target[event.target.name] = false;
    },

    getError(fieldName){
      for (let key in this.Target) {
        if (key == fieldName) {
          this.Target[key] = true;
        }
      }
      return this.errors[fieldName][0];
    },


    //Methods For All Errors in Senior High School
    // setSeniorErrors(error){
    //   this.seniorErrors= error;
    // },

    // hasSeniorError(fieldname) {
    //   return fieldname in this.seniorErrors;
    // },

    // clearSeniorError(event) {
    //   this.$delete(this.seniorErrors, event.target.name);
    //   this.TargetSenior[event.target.name] = false;
    // },

    // getSeniorError(fieldName) {
    //   for (let key in this.TargetSenior) {
    //     if (key == fieldName) {
    //       this.TargetSenior[key] = true;
    //     }
    //   }
    //   return this.seniorErrors[fieldName][0];
    // },

    filter(data) {
      console.log(data);
    }
  },

  computed:{
    hasAnyErors(){
      return Object.keys(this.errors).length > 0;
    },


    //  hasSeniorAnyErors() {
    //     return Object.keys(this.seniorErrors).length > 0;
    //   }
  }
};
</script>








<style>
.mx-auto {
  width: 250px;
  height: 100px;
  border-radius: 5px;
}
.headlineSection {
  background-color: rgb(57, 151, 206);
}

.invalid-feedback {
  color: red;
  margin-top: -7%;
  font-size: 14px;
}
</style>