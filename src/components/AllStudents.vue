<template>
  <div>
    <bread-crumb :item="items" page_name="All Students"></bread-crumb>
    <br /><br />
    <div>
      <v-card outlined>
        <v-card class="table-header" color="#00cae3">
          <v-card-title class="text-center justify-center">
            <div class="display-2 font-weight-light">Students Data</div>
          </v-card-title>

          <div class="subtitle-1 font-weight-light text-center justify-center">
            All students enrolled as of year {{ year }}
          </div>
        </v-card>
        <v-card-title>
          Sort By&nbsp;&nbsp;
          <v-select
            v-model="gradelevel"
            :items="grade_level"
            @change="filterByGradeLevel($event=gradelevel)"
            menu-props="auto"
            label="Grade Level"
            hide-details
            dense
            outlined
          ></v-select>
          &nbsp;&nbsp;
          <v-select
            v-model="selectedSection"
            @change="filterBySection($event=selectedSection)"
            :items="section"
            menu-props="auto"
            label="Section"
            hide-details
            dense
            outlined
          ></v-select>
          <v-spacer></v-spacer>
          <span v-if="adviser!=null">Adviser:{{adviser}}</span>
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
              <td>{{row.item.student.grade_level}}</td>
               <td>{{ row.item.student_section }}</td>
              <td>{{ row.item.student.firstname }} {{ row.item.student.lastname }}</td>
              <td>{{ row.item.student.age }}</td>
              <td>{{ row.item.student.address }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
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
    search: "",
    gradelevel:null,
    selectedSection:null,
    adviser:null,
    items: [
      {
        text: "Home",
        disabled: false,
        href: "/admin",
      },
      {
        text: "Students",
        disabled: true,
        href: "admin/students",
      },
    ],
    headers: [
      { text: "GradeLevel", value: "student.grade_level" },
      { text: "Section", value: "student_section" },
      {text: "Student Name", align: "start", sortable: false,value: "student.firstname"},
      { text: "Age", value: "student.age" },
      { text: "Address", value: "student.address" },
    ],
    students:[],
    filteredStudents:[],
    grade_level: [7, 8, 9, 10, 11, 12,"All"],
    section:[],
    filteredSections:[]
  }),
  created() {
    this.$axios.get("approvedEnrollment").then((response)=>{
      this.students=response.data.approvedEnrollment;
      this.filteredStudents=response.data.approvedEnrollment;
    })
    .catch((error) => {
        console.log(error);        
     });
  },
  mounted(){
  this.$axios.get("allGradeLevelSections").then((response)=>{
      this.filteredSections=response.data.sections;
    })
    .catch((error) => {
        console.log(error);        
     });
  },
  methods:{
   //Method For Filtering By Grade Level
filterByGradeLevel(grade){
   if(grade=='All'){
     this.students=this.filteredStudents;
     let arraySection=[];
     this.filteredSections.filter(val=>{arraySection.push(val.name);});
     this.section=arraySection;
     this.selectedSection=null;
     this.adviser=null
   }
   else{
    let arraySection=[];
    this.students=this.filteredStudents.filter(val=>{return val.student.grade_level == grade;});
    this.filteredSections.filter(val=>{
         if(val.gradelevel!=null){
            if(val.gradelevel.grade_level==grade){
                 arraySection.push(val.name);
            }
         }
    });
    this.section=arraySection;
    this.selectedSection=null;
    this.adviser=null
   }
 },

//Method For Filtering By Section In Every Grade Level
filterBySection(section){
  if(this.gradelevel=='All'){
     this.students=this.filteredStudents.filter(val=>{
       return val.student_section==section;
    });
   this.filteredSections.filter(val=>{
    if(val.name==section){
         this.adviser=val.teacher_id+",GradeLevel:"+val.gradelevel.grade_level;
     }
  });
  }
  else{
  this.students=this.filteredStudents.filter(val=>{
      return val.student_section==section;
  });
  this.filteredSections.filter(val=>{
    if(val.name==section){
       this.adviser=val.teacher_id;
     }
  });
  }

}

  }

};
</script>

<style>
.gl_filter {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 25px;
  /* or 179% */

  text-align: center;

  color: #646468;
}
</style>
