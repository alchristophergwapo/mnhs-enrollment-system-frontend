<template>
  <div>
    <bread-crumb :item="items" page_name="Enrollment"></bread-crumb>
    <br /><br />
    <v-container>
      <v-row align="center" justify="end">
        <v-btn color="primary" rounded link to="/enroll">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <div class="table">
      <v-card outlined>
        <v-card class="table-header" color="#4caf50">
          <v-card-title class="text-center justify-center">
            <div class="display-2 font-weight-light">Pending Enrollments</div>
          </v-card-title>

          <div class="subtitle-1 font-weight-light text-center justify-center">
            All pending enrollments as of year {{ year }}
          </div>
        </v-card>
      <v-card-title>
        Sort By&nbsp;&nbsp;
        <v-select
          :items="grade_level"
          v-model="gradelevel"
          @change="filterByGradeLevel($event)"
          menu-props="auto"
          label="Grade Level"
          hide-details
          dense
          outlined
        ></v-select>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          @keyup="filterByName($event=search)"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
        <v-data-table
          :headers="headers"
          :items="students"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item="row">
            <tr>
              <td>{{ row.item.grade_level }}</td>
              <td>{{row.item.fullname}}</td>
              <td>
                <v-dialog transition="dialog-top-transition" max-width="600">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text v-bind="attrs" v-on="on">View Details</v-btn>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-card-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialog.value = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" md="6" sm="6">
                            PSA No.:&nbsp;&nbsp;<strong>{{
                              row.item.PSA
                            }}</strong>
                          </v-col>
                          <v-col cols="12" md="6" sm="6">
                            LRN:&nbsp;&nbsp;<strong>{{ row.item.LRN }}</strong>
                          </v-col>
                          <v-col cols="12" md="6" sm="6">
                            Average:&nbsp;&nbsp;<strong>{{
                              row.item.average
                            }}</strong>
                          </v-col>
                          <v-col cols="12" md="6" sm="6">
                            Full Name:&nbsp;&nbsp;<strong
                              >{{ row.item.firstname }}
                              {{ row.item.lastname }}</strong
                            >
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Birth Date:&nbsp;&nbsp;<strong>{{
                              row.item.birthdate
                            }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="2">
                            Age:&nbsp;&nbsp;<strong>{{ row.item.age }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            Gender:&nbsp;&nbsp;<strong>{{
                              row.item.gender
                            }}</strong>
                          </v-col>
                          <v-col cols="12">
                            Belonging to any Indigenous Peoples (IP)<br />Community
                            /Indigenous Cultural Community ?
                            <strong>&nbsp;&nbsp;{{ row.item.IP }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Mother Tongue:&nbsp;&nbsp;<strong>{{
                              row.item.mother_tongue
                            }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Contact Number:&nbsp;&nbsp;<strong>{{
                              row.item.contact
                            }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Adress:&nbsp;&nbsp;<strong>{{
                              row.item.address
                            }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Zip Code:&nbsp;&nbsp;<strong>{{
                              row.item.zipcode
                            }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Father's Name:&nbsp;&nbsp;<strong>{{
                              row.item.father
                            }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Mother's Name:&nbsp;&nbsp;<strong>{{
                              row.item.mother
                            }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Guardian's Name:&nbsp;&nbsp;<strong>{{
                              row.item.guardian
                            }}</strong>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            Contact Number:&nbsp;&nbsp;<strong>{{
                              row.item.parent_number
                            }}</strong>
                          </v-col>

                          <!-- <v-avatar class="ma-3" size="300" tile> -->
                          <v-img
                            :src="
                              `http://127.0.0.1:8000/images/` +
                              row.item.card_image
                            "
                          ></v-img>
                          <!-- </v-avatar> -->
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </template>
                </v-dialog>
              </td>
              <td>
                <v-row align="center" justify="space-around">
                  <v-btn
                    color="primary"
                    @click="
                      filterSections(
                        row.item.grade_level,
                        row.item.enrollment_id,
                        row.index
                      )
                    "
                  >
                    approve
                  </v-btn>
                  <v-btn
                    color="error"
                    @click="declineEnrollment(item.id, index)"
                  >
                    decline
                  </v-btn>
                </v-row>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Select Student Sections</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-select
                :items="sections"
                v-model="section"
                label="Section*"
                required
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                @click="approveEnrollment(id,index)"
              >
                Done
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
  },
  data: () => ({
    year: new Date().getFullYear(),
    toggle_exclusive: undefined,
    dialog: false,
    section: null,
    search:null,
    gradelevel:null,
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Enrollment",
        disabled: true,
        href: "admin/enrollment",
      },
    ],

    headers: [
      { text: "Grade Level", align: "start",sortable: false, value: "grade_level",
      },
      { text: "Student Name", value:"fullname"},
      { text: "Details", value: "details" },
      { text: "Action", value: "action" },
    ],
    id: null,
    index: null,
    students: [],
    filterStudents:[],
    grade_level: ["7", "8", "9", "10", "11", "12","All"],
    sections: [],
  }),

  created() {
    if (!this.students || !this.sections) {
      setTimeout(() => {
        this.initializeData();
      }, 3000);
    }
    this.initializeData();
  },

  methods: {
    initializeData() {
      let pendingEnrollment = this.$store.getters.allPendingEnrollments;
      for (var index in pendingEnrollment) {
        let element = pendingEnrollment[index];
        let studentData = element["student"];
        let enrollmentData=[];
        enrollmentData["enrollment_id"] = element["id"];
        enrollmentData["card_image"] = element["card_image"];
        enrollmentData["fullname"]=studentData["firstname"].concat(" ",studentData["lastname"]);
        for (const data in studentData) {
          const element1 = studentData[data];
          enrollmentData[data] = element1;
        }
        this.students.push(enrollmentData);
        this.filterStudents.push(enrollmentData);
      }
      console.log(this.students);
    },

    filterSections(gradelevel,id,index){
      this.id=id;
      this.index = index;
      // console.log(index);
      this.dialog = true;
      let sections = this.$store.getters.allSections;
      // console.log(grade_level);
      for (const key in sections) {
        if (sections.hasOwnProperty.call(sections, key)) {
          const element = sections[key];
          const grade_levelData = element["gradelevel"];
          for (const glKey in grade_levelData) {
            let section = element["name"];
            if (grade_levelData.hasOwnProperty.call(grade_levelData, glKey)) {
              const element1 = grade_levelData[glKey];
              // console.log(glKey);
              if (glKey == "grade_level") {
                // console.log("here");
                if (element1 == gradelevel) {
                  // console.log("here");
                  this.sections.push(section);
                }
              }
            }
          }
        }
      }
      // console.log(this.sections);
    },

//Methods For Filtering 
filterByGradeLevel(grade){
   if(grade=='All'){
     this.students=this.filterStudents;
   }
   else{
     this.students=this.filterStudents.filter(function (val){ return val.grade_level == grade;})
   }
},
 
//Method For Filtering The Name By A GradeLevel Or All GradeLevel
filterByName(data){
   this.students=this.filterStudents.filter(val =>{
       if(this.gradelevel==null && data!=null){
          return val.fullname.concat(" ",val.grade_level).toLowerCase().includes(data.toLowerCase())
       }
       else if(this.gradelevel=='All' && data!=null){
             return val.fullname.concat(" ",val.grade_level).toLowerCase().includes(data.toLowerCase())
       }
       else{
         if(val.grade_level==this.gradelevel){
           if(data!=null){
               return val.fullname.concat(" ",val.grade_level).toLowerCase().includes(data.toLowerCase())
           }
            else{
            return val.fullname.concat(" ",val.grade_level).toLowerCase().includes(val.grade_level.toLowerCase())
        }
      }

       }
   })
    
},


//Method For Approving the enrollment
approveEnrollment(id, index) {
      alert("approve:"+id)
      console.log(this.section);
      if (this.section) {
        this.$axios
          .post("approveEnrollment/" + id,{student_section:this.section })
          .then((response) => {
            console.log(response);
            this.students.splice(index, 1);
            this.$swal.fire({
              icon: "success",
              title: "Success",
              text: "Enrollment approved.",
            });
            this.dialog = false;
            window.location.reload(true);
          })
          .catch((error) => {
            console.log(error);
            this.$swal.fire({
              icon: "error",
              title: "Ooops....",
              text: error.response.data.message,
            });
            this.dialog = true;
          });
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Ooops....",
          text: "Please select a section.",
        });
        this.dialog = true;
      }
    },

    declineEnrollment(id,index){
      alert("decline:"+id)
      this.$axios
        .post("declineEnrollment/" + id)
        .then((response) => {
          console.log(response);
          this.students.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>


<style>
.table {
  margin-top: 50px;
}
.table-header {
  margin: 0 40px 0 40px;
  position: inherit;
  top: -20px;
}

.view_dtls_btn {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;

  color: #48d3ff;
}
</style>