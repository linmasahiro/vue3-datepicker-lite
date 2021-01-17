<template>
  <div>
    <input
      type="text"
      :id="idAttr"
      :name="nameAttr"
      :class="classAttr"
      :placeholder="placeholderAttr"
      v-model="selectedValue"
      @focus="datepicker.show = true"
      :disabled="disableInput"
    />
    <div v-if="datepicker.show" class="picker__mask" @click="close"></div>
    <div v-if="datepicker.show" class="picker__frame">
      <div class="picker__warp">
        <div class="picker__box">
          <div class="picker__header">
            <div class="picker__month">
              <select v-model="datepicker.month">
                <option v-for="(n, i) in datepicker.monthList" :key="i" :value="n">
                  {{ n }}
                </option>
              </select>
            </div>
            <div class="picker__year">
              <select v-model="datepicker.year">
                <option v-for="(val, i) in datepicker.years" :key="i" :value="val">
                  {{ val }}
                </option>
              </select>
            </div>
            <div class="picker__nav--prev" @click="prevMonth"></div>
            <div class="picker__nav--next" @click="nextMonth"></div>
          </div>
          <table class="picker__table">
            <thead>
              <tr>
                <th
                  v-for="(val, i) in locale.weekday"
                  :key="i"
                  class="picker__weekday"
                  :class="{
                    picker__weekend:
                      locale.startsWeeks == 0 ||
                      locale.startsWeeks < 0 ||
                      locale.startsWeeks > 6
                        ? i == 0 || i == 6
                        : i == 6 - locale.startsWeeks || i == 7 - locale.startsWeeks,
                  }"
                >
                  {{ val }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in datepicker.days" :key="i">
                <td role="presentation" v-for="(val, j) in row" :key="j">
                  <div
                    class="picker__day"
                    :class="{
                      'picker__day--outfocus': val.month != datepicker.month,
                      'picker__day--infocus': val.month == datepicker.month,
                      'picker__day--today': val.isToday,
                      'picker__day--disabled': val.isDisabled,
                      'picker__day--selected picker__day--highlighted':
                        selectedValue == val.dateString,
                    }"
                    @click="val.isDisabled ? false : select(val.dateString)"
                  >
                    {{ val.day }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="picker__footer">
            <button class="picker__button--today" type="button" @click="selectToday">
              {{ locale.todayBtn }}
            </button>
            <button class="picker__button--clear" type="button" @click="clear">
              {{ locale.clearBtn }}
            </button>
            <button class="picker__button--close" type="button" @click="close">
              {{ locale.closeBtn }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch } from "vue";

export default defineComponent({
  name: "my-datepicker",
  props: {
    idAttr: {
      type: String,
    },
    nameAttr: {
      type: String,
    },
    classAttr: {
      type: String,
    },
    valueAttr: {
      type: String,
      default: "",
    },
    placeholderAttr: {
      type: String,
      default: "",
    },
    yearMinus: {
      type: Number,
      default: 0,
    },
    from: {
      type: String,
      default: "",
    },
    to: {
      type: String,
      default: "",
    },
    disabledDate: {
      type: Array,
      default: () => {
        return [];
      },
    },
    locale: {
      type: Object,
      default: () => {
        return {
          format: "YYYY/MM/DD",
          weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          startsWeeks: 0,
          todayBtn: "Today",
          clearBtn: "Clear",
          closeBtn: "Close",
        };
      },
    },
    disableInput: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    let formatSetting = reactive({
      format: props.locale.format,
      formatRegexp: new RegExp("([0-9]{4})/([0-9]{2})/([0-9]{2})"),
      yearIndex: 1,
      monthIndex: 3,
      dateIndex: 5,
    });
    let dateRegexp = new RegExp(
      "([Y]{4}|[y]{4}|[M]{2}|[m]{2}|[D]{2}|[d]{2})([^ a-zA-Z])([Y]{4}|[y]{4}|[M]{2}|[m]{2}|[D]{2}|[d]{2})([^ a-zA-Z])([Y]{4}|[y]{4}|[M]{2}|[m]{2}|[D]{2}|[d]{2})"
    );
    let dateFormatGroup = props.locale.format.match(dateRegexp);
    if (!dateFormatGroup) {
      formatSetting.format = "YYYY/MM/DD";
    }
    if (dateFormatGroup) {
      const isY = (v) => v == "YYYY" || v == "yyyy";
      const isM = (v) => v == "MM" || v == "mm";
      const isD = (v) => v == "DD" || v == "dd";
      let tempRegexp = "";
      for (let i = 1; i < dateFormatGroup.length; i++) {
        if (i == 2) {
          tempRegexp += "([^ a-zA-Z])";
          continue;
        }
        if (i == 4) {
          tempRegexp += "([^ a-zA-Z])";
          continue;
        }
        if (isY(dateFormatGroup[i])) {
          tempRegexp += "([0-9]{4})";
          formatSetting.yearIndex = i;
          continue;
        }
        if (isM(dateFormatGroup[i])) {
          tempRegexp += "([0-9]{2})";
          formatSetting.monthIndex = i;
          continue;
        }
        if (isD(dateFormatGroup[i])) {
          tempRegexp += "([0-9]{2})";
          formatSetting.dateIndex = i;
          continue;
        }
      }
      formatSetting.formatRegexp = new RegExp(tempRegexp);
    }

    const formatDate = (dateObj, hasMinus, format) => {
      if (format == undefined) {
        format = formatSetting.format;
      }
      let yyyy = dateObj.getFullYear();
      if (hasMinus) {
        yyyy = parseInt(yyyy) - parseInt(props.yearMinus);
      }
      format = format.replace(/yyyy/g, yyyy);
      format = format.replace(/YYYY/g, yyyy);
      format = format.replace(/MM/g, ("0" + (dateObj.getMonth() + 1)).slice(-2));
      format = format.replace(/dd/g, ("0" + dateObj.getDate()).slice(-2));
      format = format.replace(/DD/g, ("0" + dateObj.getDate()).slice(-2));
      format = format.replace(/HH/g, ("0" + dateObj.getHours()).slice(-2));
      format = format.replace(/mm/g, ("0" + dateObj.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ("0" + dateObj.getSeconds()).slice(-2));
      format = format.replace(/SSS/g, ("00" + dateObj.getMilliseconds()).slice(-3));
      return format;
    };

    const selectedValue = ref("");
    const datepicker = reactive({
      show: false,
      hasRange: computed(() => {
        let result = false;
        if (
          props.from &&
          props.to &&
          formatSetting.formatRegexp.test(props.from) &&
          formatSetting.formatRegexp.test(props.to)
        ) {
          result = true;
        }
        return result;
      }),
      year: 2020,
      years: computed(() => {
        let yearList = [];
        for (let i = datepicker.year - 10; i < datepicker.year + 10; i++) {
          if (datepicker.hasRange) {
            let fromDate = props.from.match(formatSetting.formatRegexp);
            let toDate = props.to.match(formatSetting.formatRegexp);
            if (i < fromDate[formatSetting.yearIndex]) {
              continue;
            }
            if (i > toDate[formatSetting.yearIndex]) {
              continue;
            }
          }
          yearList.push(i);
        }
        return yearList;
      }),
      month: 1,
      monthList: computed(() => {
        let result = [];
        for (let i = 1; i <= 12; i++) {
          if (datepicker.hasRange) {
            let fromDate = props.from.match(formatSetting.formatRegexp);
            let toDate = props.to.match(formatSetting.formatRegexp);
            if (
              datepicker.year == fromDate[formatSetting.yearIndex] &&
              i < fromDate[formatSetting.monthIndex]
            ) {
              if (datepicker.month <= i) {
                datepicker.month = fromDate[formatSetting.monthIndex];
              }
              continue;
            }
            if (
              datepicker.year == toDate[formatSetting.yearIndex] &&
              i > toDate[formatSetting.monthIndex]
            ) {
              if (datepicker.month >= i) {
                datepicker.month = toDate[formatSetting.monthIndex];
              }
              continue;
            }
          }
          result.push(i);
        }
        return result;
      }),
      days: computed(() => {
        let year = parseInt(datepicker.year) + parseInt(props.yearMinus);
        let month = datepicker.month;
        let startDate = new Date(year + "/" + month + "/1");
        let lastDate = new Date(year, month, 0);
        let startDateWeekday = startDate.getDay();
        let lastDateWeekday = lastDate.getDay();
        let startsWeeks =
          props.locale.startsWeeks < 0 || props.locale.startsWeeks > 6 || !props.locale.startsWeek
            ? 0
            : props.locale.startsWeeks;
        if (startDateWeekday != startsWeeks) {
          startDate.setDate(startDate.getDate() - (startDateWeekday - startsWeeks));
          if (startDateWeekday - startsWeeks < 0) {
            startDate.setDate(startDate.getDate() - 7);
          }
        }
        if (lastDateWeekday != startsWeeks + 6) {
          let padding = startsWeeks + 6 - lastDateWeekday;
          lastDate.setDate(lastDate.getDate() + padding);
        }
        let days = [];
        let row = [];
        let today = formatDate(new Date(), true);
        let isDisabled = false;
        while (startDate.getTime() - lastDate.getTime() <= 0) {
          isDisabled = false;
          let yyyy = parseInt(startDate.getFullYear()) - parseInt(props.yearMinus);
          let mm = startDate.getMonth() + 1;
          let dd = startDate.getDate();
          if (datepicker.hasRange) {
            let fromDate = props.from.match(formatSetting.formatRegexp);
            let toDate = props.to.match(formatSetting.formatRegexp);
            if (
              yyyy < fromDate[formatSetting.yearIndex] ||
              (yyyy == fromDate[formatSetting.yearIndex] &&
                mm < fromDate[formatSetting.monthIndex]) ||
              (yyyy == fromDate[formatSetting.yearIndex] &&
                mm == fromDate[formatSetting.monthIndex] &&
                dd < fromDate[formatSetting.dateIndex])
            ) {
              isDisabled = true;
            }
            if (
              yyyy > toDate[formatSetting.yearIndex] ||
              (yyyy == toDate[formatSetting.yearIndex] &&
                mm > toDate[formatSetting.monthIndex]) ||
              (yyyy == toDate[formatSetting.yearIndex] &&
                mm == toDate[formatSetting.monthIndex] &&
                dd > toDate[formatSetting.dateIndex])
            ) {
              isDisabled = true;
            }
          }
          if (!isDisabled && props.disabledDate.length > 0) {
            let checkKey = props.disabledDate.findIndex((rawDate) => {
              let tmpData = rawDate.match(formatSetting.formatRegexp);
              let tmpYear = tmpData[formatSetting.yearIndex];
              let tmpMonth = tmpData[formatSetting.monthIndex];
              let tmpDate = tmpData[formatSetting.dateIndex];
              let modifiedDate = formatDate(
                new Date(tmpYear + "/" + tmpMonth + "/" + tmpDate),
                true
              );
              return modifiedDate == formatDate(startDate, true);
            });
            isDisabled = checkKey >= 0 ? true : false;
          }
          let dateObj = {
            year: yyyy,
            month: mm,
            day: dd,
            weekday: startDate.getDay(),
            dateString: formatDate(startDate, true),
            isToday: formatDate(startDate, true) == today,
            isDisabled: isDisabled,
          };
          row.push(dateObj);
          if (row.length >= 7) {
            days.push(row);
            row = [];
          }
          startDate.setDate(startDate.getDate() + 1);
        }
        return days;
      }),
    });
    watch(selectedValue, (value, prevValue) => {
      if (value != "") {
        let result = "";
        if (formatSetting.formatRegexp.test(value)) {
          let temp = value.match(formatSetting.formatRegexp);
          result = formatDate(
            new Date(
              temp[formatSetting.yearIndex],
              temp[formatSetting.monthIndex] - 1,
              temp[formatSetting.dateIndex]
            ),
            false
          );
        } else {
          result = prevValue;
        }
        selectedValue.value = result;
      }
      emit("value-changed", value);
    });
    watch(
      () => datepicker.show,
      (state) => {
        if (state) {
          let thisMonth = new Date();
          if (selectedValue.value) {
            let temp = selectedValue.value.match(formatSetting.formatRegexp);
            thisMonth = new Date(
              temp[formatSetting.yearIndex],
              temp[formatSetting.monthIndex] - 1,
              temp[formatSetting.dateIndex]
            );
          }
          datepicker.year = thisMonth.getFullYear();
          datepicker.month = thisMonth.getMonth() + 1;
        }
      }
    );
    watch(
      () => props.valueAttr,
      (value, prevValue) => {
        if (value == "") {
          selectedValue.value = "";
          return false;
        }
        if (value != prevValue) {
          let result = "";
          if (formatSetting.formatRegexp.test(value)) {
            let temp = value.match(formatSetting.formatRegexp);
            result = formatDate(
              new Date(
                temp[formatSetting.yearIndex],
                temp[formatSetting.monthIndex] - 1,
                temp[formatSetting.dateIndex]
              ),
              false
            );
            selectedValue.value = result;
          }
        }
      }
    );

    const prevMonth = () => {
      let tempPrevYear = datepicker.month == 1 ? datepicker.year - 1 : datepicker.year;
      let tempPrevMonth = datepicker.month == 1 ? 12 : datepicker.month - 1;
      if (datepicker.hasRange) {
        let fromDate = props.from.match(formatSetting.formatRegexp);
        if (tempPrevYear < fromDate[formatSetting.yearIndex]) {
          return false;
        }
        if (
          tempPrevYear == fromDate[formatSetting.yearIndex] &&
          tempPrevMonth < fromDate[formatSetting.monthIndex]
        ) {
          return false;
        }
      }
      datepicker.year = tempPrevYear;
      datepicker.month = tempPrevMonth;
    };

    const nextMonth = () => {
      let tempNextYear = datepicker.month == 12 ? datepicker.year + 1 : datepicker.year;
      let tempNextMonth = datepicker.month == 12 ? 1 : datepicker.month + 1;
      if (datepicker.hasRange) {
        let toDate = props.to.match(formatSetting.formatRegexp);
        if (tempNextYear > toDate[formatSetting.yearIndex]) {
          return false;
        }
        if (
          tempNextYear == toDate[formatSetting.yearIndex] &&
          tempNextMonth > toDate[formatSetting.monthIndex]
        ) {
          return false;
        }
      }
      datepicker.year = tempNextYear;
      datepicker.month = tempNextMonth;
    };
    const selectToday = () => {
      let today = new Date();
      let tempYear = parseInt(today.getFullYear()) - parseInt(props.yearMinus);
      let tempMonth = today.getMonth() + 1;
      if (datepicker.hasRange) {
        let fromDate = props.from.match(formatSetting.formatRegexp);
        let toDate = props.to.match(formatSetting.formatRegexp);
        if (today < fromDate) {
          tempYear = fromDate[formatSetting.yearIndex];
          tempMonth = fromDate[formatSetting.monthIndex];
          today = fromDate;
        }
        if (today > toDate) {
          tempYear = toDate[formatSetting.yearIndex];
          tempMonth = toDate[formatSetting.monthIndex];
          today = toDate;
        }
      }
      datepicker.year = tempYear;
      datepicker.month = tempMonth;
      selectedValue.value = formatDate(today, true);
      datepicker.show = false;
    };
    const clear = () => {
      selectedValue.value = "";
      datepicker.show = false;
    };
    const close = () => {
      datepicker.show = false;
    };
    const select = (value) => {
      selectedValue.value = value;
      datepicker.show = false;
    };

    select(props.valueAttr);

    return {
      selectedValue,
      datepicker,
      prevMonth,
      nextMonth,
      selectToday,
      select,
      clear,
      close,
    };
  },
});
</script>

<style scoped>
.picker__mask {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #ffffff00;
  z-index: 10000;
  top: 0;
  left: 0;
}

.picker__frame {
  position: absolute;
  z-index: 10001;
}

.picker__warp {
  border: 1px solid;
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(18, 47, 61, 0.5), -3px -3px 15px rgba(248, 253, 255, 0.9),
    inset 3px 3px 15px transparent, inset -3px -3px 15px transparent;
}

.picker__box {
  padding: 20px;
}

.picker__header {
  position: relative;
  padding-bottom: 10px;
}

.picker__footer,
.picker__header,
.picker__table {
  text-align: center;
}

.picker__month,
.picker__year {
  font-weight: 500;
  display: inline-block;
  margin-left: 0.25em;
  margin-right: 0.25em;
}

.picker__nav--next,
.picker__nav--prev {
  position: absolute;
  padding: 0.5em 1.25em;
  width: 1em;
  height: 1em;
  box-sizing: content-box;
  top: -0.25em;
}

.picker__nav--prev {
  left: -1em;
  padding-right: 1.25em;
}

.picker__nav--next {
  right: -1em;
  padding-left: 1.25em;
}

@media (min-width: 24.5em) {
  .picker__select--month,
  .picker__select--year {
    margin-top: -0.5em;
  }

  .picker__nav--next,
  .picker__nav--prev {
    top: -0.33em;
  }

  .picker__nav--prev {
    padding-right: 1.5em;
  }

  .picker__nav--next {
    padding-left: 1.5em;
  }
}

.picker__nav--next:before,
.picker__nav--prev:before {
  content: " ";
  border-top: 0.5em solid transparent;
  border-bottom: 0.5em solid transparent;
  border-right: 0.75em solid #000;
  width: 0;
  height: 0;
  display: block;
  margin: 0 auto;
}

.picker__nav--next:before {
  border-right: 0;
  border-left: 0.75em solid #000;
}

.picker__nav--next:hover,
.picker__nav--prev:hover {
  cursor: pointer;
  color: #000;
  background: #b1dcfb;
}

.picker--focused .picker__day--highlighted,
.picker__day--highlighted:hover,
.picker__day--infocus:hover,
.picker__day--outfocus:hover {
  color: #000;
  cursor: pointer;
  background: #b1dcfb;
}

.picker__day--disabled:before {
  border-top-color: #aaa;
}

.picker__day--outfocus {
  color: #ddd;
}

.picker--focused .picker__day--selected,
.picker__day--selected,
.picker__day--selected:hover {
  background: #0089ec;
  color: #fff;
}

.picker--focused .picker__day--disabled,
.picker__day--disabled,
.picker__day--disabled:hover {
  background: #f5f5f5;
  border-color: #f5f5f5;
  color: #ddd;
  cursor: pointer;
}

.picker__day--highlighted.picker__day--disabled,
.picker__day--highlighted.picker__day--disabled:hover {
  background: #bbb;
}

.picker__weekday {
  width: 14.285714286%;
  font-size: 0.75em;
  padding-bottom: 0.25em;
  color: #999;
  font-weight: 500;
}

@media (min-height: 33.875em) {
  .picker__weekday {
    padding-bottom: 0.5em;
  }
}

.picker__button--clear,
.picker__button--close,
.picker__button--today {
  border: 1px solid #fff;
  background: #fff;
  font-size: 0.8em;
  padding: 0.66em 0;
  font-weight: 700;
  width: 33%;
  display: inline-block;
  vertical-align: bottom;
}

.picker__button--clear:hover,
.picker__button--close:hover,
.picker__button--today:hover {
  cursor: pointer;
  color: #000;
  background: #b1dcfb;
  border-bottom-color: #b1dcfb;
}

.picker__button--clear:focus,
.picker__button--close:focus,
.picker__button--today:focus {
  background: #b1dcfb;
  border-color: #0089ec;
  outline: 0;
}

.picker__button--clear:before,
.picker__button--close:before,
.picker__button--today:before {
  position: relative;
  display: inline-block;
  height: 0;
}

.picker__button--clear:before,
.picker__button--today:before {
  content: " ";
  margin-right: 0.45em;
}

.picker__button--today:before {
  top: -0.05em;
  width: 0;
  border-top: 0.66em solid #0059bc;
  border-left: 0.66em solid transparent;
}

.picker__button--clear:before {
  top: -0.25em;
  width: 0.66em;
  border-top: 3px solid #e20;
}

.picker__button--close:before {
  content: "\D7";
  top: -0.1em;
  vertical-align: top;
  font-size: 1.1em;
  margin-right: 0.35em;
  color: #777;
}

.picker__button--today[disabled],
.picker__button--today[disabled]:hover {
  background: #f5f5f5;
  border-color: #f5f5f5;
  color: #ddd;
  cursor: default;
}

.picker__button--today[disabled]:before {
  border-top-color: #aaa;
}

.picker__day {
  padding: 2px 6px;
}

.picker__day--today {
  position: relative;
}

.picker__day--today:before {
  content: " ";
  position: absolute;
  top: 2px;
  right: 2px;
  width: 0;
  height: 0;
  border-top: 0.5em solid #0059bc;
  border-left: 0.5em solid transparent;
}

.picker__weekend {
  color: #e20;
}
</style>
