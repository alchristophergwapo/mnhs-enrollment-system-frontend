<template>
  <v-btn>{{}}</v-btn>
</template>

<script>
export default {
  props: {
    btnProperties: {
      type: Object,
      required: true,
    },
  },
};
</script>