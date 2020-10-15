<template>
  <datepicker-lite
    :id-attr="datepickerSetting.id"
    :name-attr="datepickerSetting.name"
    :class-attr="datepickerSetting.class"
    :value-attr="datepickerSetting.value"
    :locale="datepickerSetting.locale"
    @value-changed="datepickerSetting.changeEvent"
  ></datepicker-lite>
</template>

<script>
import { defineComponent } from "vue";
import DatepickerLite from "./components/DatepickerLite";

export default defineComponent({
  name: "App",
  components: {
    DatepickerLite,
  },
  setup() {
    const datepickerSetting = {
      id: "birthday",
      name: "birthday",
      class: "myDateInput",
      value: "2020/10/01",
      locale: {
        weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        todayBtn: "Today",
        clearBtn: "Clear",
        closeBtn: "Close",
      },
      changeEvent: (value) => {
        console.log(value + " selected!");
      }
    }

    return {
      datepickerSetting
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
