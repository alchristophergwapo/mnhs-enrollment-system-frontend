<template>
  <v-app>
    <v-container
      style="padding: 0"
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
        style="height: 100% !important"
      >
        <div class="text-center display-2 font-weight-light">
          <span><h1>Ooops!</h1></span><br>
          Page not Found
          <br>
          <br>
          <v-btn
            class="my-3"
            large
            to="/"
            color="#006a4e"
          >
            Back to home
          </v-btn>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped lang="scss">
.container {
  height: 100vh;

  .text-center {
    text-align: center;
  }
  .my-3 {
    // background-color: ;
  }
}
</style>