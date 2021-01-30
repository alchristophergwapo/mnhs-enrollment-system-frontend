<template>
  <v-app>
    <v-card-title>
      <v-dialog v-model="dialog" persistent max-width="300px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" small dark v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>Add Section
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Add {{ text }} Sections</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-for="(field, i) in fields"
                :key="i"
                :label="field.label"
                :type="field.type"
                required
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="loading"
              color="error darken-1"
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn :loading="loading" color="blue darken-1" @click="method">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
  </v-app>
</template>

<script>
export default {
  props: [
    "card_item",
    "card_action",
    "card_fields",
    "button_loading",
  ],
  data() {
    return {
      text: this.card_item,
      fields: this.card_fields,
      dialog: false,
      loading: this.button_loading,
      method: this.card_action,
    };
  },
};
</script>