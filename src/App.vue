<template>
  <v-fade-transition mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
export default {
  name: "App",
  metaInfo: {
    title: "App",
    titleTemplate: "%s | MNHS Enrollment",
    htmlAttrs: { lang: "en" },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  },

  created() {
    this.initializeData();
  },

  methods: {
    initializeData() {
      this.$store.dispatch("allTeacher");

      this.$store.dispatch("allStudents");

      this.$store.dispatch("allSections");

      this.$store.dispatch("allPendingEnrollments");

      this.$store.dispatch("allDeclinedEnrollments");
    },
  },
};
</script>

<style>
.extra-padding {
  padding-bottom: 96px !important;
  padding-top: 96px !important;
}

.v-main {
  background-color: #eee;
  padding-bottom: 48px;
}

@media screen and (max-width: 959px) {
  .extra-padding {
    padding-top: 48px !important;
    padding-bottom: 48px !important;
  }
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #006a4e;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: blue;
}
</style>
