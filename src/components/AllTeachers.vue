
<template>
  <div>
    <bread-crumb :item="items" page_name="All Teachers"></bread-crumb>
    <br>
    <br>
    <div>
      <v-card-title>
        <v-spacer></v-spacer>
        <!-- Addin A Teacher!-->
        <v-card-title>
          <v-spacer></v-spacer>
          <div class="add_btn">
            <v-dialog v-model="statusdialog" persistent max-width="300px">
              <template v-slot:activator="{ on,attrs}">
                <v-btn color="primary" v-bind="attrs" v-on="on" @click="showTeacher">
                  <v-icon>mdi-plus</v-icon>Add Teacher
                </v-btn>
              </template>
              <v-form>
                <v-card>
                  <v-card-title class="headline">
                    <span>{{status}}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                        @keydown="clearError"
                        label="Teacher Name"
                        type="text"
                        class="form-control"
                        v-model="Teacher"
                        name="name"
                        :class="hasError('name') ? 'is-invalid':''"
                      ></v-text-field>
                      <div v-if="hasError('name')" class="invalid-feedback">{{getError('name')}}</div>
                      <v-text-field
                        @keydown="clearError"
                        label="Email"
                        type="email"
                        v-model="Email"
                        name="email"
                        :class="hasError('email') ? 'is-invalid':''"
                      ></v-text-field>
                      <div v-if="hasError('email')" class="invalid-feedback">{{getError('email')}}</div>
                      <v-text-field
                        @keydown="clearError"
                        label="Phone Number"
                        type="number"
                        v-model="Contact"
                        name="phone"
                        :class="hasError('phone') ? 'is-invalid':''"
                      ></v-text-field>
                      <div v-if="hasError('phone')" class="invalid-feedback">{{getError('phone')}}</div>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error darken-1" @click="dialogs">Cancel</v-btn>
                    <v-btn color="blue darken-1" :disabled="hasAnyErors" @click="addTeacher()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </div>
        </v-card-title>
        <!-- Addin A Teacher!-->
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="teachers"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.name}}</td>
            <td>{{ row.item.email}}</td>
            <td>{{ row.item.phone}}</td>
            <td>
              <v-icon class="btn" @click="showsTeacherById(row.item.id)">mdi-pencil</v-icon>
              <v-icon class="btn" @click="removeTeacher(row.item.id)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    BreadCrumb: () => import("@/layout/BreadCrumb.vue")
  },

  data() {
    return {
      HHTP_REQUEST_URL: "http://127.0.0.1:8000/api/",
      search: "",
      statusdialog: false,
      booleanStatus: false,
      status: null,
      Id:null,
      Teacher: null,
      Email: null,
      Contact: null,

      items: [
        {
          text: "Home",
          disabled: false,
          href: "/admin"
        },
        {
          text: "Teachers",
          disabled: true,
          href: "admin/all_teachers"
        }
      ],
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phone" },
        { text: "Action", value: "action" }
      ],

      teachers: [
        {
          id: "0",
          name: "Aileen Becher",
          email: "becher@mnhs.edu.ph",
          phone: "639123456789"
        }
      ],
      errors: {}
    };
  },

  mounted: function() {
    this.display();
  },

  methods: {
    //Methods for displaying all teachers
    display() {
      this.$axios
        .get(`${this.HHTP_REQUEST_URL}allTeacher`)
        .then(response => {
          response.data.forEach(element => {
            this.teachers.push(element);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    //Methods for Deleting A Teacher In Delete Button
    async removeTeacher(dataid) {
      this.$axios
        .get(`${this.HHTP_REQUEST_URL}delTeacher/` + `${dataid}`)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },

    //Methods for showing  a teacher by id
    showsTeacherById(id){
      this.status = "Update Teacher";
      this.statusdialog = true;
      this.booleanStatus = true;
       this.$axios
        .get(`${this.HHTP_REQUEST_URL}showByIdTeacher/` + `${id}`)
        .then(response =>{
          this.Teacher=response.data.name;
          this.Email=response.data.email;
          this.Contact=response.data.phone;
          this.Id=response.data.id;
        })
        .catch(error => {
          console.log(error);
        });

    },

    
    //Methods for showing the  Add Teacher
    showTeacher() {
      this.status = "Add Teacher";
      this.statusdialog = true;
      this.booleanStatus = false;
    },

    //Reseting the validation in cancel button
    async dialogs() {
      //This is for Add Teacher Reset Validation
      if (this.booleanStatus == false) {
        alert("Adding Teacher Functionality:" + this.booleanStatus);
        this.statusdialog = false;
        (this.Teacher = null), (this.Email = null), (this.Contact = null);
        for (let key in this.errors) {
          this.$delete(this.errors, key);
        }
      }
      //This is for Update Teacher Reset Validation
      else {
        alert("Update Teacher Functionality:" + this.booleanStatus);
        this.statusdialog = false;
        (this.Teacher = null), (this.Email = null), (this.Contact = null);
        for (let key in this.errors) {
          this.$delete(this.errors, key);
        }
      }
    },

    //Method for Adding A Teacher in save button
    async addTeacher(){
      if (this.booleanStatus == false){
        alert("Adding A Teacher:" + this.booleanStatus);
        this.$axios
          .post(`${this.HHTP_REQUEST_URL}addNewTeacher`,{
            name: this.Teacher,
            email: this.Email,
            phone: this.Contact
          })
          .then(response => {
            console.log(response.data);
            (this.Teacher = null), (this.Email = null), (this.Contact = null);
            this.statusdialog = false;
          })
          .catch(error => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              alert("something went wrong!");
            }
          });
      } else {
        alert("Updateteacher:" + this.booleanStatus+this.Id);
        this.$axios
          .post(`${this.HHTP_REQUEST_URL}updateTeacher/`+ `${this.Id}`,{
            name: this.Teacher,
            email: this.Email,
            phone: this.Contact
          })
          .then(response => {
            console.log(response.data);
            (this.Teacher = null), (this.Email = null), (this.Contact = null);
            this.statusdialog = false;
          })
          .catch(error => {
            if (error.response.status == 422) {
              this.setErrors(error.response.data.errors);
            } else {
              alert("something went wrong!");
            }
          });
      }
    },


   //Methods For All Errors
  setErrors(error){
      this.errors = error;
    },

    hasError(fieldname) {
      return fieldname in this.errors;
    },

    clearError(event) {
      this.$delete(this.errors, event.target.name);
    },

    getError(fieldName) {
      return this.errors[fieldName][0];
    }
  },

  computed: {
    hasAnyErors() {
      return Object.keys(this.errors).length > 0;
    }
  }

};
</script>


<style>
.headline {
  background-color: rgb(57, 151, 206);
}

.invalid-feedback {
  color: red;
}
</style>