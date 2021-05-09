<template>
  <div app>
    <v-data-table
      :headers="headers"
      :items="schedules"
      item-key="Time"
      :loading="isDataNotLoaded"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td>
            {{ row.item.Monday.subject_name }}<br />
            <strong
              >{{ row.item.Monday.teacher_name }} <br />
              <span v-if="row.item.Monday.teacher_name">{{
                row.item.Monday.time
              }}</span>
            </strong>
          </td>
          <td>
            {{ row.item.Tuesday.subject_name }}<br />
            <strong
              >{{ row.item.Tuesday.teacher_name }} <br />
              <span v-if="row.item.Tuesday.teacher_name">{{
                row.item.Tuesday.time
              }}</span>
            </strong>
          </td>
          <td>
            {{ row.item.Wednesday.subject_name }}<br />
            <strong
              >{{ row.item.Wednesday.teacher_name }} <br />
              <span v-if="row.item.Wednesday.teacher_name">{{
                row.item.Wednesday.time
              }}</span>
            </strong>
          </td>
          <td>
            {{ row.item.Thursday.subject_name }}<br />
            <strong
              >{{ row.item.Thursday.teacher_name }} <br />
              <span v-if="row.item.Thursday.teacher_name">{{
                row.item.Thursday.time
              }}</span>
            </strong>
          </td>
          <td>
            {{ row.item.Friday.subject_name }}<br />
            <strong
              >{{ row.item.Friday.teacher_name }} <br />
              <span v-if="row.item.Friday.teacher_name">{{
                row.item.Friday.time
              }}</span>
            </strong>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-container>
      <v-btn @click="csvExport(csvData)" dark color="teal"
        >Download Schedules</v-btn
      >
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
        { text: "Monday", value: "Monday", sortable: false },
        { text: "Tuesday", value: "Tuesday", sortable: false },
        { text: "Wednesday", value: "Wednesday", sortable: false },
        { text: "Thursday", value: "Thursday", sortable: false },
        { text: "Friday", value: "Friday", sortable: false },
      ],
      schedules: [],
      isDataNotLoaded: false,
    };
  },
  created() {
    this.isDataNotLoaded = false;
    this.$axios
      .get(`classSchedules/` + this.sectionId)
      .then((res) => {
        const schedules = res.data.sectionSchedules;

        let sched = {
          Monday: {
            subject_name: null,
            teacher_name: null,
            time: null,
          },
          Tuesday: {
            subject_name: null,
            teacher_name: null,
            time: null,
          },
          Wednesday: {
            subject_name: null,
            teacher_name: null,
            time: null,
          },
          Thursday: {
            subject_name: null,
            teacher_name: null,
            time: null,
          },
          Friday: {
            subject_name: null,
            teacher_name: null,
            time: null,
          },
        };
        let count = 0;
        let next = false;
        for (const index in schedules) {
          if (schedules.hasOwnProperty.call(schedules, index)) {
            const element = schedules[index];
            if (sched[element.day].subject_name == null)
              (sched[element.day].subject_name = element.subject_name),
                (sched[element.day].teacher_name = element.teacher_name),
                (sched[element.day].time =
                  element.start_time + " - " + element.end_time),
                (count += 1);
            else (next = true), (count = 0);
          }
          if (count == 5 || next) {
            this.schedules.push(sched);
            count = 0;
            sched = {
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
        this.isDataNotLoaded = false;
      })
      .catch(() => {
        this.isDataNotLoaded = false;
        this.$swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "An error occured!",
        });
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
      link.setAttribute("download", "mySchedules" + ".csv");
      link.click();
    },
  },
  computed: {
    csvData() {
      return this.schedules.map((item) => ({
        Monday: item.Monday.subject_name
          ? item.Monday.subject_name + " (" + item.Monday.teacher_name + ")"
          : "",
        Tuesday: item.Tuesday.subject_name
          ? item.Tuesday.subject_name + " (" + item.Tuesday.teacher_name + ")"
          : "",
        Wednesday: item.Wednesday.subject_name
          ? item.Wednesday.subject_name +
            " (" +
            item.Wednesday.teacher_name +
            ")"
          : "",
        Thursday: item.Thursday.subject_name
          ? item.Thursday.subject_name + " (" + item.Thursday.teacher_name + ")"
          : "",
        Friday: item.Friday.subject_name
          ? item.Friday.subject_name + " (" + item.Friday.teacher_name + ")"
          : "",
      }));
    },
  },
};
</script>