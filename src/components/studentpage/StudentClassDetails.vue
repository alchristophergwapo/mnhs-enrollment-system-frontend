<template>
  <div app>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <span>Adviser: {{ section }}</span>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td>
            {{ row.item.firstname.split(" ")[0]}}
            {{  row.item.middlename}}
            {{ row.item.lastname }}
          </td>
          <td>{{ row.item.address }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: ["classmates", "section_name"],
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Student Name",
          align: "start",
          value: "firstname",
        },
        { text: "Address", value: "address" },
      ],
      students:this.classmates,
      section: this.section_name,
    };
  },
  // created(){
  //   //console.log(this.classmates);
  // this.classmates.forEach(element => {
  //   if(element.middlename==null){
  //        console.log("middlename:"+element.middlename);
  //       element.middlename=null;
  //       this.students.push(element);
  //   }
  //   else{
  //    console.log("middlename:"+element.middlename);
  //     element.middlename=element.middlename.split("")[0] + ".";
  //       this.students.push(element);
  //   }
  //   //console.log(this.students);
  // });

  // }
};
</script>