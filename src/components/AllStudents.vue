<template>
  <div>
    <bread-crumb :item="items" page_name="All Students"></bread-crumb>
    <br /><br />
    <div>
      <v-card-title>
        Sort By&nbsp;&nbsp;
        <v-select
          :items="grade_level"
          menu-props="auto"
          label="Grade Level"
          hide-details
          v-model="selectedGrade"
          @change="gradeLevel($event)"
          dense
          outlined
        ></v-select>
        &nbsp;&nbsp;
        <v-select
          :items="section"
          menu-props="auto"
          label="Section"
          hide-details
          @change="selectedSection($event)"
          dense
          outlined
        ></v-select>
        <v-spacer></v-spacer>
        <span>Adviser: Aileen Becher</span>
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
            <td>{{ row.item.gradelevel}}</td>
            <td>{{ row.item.section }}</td>
            <td>{{ row.item.student }}</td>
            <td>{{ row.item.age }}</td>
            <td>{{ row.item.address }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue"),
  },
  data: () => ({
    HHTP_REQUEST_URL: "http://127.0.0.1:8000/api/",
    search: "",
    selectedGrade:null,
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
      { text: "GradeLevel", value: "gradelevel" },
       { text: "Section", value: "section" },
      {text: "Student Name", align: "start", sortable: false,value: "student",},
      { text: "Age", value: "age" },
      { text: "Address", value: "address" },
    ],
    students: [
      {
        gradelevel:null,
        section:null,
        student: "Danica Caballero",
        age: 21,
        address: "Moalboal",
      },
      {
        gradelevel:null,
        section:null,
        student: "Chilla Jean Cabungcag",
        age: 21,
        address: "Badian",
      },
      {
        gradelevel:null,
        section:null,
        student: "Jericho James Villahermosa",
        age: 21,
        address: "Bulac",
      },
      {
        gradelevel:null,
        section:null,
        student: "Christopher Alonzo",
        age: 21,
        address: "Salug",
      },
    ],
    grade_level:[7,8,9,10,11,12],
    section:[],

  }),

  mounted:function(){

  },

  methods:{
    
//Methods For Getting The Selected GradeLevel
   gradeLevel(select){
      this.$axios
      .get(
        `${this.HHTP_REQUEST_URL}selectedGradeLevel/`+`${select}`
      )
      .then(response => {
        this.section=response.data;
      })
      .catch(error => {
        console.log(error);
      });
    },
    selectedSection(select){
       alert(select+"="+this.selectedGrade)
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
