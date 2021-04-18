<template>
  <div app>
    <v-data-table
      :headers="headers"
      :items="schedules"
      item-key="Time"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.Time }}</td>
          <td>
            {{ row.item.Monday.subject_name }}<br />
            <strong>{{ row.item.Monday.teacher_name }}</strong>
          </td>
          <td>
            {{ row.item.Tuesday.subject_name }}<br />
            <strong>{{ row.item.Tuesday.teacher_name }}</strong>
          </td>
          <td>
            {{ row.item.Wednesday.subject_name }}<br />
            <strong>{{ row.item.Wednesday.teacher_name }}</strong>
          </td>
          <td>
            {{ row.item.Thursday.subject_name }}<br />
            <strong>{{ row.item.Thursday.teacher_name }}</strong>
          </td>
          <td>
            {{ row.item.Friday.subject_name }}<br />
            <strong>{{ row.item.Friday.teacher_name }}</strong>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-container>
      <v-btn @click="csvExport(csvData)" dark color="teal">Download File</v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    sectionId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      headers: [
        { text: "Time", value: "Time", sortable: false },
        { text: "Monday", value: "Monday", sortable: false },
        { text: "Tuesday", value: "Tuesday", sortable: false },
        { text: "Wednesday", value: "Wednesday", sortable: false },
        { text: "Thursday", value: "Thursday", sortable: false },
        { text: "Friday", value: "Friday", sortable: false },
      ],
      schedules: [],
    };
  },
  created() {
    this.$axios.get(`classSchedules/` + this.sectionId).then((res) => {
      const schedules = res.data.schedules;

      let sched = {
        Time: null,
        Monday: {
          subject_name: null,
          teacher_name: null,
        },
        Tuesday: {
          subject_name: null,
          teacher_name: null,
        },
        Wednesday: {
          subject_name: null,
          teacher_name: null,
        },
        Thursday: {
          subject_name: null,
          teacher_name: null,
        },
        Friday: {
          subject_name: null,
          teacher_name: null,
        },
      };
      let count = 0;
      let friday = false;
      for (const index in schedules) {
        if (schedules.hasOwnProperty.call(schedules, index)) {
          const element = schedules[index];
          sched.Time = `${element.start_time}-${element.end_time}`;
          if (element.day == "Monday") {
            sched.Monday.subject_name = element.subject_name;
            sched.Monday.teacher_name = element.teacher_name;
            count += 1;
          }
          if (element.day == "Tuesday") {
            sched.Tuesday.subject_name = element.subject_name;
            sched.Tuesday.teacher_name = element.teacher_name;
            count += 1;
          }
          if (element.day == "Wednesday") {
            sched.Wednesday.subject_name = element.subject_name;
            sched.Wednesday.teacher_name = element.teacher_name;
            count += 1;
          }
          if (element.day == "Thursday") {
            sched.Thursday.subject_name = element.subject_name;
            sched.Thursday.teacher_name = element.teacher_name;
            count += 1;
          }
          if (element.day == "Friday") {
            sched.Friday.subject_name = element.subject_name;
            sched.Friday.teacher_name = element.teacher_name;
            friday = true;
            count += 1;
          }
        }
        if (count == 5 && friday) {
          this.schedules.push(sched);
          sched = {
            Time: null,
            Monday: {
              subject_name: null,
              teacher_name: null,
            },
            Tuesday: {
              subject_name: null,
              teacher_name: null,
            },
            Wednesday: {
              subject_name: null,
              teacher_name: null,
            },
            Thursday: {
              subject_name: null,
              teacher_name: null,
            },
            Friday: {
              subject_name: null,
              teacher_name: null,
            },
          };
        }
      }
      //   console.log(this.schedules);
    });
  },
  methods: {
    //Dowloadcsv
    csvExport(arrData) {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(arrData[0]),
        ...arrData.map((item) => Object.values(item)),
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");
      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", this.selectGrade + ".csv");
      link.click();
    },
  },
  computed: {
    csvData() {
      return this.students.map((item) => ({
        SchoolYear: item.student.created_at
          .substring(0, item.student.created_at.indexOf("-"))
          .concat(
            "-",
            parseInt(
              item.student.created_at.substring(
                0,
                item.student.created_at.indexOf("-")
              )
            ) + 1
          ),
        GradeLevel: item.student.grade_level,
        Section: item.student_section,
        StudentName: item.student.firstname + " " + item.student.lastname,
        Age: item.student.age,
        Address: item.student.address.replace(/[^a-zA-Z ]/g, " "),
        //Address:item.student.address.replaceAll(","," ").replaceAll(/\s+/g," ")
      }));
    },
  },
};
</script>