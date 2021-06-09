<template>
  <datepicker-lite
    :id-attr="datepickerSetting.id"
    :name-attr="datepickerSetting.name"
    :class-attr="datepickerSetting.class"
    :value-attr="datepickerSetting.value"
    :placeholder-attr="datepickerSetting.placeholder"
    :is-button-type="datepickerSetting.isButtonType"
    :locale="datepickerSetting.locale"
    :year-minus="datepickerSetting.yearMinus"
    :years-range="datepickerSetting.yearsRange"
    :from="datepickerSetting.fromDate"
    :to="datepickerSetting.toDate"
    :disabled-date="datepickerSetting.disabledDate"
    @value-changed="datepickerSetting.changeEvent"
    :disable-input="datepickerSetting.disableInput"
  ></datepicker-lite>
  <datepicker-lite
    :id-attr="datepickerSetting2.id"
    :name-attr="datepickerSetting2.name"
    :class-attr="datepickerSetting2.class"
    :value-attr="datepickerSetting2.value"
    :placeholder-attr="datepickerSetting2.placeholder"
    :is-button-type="datepickerSetting2.isButtonType"
    :locale="datepickerSetting2.locale"
    :year-minus="datepickerSetting2.yearMinus"
    :years-range="datepickerSetting2.yearsRange"
    :from="datepickerSetting2.fromDate"
    :to="datepickerSetting2.toDate"
    :disabled-date="datepickerSetting2.disabledDate"
    @value-changed="datepickerSetting2.changeEvent"
    :disable-input="datepickerSetting2.disableInput"
  ></datepicker-lite>
  <datepicker-lite
    :id-attr="datepickerSetting3.id"
    :name-attr="datepickerSetting3.name"
    :class-attr="datepickerSetting3.class"
    :value-attr="datepickerSetting3.value"
    :placeholder-attr="datepickerSetting3.placeholder"
    :is-button-type="datepickerSetting3.isButtonType"
    :locale="datepickerSetting3.locale"
    :year-minus="datepickerSetting3.yearMinus"
    :years-range="datepickerSetting3.yearsRange"
    :from="datepickerSetting3.fromDate"
    :to="datepickerSetting3.toDate"
    :disabled-date="datepickerSetting3.disabledDate"
    @value-changed="datepickerSetting3.changeEvent"
    :disable-input="datepickerSetting3.disableInput"
    :show-bottom-button="false"
  ></datepicker-lite>
</template>

<script>
import { defineComponent } from "vue";
import DatepickerLite from "./components/DatepickerLite.vue";

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
      placeholder: "Select",
      isButtonType: false,
      yearMinus: 0,
      yearsRange: 100,
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
        months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        startsWeeks: 0,
        todayBtn: "Today",
        clearBtn: "Clear",
        closeBtn: "Close",
      },
      changeEvent: (value) => {
        console.log(value + " selected!");
      },
      disableInput: false,
    };

    const datepickerSetting2 = {
      id: "birthday",
      name: "birthday",
      class: "myDateInput",
      value: "01/10/2020",
      placeholder: "Select",
      isButtonType: false,
      yearMinus: 0,
      yearsRange: 10,
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
        months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        startsWeeks: 0,
        todayBtn: "Today",
        clearBtn: "Clear",
        closeBtn: "Close",
      },
      changeEvent: (value) => {
        console.log(value + " selected!");
      },
      disableInput: false,
    };

    const datepickerSetting3 = {
      id: "birthday",
      name: "birthday",
      class: "myDateInput",
      value: "2020/10/01",
      placeholder: "Select",
      isButtonType: true,
      yearMinus: 0,
      yearsRange: 10,
      fromDate: "2020/02/10",
      toDate: "",
      disabledDate: [],
      locale: {
        format: "YYYY/MM/DD",
        weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        startsWeeks: 0,
        todayBtn: "Today",
        clearBtn: "Clear",
        closeBtn: "Close",
      },
      changeEvent: (value) => {
        console.log(value + " selected!");
      },
      disableInput: false,
    };

    return {
      datepickerSetting,
      datepickerSetting2,
      datepickerSetting3,
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
