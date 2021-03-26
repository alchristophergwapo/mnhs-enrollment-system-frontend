<template>
  <div>
    <div class="add_btn">
      <v-card>
        <v-card-title class="headlineSection">
          <span>{{ type }} Section</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <slot name="input-field"></slot>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <slot name="actions"></slot>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
    },
  },
};
</script>