<template>
  <v-toolbar color="#E5E5E5" flat>
    <v-toolbar-title>
      <h4>{{ pageName }}</h4>
    </v-toolbar-title>
    <v-spacer />
    <v-icon color="black">
      mdi-home
    </v-icon>
    <v-breadcrumbs :items="items" />
  </v-toolbar>
</template>

<script>
export default {
  props: {
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pageName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      items: this.item,
      page: this.page,
    };
  },
};
</script>
