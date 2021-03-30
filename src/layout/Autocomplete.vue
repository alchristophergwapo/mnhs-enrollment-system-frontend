<template>
  <div>
    <slot name="label"></slot>
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      chips
      clearable
      hide-details
      hide-selected
      item-text="name"
      item-value="symbol"
      :label="'Search ...'"
      solo
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
          <!-- <v-icon left> mdi-bitcoin </v-icon> -->
          <span v-text="item.name"></span>
        </v-chip>
      </template>
      <template v-slot:item="{ item }" click>
        <v-list-item-avatar
          color="indigo"
          class="headline font-weight-light white--text"
        >
          {{ item.name.charAt(0) }}
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
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
      search: "",
      items: [],
    };
  },
  watch: {
    search(val) {
      console.log(val);

      if (this.items.length > 0) return;
      this.isLoading = true;

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
  },
  created() {
    console.log(this.gradelevel);
  },
};
</script>