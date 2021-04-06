<template>
  <div>
    <slot name="label"></slot>
    <v-autocomplete
      v-model="model"
      :rules="rules"
      :items="items"
      :filter="searchData"
      :loading="isLoading"
      clearable
      hide-details
      hide-selected
      color="white"
      :item-text="[property]"
      :label="'Search/Select ' + property.split('_')[0] + '...'"
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
      default: "",
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

    EventBus.$on("save", () => {
      // console.log(data);
      this.model = null;
    });

    // EventBus.$on("closeModal", () => {

    // });
  },
  mounted() {
    this.items = [];
    console.log(this.gradelevel);
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

    EventBus.$on("save", () => {
      // console.log(data);
      this.model = null;
    });

    // EventBus.$on("closeModal", () => {

    // });
  },
  methods: {
    selectItem(item) {
      // this.selectedItem = item;
      // this.schedules[this.day] =
      //   item[this.property] + " (" + item.teacher_name + ")";
      EventBus.$emit(`${this.request}`, { data: item, day: this.day });
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