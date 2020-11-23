<template>
  <datepicker-lite
    :id-attr="datepickerSetting.id"
    :name-attr="datepickerSetting.name"
    :class-attr="datepickerSetting.class"
    :value-attr="datepickerSetting.value"
    :locale="datepickerSetting.locale"
    :year-minus="datepickerSetting.yearMinus"
    :from="datepickerSetting.fromDate"
    :to="datepickerSetting.toDate"
    :disabled-date="datepickerSetting.disabledDate"
    @value-changed="datepickerSetting.changeEvent"
    :disableInput="datepickerSetting.disableInput"
  ></datepicker-lite>
  <datepicker-lite
    :id-attr="datepickerSetting2.id"
    :name-attr="datepickerSetting2.name"
    :class-attr="datepickerSetting2.class"
    :value-attr="datepickerSetting2.value"
    :locale="datepickerSetting2.locale"
    :year-minus="datepickerSetting2.yearMinus"
    :from="datepickerSetting2.fromDate"
    :to="datepickerSetting2.toDate"
    :disabled-date="datepickerSetting2.disabledDate"
    @value-changed="datepickerSetting2.changeEvent"
    :disableInput="datepickerSetting2.disableInput"
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
      yearMinus: 0,
      fromDate: "2020/02/10",
      toDate: "2021/02/10",
      disabledDate: [
        "2020/10/02",
        "2020/10/03",
        "2020/10/04",
        "2020/10/05",
        "2020/10/06",
      ],
      locale: {
        format: "YYYY/MM/DD",
        weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        todayBtn: "Today",
        clearBtn: "Clear",
        closeBtn: "Close",
      },
      changeEvent: (value) => {
        console.log(value + " selected!");
      },
      disableInput: false,
    }

    const datepickerSetting2 = {
      id: "birthday",
      name: "birthday",
      class: "myDateInput",
      value: "01/10/2020",
      yearMinus: 0,
      fromDate: "10/02/2020",
      toDate: "10/02/2021",
      disabledDate: [
        "02/10/2020",
        "03/10/2020",
        "04/10/2020",
        "05/10/2020",
        "06/10/2020",
      ],
      locale: {
        format: "DD-MM-YYYY",
        weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        todayBtn: "Today",
        clearBtn: "Clear",
        closeBtn: "Close",
      },
      changeEvent: (value) => {
        console.log(value + " selected!");
      },
      disableInput: false,
    }

    return {
      datepickerSetting,
      datepickerSetting2
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
