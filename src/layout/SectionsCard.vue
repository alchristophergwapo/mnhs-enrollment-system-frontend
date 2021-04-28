<template>
  <v-card outlined class="sections-base-card" elevation="8">
    <!-- <v-card class="icon-container" outlined elevation="4"> -->
    <div class="text-center justify-center" style="width: 100%">
      <v-icon large color="primary">mdi-home-group</v-icon>
      <h3 class="display-1 font-weight-light">
        {{ section }}
      </h3>
    </div>

    <!-- </v-card> -->
    <template> </template>
    <v-card-text>
      <div>
        <v-icon color="primary">mdi-home-account</v-icon>
        Capacity: {{ capacity }}
      </div>
    </v-card-text>
    <v-card-text>
      <v-icon color="primary">mdi-account-box</v-icon>
      Adviser: <span v-if="teacher">{{ teacher }}</span
      ><span v-else>None</span>
    </v-card-text>
    <v-card-actions>
      <!-- <div class="ml-auto text-right"> -->
      <slot name="btns"></slot>
      <!-- </div> -->
    </v-card-actions>
    <v-progress-linear
      :value="(total_students / capacity) * 100"
      height="25"
      :color="total_students === capacity ? 'red darken-3' : progress_color"
    >
      <strong>
        {{ total_students }} Student(s) Enrolled
      </strong> </v-progress-linear
    ><br />
  </v-card>
</template>

<script>
export default {
  name: "SectionsCard",
  props: {
    section: {
      type: String,
      default: undefined,
    },
    capacity: {
      type: Number,
      default: undefined,
    },
    total_students: {
      type: Number,
    },
    teacher: {
      type: String,
    },
    progress_color: {
      type: String,
    },
  },
};
</script>

<style>
.sections-base-card {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 20px;
  margin: 10px;
}

.icon-container {
  height: 60px;
  max-height: 80px;
  width: 100%;
  align-items: center;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  font-size: 24px;
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  position: inherit;
  top: -20px;
  text-indent: 0;
  vertical-align: middle;
}
</style>