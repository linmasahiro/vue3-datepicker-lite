<template>
  <div>
    <button
      v-if="isButtonType"
      :id="idAttr"
      :name="nameAttr"
      :class="classAttr"
      @click="onFocusEvent"
    >
      {{ selectedValue }}
    </button>
    <input
      v-if="!isButtonType"
      :id="idAttr"
      v-model="selectedValue"
      :name="nameAttr"
      :class="classAttr"
      :autocomplete="autocompleteAttr"
      :placeholder="placeholderAttr"
      :disabled="disableInput"
      type="text"
      @focus="onFocusEvent"
    >
    <div 
      v-if="datepicker.show" 
      class="picker__mask"
      @click="close"
    />
    <div
      v-if="datepicker.show"
      class="picker__frame"
      :class="{ picker__frame_up: needMoveToUp }"
    >
      <div class="picker__warp">
        <div class="picker__box">
          <div class="picker__header">
            <div class="picker__month">
              <select v-model="datepicker.month">
                <option 
                  v-for="(n, i) in datepicker.monthList" 
                  :key="i" 
                  :value="n"
                >
                  {{ modifiedLocale.months[n - 1] }}
                </option>
              </select>
            </div>
            <div class="picker__year">
              <select v-model="datepicker.year">
                <option 
                  v-for="(val, i) in datepicker.years" 
                  :key="i" 
                  :value="val"
                >
                  {{ val - yearMinus }}
                </option>
              </select>
            </div>
            <div 
              class="picker__nav--prev" 
              @click="prevMonth"
            />
            <div 
              class="picker__nav--next" 
              @click="nextMonth"
            />
          </div>
          <table class="picker__table">
            <thead>
              <tr>
                <th
                  v-for="(val, i) in modifiedLocale.weekday"
                  :key="i"
                  class="picker__weekday"
                  :class="{
                    picker__weekend:
                      modifiedLocale.startsWeeks == 0 ||
                      modifiedLocale.startsWeeks < 0 ||
                      modifiedLocale.startsWeeks > 6
                        ? i == 0 || i == 6
                        : i == 6 - modifiedLocale.startsWeeks ||
                          i == 7 - modifiedLocale.startsWeeks,
                  }"
                >
                  {{ val }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(row, i) in datepicker.days" 
                :key="i"
              >
                <td 
                  v-for="(val, j) in row"
                  :key="j"
                  role="presentation"
                >
                  <div
                    class="picker__day"
                    :class="{
                      'picker__day--outfocus': val.month != datepicker.month,
                      'picker__day--infocus': val.month == datepicker.month,
                      'picker__day--today': val.isToday,
                      'picker__day--disabled': val.isDisabled,
                      'picker__day--selected picker__day--highlighted':
                        rawValue == val.dateString,
                    }"
                    @click="val.isDisabled ? false : select(val.dateString)"
                  >
                    {{ val.day }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div 
            v-if="showBottomButton" 
            class="picker__footer"
          >
            <button 
              class="picker__button--today" 
              type="button" 
              @click="selectToday"
            >
              {{ modifiedLocale.todayBtn }}
            </button>
            <button 
              class="picker__button--clear"
              type="button" 
              @click="clear"
            >
              {{ modifiedLocale.clearBtn }}
            </button>
            <button
              class="picker__button--close"
              type="button"
              @click="close"
            >
              {{ modifiedLocale.closeBtn }}
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
  name: "MyDatepicker",
  props: {
    // Element's ID attribute
    idAttr: {
      type: String,
      default: "",
    },
    // Element's name attribute
    nameAttr: {
      type: String,
      default: "",
    },
    // Element's class attribute
    classAttr: {
      type: String,
      default: "",
    },
    // Element's value attribute (Default value)
    valueAttr: {
      type: String,
      default: "",
    },
    // Element's placeholder attribute
    placeholderAttr: {
      type: String,
      default: "",
    },
    // Element's autocomplete attribute
    autocompleteAttr: {
      type: String,
      default: "off",
    },
    // Show input element or button element
    isButtonType: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // Year of formation of a country
    yearMinus: {
      type: Number,
      default: 0,
    },
    // Qty on the year dropdown
    yearsRange: {
      type: Number,
      default: 10,
    },
    // From-date value on limited range
    from: {
      type: String,
      default: "",
    },
    // End-date value on limited range
    to: {
      type: String,
      default: "",
    },
    // Can't select date list
    disabledDate: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // Locale setting
    locale: {
      type: Object,
      default: () => {
        return {
          format: "YYYY/MM/DD",
          weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          startsWeeks: 0,
          todayBtn: "Today",
          clearBtn: "Clear",
          closeBtn: "Close",
        };
      },
    },
    // Disable input flag
    disableInput: {
      type: Boolean,
      default: false,
    },
    // Show features button flag
    showBottomButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["value-changed"],
  setup(props, { emit }) {
    // Merge locale setting and default locale setting
    let modifiedLocale = Object.assign(
      {
        format: "YYYY/MM/DD",
        weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        startsWeeks: 0,
        todayBtn: "Today",
        clearBtn: "Clear",
        closeBtn: "Close",
        slash: ["/", "/"],
        slashOffset: [],
      },
      props.locale
    );
    // Local date format setting
    let formatSetting = reactive({
      format: modifiedLocale.format,
      formatRegexp: new RegExp("([0-9]{4})/([0-9]{2})/([0-9]{2})"),
      yearIndex: 1,
      monthIndex: 3,
      dateIndex: 5,
    });
    
    //////////////////////////////
    //
    //  Setting date format
    //

    let dateRegexp = new RegExp(
      "([Y]{4}|[y]{4}|[M]{2}|[m]{2}|[D]{2}|[d]{2})([^ a-zA-Z])([Y]{4}|[y]{4}|[M]{2}|[m]{2}|[D]{2}|[d]{2})([^ a-zA-Z])([Y]{4}|[y]{4}|[M]{2}|[m]{2}|[D]{2}|[d]{2})"
    );
    let dateFormatGroup = modifiedLocale.format.match(dateRegexp);
    if (!dateFormatGroup) {
      formatSetting.format = "YYYY/MM/DD";
    }
    if (dateFormatGroup) {
      const isY = (v) => v == "YYYY" || v == "yyyy";
      const isM = (v) => v == "MM" || v == "mm";
      const isD = (v) => v == "DD" || v == "dd";
      let tempRegexp = "";
      let slashOffset = 0;
      for (let i = 1; i < dateFormatGroup.length; i++) {
        if (i == 2) {
          tempRegexp += "([^ a-zA-Z])";
          modifiedLocale.slash[0] = dateFormatGroup[i];
          continue;
        }
        if (i == 4) {
          tempRegexp += "([^ a-zA-Z])";
          modifiedLocale.slash[1] = dateFormatGroup[i];
          continue;
        }
        if (isY(dateFormatGroup[i])) {
          tempRegexp += "([0-9]{4})";
          formatSetting.yearIndex = i;
          slashOffset += 5;
          modifiedLocale.slashOffset.push(slashOffset);
          continue;
        }
        if (isM(dateFormatGroup[i])) {
          tempRegexp += "([0-9]{2})";
          formatSetting.monthIndex = i;
          slashOffset += 3;
          modifiedLocale.slashOffset.push(slashOffset);
          continue;
        }
        if (isD(dateFormatGroup[i])) {
          tempRegexp += "([0-9]{2})";
          formatSetting.dateIndex = i;
          slashOffset += 3;
          modifiedLocale.slashOffset.push(slashOffset);
          continue;
        }
      }
      formatSetting.formatRegexp = new RegExp(tempRegexp);
    }

    //
    //
    ///////////////////////////

    /**
     * Date formatter
     */
     const formatDate = (dateObj, hasMinus) => {
      const formatters = {
        'yyyy|YYYY': (d) => {
          const year = d.getFullYear();
          return hasMinus ? (year - props.yearMinus).toString() : year.toString();
        },
        'MM': (d) => padZero(d.getMonth() + 1),
        'dd|DD': (d) => padZero(d.getDate()),
        'HH': (d) => padZero(d.getHours()),
        'mm': (d) => padZero(d.getMinutes()), 
        'ss': (d) => padZero(d.getSeconds()),
        'SSS': (d) => padZero(d.getMilliseconds(), 3)
      };
      const padZero = (num, length = 2) => {
        return num.toString().padStart(length, '0');
      };

      let result = formatSetting.format;
      Object.entries(formatters).forEach(([pattern, formatter]) => {
        result = result.replace(
          new RegExp(pattern, 'g'),
          formatter(dateObj)
        );
      });
      return result;
    };

    const selectedValue = ref("");
    const rawValue = ref("");

    // All datepicker state
    const datepicker = reactive({
      show: false,
      hasRange: computed(() => {
        let result = false;
        if (props.from && props.to) {
          if (
            formatSetting.formatRegexp.test(props.from) &&
            formatSetting.formatRegexp.test(props.to)
          ) {
            result = true;
          }
        } else if (props.from && !props.to) {
          if (formatSetting.formatRegexp.test(props.from)) {
            result = true;
          }
        } else if (!props.from && props.to) {
          if (formatSetting.formatRegexp.test(props.to)) {
            result = true;
          }
        }
        return result;
      }),
      year: 2020,
      years: computed(() => {
        let yearList = [];
        for (
          let i = datepicker.year - props.yearsRange;
          i < datepicker.year + props.yearsRange;
          i++
        ) {
          if (datepicker.hasRange) {
            // active limited range
            let fromDate = props.from.match(
              formatSetting.formatRegexp
            );
            let toDate = props.to.match(formatSetting.formatRegexp);
            if (fromDate && i < parseInt(fromDate[formatSetting.yearIndex])) {
              continue;
            }
            if (toDate && i > parseInt(toDate[formatSetting.yearIndex])) {
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
            // active limited range
            let fromDate = props.from.match(
              formatSetting.formatRegexp
            );
            let toDate = props.to.match(formatSetting.formatRegexp);
            if (
              fromDate &&
              datepicker.year == parseInt(fromDate[formatSetting.yearIndex]) &&
              i < parseInt(fromDate[formatSetting.monthIndex])
            ) {
              if (datepicker.month <= i) {
                datepicker.month = parseInt(fromDate[formatSetting.monthIndex]);
              }
              continue;
            }
            if (
              toDate &&
              datepicker.year == parseInt(toDate[formatSetting.yearIndex]) &&
              i > parseInt(toDate[formatSetting.monthIndex])
            ) {
              if (datepicker.month >= i) {
                datepicker.month = parseInt(toDate[formatSetting.monthIndex]);
              }
              continue;
            }
          }
          result.push(i);
        }
        return result;
      }),
      days: computed(() => {
        let year = datepicker.year;
        let month = datepicker.month;
        let startDate = new Date(year + "/" + month + "/1");
        let lastDate = new Date(year, month, 0);
        let startDateWeekday = startDate.getDay();
        let lastDateWeekday = lastDate.getDay();
        
        //
        // find weekday
        //

        let startsWeeks =
          modifiedLocale.startsWeeks < 0 || modifiedLocale.startsWeeks > 6
            ? 0
            : modifiedLocale.startsWeeks;
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

        //
        // create calendar
        //

        let days = [];
        let row = [];
        let today = formatDate(new Date(), false);
        let isDisabled = false;
        while (startDate.getTime() - lastDate.getTime() <= 0) {
          isDisabled = false;
          let yyyy = startDate.getFullYear();
          let mm = startDate.getMonth() + 1;
          let dd = startDate.getDate();
          if (datepicker.hasRange) {
            // active limited range
            let fromDate = props.from.match(
              formatSetting.formatRegexp
            );
            let toDate = props.to.match(formatSetting.formatRegexp);
            if (
              fromDate &&
              (yyyy < parseInt(fromDate[formatSetting.yearIndex]) ||
                (yyyy == parseInt(fromDate[formatSetting.yearIndex]) &&
                  mm < parseInt(fromDate[formatSetting.monthIndex])) ||
                (yyyy == parseInt(fromDate[formatSetting.yearIndex]) &&
                  mm == parseInt(fromDate[formatSetting.monthIndex]) &&
                  dd < parseInt(fromDate[formatSetting.dateIndex])))
            ) {
              isDisabled = true;
            }
            if (
              toDate &&
              (yyyy > parseInt(toDate[formatSetting.yearIndex]) ||
                (yyyy == parseInt(toDate[formatSetting.yearIndex]) &&
                  mm > parseInt(toDate[formatSetting.monthIndex])) ||
                (yyyy == parseInt(toDate[formatSetting.yearIndex]) &&
                  mm == parseInt(toDate[formatSetting.monthIndex]) &&
                  dd > parseInt(toDate[formatSetting.dateIndex])))
            ) {
              isDisabled = true;
            }
          }
          if (!isDisabled && props.disabledDate.length > 0) {
            // active disable date
            let checkKey = props.disabledDate.findIndex((rawDate) => {
              let tmpData = rawDate.match(
                formatSetting.formatRegexp
              );
              if (tmpData) {
                let tmpYear = tmpData[formatSetting.yearIndex];
                let tmpMonth = tmpData[formatSetting.monthIndex];
                let tmpDate = tmpData[formatSetting.dateIndex];
                let modifiedDate = formatDate(
                  new Date(tmpYear + "/" + tmpMonth + "/" + tmpDate),
                  false
                );
                return modifiedDate == formatDate(startDate, false);
              }
            });
            isDisabled = checkKey >= 0 ? true : false;
          }
          let dateObj = {
            year: yyyy,
            month: mm,
            day: dd,
            weekday: startDate.getDay(),
            dateString: formatDate(startDate, false),
            isToday: formatDate(startDate, false) == today,
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

    /**
     * Auto complete input value
     */
    const autoComplete = (value, isBlur = false) => {
      const parts = value.split(modifiedLocale.slash[0]);
      if (modifiedLocale.slash[0] == modifiedLocale.slash[1]) {
        // if slash is same, then only one slash
        if (parts.length > 1) {
          parts[0] = parts[0].padStart(modifiedLocale.slashOffset[0] - 1, '0');
        }
        if (parts.length > 2) {
          parts[1] = parts[1].padStart(modifiedLocale.slashOffset[1] - modifiedLocale.slashOffset[0] - 1, '0');
          if (isBlur) {
            parts[2] = parts[2].padStart(10 - (value.length - 1), '0');
          }
        }
      } else {
        // if slash is different, then two slashes
        if (parts.length > 1) {
          parts[0] = parts[0].padStart(modifiedLocale.slashOffset[0] - 1, '0');
        }
        const parts2 = parts[1].split(modifiedLocale.slash[1]);
        if (parts2.length > 1) {
          parts2[0] = parts2[0].padStart(modifiedLocale.slashOffset[1] - modifiedLocale.slashOffset[0] - 1, '0');
          if (isBlur) {
            parts2[1] = parts2[1].padStart(10 - (value.length - 1), '0');
          }
          parts[1] = parts2.join(modifiedLocale.slash[1]);
        }
      }
      return parts.join(modifiedLocale.slash[0]);
    }

    /**
     * Watch selectedValue's state
     */
    watch(selectedValue, (value, prevValue) => {
      let isComplated = false;
      if (value && value != "") {
        let result = "";
        if (formatSetting.formatRegexp.test(value)) {
          let temp = value.match(formatSetting.formatRegexp);
          if (temp) {
            result = formatDate(
              new Date(
                parseInt(temp[formatSetting.yearIndex]),
                parseInt(temp[formatSetting.monthIndex]) - 1,
                parseInt(temp[formatSetting.dateIndex])
              ),
              false
            );
            isComplated = true;
          }
        } else {
          if (!props.yearMinus && value.length > prevValue.length) {
            result = autoComplete(value, false);
          } else {
            result = value;
          }
        }

        if (isComplated && datepicker.hasRange) {
          let fromDate = props.from.match(
            formatSetting.formatRegexp
          );
          let toDate = props.to.match(formatSetting.formatRegexp);
          let temp = value.match(formatSetting.formatRegexp);
          if (fromDate && temp) {
            if (
              new Date(
                parseInt(temp[formatSetting.yearIndex]),
                parseInt(temp[formatSetting.monthIndex]) - 1,
                parseInt(temp[formatSetting.dateIndex])
              ) <
              new Date(
                parseInt(fromDate[formatSetting.yearIndex]) - props.yearMinus,
                parseInt(fromDate[formatSetting.monthIndex]) - 1,
                parseInt(fromDate[formatSetting.dateIndex])
              )
            ) {
              result = formatDate(
                new Date(
                  parseInt(fromDate[formatSetting.yearIndex]),
                  parseInt(fromDate[formatSetting.monthIndex]) - 1,
                  parseInt(fromDate[formatSetting.dateIndex])
                ),
                true
              );
            }
          }
          if (toDate && temp) {
            if (
              new Date(
                parseInt(temp[formatSetting.yearIndex]),
                parseInt(temp[formatSetting.monthIndex]) - 1,
                parseInt(temp[formatSetting.dateIndex])
              ) >
              new Date(
                parseInt(toDate[formatSetting.yearIndex]) - props.yearMinus,
                parseInt(toDate[formatSetting.monthIndex]) - 1,
                parseInt(toDate[formatSetting.dateIndex])
              )
            ) {
              result = formatDate(
                new Date(
                  parseInt(toDate[formatSetting.yearIndex]),
                  parseInt(toDate[formatSetting.monthIndex]) - 1,
                  parseInt(toDate[formatSetting.dateIndex])
                ),
                true
              );
            }
          }
        }
        if (value != result) {
          isComplated = false;
        }
        if (props.yearMinus) {
          isComplated = true;
        }
        selectedValue.value = result;

        let rawDate = result.match(formatSetting.formatRegexp);
        if (rawDate) {
          rawValue.value = formatDate(
            new Date(
              parseInt(rawDate[formatSetting.yearIndex]) + props.yearMinus,
              parseInt(rawDate[formatSetting.monthIndex]) - 1,
              parseInt(rawDate[formatSetting.dateIndex])
            ),
            false
          );
        }
      } else {
        isComplated = true;
      }
      if (isComplated) {
        emit("value-changed", value);
      }
    });

    /**
     * Watch datepicker.show's state
     */
    watch(
      () => datepicker.show,
      (state) => {
        if (state) {
          let thisMonth = new Date();
          if (rawValue.value) {
            let temp = rawValue.value.match(formatSetting.formatRegexp);
            if (temp) {
              thisMonth = new Date(
                parseInt(temp[formatSetting.yearIndex]),
                parseInt(temp[formatSetting.monthIndex]) - 1,
                parseInt(temp[formatSetting.dateIndex])
              );
            }
          }
          datepicker.year = thisMonth.getFullYear();
          datepicker.month = thisMonth.getMonth() + 1;
        }
      }
    );

    /**
     * Watch valueAttr's state
     */
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
            if (temp) {
              result = formatDate(
                new Date(
                  parseInt(temp[formatSetting.yearIndex]),
                  parseInt(temp[formatSetting.monthIndex]) - 1,
                  parseInt(temp[formatSetting.dateIndex])
                ),
                false
              );
            }
            selectedValue.value = result;
          }
        }
      }
    );

    /**
     * Prev month event
     */
    const prevMonth = () => {
      let tempPrevYear = datepicker.month == 1 ? datepicker.year - 1 : datepicker.year;
      let tempPrevMonth = datepicker.month == 1 ? 12 : datepicker.month - 1;
      if (datepicker.hasRange) {
        // active limited range
        if (props.from) {
          let fromDate = props.from.match(formatSetting.formatRegexp);
          if (!fromDate) {
            return false;
          }
          if (tempPrevYear < parseInt(fromDate[formatSetting.yearIndex])) {
            return false;
          }
          if (
            tempPrevYear == parseInt(fromDate[formatSetting.yearIndex]) &&
            tempPrevMonth < parseInt(fromDate[formatSetting.monthIndex])
          ) {
            return false;
          }
        }
      }
      datepicker.year = tempPrevYear;
      datepicker.month = tempPrevMonth;
    };

    /**
     * Next month event
     */
    const nextMonth = () => {
      let tempNextYear = datepicker.month == 12 ? datepicker.year + 1 : datepicker.year;
      let tempNextMonth = datepicker.month == 12 ? 1 : datepicker.month + 1;
      if (datepicker.hasRange) {
        // active limited range
        if (props.to) {
          let toDate = props.to.match(formatSetting.formatRegexp);
          if (!toDate) {
            return false;
          }
          if (tempNextYear > parseInt(toDate[formatSetting.yearIndex])) {
            return false;
          }
          if (
            tempNextYear == parseInt(toDate[formatSetting.yearIndex]) &&
            tempNextMonth > parseInt(toDate[formatSetting.monthIndex])
          ) {
            return false;
          }
        }
      }
      datepicker.year = tempNextYear;
      datepicker.month = tempNextMonth;
    };

    /**
     * Current today event
     */
    const selectToday = () => {
      let today = new Date();
      let tempYear = today.getFullYear();
      let tempMonth = today.getMonth() + 1;
      if (datepicker.hasRange) {
        let fromDate = props.from.match(formatSetting.formatRegexp);
        let toDate = props.to.match(formatSetting.formatRegexp);
        if (fromDate) {
          if (
            today <
            new Date(
              fromDate[formatSetting.yearIndex] +
                "/" +
                fromDate[formatSetting.monthIndex] +
                "/" +
                fromDate[formatSetting.dateIndex]
            )
          ) {
            tempYear = parseInt(fromDate[formatSetting.yearIndex]);
            tempMonth = parseInt(fromDate[formatSetting.monthIndex]);
            today = new Date(
              fromDate[formatSetting.yearIndex] +
                "/" +
                fromDate[formatSetting.monthIndex] +
                "/" +
                fromDate[formatSetting.dateIndex]
            );
          }
        }
        if (toDate) {
          if (
            today >
            new Date(
              toDate[formatSetting.yearIndex] +
                "/" +
                toDate[formatSetting.monthIndex] +
                "/" +
                toDate[formatSetting.dateIndex]
            )
          ) {
            tempYear = parseInt(toDate[formatSetting.yearIndex]);
            tempMonth = parseInt(toDate[formatSetting.monthIndex]);
            today = new Date(
              toDate[formatSetting.yearIndex] +
                "/" +
                toDate[formatSetting.monthIndex] +
                "/" +
                toDate[formatSetting.dateIndex]
            );
          }
        }
      }
      datepicker.year = tempYear;
      datepicker.month = tempMonth;
      selectedValue.value = formatDate(today, true);
      rawValue.value = formatDate(today, false);
      datepicker.show = false;
    };

    /**
     * Value clear event
     */
    const clear = () => {
      selectedValue.value = "";
      datepicker.show = false;
    };

    /**
     * Close datepicker event
     */
    const close = () => {
      // last input value auto complete
      selectedValue.value = autoComplete(selectedValue.value, true);
      if (! formatSetting.formatRegexp.test(selectedValue.value)) {
        console.log("date format is correct");
        clear();
      }

      // hide datepicker
      datepicker.show = false;
    };

    /**
     * Current date event
     */
    const select = (value) => {
      if (value) {
        let tmp = value.match(formatSetting.formatRegexp);
        if (tmp) {
          let dateObj = new Date(
            tmp[formatSetting.yearIndex] +
              "/" +
              tmp[formatSetting.monthIndex] +
              "/" +
              tmp[formatSetting.dateIndex]
          );
          selectedValue.value = formatDate(dateObj, true);
          datepicker.year = parseInt(tmp[formatSetting.yearIndex]);
          rawValue.value = value;
        }
      } else {
        selectedValue.value = rawValue.value = "";
      }
      datepicker.show = false;
    };


    ///////////////////
    //
    // Modified datepicker position
    //

    const needMoveToUp = ref(false);
    const onFocusEvent = (event) => {
      let potisionY = event.target.getBoundingClientRect().y;
      needMoveToUp.value = false;
      if (window.innerHeight - potisionY <= 290) {
        needMoveToUp.value = true;
      }
      datepicker.show = true;
    };

    //
    //
    ///////////////////

    // Set default value
    select(props.valueAttr);

    return {
      modifiedLocale,
      selectedValue,
      rawValue,
      datepicker,
      prevMonth,
      nextMonth,
      selectToday,
      select,
      clear,
      close,
      needMoveToUp,
      onFocusEvent,
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

.picker__frame_up {
  top: -300px;
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
