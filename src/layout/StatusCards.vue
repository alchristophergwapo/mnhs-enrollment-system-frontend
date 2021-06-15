<template>
  <v-card
    class="v-card--material-stats"
    outlined
  >
    <div
      class="icon_container"
      :style="'background:' + icon_background_color + ';'"
    >
      <v-icon
        color="white"
        large
      >
        {{ icon }}
      </v-icon>
    </div>
    <template>
      <div class="ml-auto text-right">
        <div
          class="body-3 grey--text font-weight-light"
          v-text="title"
        />

        <h3 class="display-2 font-weight-light text--primary">
          {{ value }} <small>{{ smallValue }}</small>
        </h3>
      </div>
    </template>
    <slot name="actions" />
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
</style>
