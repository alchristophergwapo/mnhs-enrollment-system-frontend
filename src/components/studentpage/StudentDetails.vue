<template>
  <v-app>
    <v-card class="student_profile" elevation="3" outlined tile width="100%">
      <v-card-title class="mt-8 justify-center">
        <v-avatar v-if="student.gender == 'Male'" size="100">
          <img src="../../assets/images/avatar.png" alt="" />
        </v-avatar>
        <v-avatar v-else size="100">
          <img src="../../assets/images/girl_avatar.png" alt="" />
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
              {{ student.section ? student.section.name : "NA" }}
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
            @click="enrollMe()"
          >
            Enroll for Grade {{ enrollment.grade_level + 1 }}
          </v-btn>
        </div>
      </v-container>
    </v-card>

    <v-dialog
      v-model="additionalInfoDialog"
      persistent
      max-width="500px"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <br />
        <div v-if="!forSeniorHigh">
          <div class="text-center text-h6">
            Select specialization
          </div>
          <br />
          <v-card-text>
            <label for="">Select Specialization</label>
            <v-select
              v-model="enrollment.specialization"
              name="specialization"
              :items="specializations"
              :rules="[(v) => !!v || 'Required']"
              hide-details="auto"
              clearable
              dense
              outlined
              required
              @click:clear="specialization = null"
            >
            </v-select>
          </v-card-text>
        </div>
        <div v-else>
          <div class="text-center text-h6">
            Fill up the needed data below
          </div>
          <br />
          <v-card-text>
            <p class="checkbox-label">
              <v-icon slot="start" color="red" x-small>
                mdi-asterisk
              </v-icon>
              Semester
            </p>
            <v-row>
              <v-col cols="6">
                <v-checkbox
                  v-model="seniorHigh.semester"
                  :rules="[(semester) => !!semester || 'Semester is required.']"
                  dense
                  hide-details="auto"
                  label="First Semester"
                  value="First Semester"
                  type="checkbox"
                  :required="seniorHigh.semester ? false : true"
                />
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="seniorHigh.semester"
                  :rules="[(semester) => !!semester || 'Semester is required.']"
                  label="Second Semester"
                  value="Second Semester"
                  type="checkbox"
                  dense
                  hide-details="auto"
                  :required="seniorHigh.semester ? false : true"
                />
              </v-col>
            </v-row>
            <br>
            <v-select
              v-model="seniorHigh.track"
              :rules="[(track) => !!track || 'Track is required.']"
              :items="tracks"
              label="Track"
              outlined
              required
            >
              <v-icon slot="prepend-inner" color="red" x-small>
                mdi-asterisk
              </v-icon>
            </v-select>
            <v-select
              v-model="seniorHigh.strand"
              :items="strands[0][seniorHigh.track]"
              :rules="[(strand) => !!strand || 'Strand is required.']"
              label="Strand"
              outlined
              required
            >
              <v-icon slot="prepend-inner" color="red" x-small>
                mdi-asterisk
              </v-icon>
            </v-select>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="danger"
            class="white--text px-6"
            @click="closeSpecializationDialog()"
            >Cancel</v-btn
          >
          <v-btn color="primary" class="px-6" @click="enrollNow()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { EventBus } from "../../bus/bus";
export default {
  props: {
    studentDetails: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      student: this.studentDetails,
      enrollment: this.studentDetails.enrollment[
        this.studentDetails.enrollment.length - 1
      ],
      specializations: ["Agriculture", "Electricity", "Household", "ICT"],
      additionalInfoDialog: false,
      forSeniorHigh: false,
      tracks: ["ACADEMIC TRACK", "TECHNICAL-VOCATIONAL LIVELIHOOD (TLV) TRACK"],
      strands: [
        {
          "ACADEMIC TRACK": [
            "ACCOUNTANCY, BUSINESS AND MANAGEMENT (ABM) STRAND",
            "HUMANITIES AND SOCIAL SCIENCES STRAND (HUMSS)",
            "SCIENCE, TECHNOLOGY, ENGINEERING AND MATHEMATICS (STEM) STRAND",
          ],
          "TECHNICAL-VOCATIONAL LIVELIHOOD (TVL) TRACK": ["AGRI-FISHERY ARTS"],
        },
      ],
      seniorHigh: {
        semester: null,
        track: "",
        strand: "",
      },
    };
  },

  created() {
    console.log(this.enrollment);
    if (this.enrollment.grade_level === 10) {
      this.forSeniorHigh = true;
    }
  },

  methods: {
    enrollMe() {
      if (this.enrollment.grade_level === 8) {
        this.additionalInfoDialog = true;
      }
      if (this.enrollment.grade_level === 10) {
        this.additionalInfoDialog = true;
      } else {
        this.enrollNow();
      }
    },

    enrollNow() {
      console.log(this.student);
      let noError = false;
      const data = {
        start_school_year: this.enrollment.end_school_year,
        end_school_year: this.enrollment.end_school_year + 1,
        grade_level: this.enrollment.grade_level + 1,
        specialization: this.enrollment.specialization,
        student_id: this.student.id,
        semester: this.seniorHigh.semester,
        track: this.seniorHigh.track,
        strand: this.seniorHigh.strand,
      };
      if (this.enrollment.grade_level === 8) {
        if (
          this.enrollment.specialization != null &&
          this.enrollment.specialization != ""
        ) {
          noError = true;
        }
      }

      if (noError) {
        this.$axios
          .post("enroll", data)
          .then((res) => {
            this.showResponse("success", "", res.data.success);
            EventBus.$emit("enrolled");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    closeSpecializationDialog() {
      this.additionalInfoDialog = false;
      this.enrollment.specializations = null;
    },

    showResponse(icon, title, message) {
      this.$swal.fire({
        icon: icon,
        title: title,
        text: message,
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
