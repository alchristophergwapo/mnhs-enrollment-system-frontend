<template>
  <div>
    <v-alert v-if="type == 'error'" type="error"> {{ message }} </v-alert>
    <v-alert v-if="type == 'success'" type="success">{{ message }}</v-alert>
  </div>
</template>

<script>
export default {
  props: ["alert_message", "alert_type"],
  data() {
    return {
      message: this.alert_message,
      type: this.alert_type,
    };
  },
};
</script>