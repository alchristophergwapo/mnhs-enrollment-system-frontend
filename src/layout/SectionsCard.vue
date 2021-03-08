<template>
  <v-card outlined class="sections-base-card">
    <div class="icon-container" :style="'background:' + icon_background_color">
      <v-icon large>mdi-home-group</v-icon>
      <h3 class="display-1 font-weight-light text--primary">
        {{ section }}
      </h3>
    </div>
    <template> </template>
    <v-card-text>
      <div>
        <v-icon color="black">mdi-home-account</v-icon>
        Capacity: {{ capacity }}
      </div>
    </v-card-text>
    <v-card-text>
      <v-icon color="black">mdi-account-box</v-icon>
      Adviser: {{ teacher }}
    </v-card-text>
    <v-card-text>
      <div class="ml-auto text-right">
        <slot name="edit"></slot>
      </div>
    </v-card-text>
    <v-progress-linear :value="(total_students / capacity) * 100" height="25">
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
    icon_background_color: {
      type: String,
      default: undefined,
    },
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
  },
};
</script>

<style>
.sections-base-card {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 10px;
  margin: 20px;
}

.icon-container {
  height: 60px;
  max-height: 60px;
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