<template>
  <v-toolbar color="#E5E5E5" flat>
    <v-toolbar-title>
      <h4>{{ page_name }}</h4>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-icon color="black">mdi-home</v-icon>
    <v-breadcrumbs :items="items"></v-breadcrumbs>
  </v-toolbar>
</template>

<script>
export default {
  props: ["item", "page_name"],
  data() {
    return {
      items: this.item,
      page: this.page,
    };
  },
};
</script>