<template>
  <div>
    <v-card>
      <slot name="header_action" />
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
            sm="6"
          >
            PSA No.:&nbsp;&nbsp;<strong>{{ enrollment.PSA }}</strong>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="6"
          >
            LRN:&nbsp;&nbsp;<strong>{{ enrollment.LRN }}</strong>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="6"
          >
            Average:&nbsp;&nbsp;<strong>{{ enrollment.average }}</strong>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="6"
          >
            Full Name:&nbsp;&nbsp;<strong>{{ enrollment.firstname }} {{ enrollment.lastname }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Birth Date:&nbsp;&nbsp;<strong>{{ enrollment.birthdate }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="2"
          >
            Age:&nbsp;&nbsp;<strong>{{ enrollment.age }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            Gender:&nbsp;&nbsp;<strong>{{ enrollment.gender }}</strong>
          </v-col>
          <v-col cols="12">
            Belonging to any Indigenous Peoples (IP)<br>Community /Indigenous
            Cultural Community ?
            <strong>&nbsp;&nbsp;{{ enrollment.IP }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Mother Tongue:&nbsp;&nbsp;<strong>{{
              enrollment.mother_tongue
            }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Contact Number:&nbsp;&nbsp;<strong>{{ enrollment.contact }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Adress:&nbsp;&nbsp;<strong>{{ enrollment.address }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Zip Code:&nbsp;&nbsp;<strong>{{ enrollment.zipcode }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Father's Name:&nbsp;&nbsp;<strong>{{ enrollment.father }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Mother's Name:&nbsp;&nbsp;<strong>{{ enrollment.mother }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Guardian's Name:&nbsp;&nbsp;<strong>{{
              enrollment.guardian
            }}</strong>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            Contact Number:&nbsp;&nbsp;<strong>{{
              enrollment.parent_number
            }}</strong>
          </v-col>
          <v-container v-if="enrollment.enrollment.card_image != 'undefined'">
            <v-img :src="imageUrl + enrollment.enrollment.card_image">
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  />
                </v-row>
              </template>
            </v-img>
          </v-container>
        </v-row>
      </v-card-text>
      <slot name="actions" />
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    enrollment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      //imageUrl: "http://localhost:8000/images/",
      imageUrl: "https://mnhs-enrollment-system.herokuapp.com/images/",
    };
  },
};
</script>
