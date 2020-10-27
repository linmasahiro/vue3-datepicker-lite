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
        :year-minus="datepickerSetting.yearMinus"
        :from="datepickerSetting.fromDate"
        :to="datepickerSetting.toDate"
        :disabled-date="datepickerSetting.disabledDate"
        :locale="datepickerSetting.locale"
        @value-changed="datepickerSetting.changeEvent"
    ></datepicker-lite>

### sample data
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
        weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        todayBtn: "Today",
        clearBtn: "Clear",
        closeBtn: "Close",
      },
      changeEvent: (value) => {
        console.log(value + " selected!");
      }
    }
