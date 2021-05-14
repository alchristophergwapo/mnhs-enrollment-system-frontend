<template>
  <v-container>
    <v-card
      class="input-card pa-4"
      width="100%"
      :max-width="card_properties.max_width"
      outlined
      elevation="24"
    >
      <v-card-title>
        <v-row>
          <v-icon v-if="card_properties.icon">
            {{ card_properties.icon }}
          </v-icon>
          <h3 v-if="card_properties.title">{{ card_properties.title }}</h3>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <br />
      <v-container>
        <slot name="card_form"></slot>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="card_btns"></slot>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "InputCard",
  props: {
    card_properties: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.input-card {
  margin: auto;
}
</style>