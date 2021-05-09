<template>
  <v-card class="v-card--material-chart" color="#e6e6e6">
    <chartist
      :data="data"
      :event-handlers="eventHandlers"
      :options="options"
      :ratio="ratio"
      :responsive-options="responsiveOptions"
      :type="type"
      style="max-height: 300px"
    />

    <slot slot="reveal-actions" name="reveal-actions" />

    <slot />

    <slot slot="actions" name="actions" />
  </v-card>
</template>

<script>
export default {
  name: "MaterialChartCard",

  inheritAttrs: false,

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    eventHandlers: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    ratio: {
      type: String,
      default: undefined,
    },
    responsiveOptions: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      required: true,
      validator: (v) => ["Bar", "Line", "Pie"].includes(v),
    },
  },
};
</script>
