<template>
  <div app>
    <v-card class="student_profile" elevation="3" outlined tile width="100%">
      <v-card-title class="mt-8 justify-center">
        <v-avatar size="100" v-if="student.gender == 'Male'">
          <img src="../../assets/images/avatar.png" alt="" />
        </v-avatar>
        <v-avatar size="100" v-else>
          <img src="../../assets/images/girl_avatar.png" alt="" />
        </v-avatar>
      </v-card-title>
      <v-container>
        <v-card-title class="justify-center"
          >{{ student.firstname }} {{ student.lastname }}
        </v-card-title>
        <v-card-text
          ><strong class="student_details"
            >LRN: {{ student.LRN }}
          </strong></v-card-text
        >
        <v-card-text
          ><strong class="student_details"
            >Grade: {{ student.grade_level }}
          </strong></v-card-text
        >
        <v-card-text
          ><strong class="student_details"
            >Section: {{ student.enrollment.student_section }}
          </strong></v-card-text
        >
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["student_details"],
  data() {
    console.log("stud:", this.student_details);

    return {
      student: this.student_details,
    };
  },
};
</script>

<style>
.student_details {
  margin-left: 20px;
}

.student_profile {
  background: linear-gradient(
    180deg,
    rgba(75, 201, 240, 0.56) -2.54%,
    rgba(196, 196, 196, 0) 97.46%
  );
}
</style>