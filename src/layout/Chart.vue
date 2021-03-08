<template>
  <v-card outlined class="v-card--material-chart">
    <template>
      <chartist
        :data="data"
        :event-handlers="eventHandlers"
        :options="options"
        :ratio="ratio"
        :responsive-options="responsiveOptions"
        :type="type"
        style="max-height: 270px"
      />
    </template>

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

<style>
.v-card--material-chart {
  border-radius: 4px;
  width: 100%;
  height: 340px;
  padding: 0 15px 0 15px;
  display: block;
  max-width: 100%;
  outline: none;
  text-decoration: none;
  overflow-wrap: break-word;
  position: relative;
  white-space: normal;
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    -webkit-box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: box-shadow;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
}

.ct-square {
  background-color: rgb(233, 30, 99);
  border-color: rgb(233, 30, 99);
  border-radius: 4px;
  position: inherit;
  top: -20px;
}

.ct-square > svg {
  padding: 0 15px 0 15px;
}

.ct-labels span {
  color: white;
  font-size: 0.975rem;
  font-weight: 100;
}

.ct-series-a .ct-point,
.ct-series-a .ct-line,
.ct-series-a .ct-bar,
.ct-series-a .ct-slice-donut {
  stroke: rgba(255, 255, 255, 0.8);
}
</style>
