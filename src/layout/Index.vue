<template>
  <v-app>
    <side-bar></side-bar>
    <app-bar></app-bar>
    <v-main>
      <div class="main-view">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "HomeLayout",
  components: {
    SideBar: () => import("@/layout/SideBar.vue"),
    AppBar: () => import("@/layout/AppBar.vue"),
  },
  data(){
      return{
          drawer: true,
          menuOpen: false,
      }
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    mini() {
      return !(this.mdAndUp || this.menuOpen);
    },
    breakpoint() {
      return JSON.stringify(this.$vuetify.breakpoint, null, 2);
    }
  }
};
</script>

<style>
.main-view {
  margin: 10px;
}

.nav-link {
  margin-bottom: 15px;
  padding-bottom: 5px;
  padding-top: 5px;
}

.nav-link:hover {
  background: rgba(59, 189, 218, 0.5);
}

.nav-link:active {
  background-color: rgba(59, 189, 218);
}

.nav-def {
  position: absolute;
  left: 80px;
}

img.icon {
  height: 35px;
  width: auto;
}

.label {
  margin-right: 20px;
}
</style>