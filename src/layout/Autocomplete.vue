<template>
  <div>
    <slot name="label"></slot>
    <v-autocomplete
      v-model="model"
      :rules="rules"
      :items="items"
      :filter="searchData"
      :loading="isLoading"
      :item-text="[property]"
      :placeholder="'Search/Select ' + property.split('_')[0] + '...'"
      :prepend-inner-icon="model ? prepend_icon : 'mdi-help'"
      auto-select-first
      dense
      clearable
      hide-details
      hide-selected
      outlined
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            No
            <strong>Data</strong>
          </v-list-item-title>
        </v-list-item>
      </template>
      <template v-slot:item="{ item }" click>
        <v-list-item-avatar
          color="indigo"
          class="headline font-weight-light white--text"
          @click="selectItem(item)"
        >
          {{ item[property].charAt(0) }}
        </v-list-item-avatar>
        <v-list-item-content
          @click="selectItem(item)"
          @mousedown="selectItem(item)"
        >
          <v-list-item-title v-text="item[property]"></v-list-item-title>
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
    },
    property: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
    },
    rules: {
      type: Array,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    prepend_icon: {
      type: String,
    },
  },
  data() {
    return {
      model: this.modelValue,
      isLoading: false,
      items: [],
      schedules: {
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null,
      },
      selectedItem: null,
    };
  },
  created() {
    this.items = [];
    console.log(this.modelValue);
    let resRef = this.property.split("_")[0];
    let request = this.request;
    if (request != "allNoneAdvisoryTeacher" && request != "allTeacher") {
      request += `/${this.gradelevel}`;
    }
    this.$axios
      .get(request)
      .then((res) => {
        // console.log(res);
        this.items = res.data[resRef];
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
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
    selectItem(item) {
      // this.selectedItem = item;
      // this.schedules[this.day] =
      //   item[this.property] + " (" + item.teacher_name + ")";
      if (this.edit) {
        EventBus.$emit(`edit${this.request}`, { data: item, day: this.day });
      } else {
        EventBus.$emit(`${this.request}`, { data: item, day: this.day });
      }
    },
    searchData(item, queryText) {
      // console.log(itemText);
      const textOne = item[this.property].toLowerCase();
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1;
    },
  },
};
</script>