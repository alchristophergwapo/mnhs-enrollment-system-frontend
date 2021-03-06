<template>
  <div>
    <slot name="label" />
    <v-autocomplete
      v-model="model"
      :rules="rules"
      :items="items"
      :filter="searchData"
      :loading="isLoading"
      :item-text="[property]"
      :item-value="[...property]"
      :placeholder="'Search/Select ' + property.split('_')[0] + '...'"
      :prepend-inner-icon="model ? prependIcon : 'mdi-help'"
      dense
      clearable
      outlined
      @change="selectItem"
      @click:clear="clearData"
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            No
            <strong>Data</strong>
          </v-list-item-title>
        </v-list-item>
      </template>
      <template
        v-slot:item="{ item }"
        click
      >
        <v-list-item-avatar
          color="indigo"
          class="headline font-weight-light white--text"
        >
          {{ item[property].charAt(0) }}
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item[property]" />
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
      required: true,
    },
    day: {
      type: String,
      default: 'Monday'
    },
    property: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => {
        return [];
      }
    },
    edit: {
      type: Boolean,
      default: false,
    },
    prependIcon: {
      type: String,
      default: 'mdi-help',
    },
  },
  data() {
    return {
      model: this.modelValue,
      isLoading: false,
      items: [],
      selectedItem: null,
    };
  },
  created() {
    this.retrieveData();
    EventBus.$on("reloadData", () => {
      this.retrieveData();
    });
    EventBus.$on("save", () => {
      this.model = null;
    });
  },
  mounted() {
    this.items = [];

    EventBus.$on("save", () => {
      this.model = null;
    });
  },
  methods: {
    retrieveData() {
      this.items = [];
      let resRef = this.property.split("_")[0];
      let request = this.request;
      if (request != "allNoneAdvisoryTeacher" && request != "allTeacher") {
        request += `/${this.gradelevel}`;
      }
      this.$axios
        .get(request)
        .then((res) => {
          this.items = res.data[resRef];
        })
        .catch(() => {
          this.$swal.fire({
            icon: "warning",
            title: "Ooops!",
            text: "An error encountered!",
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectItem(item) {
      const data = this.items.filter((val) => {
        return val[this.property] == item;
      });
      if (this.edit) {
        EventBus.$emit(`edit${this.request}`, { data: data[0], day: this.day });
      } else {
        EventBus.$emit(`${this.request}`, { data: data[0], day: this.day });
      }
    },
    searchData(item, queryText) {
      const textOne = item[this.property].toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    clearData() {
      EventBus.$emit("clearData", { day: this.day });
    },
  },
};
</script>