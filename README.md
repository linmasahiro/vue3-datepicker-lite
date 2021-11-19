# vue3-datepicker-lite

[![Lincense](https://img.shields.io/github/license/linmasahiro/vue3-datepicker-lite)](https://github.com/linmasahiro/vue3-datepicker-lite/blob/master/LICENSE) 
[![NPM](https://img.shields.io/npm/v/vue3-datepicker-lite)](https://www.npmjs.com/package/vue3-datepicker-lite)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/linmasahiro/vue3-datepicker-lite)](https://github.com/linmasahiro/vue3-datepicker-lite)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Flinmasahiro.github.io%2Fvue3-datepicker-lite%2Fdist%2F)](https://linmasahiro.github.io/vue3-datepicker-lite/dist/)
[![npm](https://img.shields.io/npm/dm/vue3-datepicker-lite)](https://www.npmjs.com/package/vue3-datepicker-lite)

![GitHub Repo stars](https://img.shields.io/github/stars/linmasahiro/vue-scheduler-lite?style=social)
![GitHub forks](https://img.shields.io/github/forks/linmasahiro/vue-scheduler-lite?style=social)

![SampleGif](https://linmasahiro.github.io/vue3-datepicker-lite/sample.gif)

A simple datepicker component support Vue3.0!!

## DEMO

[Online Demo](https://linmasahiro.github.io/vue3-datepicker-lite/dist/)

## SampleCode

### import
    import DatepickerLite from "vue3-datepicker-lite";

### component
    <datepicker-lite
        :id-attr="datepickerSetting.id"
        :name-attr="datepickerSetting.name"
        :class-attr="datepickerSetting.class"
        :value-attr="datepickerSetting.value"
        :placeholder-attr="datepickerSetting.placeholder"
        :is-button-type="datepickerSetting.isButtonType"
        :year-minus="datepickerSetting.yearMinus"
        :years-range="100"
        :from="datepickerSetting.fromDate"
        :to="datepickerSetting.toDate"
        :disabled-date="datepickerSetting.disabledDate"
        :locale="datepickerSetting.locale"
        @value-changed="datepickerSetting.changeEvent"
        :disable-input="datepickerSetting.disableInput"
        :show-bottom-button="true"
    ></datepicker-lite>

### sample data
    const datepickerSetting = {
      id: "birthday",
      name: "birthday",
      class: "myDateInput",
      value: "2020/10/01",
      placeholder: "Select",
      isButtonType: false,
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
    }

### release
    ver 1.9.2 : fixed bugs
    ver 1.9.1 : added auto-complate slash in the input field
    ver 1.9.0 : added show-bottom-button option and years-range option
    ver 1.8.9 : added months-option on locale-options
    ver 1.8.8 : added switch to button-type option
    ver 1.8.7 : added autocomplated off option
    ver 1.8.6 : fixed datepicker on window bottom will be over window height bug
    ver 1.8.5 : fixed locale attribute bug
    ver 1.8.4 : supported start weeks option
    ver 1.8.3 : fixed disabledDate not work bug
    ver 1.8.2 : fixed valueAttr can not to be null bug
    ver 1.8.1 : supported placeholder
    ver 1.8.0 : supported value-attr responsive
    ver 1.7.0 : supported disable input
    ver 1.6.0 : supported date format
