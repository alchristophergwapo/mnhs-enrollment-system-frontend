<template>
  <v-card
    class="student_profile"
    elevation="3"
    outlined
    tile
    width="100%"
  >
    <v-card-title class="mt-8 justify-center">
      <v-avatar
        v-if="student.gender == 'Male'"
        size="100"
      >
        <img
          src="../../assets/images/avatar.png"
          alt=""
        >
      </v-avatar>
      <v-avatar
        v-else
        size="100"
      >
        <img
          src="../../assets/images/girl_avatar.png"
          alt=""
        >
      </v-avatar>
    </v-card-title>
    <v-container>
      <v-card-title class="justify-center">
        {{ student.firstname }} {{ student.lastname }}
      </v-card-title>
      <v-card-subtitle>
        <div class="text-center">
          S.Y. {{ student.enrollment.start_school_year }} -
          {{ student.enrollment.end_school_year }}
        </div>
      </v-card-subtitle>
      <v-card-text>
        <div class="info-data">
          <div class="info-label">
            LRN:
          </div>
          <div>
            <strong class="student_details">{{ student.LRN }} </strong>
          </div>
        </div>
        <div class="info-data">
          <div class="info-label">
            Grade:
          </div>
          <strong class="student_details">
            {{ student.enrollment.grade_level }}
          </strong>
        </div>
        <div class="info-data">
          <div class="info-label">
            Section:
          </div>
          <strong class="student_details">
            {{ student.section.name }}
          </strong>
        </div>
        <div class="info-data">
          <div class="info-label">
            Enrollment Remarks:
          </div>
          <strong class="student_details">
            <span class="teal--text text--darken-4 text">{{
              student.enrollment.enrollment_remarks
            }}</span>
          </strong>
        </div>
      </v-card-text>
      <div class="enroll-now">
        <v-btn
          color="primary"
          block
          :disabled="student.enrollment.enrollment_remarks != 'PASSED'"
          @click="enrollNow()"
        >
          Enroll for Grade {{ student.enrollment.grade_level + 1 }}
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {studentDetails: {
    type: Object,
    default: () => {
      return {};
    }
  }},
  data() {
    return {
      student: this.studentDetails,
    };
  },
  methods: {
    enrollNow() {
      console.log(this.student);
      const data = {
        start_school_year: this.student.enrollment.end_school_year,
        end_school_year: this.student.enrollment.end_school_year + 1,
        grade_level: this.student.enrollment.grade_level + 1,
        specialization: this.student.enrollment.specialization,
        student_id: this.student.id,
      };
      this.$axios
        .post("enroll", data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
.student_details span.text {
  font-size: 18px;
}

.student_profile {
  margin-top: -20px;
  background: linear-gradient(
    180deg,
    rgba(75, 201, 240, 0.56) -2.54%,
    rgba(196, 196, 196, 0) 97.46%
  );
}

.info-data {
  display: grid;
  grid-template-columns: 60% 40%;
  align-content: center;
  align-items: center;
  margin-bottom: 15px;
}
</style>
