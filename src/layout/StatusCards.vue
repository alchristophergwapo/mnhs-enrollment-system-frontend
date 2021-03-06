<template>
  <v-card class="v-card--material-stats" outlined>
    <div class="icon_container" :style="'background:' + icon_background_color">
      <v-icon large>{{ icon }}</v-icon>
    </div>
    <template>
      <div class="ml-auto text-right">
        <div class="body-3 grey--text font-weight-light" v-text="title" />

        <h3 class="display-2 font-weight-light text--primary">
          +{{ value }} <small>{{ smallValue }}</small>
        </h3>
      </div>
    </template>
  </v-card>
</template>

<script>
export default {
  name: "StatusCard",

  //   inheritAttrs: false,

  props: {
    icon: {
      type: String,
      required: true,
    },
    icon_background_color: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: undefined,
    },
    value: {
      type: Number,
      default: undefined,
    },
    smallValue: {
      type: String,
      default: undefined,
    },
  },
};
</script>

<style>
.v-card--material-stats {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 10px 10px 0 10px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.icon_container {
  max-height: 90px;
  width: 90px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-font-feature-settings: "liga";
  font-feature-settings: "liga";
  font-size: 24px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  position: inherit;
  top: -20px;
  text-indent: 0;
  -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.theme--light.v-icon {
  color: white;
}
</style>
