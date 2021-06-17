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
          S.Y. {{ enrollment.start_school_year }} -
          {{ enrollment.end_school_year }}
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
            {{ enrollment.grade_level }}
          </strong>
        </div>
        <div class="info-data">
          <div class="info-label">
            Section:
          </div>
          <strong class="student_details">
            {{ student.section ? student.section.name : 'NA' }}
          </strong>
        </div>
        <div class="info-data">
          <div class="info-label">
            Enrollment Remarks:
          </div>
          <strong class="student_details">
            <span class="teal--text text--darken-4 text">{{
              enrollment.enrollment_remarks
            }}</span>
          </strong>
        </div>
      </v-card-text>
      <div class="enroll-now">
        <v-btn
          color="primary"
          block
          :disabled="enrollment.enrollment_remarks != 'PASSED'"
          @click="enrollNow()"
        >
          Enroll for Grade {{ enrollment.grade_level + 1 }}
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import { EventBus } from '../../bus/bus';
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
      enrollment: this.studentDetails.enrollment[this.studentDetails.enrollment.length - 1]
    };
  },
  methods: {
    enrollNow() {
      console.log(this.student);
      const data = {
        start_school_year: this.enrollment.end_school_year,
        end_school_year: this.enrollment.end_school_year + 1,
        grade_level: this.enrollment.grade_level + 1,
        specialization: this.enrollment.specialization,
        student_id: this.student.id,
      };
      this.$axios
        .post("enroll", data)
        .then((res) => {
          this.showResponse('success', '', res.data.success);
          EventBus.$emit('enrolled');
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showResponse(icon, title, message) {
      this.$swal.fire({
        icon: icon,
        title: title,
        text: message
      });
    }
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
