<template>
  <div>
    <slot name="label"></slot>
    <v-autocomplete
      v-model="model"
      :rules="[(value) => !!value || 'This field is required.']"
      :items="items"
      :filter="searchData"
      :loading="isLoading"
      clearable
      hide-details
      hide-selected
      color="white"
      item-text="subject_name"
      label="Search ..."
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            No
            <strong>Data</strong>
          </v-list-item-title>
        </v-list-item>
      </template>
      <template v-slot:selection="{ attr, on, item, selected }">
        <v-chip
          v-bind="attr"
          :input-value="selected"
          color="blue-grey"
          class="white--text"
          v-on="on"
        >
          <span v-text="item.subject_name"></span>
        </v-chip>
      </template>
      <template v-slot:item="{ item }" click>
        <v-list-item-avatar
          color="indigo"
          class="headline font-weight-light white--text"
        >
          {{ item.subject_name.charAt(0) }}
        </v-list-item-avatar>
        <v-list-item-content @click="selectItem(item)">
          <v-list-item-title v-text="item.subject_name"></v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import { EventBus } from "../bus/bus";
export default {
  props: {
    request: {
      type: String,
      required: true,
    },
    gradelevel: {
      type: Number,
    },
  },
  data() {
    return {
      model: "",
      isLoading: false,
      items: [],
    };
  },
  created() {
    this.$store
      .dispatch(`${this.request}`, this.gradelevel)
      .then((res) => {
        // console.log(res);
        this.items = res;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
  methods: {
    selectItem(item) {
      EventBus.$emit(`${this.request}`, item);
    },
    searchData(item, queryText, itemText) {
      console.log(itemText);
      const textOne = item.subject_name.toLowerCase();
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1;
    },
  },
};
</script>