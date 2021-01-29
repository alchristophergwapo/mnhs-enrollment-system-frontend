<template>
  <div>
    <bread-crumb :item="items" page_name="All Teachers"></bread-crumb>
    <br>
    <br>
    <div>
      <v-card-title>
        <v-spacer></v-spacer>

        <!-- Add Teacher Button -->
        <v-card-title>
          <v-spacer></v-spacer>
          <div class="add_btn">
            <v-dialog v-model="statusdialog" persistent max-width="300px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on">
                  <v-icon>mdi-plus</v-icon>Add Teacher
                </v-btn>
              </template>

              <v-form ref="addTeacherForm" v-model="valid" lazy-validation>
                <v-card>
                  <v-card-title class="headline">
                    <span>Add Teacher</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                        label="Teacher Name"
                        type="text"
                        v-model="Teacher"
                        :rules="[rules.username]"
                        maxlength="100"
                        required
                      ></v-text-field>
                      <v-text-field
                        label="Email"
                        type="email"
                        v-model="Email"
                        :rules="rules.emailRules"
                      ></v-text-field>
                      <v-text-field
                        label="Phone Number"
                        type="number"
                        v-model="Contact"
                        :rules="rules.phone"
                         maxlength="11"
                        required
                      ></v-text-field>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="loading" color="error darken-1" @click="dialogs">Cancel</v-btn>
                    <v-btn
                      :loading="loading"
                      :disabled="!valid"
                      color="blue darken-1"
                      @click="addTeacher"
                    >Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </div>
        </v-card-title>
        <!--Add Teacher Button-->
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
              <v-icon class="btn">mdi-pencil</v-icon>
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
      // config: {
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" }
      // },
      search: "",
      statusdialog: false,
      loading: false,
      valid: true,

      Teacher: "",
      Email: "",
      Contact: "",

      rules: {
        username: value => !!value || "Name is required!",
        phone: [
          v => !!v || "Phone is required",
         // value => value.length == 11 || "Contact must be 11 characters"
        ],
        emailRules: [
          v => !!v || "E-mail is required",
          v => /.+@.+/.test(v) || "E-mail must be valid"
        ]
      },
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
          id:'0',
          name: "Aileen Becher",
          email: "becher@mnhs.edu.ph",
          phone: "639123456789"
        }
      ]
    };
  },

  //Getting All Teachers
  mounted: function() {
    this.display(this.teachers);
  },

  methods: {

    display(allTeacher) {
      this.$axios
        .get(`${this.HHTP_REQUEST_URL}allTeacher`)
        .then(function(response) {
          response.data.forEach(element => {
            allTeacher.push(element);
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //Adding A Teacher in save button
    async addTeacher() {
      if (this.$refs.addTeacherForm.validate()) {
        this.$axios
          .post(`${this.HHTP_REQUEST_URL}addNewTeacher`, {
            name: this.Teacher,
            email: this.Email,
            phone: this.Contact.toString()
          })
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
        this.loading = true;
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.loading = false;
        this.statusdialog = false;
      }
      this.$refs.addTeacherForm.reset();
      
    },

     //Deleting A Teacher In Delete Button
      async removeTeacher(dataid) {
         this.$axios
        .get(`${this.HHTP_REQUEST_URL}delTeacher/`+`${dataid}`)
        .then(function(response){
             console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      
    },

    //Reseting the validation in cancel button
    async dialogs() {
      this.statusdialog = false;
      this.$refs.addTeacherForm.resetValidation();
    }

  }

};
</script>

<style>
.headline {
  background-color: rgb(57, 151, 206);
}
</style>