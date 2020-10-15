# vue3-datepicker-lite

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
        :locale="datepickerSetting.locale"
        @value-changed="datepickerSetting.changeEvent"
    ></datepicker-lite>

### sample data
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
