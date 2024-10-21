"use strict";
(() => {
  // src/version.ts
  var VERSION = "0.1.13";

  // node_modules/flatpickr/dist/esm/types/options.js
  var HOOKS = [
    "onChange",
    "onClose",
    "onDayCreate",
    "onDestroy",
    "onKeyDown",
    "onMonthChange",
    "onOpen",
    "onParseConfig",
    "onReady",
    "onValueUpdate",
    "onYearChange",
    "onPreCalendarPosition"
  ];
  var defaults = {
    _disable: [],
    allowInput: false,
    allowInvalidPreload: false,
    altFormat: "F j, Y",
    altInput: false,
    altInputClass: "form-control input",
    animate: typeof window === "object" && window.navigator.userAgent.indexOf("MSIE") === -1,
    ariaDateFormat: "F j, Y",
    autoFillDefaultTime: true,
    clickOpens: true,
    closeOnSelect: true,
    conjunction: ", ",
    dateFormat: "Y-m-d",
    defaultHour: 12,
    defaultMinute: 0,
    defaultSeconds: 0,
    disable: [],
    disableMobile: false,
    enableSeconds: false,
    enableTime: false,
    errorHandler: function(err) {
      return typeof console !== "undefined" && console.warn(err);
    },
    getWeek: function(givenDate) {
      var date = new Date(givenDate.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      var week1 = new Date(date.getFullYear(), 0, 4);
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 864e5 - 3 + (week1.getDay() + 6) % 7) / 7);
    },
    hourIncrement: 1,
    ignoredFocusElements: [],
    inline: false,
    locale: "default",
    minuteIncrement: 5,
    mode: "single",
    monthSelectorType: "dropdown",
    nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
    noCalendar: false,
    now: new Date(),
    onChange: [],
    onClose: [],
    onDayCreate: [],
    onDestroy: [],
    onKeyDown: [],
    onMonthChange: [],
    onOpen: [],
    onParseConfig: [],
    onReady: [],
    onValueUpdate: [],
    onYearChange: [],
    onPreCalendarPosition: [],
    plugins: [],
    position: "auto",
    positionElement: void 0,
    prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
    shorthandCurrentMonth: false,
    showMonths: 1,
    static: false,
    time_24hr: false,
    weekNumbers: false,
    wrap: false
  };

  // node_modules/flatpickr/dist/esm/l10n/default.js
  var english = {
    weekdays: {
      shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      longhand: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
    },
    months: {
      shorthand: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      longhand: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    },
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    firstDayOfWeek: 0,
    ordinal: function(nth) {
      var s3 = nth % 100;
      if (s3 > 3 && s3 < 21)
        return "th";
      switch (s3 % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
    rangeSeparator: " to ",
    weekAbbreviation: "Wk",
    scrollTitle: "Scroll to increment",
    toggleTitle: "Click to toggle",
    amPM: ["AM", "PM"],
    yearAriaLabel: "Year",
    monthAriaLabel: "Month",
    hourAriaLabel: "Hour",
    minuteAriaLabel: "Minute",
    time_24hr: false
  };
  var default_default = english;

  // node_modules/flatpickr/dist/esm/utils/index.js
  var pad = function(number, length) {
    if (length === void 0) {
      length = 2;
    }
    return ("000" + number).slice(length * -1);
  };
  var int = function(bool) {
    return bool === true ? 1 : 0;
  };
  function debounce(fn2, wait) {
    var t2;
    return function() {
      var _this = this;
      var args = arguments;
      clearTimeout(t2);
      t2 = setTimeout(function() {
        return fn2.apply(_this, args);
      }, wait);
    };
  }
  var arrayify = function(obj) {
    return obj instanceof Array ? obj : [obj];
  };

  // node_modules/flatpickr/dist/esm/utils/dom.js
  function toggleClass(elem, className, bool) {
    if (bool === true)
      return elem.classList.add(className);
    elem.classList.remove(className);
  }
  function createElement(tag, className, content) {
    var e5 = window.document.createElement(tag);
    className = className || "";
    content = content || "";
    e5.className = className;
    if (content !== void 0)
      e5.textContent = content;
    return e5;
  }
  function clearNode(node) {
    while (node.firstChild)
      node.removeChild(node.firstChild);
  }
  function findParent(node, condition) {
    if (condition(node))
      return node;
    else if (node.parentNode)
      return findParent(node.parentNode, condition);
    return void 0;
  }
  function createNumberInput(inputClassName, opts) {
    var wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
    if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
      numInput.type = "number";
    } else {
      numInput.type = "text";
      numInput.pattern = "\\d*";
    }
    if (opts !== void 0)
      for (var key in opts)
        numInput.setAttribute(key, opts[key]);
    wrapper.appendChild(numInput);
    wrapper.appendChild(arrowUp);
    wrapper.appendChild(arrowDown);
    return wrapper;
  }
  function getEventTarget(event) {
    try {
      if (typeof event.composedPath === "function") {
        var path = event.composedPath();
        return path[0];
      }
      return event.target;
    } catch (error) {
      return event.target;
    }
  }

  // node_modules/flatpickr/dist/esm/utils/formatting.js
  var doNothing = function() {
    return void 0;
  };
  var monthToStr = function(monthNumber, shorthand, locale) {
    return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
  };
  var revFormat = {
    D: doNothing,
    F: function(dateObj, monthName, locale) {
      dateObj.setMonth(locale.months.longhand.indexOf(monthName));
    },
    G: function(dateObj, hour) {
      dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    H: function(dateObj, hour) {
      dateObj.setHours(parseFloat(hour));
    },
    J: function(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    K: function(dateObj, amPM, locale) {
      dateObj.setHours(dateObj.getHours() % 12 + 12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
    },
    M: function(dateObj, shortMonth, locale) {
      dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
    },
    S: function(dateObj, seconds) {
      dateObj.setSeconds(parseFloat(seconds));
    },
    U: function(_2, unixSeconds) {
      return new Date(parseFloat(unixSeconds) * 1e3);
    },
    W: function(dateObj, weekNum, locale) {
      var weekNumber = parseInt(weekNum);
      var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
      date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
      return date;
    },
    Y: function(dateObj, year) {
      dateObj.setFullYear(parseFloat(year));
    },
    Z: function(_2, ISODate) {
      return new Date(ISODate);
    },
    d: function(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    h: function(dateObj, hour) {
      dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    i: function(dateObj, minutes) {
      dateObj.setMinutes(parseFloat(minutes));
    },
    j: function(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    l: doNothing,
    m: function(dateObj, month) {
      dateObj.setMonth(parseFloat(month) - 1);
    },
    n: function(dateObj, month) {
      dateObj.setMonth(parseFloat(month) - 1);
    },
    s: function(dateObj, seconds) {
      dateObj.setSeconds(parseFloat(seconds));
    },
    u: function(_2, unixMillSeconds) {
      return new Date(parseFloat(unixMillSeconds));
    },
    w: doNothing,
    y: function(dateObj, year) {
      dateObj.setFullYear(2e3 + parseFloat(year));
    }
  };
  var tokenRegex = {
    D: "",
    F: "",
    G: "(\\d\\d|\\d)",
    H: "(\\d\\d|\\d)",
    J: "(\\d\\d|\\d)\\w+",
    K: "",
    M: "",
    S: "(\\d\\d|\\d)",
    U: "(.+)",
    W: "(\\d\\d|\\d)",
    Y: "(\\d{4})",
    Z: "(.+)",
    d: "(\\d\\d|\\d)",
    h: "(\\d\\d|\\d)",
    i: "(\\d\\d|\\d)",
    j: "(\\d\\d|\\d)",
    l: "",
    m: "(\\d\\d|\\d)",
    n: "(\\d\\d|\\d)",
    s: "(\\d\\d|\\d)",
    u: "(.+)",
    w: "(\\d\\d|\\d)",
    y: "(\\d{2})"
  };
  var formats = {
    Z: function(date) {
      return date.toISOString();
    },
    D: function(date, locale, options) {
      return locale.weekdays.shorthand[formats.w(date, locale, options)];
    },
    F: function(date, locale, options) {
      return monthToStr(formats.n(date, locale, options) - 1, false, locale);
    },
    G: function(date, locale, options) {
      return pad(formats.h(date, locale, options));
    },
    H: function(date) {
      return pad(date.getHours());
    },
    J: function(date, locale) {
      return locale.ordinal !== void 0 ? date.getDate() + locale.ordinal(date.getDate()) : date.getDate();
    },
    K: function(date, locale) {
      return locale.amPM[int(date.getHours() > 11)];
    },
    M: function(date, locale) {
      return monthToStr(date.getMonth(), true, locale);
    },
    S: function(date) {
      return pad(date.getSeconds());
    },
    U: function(date) {
      return date.getTime() / 1e3;
    },
    W: function(date, _2, options) {
      return options.getWeek(date);
    },
    Y: function(date) {
      return pad(date.getFullYear(), 4);
    },
    d: function(date) {
      return pad(date.getDate());
    },
    h: function(date) {
      return date.getHours() % 12 ? date.getHours() % 12 : 12;
    },
    i: function(date) {
      return pad(date.getMinutes());
    },
    j: function(date) {
      return date.getDate();
    },
    l: function(date, locale) {
      return locale.weekdays.longhand[date.getDay()];
    },
    m: function(date) {
      return pad(date.getMonth() + 1);
    },
    n: function(date) {
      return date.getMonth() + 1;
    },
    s: function(date) {
      return date.getSeconds();
    },
    u: function(date) {
      return date.getTime();
    },
    w: function(date) {
      return date.getDay();
    },
    y: function(date) {
      return String(date.getFullYear()).substring(2);
    }
  };

  // node_modules/flatpickr/dist/esm/utils/dates.js
  var createDateFormatter = function(_a) {
    var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c, _d = _a.isMobile, isMobile = _d === void 0 ? false : _d;
    return function(dateObj, frmt, overrideLocale) {
      var locale = overrideLocale || l10n;
      if (config.formatDate !== void 0 && !isMobile) {
        return config.formatDate(dateObj, frmt, locale);
      }
      return frmt.split("").map(function(c2, i2, arr) {
        return formats[c2] && arr[i2 - 1] !== "\\" ? formats[c2](dateObj, locale, config) : c2 !== "\\" ? c2 : "";
      }).join("");
    };
  };
  var createDateParser = function(_a) {
    var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c;
    return function(date, givenFormat, timeless, customLocale) {
      if (date !== 0 && !date)
        return void 0;
      var locale = customLocale || l10n;
      var parsedDate;
      var dateOrig = date;
      if (date instanceof Date)
        parsedDate = new Date(date.getTime());
      else if (typeof date !== "string" && date.toFixed !== void 0)
        parsedDate = new Date(date);
      else if (typeof date === "string") {
        var format = givenFormat || (config || defaults).dateFormat;
        var datestr = String(date).trim();
        if (datestr === "today") {
          parsedDate = new Date();
          timeless = true;
        } else if (config && config.parseDate) {
          parsedDate = config.parseDate(date, format);
        } else if (/Z$/.test(datestr) || /GMT$/.test(datestr)) {
          parsedDate = new Date(date);
        } else {
          var matched = void 0, ops = [];
          for (var i2 = 0, matchIndex = 0, regexStr = ""; i2 < format.length; i2++) {
            var token = format[i2];
            var isBackSlash = token === "\\";
            var escaped = format[i2 - 1] === "\\" || isBackSlash;
            if (tokenRegex[token] && !escaped) {
              regexStr += tokenRegex[token];
              var match2 = new RegExp(regexStr).exec(date);
              if (match2 && (matched = true)) {
                ops[token !== "Y" ? "push" : "unshift"]({
                  fn: revFormat[token],
                  val: match2[++matchIndex]
                });
              }
            } else if (!isBackSlash)
              regexStr += ".";
          }
          parsedDate = !config || !config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));
          ops.forEach(function(_a2) {
            var fn2 = _a2.fn, val = _a2.val;
            return parsedDate = fn2(parsedDate, val, locale) || parsedDate;
          });
          parsedDate = matched ? parsedDate : void 0;
        }
      }
      if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
        config.errorHandler(new Error("Invalid date provided: " + dateOrig));
        return void 0;
      }
      if (timeless === true)
        parsedDate.setHours(0, 0, 0, 0);
      return parsedDate;
    };
  };
  function compareDates(date1, date2, timeless) {
    if (timeless === void 0) {
      timeless = true;
    }
    if (timeless !== false) {
      return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
    }
    return date1.getTime() - date2.getTime();
  }
  var isBetween = function(ts2, ts1, ts22) {
    return ts2 > Math.min(ts1, ts22) && ts2 < Math.max(ts1, ts22);
  };
  var calculateSecondsSinceMidnight = function(hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
  };
  var parseSeconds = function(secondsSinceMidnight) {
    var hours = Math.floor(secondsSinceMidnight / 3600), minutes = (secondsSinceMidnight - hours * 3600) / 60;
    return [hours, minutes, secondsSinceMidnight - hours * 3600 - minutes * 60];
  };
  var duration = {
    DAY: 864e5
  };
  function getDefaultHours(config) {
    var hours = config.defaultHour;
    var minutes = config.defaultMinute;
    var seconds = config.defaultSeconds;
    if (config.minDate !== void 0) {
      var minHour = config.minDate.getHours();
      var minMinutes = config.minDate.getMinutes();
      var minSeconds = config.minDate.getSeconds();
      if (hours < minHour) {
        hours = minHour;
      }
      if (hours === minHour && minutes < minMinutes) {
        minutes = minMinutes;
      }
      if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
        seconds = config.minDate.getSeconds();
    }
    if (config.maxDate !== void 0) {
      var maxHr = config.maxDate.getHours();
      var maxMinutes = config.maxDate.getMinutes();
      hours = Math.min(hours, maxHr);
      if (hours === maxHr)
        minutes = Math.min(maxMinutes, minutes);
      if (hours === maxHr && minutes === maxMinutes)
        seconds = config.maxDate.getSeconds();
    }
    return { hours, minutes, seconds };
  }

  // node_modules/flatpickr/dist/esm/utils/polyfills.js
  if (typeof Object.assign !== "function") {
    Object.assign = function(target) {
      var args = [];
      for (var _i2 = 1; _i2 < arguments.length; _i2++) {
        args[_i2 - 1] = arguments[_i2];
      }
      if (!target) {
        throw TypeError("Cannot convert undefined or null to object");
      }
      var _loop_1 = function(source2) {
        if (source2) {
          Object.keys(source2).forEach(function(key) {
            return target[key] = source2[key];
          });
        }
      };
      for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var source = args_1[_a];
        _loop_1(source);
      }
      return target;
    };
  }

  // node_modules/flatpickr/dist/esm/index.js
  var __assign = function() {
    __assign = Object.assign || function(t2) {
      for (var s3, i2 = 1, n3 = arguments.length; i2 < n3; i2++) {
        s3 = arguments[i2];
        for (var p2 in s3)
          if (Object.prototype.hasOwnProperty.call(s3, p2))
            t2[p2] = s3[p2];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  var __spreadArrays = function() {
    for (var s3 = 0, i2 = 0, il = arguments.length; i2 < il; i2++)
      s3 += arguments[i2].length;
    for (var r2 = Array(s3), k2 = 0, i2 = 0; i2 < il; i2++)
      for (var a2 = arguments[i2], j2 = 0, jl = a2.length; j2 < jl; j2++, k2++)
        r2[k2] = a2[j2];
    return r2;
  };
  var DEBOUNCED_CHANGE_MS = 300;
  function FlatpickrInstance(element, instanceConfig) {
    var self2 = {
      config: __assign(__assign({}, defaults), flatpickr.defaultConfig),
      l10n: default_default
    };
    self2.parseDate = createDateParser({ config: self2.config, l10n: self2.l10n });
    self2._handlers = [];
    self2.pluginElements = [];
    self2.loadedPlugins = [];
    self2._bind = bind;
    self2._setHoursFromDate = setHoursFromDate;
    self2._positionCalendar = positionCalendar;
    self2.changeMonth = changeMonth;
    self2.changeYear = changeYear;
    self2.clear = clear;
    self2.close = close;
    self2.onMouseOver = onMouseOver;
    self2._createElement = createElement;
    self2.createDay = createDay;
    self2.destroy = destroy;
    self2.isEnabled = isEnabled;
    self2.jumpToDate = jumpToDate;
    self2.updateValue = updateValue;
    self2.open = open;
    self2.redraw = redraw;
    self2.set = set;
    self2.setDate = setDate;
    self2.toggle = toggle;
    function setupHelperFunctions() {
      self2.utils = {
        getDaysInMonth: function(month, yr2) {
          if (month === void 0) {
            month = self2.currentMonth;
          }
          if (yr2 === void 0) {
            yr2 = self2.currentYear;
          }
          if (month === 1 && (yr2 % 4 === 0 && yr2 % 100 !== 0 || yr2 % 400 === 0))
            return 29;
          return self2.l10n.daysInMonth[month];
        }
      };
    }
    function init2() {
      self2.element = self2.input = element;
      self2.isOpen = false;
      parseConfig();
      setupLocale();
      setupInputs();
      setupDates();
      setupHelperFunctions();
      if (!self2.isMobile)
        build();
      bindEvents();
      if (self2.selectedDates.length || self2.config.noCalendar) {
        if (self2.config.enableTime) {
          setHoursFromDate(self2.config.noCalendar ? self2.latestSelectedDateObj : void 0);
        }
        updateValue(false);
      }
      setCalendarWidth();
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (!self2.isMobile && isSafari) {
        positionCalendar();
      }
      triggerEvent("onReady");
    }
    function getClosestActiveElement() {
      var _a;
      return ((_a = self2.calendarContainer) === null || _a === void 0 ? void 0 : _a.getRootNode()).activeElement || document.activeElement;
    }
    function bindToInstance(fn2) {
      return fn2.bind(self2);
    }
    function setCalendarWidth() {
      var config = self2.config;
      if (config.weekNumbers === false && config.showMonths === 1) {
        return;
      } else if (config.noCalendar !== true) {
        window.requestAnimationFrame(function() {
          if (self2.calendarContainer !== void 0) {
            self2.calendarContainer.style.visibility = "hidden";
            self2.calendarContainer.style.display = "block";
          }
          if (self2.daysContainer !== void 0) {
            var daysWidth = (self2.days.offsetWidth + 1) * config.showMonths;
            self2.daysContainer.style.width = daysWidth + "px";
            self2.calendarContainer.style.width = daysWidth + (self2.weekWrapper !== void 0 ? self2.weekWrapper.offsetWidth : 0) + "px";
            self2.calendarContainer.style.removeProperty("visibility");
            self2.calendarContainer.style.removeProperty("display");
          }
        });
      }
    }
    function updateTime(e5) {
      if (self2.selectedDates.length === 0) {
        var defaultDate = self2.config.minDate === void 0 || compareDates(new Date(), self2.config.minDate) >= 0 ? new Date() : new Date(self2.config.minDate.getTime());
        var defaults2 = getDefaultHours(self2.config);
        defaultDate.setHours(defaults2.hours, defaults2.minutes, defaults2.seconds, defaultDate.getMilliseconds());
        self2.selectedDates = [defaultDate];
        self2.latestSelectedDateObj = defaultDate;
      }
      if (e5 !== void 0 && e5.type !== "blur") {
        timeWrapper(e5);
      }
      var prevValue = self2._input.value;
      setHoursFromInputs();
      updateValue();
      if (self2._input.value !== prevValue) {
        self2._debouncedChange();
      }
    }
    function ampm2military(hour, amPM) {
      return hour % 12 + 12 * int(amPM === self2.l10n.amPM[1]);
    }
    function military2ampm(hour) {
      switch (hour % 24) {
        case 0:
        case 12:
          return 12;
        default:
          return hour % 12;
      }
    }
    function setHoursFromInputs() {
      if (self2.hourElement === void 0 || self2.minuteElement === void 0)
        return;
      var hours = (parseInt(self2.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self2.minuteElement.value, 10) || 0) % 60, seconds = self2.secondElement !== void 0 ? (parseInt(self2.secondElement.value, 10) || 0) % 60 : 0;
      if (self2.amPM !== void 0) {
        hours = ampm2military(hours, self2.amPM.textContent);
      }
      var limitMinHours = self2.config.minTime !== void 0 || self2.config.minDate && self2.minDateHasTime && self2.latestSelectedDateObj && compareDates(self2.latestSelectedDateObj, self2.config.minDate, true) === 0;
      var limitMaxHours = self2.config.maxTime !== void 0 || self2.config.maxDate && self2.maxDateHasTime && self2.latestSelectedDateObj && compareDates(self2.latestSelectedDateObj, self2.config.maxDate, true) === 0;
      if (self2.config.maxTime !== void 0 && self2.config.minTime !== void 0 && self2.config.minTime > self2.config.maxTime) {
        var minBound = calculateSecondsSinceMidnight(self2.config.minTime.getHours(), self2.config.minTime.getMinutes(), self2.config.minTime.getSeconds());
        var maxBound = calculateSecondsSinceMidnight(self2.config.maxTime.getHours(), self2.config.maxTime.getMinutes(), self2.config.maxTime.getSeconds());
        var currentTime = calculateSecondsSinceMidnight(hours, minutes, seconds);
        if (currentTime > maxBound && currentTime < minBound) {
          var result = parseSeconds(minBound);
          hours = result[0];
          minutes = result[1];
          seconds = result[2];
        }
      } else {
        if (limitMaxHours) {
          var maxTime = self2.config.maxTime !== void 0 ? self2.config.maxTime : self2.config.maxDate;
          hours = Math.min(hours, maxTime.getHours());
          if (hours === maxTime.getHours())
            minutes = Math.min(minutes, maxTime.getMinutes());
          if (minutes === maxTime.getMinutes())
            seconds = Math.min(seconds, maxTime.getSeconds());
        }
        if (limitMinHours) {
          var minTime = self2.config.minTime !== void 0 ? self2.config.minTime : self2.config.minDate;
          hours = Math.max(hours, minTime.getHours());
          if (hours === minTime.getHours() && minutes < minTime.getMinutes())
            minutes = minTime.getMinutes();
          if (minutes === minTime.getMinutes())
            seconds = Math.max(seconds, minTime.getSeconds());
        }
      }
      setHours(hours, minutes, seconds);
    }
    function setHoursFromDate(dateObj) {
      var date = dateObj || self2.latestSelectedDateObj;
      if (date && date instanceof Date) {
        setHours(date.getHours(), date.getMinutes(), date.getSeconds());
      }
    }
    function setHours(hours, minutes, seconds) {
      if (self2.latestSelectedDateObj !== void 0) {
        self2.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
      }
      if (!self2.hourElement || !self2.minuteElement || self2.isMobile)
        return;
      self2.hourElement.value = pad(!self2.config.time_24hr ? (12 + hours) % 12 + 12 * int(hours % 12 === 0) : hours);
      self2.minuteElement.value = pad(minutes);
      if (self2.amPM !== void 0)
        self2.amPM.textContent = self2.l10n.amPM[int(hours >= 12)];
      if (self2.secondElement !== void 0)
        self2.secondElement.value = pad(seconds);
    }
    function onYearInput(event) {
      var eventTarget = getEventTarget(event);
      var year = parseInt(eventTarget.value) + (event.delta || 0);
      if (year / 1e3 > 1 || event.key === "Enter" && !/[^\d]/.test(year.toString())) {
        changeYear(year);
      }
    }
    function bind(element2, event, handler, options) {
      if (event instanceof Array)
        return event.forEach(function(ev) {
          return bind(element2, ev, handler, options);
        });
      if (element2 instanceof Array)
        return element2.forEach(function(el) {
          return bind(el, event, handler, options);
        });
      element2.addEventListener(event, handler, options);
      self2._handlers.push({
        remove: function() {
          return element2.removeEventListener(event, handler, options);
        }
      });
    }
    function triggerChange() {
      triggerEvent("onChange");
    }
    function bindEvents() {
      if (self2.config.wrap) {
        ["open", "close", "toggle", "clear"].forEach(function(evt) {
          Array.prototype.forEach.call(self2.element.querySelectorAll("[data-" + evt + "]"), function(el) {
            return bind(el, "click", self2[evt]);
          });
        });
      }
      if (self2.isMobile) {
        setupMobile();
        return;
      }
      var debouncedResize = debounce(onResize, 50);
      self2._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
      if (self2.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
        bind(self2.daysContainer, "mouseover", function(e5) {
          if (self2.config.mode === "range")
            onMouseOver(getEventTarget(e5));
        });
      bind(self2._input, "keydown", onKeyDown);
      if (self2.calendarContainer !== void 0) {
        bind(self2.calendarContainer, "keydown", onKeyDown);
      }
      if (!self2.config.inline && !self2.config.static)
        bind(window, "resize", debouncedResize);
      if (window.ontouchstart !== void 0)
        bind(window.document, "touchstart", documentClick);
      else
        bind(window.document, "mousedown", documentClick);
      bind(window.document, "focus", documentClick, { capture: true });
      if (self2.config.clickOpens === true) {
        bind(self2._input, "focus", self2.open);
        bind(self2._input, "click", self2.open);
      }
      if (self2.daysContainer !== void 0) {
        bind(self2.monthNav, "click", onMonthNavClick);
        bind(self2.monthNav, ["keyup", "increment"], onYearInput);
        bind(self2.daysContainer, "click", selectDate);
      }
      if (self2.timeContainer !== void 0 && self2.minuteElement !== void 0 && self2.hourElement !== void 0) {
        var selText = function(e5) {
          return getEventTarget(e5).select();
        };
        bind(self2.timeContainer, ["increment"], updateTime);
        bind(self2.timeContainer, "blur", updateTime, { capture: true });
        bind(self2.timeContainer, "click", timeIncrement);
        bind([self2.hourElement, self2.minuteElement], ["focus", "click"], selText);
        if (self2.secondElement !== void 0)
          bind(self2.secondElement, "focus", function() {
            return self2.secondElement && self2.secondElement.select();
          });
        if (self2.amPM !== void 0) {
          bind(self2.amPM, "click", function(e5) {
            updateTime(e5);
          });
        }
      }
      if (self2.config.allowInput) {
        bind(self2._input, "blur", onBlur);
      }
    }
    function jumpToDate(jumpDate, triggerChange2) {
      var jumpTo = jumpDate !== void 0 ? self2.parseDate(jumpDate) : self2.latestSelectedDateObj || (self2.config.minDate && self2.config.minDate > self2.now ? self2.config.minDate : self2.config.maxDate && self2.config.maxDate < self2.now ? self2.config.maxDate : self2.now);
      var oldYear = self2.currentYear;
      var oldMonth = self2.currentMonth;
      try {
        if (jumpTo !== void 0) {
          self2.currentYear = jumpTo.getFullYear();
          self2.currentMonth = jumpTo.getMonth();
        }
      } catch (e5) {
        e5.message = "Invalid date supplied: " + jumpTo;
        self2.config.errorHandler(e5);
      }
      if (triggerChange2 && self2.currentYear !== oldYear) {
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
      if (triggerChange2 && (self2.currentYear !== oldYear || self2.currentMonth !== oldMonth)) {
        triggerEvent("onMonthChange");
      }
      self2.redraw();
    }
    function timeIncrement(e5) {
      var eventTarget = getEventTarget(e5);
      if (~eventTarget.className.indexOf("arrow"))
        incrementNumInput(e5, eventTarget.classList.contains("arrowUp") ? 1 : -1);
    }
    function incrementNumInput(e5, delta, inputElem) {
      var target = e5 && getEventTarget(e5);
      var input = inputElem || target && target.parentNode && target.parentNode.firstChild;
      var event = createEvent("increment");
      event.delta = delta;
      input && input.dispatchEvent(event);
    }
    function build() {
      var fragment = window.document.createDocumentFragment();
      self2.calendarContainer = createElement("div", "flatpickr-calendar");
      self2.calendarContainer.tabIndex = -1;
      if (!self2.config.noCalendar) {
        fragment.appendChild(buildMonthNav());
        self2.innerContainer = createElement("div", "flatpickr-innerContainer");
        if (self2.config.weekNumbers) {
          var _a = buildWeeks(), weekWrapper = _a.weekWrapper, weekNumbers = _a.weekNumbers;
          self2.innerContainer.appendChild(weekWrapper);
          self2.weekNumbers = weekNumbers;
          self2.weekWrapper = weekWrapper;
        }
        self2.rContainer = createElement("div", "flatpickr-rContainer");
        self2.rContainer.appendChild(buildWeekdays());
        if (!self2.daysContainer) {
          self2.daysContainer = createElement("div", "flatpickr-days");
          self2.daysContainer.tabIndex = -1;
        }
        buildDays();
        self2.rContainer.appendChild(self2.daysContainer);
        self2.innerContainer.appendChild(self2.rContainer);
        fragment.appendChild(self2.innerContainer);
      }
      if (self2.config.enableTime) {
        fragment.appendChild(buildTime());
      }
      toggleClass(self2.calendarContainer, "rangeMode", self2.config.mode === "range");
      toggleClass(self2.calendarContainer, "animate", self2.config.animate === true);
      toggleClass(self2.calendarContainer, "multiMonth", self2.config.showMonths > 1);
      self2.calendarContainer.appendChild(fragment);
      var customAppend = self2.config.appendTo !== void 0 && self2.config.appendTo.nodeType !== void 0;
      if (self2.config.inline || self2.config.static) {
        self2.calendarContainer.classList.add(self2.config.inline ? "inline" : "static");
        if (self2.config.inline) {
          if (!customAppend && self2.element.parentNode)
            self2.element.parentNode.insertBefore(self2.calendarContainer, self2._input.nextSibling);
          else if (self2.config.appendTo !== void 0)
            self2.config.appendTo.appendChild(self2.calendarContainer);
        }
        if (self2.config.static) {
          var wrapper = createElement("div", "flatpickr-wrapper");
          if (self2.element.parentNode)
            self2.element.parentNode.insertBefore(wrapper, self2.element);
          wrapper.appendChild(self2.element);
          if (self2.altInput)
            wrapper.appendChild(self2.altInput);
          wrapper.appendChild(self2.calendarContainer);
        }
      }
      if (!self2.config.static && !self2.config.inline)
        (self2.config.appendTo !== void 0 ? self2.config.appendTo : window.document.body).appendChild(self2.calendarContainer);
    }
    function createDay(className, date, _dayNumber, i2) {
      var dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", className, date.getDate().toString());
      dayElement.dateObj = date;
      dayElement.$i = i2;
      dayElement.setAttribute("aria-label", self2.formatDate(date, self2.config.ariaDateFormat));
      if (className.indexOf("hidden") === -1 && compareDates(date, self2.now) === 0) {
        self2.todayDateElem = dayElement;
        dayElement.classList.add("today");
        dayElement.setAttribute("aria-current", "date");
      }
      if (dateIsEnabled) {
        dayElement.tabIndex = -1;
        if (isDateSelected(date)) {
          dayElement.classList.add("selected");
          self2.selectedDateElem = dayElement;
          if (self2.config.mode === "range") {
            toggleClass(dayElement, "startRange", self2.selectedDates[0] && compareDates(date, self2.selectedDates[0], true) === 0);
            toggleClass(dayElement, "endRange", self2.selectedDates[1] && compareDates(date, self2.selectedDates[1], true) === 0);
            if (className === "nextMonthDay")
              dayElement.classList.add("inRange");
          }
        }
      } else {
        dayElement.classList.add("flatpickr-disabled");
      }
      if (self2.config.mode === "range") {
        if (isDateInRange(date) && !isDateSelected(date))
          dayElement.classList.add("inRange");
      }
      if (self2.weekNumbers && self2.config.showMonths === 1 && className !== "prevMonthDay" && i2 % 7 === 6) {
        self2.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self2.config.getWeek(date) + "</span>");
      }
      triggerEvent("onDayCreate", dayElement);
      return dayElement;
    }
    function focusOnDayElem(targetNode) {
      targetNode.focus();
      if (self2.config.mode === "range")
        onMouseOver(targetNode);
    }
    function getFirstAvailableDay(delta) {
      var startMonth = delta > 0 ? 0 : self2.config.showMonths - 1;
      var endMonth = delta > 0 ? self2.config.showMonths : -1;
      for (var m2 = startMonth; m2 != endMonth; m2 += delta) {
        var month = self2.daysContainer.children[m2];
        var startIndex = delta > 0 ? 0 : month.children.length - 1;
        var endIndex = delta > 0 ? month.children.length : -1;
        for (var i2 = startIndex; i2 != endIndex; i2 += delta) {
          var c2 = month.children[i2];
          if (c2.className.indexOf("hidden") === -1 && isEnabled(c2.dateObj))
            return c2;
        }
      }
      return void 0;
    }
    function getNextAvailableDay(current, delta) {
      var givenMonth = current.className.indexOf("Month") === -1 ? current.dateObj.getMonth() : self2.currentMonth;
      var endMonth = delta > 0 ? self2.config.showMonths : -1;
      var loopDelta = delta > 0 ? 1 : -1;
      for (var m2 = givenMonth - self2.currentMonth; m2 != endMonth; m2 += loopDelta) {
        var month = self2.daysContainer.children[m2];
        var startIndex = givenMonth - self2.currentMonth === m2 ? current.$i + delta : delta < 0 ? month.children.length - 1 : 0;
        var numMonthDays = month.children.length;
        for (var i2 = startIndex; i2 >= 0 && i2 < numMonthDays && i2 != (delta > 0 ? numMonthDays : -1); i2 += loopDelta) {
          var c2 = month.children[i2];
          if (c2.className.indexOf("hidden") === -1 && isEnabled(c2.dateObj) && Math.abs(current.$i - i2) >= Math.abs(delta))
            return focusOnDayElem(c2);
        }
      }
      self2.changeMonth(loopDelta);
      focusOnDay(getFirstAvailableDay(loopDelta), 0);
      return void 0;
    }
    function focusOnDay(current, offset2) {
      var activeElement = getClosestActiveElement();
      var dayFocused = isInView(activeElement || document.body);
      var startElem = current !== void 0 ? current : dayFocused ? activeElement : self2.selectedDateElem !== void 0 && isInView(self2.selectedDateElem) ? self2.selectedDateElem : self2.todayDateElem !== void 0 && isInView(self2.todayDateElem) ? self2.todayDateElem : getFirstAvailableDay(offset2 > 0 ? 1 : -1);
      if (startElem === void 0) {
        self2._input.focus();
      } else if (!dayFocused) {
        focusOnDayElem(startElem);
      } else {
        getNextAvailableDay(startElem, offset2);
      }
    }
    function buildMonthDays(year, month) {
      var firstOfMonth = (new Date(year, month, 1).getDay() - self2.l10n.firstDayOfWeek + 7) % 7;
      var prevMonthDays = self2.utils.getDaysInMonth((month - 1 + 12) % 12, year);
      var daysInMonth2 = self2.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self2.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
      var dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
      for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
        days.appendChild(createDay("flatpickr-day " + prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
      }
      for (dayNumber = 1; dayNumber <= daysInMonth2; dayNumber++, dayIndex++) {
        days.appendChild(createDay("flatpickr-day", new Date(year, month, dayNumber), dayNumber, dayIndex));
      }
      for (var dayNum = daysInMonth2 + 1; dayNum <= 42 - firstOfMonth && (self2.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
        days.appendChild(createDay("flatpickr-day " + nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth2), dayNum, dayIndex));
      }
      var dayContainer = createElement("div", "dayContainer");
      dayContainer.appendChild(days);
      return dayContainer;
    }
    function buildDays() {
      if (self2.daysContainer === void 0) {
        return;
      }
      clearNode(self2.daysContainer);
      if (self2.weekNumbers)
        clearNode(self2.weekNumbers);
      var frag = document.createDocumentFragment();
      for (var i2 = 0; i2 < self2.config.showMonths; i2++) {
        var d2 = new Date(self2.currentYear, self2.currentMonth, 1);
        d2.setMonth(self2.currentMonth + i2);
        frag.appendChild(buildMonthDays(d2.getFullYear(), d2.getMonth()));
      }
      self2.daysContainer.appendChild(frag);
      self2.days = self2.daysContainer.firstChild;
      if (self2.config.mode === "range" && self2.selectedDates.length === 1) {
        onMouseOver();
      }
    }
    function buildMonthSwitch() {
      if (self2.config.showMonths > 1 || self2.config.monthSelectorType !== "dropdown")
        return;
      var shouldBuildMonth = function(month2) {
        if (self2.config.minDate !== void 0 && self2.currentYear === self2.config.minDate.getFullYear() && month2 < self2.config.minDate.getMonth()) {
          return false;
        }
        return !(self2.config.maxDate !== void 0 && self2.currentYear === self2.config.maxDate.getFullYear() && month2 > self2.config.maxDate.getMonth());
      };
      self2.monthsDropdownContainer.tabIndex = -1;
      self2.monthsDropdownContainer.innerHTML = "";
      for (var i2 = 0; i2 < 12; i2++) {
        if (!shouldBuildMonth(i2))
          continue;
        var month = createElement("option", "flatpickr-monthDropdown-month");
        month.value = new Date(self2.currentYear, i2).getMonth().toString();
        month.textContent = monthToStr(i2, self2.config.shorthandCurrentMonth, self2.l10n);
        month.tabIndex = -1;
        if (self2.currentMonth === i2) {
          month.selected = true;
        }
        self2.monthsDropdownContainer.appendChild(month);
      }
    }
    function buildMonth() {
      var container = createElement("div", "flatpickr-month");
      var monthNavFragment = window.document.createDocumentFragment();
      var monthElement;
      if (self2.config.showMonths > 1 || self2.config.monthSelectorType === "static") {
        monthElement = createElement("span", "cur-month");
      } else {
        self2.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
        self2.monthsDropdownContainer.setAttribute("aria-label", self2.l10n.monthAriaLabel);
        bind(self2.monthsDropdownContainer, "change", function(e5) {
          var target = getEventTarget(e5);
          var selectedMonth = parseInt(target.value, 10);
          self2.changeMonth(selectedMonth - self2.currentMonth);
          triggerEvent("onMonthChange");
        });
        buildMonthSwitch();
        monthElement = self2.monthsDropdownContainer;
      }
      var yearInput = createNumberInput("cur-year", { tabindex: "-1" });
      var yearElement = yearInput.getElementsByTagName("input")[0];
      yearElement.setAttribute("aria-label", self2.l10n.yearAriaLabel);
      if (self2.config.minDate) {
        yearElement.setAttribute("min", self2.config.minDate.getFullYear().toString());
      }
      if (self2.config.maxDate) {
        yearElement.setAttribute("max", self2.config.maxDate.getFullYear().toString());
        yearElement.disabled = !!self2.config.minDate && self2.config.minDate.getFullYear() === self2.config.maxDate.getFullYear();
      }
      var currentMonth = createElement("div", "flatpickr-current-month");
      currentMonth.appendChild(monthElement);
      currentMonth.appendChild(yearInput);
      monthNavFragment.appendChild(currentMonth);
      container.appendChild(monthNavFragment);
      return {
        container,
        yearElement,
        monthElement
      };
    }
    function buildMonths() {
      clearNode(self2.monthNav);
      self2.monthNav.appendChild(self2.prevMonthNav);
      if (self2.config.showMonths) {
        self2.yearElements = [];
        self2.monthElements = [];
      }
      for (var m2 = self2.config.showMonths; m2--; ) {
        var month = buildMonth();
        self2.yearElements.push(month.yearElement);
        self2.monthElements.push(month.monthElement);
        self2.monthNav.appendChild(month.container);
      }
      self2.monthNav.appendChild(self2.nextMonthNav);
    }
    function buildMonthNav() {
      self2.monthNav = createElement("div", "flatpickr-months");
      self2.yearElements = [];
      self2.monthElements = [];
      self2.prevMonthNav = createElement("span", "flatpickr-prev-month");
      self2.prevMonthNav.innerHTML = self2.config.prevArrow;
      self2.nextMonthNav = createElement("span", "flatpickr-next-month");
      self2.nextMonthNav.innerHTML = self2.config.nextArrow;
      buildMonths();
      Object.defineProperty(self2, "_hidePrevMonthArrow", {
        get: function() {
          return self2.__hidePrevMonthArrow;
        },
        set: function(bool) {
          if (self2.__hidePrevMonthArrow !== bool) {
            toggleClass(self2.prevMonthNav, "flatpickr-disabled", bool);
            self2.__hidePrevMonthArrow = bool;
          }
        }
      });
      Object.defineProperty(self2, "_hideNextMonthArrow", {
        get: function() {
          return self2.__hideNextMonthArrow;
        },
        set: function(bool) {
          if (self2.__hideNextMonthArrow !== bool) {
            toggleClass(self2.nextMonthNav, "flatpickr-disabled", bool);
            self2.__hideNextMonthArrow = bool;
          }
        }
      });
      self2.currentYearElement = self2.yearElements[0];
      updateNavigationCurrentMonth();
      return self2.monthNav;
    }
    function buildTime() {
      self2.calendarContainer.classList.add("hasTime");
      if (self2.config.noCalendar)
        self2.calendarContainer.classList.add("noCalendar");
      var defaults2 = getDefaultHours(self2.config);
      self2.timeContainer = createElement("div", "flatpickr-time");
      self2.timeContainer.tabIndex = -1;
      var separator = createElement("span", "flatpickr-time-separator", ":");
      var hourInput = createNumberInput("flatpickr-hour", {
        "aria-label": self2.l10n.hourAriaLabel
      });
      self2.hourElement = hourInput.getElementsByTagName("input")[0];
      var minuteInput = createNumberInput("flatpickr-minute", {
        "aria-label": self2.l10n.minuteAriaLabel
      });
      self2.minuteElement = minuteInput.getElementsByTagName("input")[0];
      self2.hourElement.tabIndex = self2.minuteElement.tabIndex = -1;
      self2.hourElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getHours() : self2.config.time_24hr ? defaults2.hours : military2ampm(defaults2.hours));
      self2.minuteElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getMinutes() : defaults2.minutes);
      self2.hourElement.setAttribute("step", self2.config.hourIncrement.toString());
      self2.minuteElement.setAttribute("step", self2.config.minuteIncrement.toString());
      self2.hourElement.setAttribute("min", self2.config.time_24hr ? "0" : "1");
      self2.hourElement.setAttribute("max", self2.config.time_24hr ? "23" : "12");
      self2.hourElement.setAttribute("maxlength", "2");
      self2.minuteElement.setAttribute("min", "0");
      self2.minuteElement.setAttribute("max", "59");
      self2.minuteElement.setAttribute("maxlength", "2");
      self2.timeContainer.appendChild(hourInput);
      self2.timeContainer.appendChild(separator);
      self2.timeContainer.appendChild(minuteInput);
      if (self2.config.time_24hr)
        self2.timeContainer.classList.add("time24hr");
      if (self2.config.enableSeconds) {
        self2.timeContainer.classList.add("hasSeconds");
        var secondInput = createNumberInput("flatpickr-second");
        self2.secondElement = secondInput.getElementsByTagName("input")[0];
        self2.secondElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getSeconds() : defaults2.seconds);
        self2.secondElement.setAttribute("step", self2.minuteElement.getAttribute("step"));
        self2.secondElement.setAttribute("min", "0");
        self2.secondElement.setAttribute("max", "59");
        self2.secondElement.setAttribute("maxlength", "2");
        self2.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
        self2.timeContainer.appendChild(secondInput);
      }
      if (!self2.config.time_24hr) {
        self2.amPM = createElement("span", "flatpickr-am-pm", self2.l10n.amPM[int((self2.latestSelectedDateObj ? self2.hourElement.value : self2.config.defaultHour) > 11)]);
        self2.amPM.title = self2.l10n.toggleTitle;
        self2.amPM.tabIndex = -1;
        self2.timeContainer.appendChild(self2.amPM);
      }
      return self2.timeContainer;
    }
    function buildWeekdays() {
      if (!self2.weekdayContainer)
        self2.weekdayContainer = createElement("div", "flatpickr-weekdays");
      else
        clearNode(self2.weekdayContainer);
      for (var i2 = self2.config.showMonths; i2--; ) {
        var container = createElement("div", "flatpickr-weekdaycontainer");
        self2.weekdayContainer.appendChild(container);
      }
      updateWeekdays();
      return self2.weekdayContainer;
    }
    function updateWeekdays() {
      if (!self2.weekdayContainer) {
        return;
      }
      var firstDayOfWeek = self2.l10n.firstDayOfWeek;
      var weekdays2 = __spreadArrays(self2.l10n.weekdays.shorthand);
      if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays2.length) {
        weekdays2 = __spreadArrays(weekdays2.splice(firstDayOfWeek, weekdays2.length), weekdays2.splice(0, firstDayOfWeek));
      }
      for (var i2 = self2.config.showMonths; i2--; ) {
        self2.weekdayContainer.children[i2].innerHTML = "\n      <span class='flatpickr-weekday'>\n        " + weekdays2.join("</span><span class='flatpickr-weekday'>") + "\n      </span>\n      ";
      }
    }
    function buildWeeks() {
      self2.calendarContainer.classList.add("hasWeeks");
      var weekWrapper = createElement("div", "flatpickr-weekwrapper");
      weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self2.l10n.weekAbbreviation));
      var weekNumbers = createElement("div", "flatpickr-weeks");
      weekWrapper.appendChild(weekNumbers);
      return {
        weekWrapper,
        weekNumbers
      };
    }
    function changeMonth(value, isOffset) {
      if (isOffset === void 0) {
        isOffset = true;
      }
      var delta = isOffset ? value : value - self2.currentMonth;
      if (delta < 0 && self2._hidePrevMonthArrow === true || delta > 0 && self2._hideNextMonthArrow === true)
        return;
      self2.currentMonth += delta;
      if (self2.currentMonth < 0 || self2.currentMonth > 11) {
        self2.currentYear += self2.currentMonth > 11 ? 1 : -1;
        self2.currentMonth = (self2.currentMonth + 12) % 12;
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
      buildDays();
      triggerEvent("onMonthChange");
      updateNavigationCurrentMonth();
    }
    function clear(triggerChangeEvent, toInitial) {
      if (triggerChangeEvent === void 0) {
        triggerChangeEvent = true;
      }
      if (toInitial === void 0) {
        toInitial = true;
      }
      self2.input.value = "";
      if (self2.altInput !== void 0)
        self2.altInput.value = "";
      if (self2.mobileInput !== void 0)
        self2.mobileInput.value = "";
      self2.selectedDates = [];
      self2.latestSelectedDateObj = void 0;
      if (toInitial === true) {
        self2.currentYear = self2._initialDate.getFullYear();
        self2.currentMonth = self2._initialDate.getMonth();
      }
      if (self2.config.enableTime === true) {
        var _a = getDefaultHours(self2.config), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
        setHours(hours, minutes, seconds);
      }
      self2.redraw();
      if (triggerChangeEvent)
        triggerEvent("onChange");
    }
    function close() {
      self2.isOpen = false;
      if (!self2.isMobile) {
        if (self2.calendarContainer !== void 0) {
          self2.calendarContainer.classList.remove("open");
        }
        if (self2._input !== void 0) {
          self2._input.classList.remove("active");
        }
      }
      triggerEvent("onClose");
    }
    function destroy() {
      if (self2.config !== void 0)
        triggerEvent("onDestroy");
      for (var i2 = self2._handlers.length; i2--; ) {
        self2._handlers[i2].remove();
      }
      self2._handlers = [];
      if (self2.mobileInput) {
        if (self2.mobileInput.parentNode)
          self2.mobileInput.parentNode.removeChild(self2.mobileInput);
        self2.mobileInput = void 0;
      } else if (self2.calendarContainer && self2.calendarContainer.parentNode) {
        if (self2.config.static && self2.calendarContainer.parentNode) {
          var wrapper = self2.calendarContainer.parentNode;
          wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
          if (wrapper.parentNode) {
            while (wrapper.firstChild)
              wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            wrapper.parentNode.removeChild(wrapper);
          }
        } else
          self2.calendarContainer.parentNode.removeChild(self2.calendarContainer);
      }
      if (self2.altInput) {
        self2.input.type = "text";
        if (self2.altInput.parentNode)
          self2.altInput.parentNode.removeChild(self2.altInput);
        delete self2.altInput;
      }
      if (self2.input) {
        self2.input.type = self2.input._type;
        self2.input.classList.remove("flatpickr-input");
        self2.input.removeAttribute("readonly");
      }
      [
        "_showTimeInput",
        "latestSelectedDateObj",
        "_hideNextMonthArrow",
        "_hidePrevMonthArrow",
        "__hideNextMonthArrow",
        "__hidePrevMonthArrow",
        "isMobile",
        "isOpen",
        "selectedDateElem",
        "minDateHasTime",
        "maxDateHasTime",
        "days",
        "daysContainer",
        "_input",
        "_positionElement",
        "innerContainer",
        "rContainer",
        "monthNav",
        "todayDateElem",
        "calendarContainer",
        "weekdayContainer",
        "prevMonthNav",
        "nextMonthNav",
        "monthsDropdownContainer",
        "currentMonthElement",
        "currentYearElement",
        "navigationCurrentMonth",
        "selectedDateElem",
        "config"
      ].forEach(function(k2) {
        try {
          delete self2[k2];
        } catch (_2) {
        }
      });
    }
    function isCalendarElem(elem) {
      return self2.calendarContainer.contains(elem);
    }
    function documentClick(e5) {
      if (self2.isOpen && !self2.config.inline) {
        var eventTarget_1 = getEventTarget(e5);
        var isCalendarElement = isCalendarElem(eventTarget_1);
        var isInput = eventTarget_1 === self2.input || eventTarget_1 === self2.altInput || self2.element.contains(eventTarget_1) || e5.path && e5.path.indexOf && (~e5.path.indexOf(self2.input) || ~e5.path.indexOf(self2.altInput));
        var lostFocus = !isInput && !isCalendarElement && !isCalendarElem(e5.relatedTarget);
        var isIgnored = !self2.config.ignoredFocusElements.some(function(elem) {
          return elem.contains(eventTarget_1);
        });
        if (lostFocus && isIgnored) {
          if (self2.config.allowInput) {
            self2.setDate(self2._input.value, false, self2.config.altInput ? self2.config.altFormat : self2.config.dateFormat);
          }
          if (self2.timeContainer !== void 0 && self2.minuteElement !== void 0 && self2.hourElement !== void 0 && self2.input.value !== "" && self2.input.value !== void 0) {
            updateTime();
          }
          self2.close();
          if (self2.config && self2.config.mode === "range" && self2.selectedDates.length === 1)
            self2.clear(false);
        }
      }
    }
    function changeYear(newYear) {
      if (!newYear || self2.config.minDate && newYear < self2.config.minDate.getFullYear() || self2.config.maxDate && newYear > self2.config.maxDate.getFullYear())
        return;
      var newYearNum = newYear, isNewYear = self2.currentYear !== newYearNum;
      self2.currentYear = newYearNum || self2.currentYear;
      if (self2.config.maxDate && self2.currentYear === self2.config.maxDate.getFullYear()) {
        self2.currentMonth = Math.min(self2.config.maxDate.getMonth(), self2.currentMonth);
      } else if (self2.config.minDate && self2.currentYear === self2.config.minDate.getFullYear()) {
        self2.currentMonth = Math.max(self2.config.minDate.getMonth(), self2.currentMonth);
      }
      if (isNewYear) {
        self2.redraw();
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
    }
    function isEnabled(date, timeless) {
      var _a;
      if (timeless === void 0) {
        timeless = true;
      }
      var dateToCheck = self2.parseDate(date, void 0, timeless);
      if (self2.config.minDate && dateToCheck && compareDates(dateToCheck, self2.config.minDate, timeless !== void 0 ? timeless : !self2.minDateHasTime) < 0 || self2.config.maxDate && dateToCheck && compareDates(dateToCheck, self2.config.maxDate, timeless !== void 0 ? timeless : !self2.maxDateHasTime) > 0)
        return false;
      if (!self2.config.enable && self2.config.disable.length === 0)
        return true;
      if (dateToCheck === void 0)
        return false;
      var bool = !!self2.config.enable, array = (_a = self2.config.enable) !== null && _a !== void 0 ? _a : self2.config.disable;
      for (var i2 = 0, d2 = void 0; i2 < array.length; i2++) {
        d2 = array[i2];
        if (typeof d2 === "function" && d2(dateToCheck))
          return bool;
        else if (d2 instanceof Date && dateToCheck !== void 0 && d2.getTime() === dateToCheck.getTime())
          return bool;
        else if (typeof d2 === "string") {
          var parsed = self2.parseDate(d2, void 0, true);
          return parsed && parsed.getTime() === dateToCheck.getTime() ? bool : !bool;
        } else if (typeof d2 === "object" && dateToCheck !== void 0 && d2.from && d2.to && dateToCheck.getTime() >= d2.from.getTime() && dateToCheck.getTime() <= d2.to.getTime())
          return bool;
      }
      return !bool;
    }
    function isInView(elem) {
      if (self2.daysContainer !== void 0)
        return elem.className.indexOf("hidden") === -1 && elem.className.indexOf("flatpickr-disabled") === -1 && self2.daysContainer.contains(elem);
      return false;
    }
    function onBlur(e5) {
      var isInput = e5.target === self2._input;
      var valueChanged = self2._input.value.trimEnd() !== getDateStr();
      if (isInput && valueChanged && !(e5.relatedTarget && isCalendarElem(e5.relatedTarget))) {
        self2.setDate(self2._input.value, true, e5.target === self2.altInput ? self2.config.altFormat : self2.config.dateFormat);
      }
    }
    function onKeyDown(e5) {
      var eventTarget = getEventTarget(e5);
      var isInput = self2.config.wrap ? element.contains(eventTarget) : eventTarget === self2._input;
      var allowInput = self2.config.allowInput;
      var allowKeydown = self2.isOpen && (!allowInput || !isInput);
      var allowInlineKeydown = self2.config.inline && isInput && !allowInput;
      if (e5.keyCode === 13 && isInput) {
        if (allowInput) {
          self2.setDate(self2._input.value, true, eventTarget === self2.altInput ? self2.config.altFormat : self2.config.dateFormat);
          self2.close();
          return eventTarget.blur();
        } else {
          self2.open();
        }
      } else if (isCalendarElem(eventTarget) || allowKeydown || allowInlineKeydown) {
        var isTimeObj = !!self2.timeContainer && self2.timeContainer.contains(eventTarget);
        switch (e5.keyCode) {
          case 13:
            if (isTimeObj) {
              e5.preventDefault();
              updateTime();
              focusAndClose();
            } else
              selectDate(e5);
            break;
          case 27:
            e5.preventDefault();
            focusAndClose();
            break;
          case 8:
          case 46:
            if (isInput && !self2.config.allowInput) {
              e5.preventDefault();
              self2.clear();
            }
            break;
          case 37:
          case 39:
            if (!isTimeObj && !isInput) {
              e5.preventDefault();
              var activeElement = getClosestActiveElement();
              if (self2.daysContainer !== void 0 && (allowInput === false || activeElement && isInView(activeElement))) {
                var delta_1 = e5.keyCode === 39 ? 1 : -1;
                if (!e5.ctrlKey)
                  focusOnDay(void 0, delta_1);
                else {
                  e5.stopPropagation();
                  changeMonth(delta_1);
                  focusOnDay(getFirstAvailableDay(1), 0);
                }
              }
            } else if (self2.hourElement)
              self2.hourElement.focus();
            break;
          case 38:
          case 40:
            e5.preventDefault();
            var delta = e5.keyCode === 40 ? 1 : -1;
            if (self2.daysContainer && eventTarget.$i !== void 0 || eventTarget === self2.input || eventTarget === self2.altInput) {
              if (e5.ctrlKey) {
                e5.stopPropagation();
                changeYear(self2.currentYear - delta);
                focusOnDay(getFirstAvailableDay(1), 0);
              } else if (!isTimeObj)
                focusOnDay(void 0, delta * 7);
            } else if (eventTarget === self2.currentYearElement) {
              changeYear(self2.currentYear - delta);
            } else if (self2.config.enableTime) {
              if (!isTimeObj && self2.hourElement)
                self2.hourElement.focus();
              updateTime(e5);
              self2._debouncedChange();
            }
            break;
          case 9:
            if (isTimeObj) {
              var elems = [
                self2.hourElement,
                self2.minuteElement,
                self2.secondElement,
                self2.amPM
              ].concat(self2.pluginElements).filter(function(x2) {
                return x2;
              });
              var i2 = elems.indexOf(eventTarget);
              if (i2 !== -1) {
                var target = elems[i2 + (e5.shiftKey ? -1 : 1)];
                e5.preventDefault();
                (target || self2._input).focus();
              }
            } else if (!self2.config.noCalendar && self2.daysContainer && self2.daysContainer.contains(eventTarget) && e5.shiftKey) {
              e5.preventDefault();
              self2._input.focus();
            }
            break;
          default:
            break;
        }
      }
      if (self2.amPM !== void 0 && eventTarget === self2.amPM) {
        switch (e5.key) {
          case self2.l10n.amPM[0].charAt(0):
          case self2.l10n.amPM[0].charAt(0).toLowerCase():
            self2.amPM.textContent = self2.l10n.amPM[0];
            setHoursFromInputs();
            updateValue();
            break;
          case self2.l10n.amPM[1].charAt(0):
          case self2.l10n.amPM[1].charAt(0).toLowerCase():
            self2.amPM.textContent = self2.l10n.amPM[1];
            setHoursFromInputs();
            updateValue();
            break;
        }
      }
      if (isInput || isCalendarElem(eventTarget)) {
        triggerEvent("onKeyDown", e5);
      }
    }
    function onMouseOver(elem, cellClass) {
      if (cellClass === void 0) {
        cellClass = "flatpickr-day";
      }
      if (self2.selectedDates.length !== 1 || elem && (!elem.classList.contains(cellClass) || elem.classList.contains("flatpickr-disabled")))
        return;
      var hoverDate = elem ? elem.dateObj.getTime() : self2.days.firstElementChild.dateObj.getTime(), initialDate = self2.parseDate(self2.selectedDates[0], void 0, true).getTime(), rangeStartDate = Math.min(hoverDate, self2.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self2.selectedDates[0].getTime());
      var containsDisabled = false;
      var minRange = 0, maxRange = 0;
      for (var t2 = rangeStartDate; t2 < rangeEndDate; t2 += duration.DAY) {
        if (!isEnabled(new Date(t2), true)) {
          containsDisabled = containsDisabled || t2 > rangeStartDate && t2 < rangeEndDate;
          if (t2 < initialDate && (!minRange || t2 > minRange))
            minRange = t2;
          else if (t2 > initialDate && (!maxRange || t2 < maxRange))
            maxRange = t2;
        }
      }
      var hoverableCells = Array.from(self2.rContainer.querySelectorAll("*:nth-child(-n+" + self2.config.showMonths + ") > ." + cellClass));
      hoverableCells.forEach(function(dayElem) {
        var date = dayElem.dateObj;
        var timestamp = date.getTime();
        var outOfRange = minRange > 0 && timestamp < minRange || maxRange > 0 && timestamp > maxRange;
        if (outOfRange) {
          dayElem.classList.add("notAllowed");
          ["inRange", "startRange", "endRange"].forEach(function(c2) {
            dayElem.classList.remove(c2);
          });
          return;
        } else if (containsDisabled && !outOfRange)
          return;
        ["startRange", "inRange", "endRange", "notAllowed"].forEach(function(c2) {
          dayElem.classList.remove(c2);
        });
        if (elem !== void 0) {
          elem.classList.add(hoverDate <= self2.selectedDates[0].getTime() ? "startRange" : "endRange");
          if (initialDate < hoverDate && timestamp === initialDate)
            dayElem.classList.add("startRange");
          else if (initialDate > hoverDate && timestamp === initialDate)
            dayElem.classList.add("endRange");
          if (timestamp >= minRange && (maxRange === 0 || timestamp <= maxRange) && isBetween(timestamp, initialDate, hoverDate))
            dayElem.classList.add("inRange");
        }
      });
    }
    function onResize() {
      if (self2.isOpen && !self2.config.static && !self2.config.inline)
        positionCalendar();
    }
    function open(e5, positionElement) {
      if (positionElement === void 0) {
        positionElement = self2._positionElement;
      }
      if (self2.isMobile === true) {
        if (e5) {
          e5.preventDefault();
          var eventTarget = getEventTarget(e5);
          if (eventTarget) {
            eventTarget.blur();
          }
        }
        if (self2.mobileInput !== void 0) {
          self2.mobileInput.focus();
          self2.mobileInput.click();
        }
        triggerEvent("onOpen");
        return;
      } else if (self2._input.disabled || self2.config.inline) {
        return;
      }
      var wasOpen = self2.isOpen;
      self2.isOpen = true;
      if (!wasOpen) {
        self2.calendarContainer.classList.add("open");
        self2._input.classList.add("active");
        triggerEvent("onOpen");
        positionCalendar(positionElement);
      }
      if (self2.config.enableTime === true && self2.config.noCalendar === true) {
        if (self2.config.allowInput === false && (e5 === void 0 || !self2.timeContainer.contains(e5.relatedTarget))) {
          setTimeout(function() {
            return self2.hourElement.select();
          }, 50);
        }
      }
    }
    function minMaxDateSetter(type) {
      return function(date) {
        var dateObj = self2.config["_" + type + "Date"] = self2.parseDate(date, self2.config.dateFormat);
        var inverseDateObj = self2.config["_" + (type === "min" ? "max" : "min") + "Date"];
        if (dateObj !== void 0) {
          self2[type === "min" ? "minDateHasTime" : "maxDateHasTime"] = dateObj.getHours() > 0 || dateObj.getMinutes() > 0 || dateObj.getSeconds() > 0;
        }
        if (self2.selectedDates) {
          self2.selectedDates = self2.selectedDates.filter(function(d2) {
            return isEnabled(d2);
          });
          if (!self2.selectedDates.length && type === "min")
            setHoursFromDate(dateObj);
          updateValue();
        }
        if (self2.daysContainer) {
          redraw();
          if (dateObj !== void 0)
            self2.currentYearElement[type] = dateObj.getFullYear().toString();
          else
            self2.currentYearElement.removeAttribute(type);
          self2.currentYearElement.disabled = !!inverseDateObj && dateObj !== void 0 && inverseDateObj.getFullYear() === dateObj.getFullYear();
        }
      };
    }
    function parseConfig() {
      var boolOpts = [
        "wrap",
        "weekNumbers",
        "allowInput",
        "allowInvalidPreload",
        "clickOpens",
        "time_24hr",
        "enableTime",
        "noCalendar",
        "altInput",
        "shorthandCurrentMonth",
        "inline",
        "static",
        "enableSeconds",
        "disableMobile"
      ];
      var userConfig = __assign(__assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
      var formats2 = {};
      self2.config.parseDate = userConfig.parseDate;
      self2.config.formatDate = userConfig.formatDate;
      Object.defineProperty(self2.config, "enable", {
        get: function() {
          return self2.config._enable;
        },
        set: function(dates) {
          self2.config._enable = parseDateRules(dates);
        }
      });
      Object.defineProperty(self2.config, "disable", {
        get: function() {
          return self2.config._disable;
        },
        set: function(dates) {
          self2.config._disable = parseDateRules(dates);
        }
      });
      var timeMode = userConfig.mode === "time";
      if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
        var defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
        formats2.dateFormat = userConfig.noCalendar || timeMode ? "H:i" + (userConfig.enableSeconds ? ":S" : "") : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
      }
      if (userConfig.altInput && (userConfig.enableTime || timeMode) && !userConfig.altFormat) {
        var defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults.altFormat;
        formats2.altFormat = userConfig.noCalendar || timeMode ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K") : defaultAltFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
      }
      Object.defineProperty(self2.config, "minDate", {
        get: function() {
          return self2.config._minDate;
        },
        set: minMaxDateSetter("min")
      });
      Object.defineProperty(self2.config, "maxDate", {
        get: function() {
          return self2.config._maxDate;
        },
        set: minMaxDateSetter("max")
      });
      var minMaxTimeSetter = function(type) {
        return function(val) {
          self2.config[type === "min" ? "_minTime" : "_maxTime"] = self2.parseDate(val, "H:i:S");
        };
      };
      Object.defineProperty(self2.config, "minTime", {
        get: function() {
          return self2.config._minTime;
        },
        set: minMaxTimeSetter("min")
      });
      Object.defineProperty(self2.config, "maxTime", {
        get: function() {
          return self2.config._maxTime;
        },
        set: minMaxTimeSetter("max")
      });
      if (userConfig.mode === "time") {
        self2.config.noCalendar = true;
        self2.config.enableTime = true;
      }
      Object.assign(self2.config, formats2, userConfig);
      for (var i2 = 0; i2 < boolOpts.length; i2++)
        self2.config[boolOpts[i2]] = self2.config[boolOpts[i2]] === true || self2.config[boolOpts[i2]] === "true";
      HOOKS.filter(function(hook) {
        return self2.config[hook] !== void 0;
      }).forEach(function(hook) {
        self2.config[hook] = arrayify(self2.config[hook] || []).map(bindToInstance);
      });
      self2.isMobile = !self2.config.disableMobile && !self2.config.inline && self2.config.mode === "single" && !self2.config.disable.length && !self2.config.enable && !self2.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      for (var i2 = 0; i2 < self2.config.plugins.length; i2++) {
        var pluginConf = self2.config.plugins[i2](self2) || {};
        for (var key in pluginConf) {
          if (HOOKS.indexOf(key) > -1) {
            self2.config[key] = arrayify(pluginConf[key]).map(bindToInstance).concat(self2.config[key]);
          } else if (typeof userConfig[key] === "undefined")
            self2.config[key] = pluginConf[key];
        }
      }
      if (!userConfig.altInputClass) {
        self2.config.altInputClass = getInputElem().className + " " + self2.config.altInputClass;
      }
      triggerEvent("onParseConfig");
    }
    function getInputElem() {
      return self2.config.wrap ? element.querySelector("[data-input]") : element;
    }
    function setupLocale() {
      if (typeof self2.config.locale !== "object" && typeof flatpickr.l10ns[self2.config.locale] === "undefined")
        self2.config.errorHandler(new Error("flatpickr: invalid locale " + self2.config.locale));
      self2.l10n = __assign(__assign({}, flatpickr.l10ns.default), typeof self2.config.locale === "object" ? self2.config.locale : self2.config.locale !== "default" ? flatpickr.l10ns[self2.config.locale] : void 0);
      tokenRegex.D = "(" + self2.l10n.weekdays.shorthand.join("|") + ")";
      tokenRegex.l = "(" + self2.l10n.weekdays.longhand.join("|") + ")";
      tokenRegex.M = "(" + self2.l10n.months.shorthand.join("|") + ")";
      tokenRegex.F = "(" + self2.l10n.months.longhand.join("|") + ")";
      tokenRegex.K = "(" + self2.l10n.amPM[0] + "|" + self2.l10n.amPM[1] + "|" + self2.l10n.amPM[0].toLowerCase() + "|" + self2.l10n.amPM[1].toLowerCase() + ")";
      var userConfig = __assign(__assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
      if (userConfig.time_24hr === void 0 && flatpickr.defaultConfig.time_24hr === void 0) {
        self2.config.time_24hr = self2.l10n.time_24hr;
      }
      self2.formatDate = createDateFormatter(self2);
      self2.parseDate = createDateParser({ config: self2.config, l10n: self2.l10n });
    }
    function positionCalendar(customPositionElement) {
      if (typeof self2.config.position === "function") {
        return void self2.config.position(self2, customPositionElement);
      }
      if (self2.calendarContainer === void 0)
        return;
      triggerEvent("onPreCalendarPosition");
      var positionElement = customPositionElement || self2._positionElement;
      var calendarHeight = Array.prototype.reduce.call(self2.calendarContainer.children, function(acc, child) {
        return acc + child.offsetHeight;
      }, 0), calendarWidth = self2.calendarContainer.offsetWidth, configPos = self2.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" || configPosVertical !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;
      var top = window.pageYOffset + inputBounds.top + (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
      toggleClass(self2.calendarContainer, "arrowTop", !showOnTop);
      toggleClass(self2.calendarContainer, "arrowBottom", showOnTop);
      if (self2.config.inline)
        return;
      var left = window.pageXOffset + inputBounds.left;
      var isCenter = false;
      var isRight = false;
      if (configPosHorizontal === "center") {
        left -= (calendarWidth - inputBounds.width) / 2;
        isCenter = true;
      } else if (configPosHorizontal === "right") {
        left -= calendarWidth - inputBounds.width;
        isRight = true;
      }
      toggleClass(self2.calendarContainer, "arrowLeft", !isCenter && !isRight);
      toggleClass(self2.calendarContainer, "arrowCenter", isCenter);
      toggleClass(self2.calendarContainer, "arrowRight", isRight);
      var right = window.document.body.offsetWidth - (window.pageXOffset + inputBounds.right);
      var rightMost = left + calendarWidth > window.document.body.offsetWidth;
      var centerMost = right + calendarWidth > window.document.body.offsetWidth;
      toggleClass(self2.calendarContainer, "rightMost", rightMost);
      if (self2.config.static)
        return;
      self2.calendarContainer.style.top = top + "px";
      if (!rightMost) {
        self2.calendarContainer.style.left = left + "px";
        self2.calendarContainer.style.right = "auto";
      } else if (!centerMost) {
        self2.calendarContainer.style.left = "auto";
        self2.calendarContainer.style.right = right + "px";
      } else {
        var doc = getDocumentStyleSheet();
        if (doc === void 0)
          return;
        var bodyWidth = window.document.body.offsetWidth;
        var centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
        var centerBefore = ".flatpickr-calendar.centerMost:before";
        var centerAfter = ".flatpickr-calendar.centerMost:after";
        var centerIndex = doc.cssRules.length;
        var centerStyle = "{left:" + inputBounds.left + "px;right:auto;}";
        toggleClass(self2.calendarContainer, "rightMost", false);
        toggleClass(self2.calendarContainer, "centerMost", true);
        doc.insertRule(centerBefore + "," + centerAfter + centerStyle, centerIndex);
        self2.calendarContainer.style.left = centerLeft + "px";
        self2.calendarContainer.style.right = "auto";
      }
    }
    function getDocumentStyleSheet() {
      var editableSheet = null;
      for (var i2 = 0; i2 < document.styleSheets.length; i2++) {
        var sheet = document.styleSheets[i2];
        if (!sheet.cssRules)
          continue;
        try {
          sheet.cssRules;
        } catch (err) {
          continue;
        }
        editableSheet = sheet;
        break;
      }
      return editableSheet != null ? editableSheet : createStyleSheet();
    }
    function createStyleSheet() {
      var style = document.createElement("style");
      document.head.appendChild(style);
      return style.sheet;
    }
    function redraw() {
      if (self2.config.noCalendar || self2.isMobile)
        return;
      buildMonthSwitch();
      updateNavigationCurrentMonth();
      buildDays();
    }
    function focusAndClose() {
      self2._input.focus();
      if (window.navigator.userAgent.indexOf("MSIE") !== -1 || navigator.msMaxTouchPoints !== void 0) {
        setTimeout(self2.close, 0);
      } else {
        self2.close();
      }
    }
    function selectDate(e5) {
      e5.preventDefault();
      e5.stopPropagation();
      var isSelectable = function(day) {
        return day.classList && day.classList.contains("flatpickr-day") && !day.classList.contains("flatpickr-disabled") && !day.classList.contains("notAllowed");
      };
      var t2 = findParent(getEventTarget(e5), isSelectable);
      if (t2 === void 0)
        return;
      var target = t2;
      var selectedDate = self2.latestSelectedDateObj = new Date(target.dateObj.getTime());
      var shouldChangeMonth = (selectedDate.getMonth() < self2.currentMonth || selectedDate.getMonth() > self2.currentMonth + self2.config.showMonths - 1) && self2.config.mode !== "range";
      self2.selectedDateElem = target;
      if (self2.config.mode === "single")
        self2.selectedDates = [selectedDate];
      else if (self2.config.mode === "multiple") {
        var selectedIndex = isDateSelected(selectedDate);
        if (selectedIndex)
          self2.selectedDates.splice(parseInt(selectedIndex), 1);
        else
          self2.selectedDates.push(selectedDate);
      } else if (self2.config.mode === "range") {
        if (self2.selectedDates.length === 2) {
          self2.clear(false, false);
        }
        self2.latestSelectedDateObj = selectedDate;
        self2.selectedDates.push(selectedDate);
        if (compareDates(selectedDate, self2.selectedDates[0], true) !== 0)
          self2.selectedDates.sort(function(a2, b2) {
            return a2.getTime() - b2.getTime();
          });
      }
      setHoursFromInputs();
      if (shouldChangeMonth) {
        var isNewYear = self2.currentYear !== selectedDate.getFullYear();
        self2.currentYear = selectedDate.getFullYear();
        self2.currentMonth = selectedDate.getMonth();
        if (isNewYear) {
          triggerEvent("onYearChange");
          buildMonthSwitch();
        }
        triggerEvent("onMonthChange");
      }
      updateNavigationCurrentMonth();
      buildDays();
      updateValue();
      if (!shouldChangeMonth && self2.config.mode !== "range" && self2.config.showMonths === 1)
        focusOnDayElem(target);
      else if (self2.selectedDateElem !== void 0 && self2.hourElement === void 0) {
        self2.selectedDateElem && self2.selectedDateElem.focus();
      }
      if (self2.hourElement !== void 0)
        self2.hourElement !== void 0 && self2.hourElement.focus();
      if (self2.config.closeOnSelect) {
        var single = self2.config.mode === "single" && !self2.config.enableTime;
        var range = self2.config.mode === "range" && self2.selectedDates.length === 2 && !self2.config.enableTime;
        if (single || range) {
          focusAndClose();
        }
      }
      triggerChange();
    }
    var CALLBACKS = {
      locale: [setupLocale, updateWeekdays],
      showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
      minDate: [jumpToDate],
      maxDate: [jumpToDate],
      positionElement: [updatePositionElement],
      clickOpens: [
        function() {
          if (self2.config.clickOpens === true) {
            bind(self2._input, "focus", self2.open);
            bind(self2._input, "click", self2.open);
          } else {
            self2._input.removeEventListener("focus", self2.open);
            self2._input.removeEventListener("click", self2.open);
          }
        }
      ]
    };
    function set(option, value) {
      if (option !== null && typeof option === "object") {
        Object.assign(self2.config, option);
        for (var key in option) {
          if (CALLBACKS[key] !== void 0)
            CALLBACKS[key].forEach(function(x2) {
              return x2();
            });
        }
      } else {
        self2.config[option] = value;
        if (CALLBACKS[option] !== void 0)
          CALLBACKS[option].forEach(function(x2) {
            return x2();
          });
        else if (HOOKS.indexOf(option) > -1)
          self2.config[option] = arrayify(value);
      }
      self2.redraw();
      updateValue(true);
    }
    function setSelectedDate(inputDate, format) {
      var dates = [];
      if (inputDate instanceof Array)
        dates = inputDate.map(function(d2) {
          return self2.parseDate(d2, format);
        });
      else if (inputDate instanceof Date || typeof inputDate === "number")
        dates = [self2.parseDate(inputDate, format)];
      else if (typeof inputDate === "string") {
        switch (self2.config.mode) {
          case "single":
          case "time":
            dates = [self2.parseDate(inputDate, format)];
            break;
          case "multiple":
            dates = inputDate.split(self2.config.conjunction).map(function(date) {
              return self2.parseDate(date, format);
            });
            break;
          case "range":
            dates = inputDate.split(self2.l10n.rangeSeparator).map(function(date) {
              return self2.parseDate(date, format);
            });
            break;
          default:
            break;
        }
      } else
        self2.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
      self2.selectedDates = self2.config.allowInvalidPreload ? dates : dates.filter(function(d2) {
        return d2 instanceof Date && isEnabled(d2, false);
      });
      if (self2.config.mode === "range")
        self2.selectedDates.sort(function(a2, b2) {
          return a2.getTime() - b2.getTime();
        });
    }
    function setDate(date, triggerChange2, format) {
      if (triggerChange2 === void 0) {
        triggerChange2 = false;
      }
      if (format === void 0) {
        format = self2.config.dateFormat;
      }
      if (date !== 0 && !date || date instanceof Array && date.length === 0)
        return self2.clear(triggerChange2);
      setSelectedDate(date, format);
      self2.latestSelectedDateObj = self2.selectedDates[self2.selectedDates.length - 1];
      self2.redraw();
      jumpToDate(void 0, triggerChange2);
      setHoursFromDate();
      if (self2.selectedDates.length === 0) {
        self2.clear(false);
      }
      updateValue(triggerChange2);
      if (triggerChange2)
        triggerEvent("onChange");
    }
    function parseDateRules(arr) {
      return arr.slice().map(function(rule) {
        if (typeof rule === "string" || typeof rule === "number" || rule instanceof Date) {
          return self2.parseDate(rule, void 0, true);
        } else if (rule && typeof rule === "object" && rule.from && rule.to)
          return {
            from: self2.parseDate(rule.from, void 0),
            to: self2.parseDate(rule.to, void 0)
          };
        return rule;
      }).filter(function(x2) {
        return x2;
      });
    }
    function setupDates() {
      self2.selectedDates = [];
      self2.now = self2.parseDate(self2.config.now) || new Date();
      var preloadedDate = self2.config.defaultDate || ((self2.input.nodeName === "INPUT" || self2.input.nodeName === "TEXTAREA") && self2.input.placeholder && self2.input.value === self2.input.placeholder ? null : self2.input.value);
      if (preloadedDate)
        setSelectedDate(preloadedDate, self2.config.dateFormat);
      self2._initialDate = self2.selectedDates.length > 0 ? self2.selectedDates[0] : self2.config.minDate && self2.config.minDate.getTime() > self2.now.getTime() ? self2.config.minDate : self2.config.maxDate && self2.config.maxDate.getTime() < self2.now.getTime() ? self2.config.maxDate : self2.now;
      self2.currentYear = self2._initialDate.getFullYear();
      self2.currentMonth = self2._initialDate.getMonth();
      if (self2.selectedDates.length > 0)
        self2.latestSelectedDateObj = self2.selectedDates[0];
      if (self2.config.minTime !== void 0)
        self2.config.minTime = self2.parseDate(self2.config.minTime, "H:i");
      if (self2.config.maxTime !== void 0)
        self2.config.maxTime = self2.parseDate(self2.config.maxTime, "H:i");
      self2.minDateHasTime = !!self2.config.minDate && (self2.config.minDate.getHours() > 0 || self2.config.minDate.getMinutes() > 0 || self2.config.minDate.getSeconds() > 0);
      self2.maxDateHasTime = !!self2.config.maxDate && (self2.config.maxDate.getHours() > 0 || self2.config.maxDate.getMinutes() > 0 || self2.config.maxDate.getSeconds() > 0);
    }
    function setupInputs() {
      self2.input = getInputElem();
      if (!self2.input) {
        self2.config.errorHandler(new Error("Invalid input element specified"));
        return;
      }
      self2.input._type = self2.input.type;
      self2.input.type = "text";
      self2.input.classList.add("flatpickr-input");
      self2._input = self2.input;
      if (self2.config.altInput) {
        self2.altInput = createElement(self2.input.nodeName, self2.config.altInputClass);
        self2._input = self2.altInput;
        self2.altInput.placeholder = self2.input.placeholder;
        self2.altInput.disabled = self2.input.disabled;
        self2.altInput.required = self2.input.required;
        self2.altInput.tabIndex = self2.input.tabIndex;
        self2.altInput.type = "text";
        self2.input.setAttribute("type", "hidden");
        if (!self2.config.static && self2.input.parentNode)
          self2.input.parentNode.insertBefore(self2.altInput, self2.input.nextSibling);
      }
      if (!self2.config.allowInput)
        self2._input.setAttribute("readonly", "readonly");
      updatePositionElement();
    }
    function updatePositionElement() {
      self2._positionElement = self2.config.positionElement || self2._input;
    }
    function setupMobile() {
      var inputType = self2.config.enableTime ? self2.config.noCalendar ? "time" : "datetime-local" : "date";
      self2.mobileInput = createElement("input", self2.input.className + " flatpickr-mobile");
      self2.mobileInput.tabIndex = 1;
      self2.mobileInput.type = inputType;
      self2.mobileInput.disabled = self2.input.disabled;
      self2.mobileInput.required = self2.input.required;
      self2.mobileInput.placeholder = self2.input.placeholder;
      self2.mobileFormatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" : inputType === "date" ? "Y-m-d" : "H:i:S";
      if (self2.selectedDates.length > 0) {
        self2.mobileInput.defaultValue = self2.mobileInput.value = self2.formatDate(self2.selectedDates[0], self2.mobileFormatStr);
      }
      if (self2.config.minDate)
        self2.mobileInput.min = self2.formatDate(self2.config.minDate, "Y-m-d");
      if (self2.config.maxDate)
        self2.mobileInput.max = self2.formatDate(self2.config.maxDate, "Y-m-d");
      if (self2.input.getAttribute("step"))
        self2.mobileInput.step = String(self2.input.getAttribute("step"));
      self2.input.type = "hidden";
      if (self2.altInput !== void 0)
        self2.altInput.type = "hidden";
      try {
        if (self2.input.parentNode)
          self2.input.parentNode.insertBefore(self2.mobileInput, self2.input.nextSibling);
      } catch (_a) {
      }
      bind(self2.mobileInput, "change", function(e5) {
        self2.setDate(getEventTarget(e5).value, false, self2.mobileFormatStr);
        triggerEvent("onChange");
        triggerEvent("onClose");
      });
    }
    function toggle(e5) {
      if (self2.isOpen === true)
        return self2.close();
      self2.open(e5);
    }
    function triggerEvent(event, data) {
      if (self2.config === void 0)
        return;
      var hooks = self2.config[event];
      if (hooks !== void 0 && hooks.length > 0) {
        for (var i2 = 0; hooks[i2] && i2 < hooks.length; i2++)
          hooks[i2](self2.selectedDates, self2.input.value, self2, data);
      }
      if (event === "onChange") {
        self2.input.dispatchEvent(createEvent("change"));
        self2.input.dispatchEvent(createEvent("input"));
      }
    }
    function createEvent(name) {
      var e5 = document.createEvent("Event");
      e5.initEvent(name, true, true);
      return e5;
    }
    function isDateSelected(date) {
      for (var i2 = 0; i2 < self2.selectedDates.length; i2++) {
        var selectedDate = self2.selectedDates[i2];
        if (selectedDate instanceof Date && compareDates(selectedDate, date) === 0)
          return "" + i2;
      }
      return false;
    }
    function isDateInRange(date) {
      if (self2.config.mode !== "range" || self2.selectedDates.length < 2)
        return false;
      return compareDates(date, self2.selectedDates[0]) >= 0 && compareDates(date, self2.selectedDates[1]) <= 0;
    }
    function updateNavigationCurrentMonth() {
      if (self2.config.noCalendar || self2.isMobile || !self2.monthNav)
        return;
      self2.yearElements.forEach(function(yearElement, i2) {
        var d2 = new Date(self2.currentYear, self2.currentMonth, 1);
        d2.setMonth(self2.currentMonth + i2);
        if (self2.config.showMonths > 1 || self2.config.monthSelectorType === "static") {
          self2.monthElements[i2].textContent = monthToStr(d2.getMonth(), self2.config.shorthandCurrentMonth, self2.l10n) + " ";
        } else {
          self2.monthsDropdownContainer.value = d2.getMonth().toString();
        }
        yearElement.value = d2.getFullYear().toString();
      });
      self2._hidePrevMonthArrow = self2.config.minDate !== void 0 && (self2.currentYear === self2.config.minDate.getFullYear() ? self2.currentMonth <= self2.config.minDate.getMonth() : self2.currentYear < self2.config.minDate.getFullYear());
      self2._hideNextMonthArrow = self2.config.maxDate !== void 0 && (self2.currentYear === self2.config.maxDate.getFullYear() ? self2.currentMonth + 1 > self2.config.maxDate.getMonth() : self2.currentYear > self2.config.maxDate.getFullYear());
    }
    function getDateStr(specificFormat) {
      var format = specificFormat || (self2.config.altInput ? self2.config.altFormat : self2.config.dateFormat);
      return self2.selectedDates.map(function(dObj) {
        return self2.formatDate(dObj, format);
      }).filter(function(d2, i2, arr) {
        return self2.config.mode !== "range" || self2.config.enableTime || arr.indexOf(d2) === i2;
      }).join(self2.config.mode !== "range" ? self2.config.conjunction : self2.l10n.rangeSeparator);
    }
    function updateValue(triggerChange2) {
      if (triggerChange2 === void 0) {
        triggerChange2 = true;
      }
      if (self2.mobileInput !== void 0 && self2.mobileFormatStr) {
        self2.mobileInput.value = self2.latestSelectedDateObj !== void 0 ? self2.formatDate(self2.latestSelectedDateObj, self2.mobileFormatStr) : "";
      }
      self2.input.value = getDateStr(self2.config.dateFormat);
      if (self2.altInput !== void 0) {
        self2.altInput.value = getDateStr(self2.config.altFormat);
      }
      if (triggerChange2 !== false)
        triggerEvent("onValueUpdate");
    }
    function onMonthNavClick(e5) {
      var eventTarget = getEventTarget(e5);
      var isPrevMonth = self2.prevMonthNav.contains(eventTarget);
      var isNextMonth = self2.nextMonthNav.contains(eventTarget);
      if (isPrevMonth || isNextMonth) {
        changeMonth(isPrevMonth ? -1 : 1);
      } else if (self2.yearElements.indexOf(eventTarget) >= 0) {
        eventTarget.select();
      } else if (eventTarget.classList.contains("arrowUp")) {
        self2.changeYear(self2.currentYear + 1);
      } else if (eventTarget.classList.contains("arrowDown")) {
        self2.changeYear(self2.currentYear - 1);
      }
    }
    function timeWrapper(e5) {
      e5.preventDefault();
      var isKeyDown = e5.type === "keydown", eventTarget = getEventTarget(e5), input = eventTarget;
      if (self2.amPM !== void 0 && eventTarget === self2.amPM) {
        self2.amPM.textContent = self2.l10n.amPM[int(self2.amPM.textContent === self2.l10n.amPM[0])];
      }
      var min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e5.delta || (isKeyDown ? e5.which === 38 ? 1 : -1 : 0);
      var newValue = curValue + step * delta;
      if (typeof input.value !== "undefined" && input.value.length === 2) {
        var isHourElem = input === self2.hourElement, isMinuteElem = input === self2.minuteElement;
        if (newValue < min) {
          newValue = max + newValue + int(!isHourElem) + (int(isHourElem) && int(!self2.amPM));
          if (isMinuteElem)
            incrementNumInput(void 0, -1, self2.hourElement);
        } else if (newValue > max) {
          newValue = input === self2.hourElement ? newValue - max - int(!self2.amPM) : min;
          if (isMinuteElem)
            incrementNumInput(void 0, 1, self2.hourElement);
        }
        if (self2.amPM && isHourElem && (step === 1 ? newValue + curValue === 23 : Math.abs(newValue - curValue) > step)) {
          self2.amPM.textContent = self2.l10n.amPM[int(self2.amPM.textContent === self2.l10n.amPM[0])];
        }
        input.value = pad(newValue);
      }
    }
    init2();
    return self2;
  }
  function _flatpickr(nodeList, config) {
    var nodes = Array.prototype.slice.call(nodeList).filter(function(x2) {
      return x2 instanceof HTMLElement;
    });
    var instances = [];
    for (var i2 = 0; i2 < nodes.length; i2++) {
      var node = nodes[i2];
      try {
        if (node.getAttribute("data-fp-omit") !== null)
          continue;
        if (node._flatpickr !== void 0) {
          node._flatpickr.destroy();
          node._flatpickr = void 0;
        }
        node._flatpickr = FlatpickrInstance(node, config || {});
        instances.push(node._flatpickr);
      } catch (e5) {
        console.error(e5);
      }
    }
    return instances.length === 1 ? instances[0] : instances;
  }
  if (typeof HTMLElement !== "undefined" && typeof HTMLCollection !== "undefined" && typeof NodeList !== "undefined") {
    HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function(config) {
      return _flatpickr(this, config);
    };
    HTMLElement.prototype.flatpickr = function(config) {
      return _flatpickr([this], config);
    };
  }
  var flatpickr = function(selector, config) {
    if (typeof selector === "string") {
      return _flatpickr(window.document.querySelectorAll(selector), config);
    } else if (selector instanceof Node) {
      return _flatpickr([selector], config);
    } else {
      return _flatpickr(selector, config);
    }
  };
  flatpickr.defaultConfig = {};
  flatpickr.l10ns = {
    en: __assign({}, default_default),
    default: __assign({}, default_default)
  };
  flatpickr.localize = function(l10n) {
    flatpickr.l10ns.default = __assign(__assign({}, flatpickr.l10ns.default), l10n);
  };
  flatpickr.setDefaults = function(config) {
    flatpickr.defaultConfig = __assign(__assign({}, flatpickr.defaultConfig), config);
  };
  flatpickr.parseDate = createDateParser({});
  flatpickr.formatDate = createDateFormatter({});
  flatpickr.compareDates = compareDates;
  if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
    jQuery.fn.flatpickr = function(config) {
      return _flatpickr(this, config);
    };
  }
  Date.prototype.fp_incr = function(days) {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
  };
  if (typeof window !== "undefined") {
    window.flatpickr = flatpickr;
  }
  var esm_default = flatpickr;

  // node_modules/luxon/src/errors.js
  var LuxonError = class extends Error {
  };
  var InvalidDateTimeError = class extends LuxonError {
    constructor(reason) {
      super(`Invalid DateTime: ${reason.toMessage()}`);
    }
  };
  var InvalidIntervalError = class extends LuxonError {
    constructor(reason) {
      super(`Invalid Interval: ${reason.toMessage()}`);
    }
  };
  var InvalidDurationError = class extends LuxonError {
    constructor(reason) {
      super(`Invalid Duration: ${reason.toMessage()}`);
    }
  };
  var ConflictingSpecificationError = class extends LuxonError {
  };
  var InvalidUnitError = class extends LuxonError {
    constructor(unit) {
      super(`Invalid unit ${unit}`);
    }
  };
  var InvalidArgumentError = class extends LuxonError {
  };
  var ZoneIsAbstractError = class extends LuxonError {
    constructor() {
      super("Zone is an abstract class");
    }
  };

  // node_modules/luxon/src/impl/formats.js
  var n = "numeric";
  var s = "short";
  var l = "long";
  var DATE_SHORT = {
    year: n,
    month: n,
    day: n
  };
  var DATE_MED = {
    year: n,
    month: s,
    day: n
  };
  var DATE_MED_WITH_WEEKDAY = {
    year: n,
    month: s,
    day: n,
    weekday: s
  };
  var DATE_FULL = {
    year: n,
    month: l,
    day: n
  };
  var DATE_HUGE = {
    year: n,
    month: l,
    day: n,
    weekday: l
  };
  var TIME_SIMPLE = {
    hour: n,
    minute: n
  };
  var TIME_WITH_SECONDS = {
    hour: n,
    minute: n,
    second: n
  };
  var TIME_WITH_SHORT_OFFSET = {
    hour: n,
    minute: n,
    second: n,
    timeZoneName: s
  };
  var TIME_WITH_LONG_OFFSET = {
    hour: n,
    minute: n,
    second: n,
    timeZoneName: l
  };
  var TIME_24_SIMPLE = {
    hour: n,
    minute: n,
    hourCycle: "h23"
  };
  var TIME_24_WITH_SECONDS = {
    hour: n,
    minute: n,
    second: n,
    hourCycle: "h23"
  };
  var TIME_24_WITH_SHORT_OFFSET = {
    hour: n,
    minute: n,
    second: n,
    hourCycle: "h23",
    timeZoneName: s
  };
  var TIME_24_WITH_LONG_OFFSET = {
    hour: n,
    minute: n,
    second: n,
    hourCycle: "h23",
    timeZoneName: l
  };
  var DATETIME_SHORT = {
    year: n,
    month: n,
    day: n,
    hour: n,
    minute: n
  };
  var DATETIME_SHORT_WITH_SECONDS = {
    year: n,
    month: n,
    day: n,
    hour: n,
    minute: n,
    second: n
  };
  var DATETIME_MED = {
    year: n,
    month: s,
    day: n,
    hour: n,
    minute: n
  };
  var DATETIME_MED_WITH_SECONDS = {
    year: n,
    month: s,
    day: n,
    hour: n,
    minute: n,
    second: n
  };
  var DATETIME_MED_WITH_WEEKDAY = {
    year: n,
    month: s,
    day: n,
    weekday: s,
    hour: n,
    minute: n
  };
  var DATETIME_FULL = {
    year: n,
    month: l,
    day: n,
    hour: n,
    minute: n,
    timeZoneName: s
  };
  var DATETIME_FULL_WITH_SECONDS = {
    year: n,
    month: l,
    day: n,
    hour: n,
    minute: n,
    second: n,
    timeZoneName: s
  };
  var DATETIME_HUGE = {
    year: n,
    month: l,
    day: n,
    weekday: l,
    hour: n,
    minute: n,
    timeZoneName: l
  };
  var DATETIME_HUGE_WITH_SECONDS = {
    year: n,
    month: l,
    day: n,
    weekday: l,
    hour: n,
    minute: n,
    second: n,
    timeZoneName: l
  };

  // node_modules/luxon/src/zone.js
  var Zone = class {
    get type() {
      throw new ZoneIsAbstractError();
    }
    get name() {
      throw new ZoneIsAbstractError();
    }
    get ianaName() {
      return this.name;
    }
    get isUniversal() {
      throw new ZoneIsAbstractError();
    }
    offsetName(ts2, opts) {
      throw new ZoneIsAbstractError();
    }
    formatOffset(ts2, format) {
      throw new ZoneIsAbstractError();
    }
    offset(ts2) {
      throw new ZoneIsAbstractError();
    }
    equals(otherZone) {
      throw new ZoneIsAbstractError();
    }
    get isValid() {
      throw new ZoneIsAbstractError();
    }
  };

  // node_modules/luxon/src/zones/systemZone.js
  var singleton = null;
  var SystemZone = class extends Zone {
    static get instance() {
      if (singleton === null) {
        singleton = new SystemZone();
      }
      return singleton;
    }
    get type() {
      return "system";
    }
    get name() {
      return new Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    get isUniversal() {
      return false;
    }
    offsetName(ts2, { format, locale }) {
      return parseZoneInfo(ts2, format, locale);
    }
    formatOffset(ts2, format) {
      return formatOffset(this.offset(ts2), format);
    }
    offset(ts2) {
      return -new Date(ts2).getTimezoneOffset();
    }
    equals(otherZone) {
      return otherZone.type === "system";
    }
    get isValid() {
      return true;
    }
  };

  // node_modules/luxon/src/zones/IANAZone.js
  var dtfCache = {};
  function makeDTF(zone) {
    if (!dtfCache[zone]) {
      dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
        hour12: false,
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        era: "short"
      });
    }
    return dtfCache[zone];
  }
  var typeToPos = {
    year: 0,
    month: 1,
    day: 2,
    era: 3,
    hour: 4,
    minute: 5,
    second: 6
  };
  function hackyOffset(dtf, date) {
    const formatted = dtf.format(date).replace(/\u200E/g, ""), parsed = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(formatted), [, fMonth, fDay, fYear, fadOrBc, fHour, fMinute, fSecond] = parsed;
    return [fYear, fMonth, fDay, fadOrBc, fHour, fMinute, fSecond];
  }
  function partsOffset(dtf, date) {
    const formatted = dtf.formatToParts(date);
    const filled = [];
    for (let i2 = 0; i2 < formatted.length; i2++) {
      const { type, value } = formatted[i2];
      const pos = typeToPos[type];
      if (type === "era") {
        filled[pos] = value;
      } else if (!isUndefined(pos)) {
        filled[pos] = parseInt(value, 10);
      }
    }
    return filled;
  }
  var ianaZoneCache = {};
  var IANAZone = class extends Zone {
    static create(name) {
      if (!ianaZoneCache[name]) {
        ianaZoneCache[name] = new IANAZone(name);
      }
      return ianaZoneCache[name];
    }
    static resetCache() {
      ianaZoneCache = {};
      dtfCache = {};
    }
    static isValidSpecifier(s3) {
      return this.isValidZone(s3);
    }
    static isValidZone(zone) {
      if (!zone) {
        return false;
      }
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: zone }).format();
        return true;
      } catch (e5) {
        return false;
      }
    }
    constructor(name) {
      super();
      this.zoneName = name;
      this.valid = IANAZone.isValidZone(name);
    }
    get type() {
      return "iana";
    }
    get name() {
      return this.zoneName;
    }
    get isUniversal() {
      return false;
    }
    offsetName(ts2, { format, locale }) {
      return parseZoneInfo(ts2, format, locale, this.name);
    }
    formatOffset(ts2, format) {
      return formatOffset(this.offset(ts2), format);
    }
    offset(ts2) {
      const date = new Date(ts2);
      if (isNaN(date))
        return NaN;
      const dtf = makeDTF(this.name);
      let [year, month, day, adOrBc, hour, minute, second] = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date);
      if (adOrBc === "BC") {
        year = -Math.abs(year) + 1;
      }
      const adjustedHour = hour === 24 ? 0 : hour;
      const asUTC = objToLocalTS({
        year,
        month,
        day,
        hour: adjustedHour,
        minute,
        second,
        millisecond: 0
      });
      let asTS = +date;
      const over = asTS % 1e3;
      asTS -= over >= 0 ? over : 1e3 + over;
      return (asUTC - asTS) / (60 * 1e3);
    }
    equals(otherZone) {
      return otherZone.type === "iana" && otherZone.name === this.name;
    }
    get isValid() {
      return this.valid;
    }
  };

  // node_modules/luxon/src/impl/locale.js
  var intlLFCache = {};
  function getCachedLF(locString, opts = {}) {
    const key = JSON.stringify([locString, opts]);
    let dtf = intlLFCache[key];
    if (!dtf) {
      dtf = new Intl.ListFormat(locString, opts);
      intlLFCache[key] = dtf;
    }
    return dtf;
  }
  var intlDTCache = {};
  function getCachedDTF(locString, opts = {}) {
    const key = JSON.stringify([locString, opts]);
    let dtf = intlDTCache[key];
    if (!dtf) {
      dtf = new Intl.DateTimeFormat(locString, opts);
      intlDTCache[key] = dtf;
    }
    return dtf;
  }
  var intlNumCache = {};
  function getCachedINF(locString, opts = {}) {
    const key = JSON.stringify([locString, opts]);
    let inf = intlNumCache[key];
    if (!inf) {
      inf = new Intl.NumberFormat(locString, opts);
      intlNumCache[key] = inf;
    }
    return inf;
  }
  var intlRelCache = {};
  function getCachedRTF(locString, opts = {}) {
    const { base, ...cacheKeyOpts } = opts;
    const key = JSON.stringify([locString, cacheKeyOpts]);
    let inf = intlRelCache[key];
    if (!inf) {
      inf = new Intl.RelativeTimeFormat(locString, opts);
      intlRelCache[key] = inf;
    }
    return inf;
  }
  var sysLocaleCache = null;
  function systemLocale() {
    if (sysLocaleCache) {
      return sysLocaleCache;
    } else {
      sysLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
      return sysLocaleCache;
    }
  }
  var weekInfoCache = {};
  function getCachedWeekInfo(locString) {
    let data = weekInfoCache[locString];
    if (!data) {
      const locale = new Intl.Locale(locString);
      data = "getWeekInfo" in locale ? locale.getWeekInfo() : locale.weekInfo;
      weekInfoCache[locString] = data;
    }
    return data;
  }
  function parseLocaleString(localeStr) {
    const xIndex = localeStr.indexOf("-x-");
    if (xIndex !== -1) {
      localeStr = localeStr.substring(0, xIndex);
    }
    const uIndex = localeStr.indexOf("-u-");
    if (uIndex === -1) {
      return [localeStr];
    } else {
      let options;
      let selectedStr;
      try {
        options = getCachedDTF(localeStr).resolvedOptions();
        selectedStr = localeStr;
      } catch (e5) {
        const smaller = localeStr.substring(0, uIndex);
        options = getCachedDTF(smaller).resolvedOptions();
        selectedStr = smaller;
      }
      const { numberingSystem, calendar } = options;
      return [selectedStr, numberingSystem, calendar];
    }
  }
  function intlConfigString(localeStr, numberingSystem, outputCalendar) {
    if (outputCalendar || numberingSystem) {
      if (!localeStr.includes("-u-")) {
        localeStr += "-u";
      }
      if (outputCalendar) {
        localeStr += `-ca-${outputCalendar}`;
      }
      if (numberingSystem) {
        localeStr += `-nu-${numberingSystem}`;
      }
      return localeStr;
    } else {
      return localeStr;
    }
  }
  function mapMonths(f2) {
    const ms = [];
    for (let i2 = 1; i2 <= 12; i2++) {
      const dt2 = DateTime.utc(2009, i2, 1);
      ms.push(f2(dt2));
    }
    return ms;
  }
  function mapWeekdays(f2) {
    const ms = [];
    for (let i2 = 1; i2 <= 7; i2++) {
      const dt2 = DateTime.utc(2016, 11, 13 + i2);
      ms.push(f2(dt2));
    }
    return ms;
  }
  function listStuff(loc, length, englishFn, intlFn) {
    const mode = loc.listingMode();
    if (mode === "error") {
      return null;
    } else if (mode === "en") {
      return englishFn(length);
    } else {
      return intlFn(length);
    }
  }
  function supportsFastNumbers(loc) {
    if (loc.numberingSystem && loc.numberingSystem !== "latn") {
      return false;
    } else {
      return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
    }
  }
  var PolyNumberFormatter = class {
    constructor(intl, forceSimple, opts) {
      this.padTo = opts.padTo || 0;
      this.floor = opts.floor || false;
      const { padTo, floor, ...otherOpts } = opts;
      if (!forceSimple || Object.keys(otherOpts).length > 0) {
        const intlOpts = { useGrouping: false, ...opts };
        if (opts.padTo > 0)
          intlOpts.minimumIntegerDigits = opts.padTo;
        this.inf = getCachedINF(intl, intlOpts);
      }
    }
    format(i2) {
      if (this.inf) {
        const fixed = this.floor ? Math.floor(i2) : i2;
        return this.inf.format(fixed);
      } else {
        const fixed = this.floor ? Math.floor(i2) : roundTo(i2, 3);
        return padStart(fixed, this.padTo);
      }
    }
  };
  var PolyDateFormatter = class {
    constructor(dt2, intl, opts) {
      this.opts = opts;
      this.originalZone = void 0;
      let z2 = void 0;
      if (this.opts.timeZone) {
        this.dt = dt2;
      } else if (dt2.zone.type === "fixed") {
        const gmtOffset = -1 * (dt2.offset / 60);
        const offsetZ = gmtOffset >= 0 ? `Etc/GMT+${gmtOffset}` : `Etc/GMT${gmtOffset}`;
        if (dt2.offset !== 0 && IANAZone.create(offsetZ).valid) {
          z2 = offsetZ;
          this.dt = dt2;
        } else {
          z2 = "UTC";
          this.dt = dt2.offset === 0 ? dt2 : dt2.setZone("UTC").plus({ minutes: dt2.offset });
          this.originalZone = dt2.zone;
        }
      } else if (dt2.zone.type === "system") {
        this.dt = dt2;
      } else if (dt2.zone.type === "iana") {
        this.dt = dt2;
        z2 = dt2.zone.name;
      } else {
        z2 = "UTC";
        this.dt = dt2.setZone("UTC").plus({ minutes: dt2.offset });
        this.originalZone = dt2.zone;
      }
      const intlOpts = { ...this.opts };
      intlOpts.timeZone = intlOpts.timeZone || z2;
      this.dtf = getCachedDTF(intl, intlOpts);
    }
    format() {
      if (this.originalZone) {
        return this.formatToParts().map(({ value }) => value).join("");
      }
      return this.dtf.format(this.dt.toJSDate());
    }
    formatToParts() {
      const parts = this.dtf.formatToParts(this.dt.toJSDate());
      if (this.originalZone) {
        return parts.map((part) => {
          if (part.type === "timeZoneName") {
            const offsetName = this.originalZone.offsetName(this.dt.ts, {
              locale: this.dt.locale,
              format: this.opts.timeZoneName
            });
            return {
              ...part,
              value: offsetName
            };
          } else {
            return part;
          }
        });
      }
      return parts;
    }
    resolvedOptions() {
      return this.dtf.resolvedOptions();
    }
  };
  var PolyRelFormatter = class {
    constructor(intl, isEnglish, opts) {
      this.opts = { style: "long", ...opts };
      if (!isEnglish && hasRelative()) {
        this.rtf = getCachedRTF(intl, opts);
      }
    }
    format(count, unit) {
      if (this.rtf) {
        return this.rtf.format(count, unit);
      } else {
        return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
      }
    }
    formatToParts(count, unit) {
      if (this.rtf) {
        return this.rtf.formatToParts(count, unit);
      } else {
        return [];
      }
    }
  };
  var fallbackWeekSettings = {
    firstDay: 1,
    minimalDays: 4,
    weekend: [6, 7]
  };
  var Locale = class {
    static fromOpts(opts) {
      return Locale.create(
        opts.locale,
        opts.numberingSystem,
        opts.outputCalendar,
        opts.weekSettings,
        opts.defaultToEN
      );
    }
    static create(locale, numberingSystem, outputCalendar, weekSettings, defaultToEN = false) {
      const specifiedLocale = locale || Settings.defaultLocale;
      const localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale());
      const numberingSystemR = numberingSystem || Settings.defaultNumberingSystem;
      const outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
      const weekSettingsR = validateWeekSettings(weekSettings) || Settings.defaultWeekSettings;
      return new Locale(localeR, numberingSystemR, outputCalendarR, weekSettingsR, specifiedLocale);
    }
    static resetCache() {
      sysLocaleCache = null;
      intlDTCache = {};
      intlNumCache = {};
      intlRelCache = {};
    }
    static fromObject({ locale, numberingSystem, outputCalendar, weekSettings } = {}) {
      return Locale.create(locale, numberingSystem, outputCalendar, weekSettings);
    }
    constructor(locale, numbering, outputCalendar, weekSettings, specifiedLocale) {
      const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale);
      this.locale = parsedLocale;
      this.numberingSystem = numbering || parsedNumberingSystem || null;
      this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
      this.weekSettings = weekSettings;
      this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);
      this.weekdaysCache = { format: {}, standalone: {} };
      this.monthsCache = { format: {}, standalone: {} };
      this.meridiemCache = null;
      this.eraCache = {};
      this.specifiedLocale = specifiedLocale;
      this.fastNumbersCached = null;
    }
    get fastNumbers() {
      if (this.fastNumbersCached == null) {
        this.fastNumbersCached = supportsFastNumbers(this);
      }
      return this.fastNumbersCached;
    }
    listingMode() {
      const isActuallyEn = this.isEnglish();
      const hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
      return isActuallyEn && hasNoWeirdness ? "en" : "intl";
    }
    clone(alts) {
      if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
        return this;
      } else {
        return Locale.create(
          alts.locale || this.specifiedLocale,
          alts.numberingSystem || this.numberingSystem,
          alts.outputCalendar || this.outputCalendar,
          validateWeekSettings(alts.weekSettings) || this.weekSettings,
          alts.defaultToEN || false
        );
      }
    }
    redefaultToEN(alts = {}) {
      return this.clone({ ...alts, defaultToEN: true });
    }
    redefaultToSystem(alts = {}) {
      return this.clone({ ...alts, defaultToEN: false });
    }
    months(length, format = false) {
      return listStuff(this, length, months, () => {
        const intl = format ? { month: length, day: "numeric" } : { month: length }, formatStr = format ? "format" : "standalone";
        if (!this.monthsCache[formatStr][length]) {
          this.monthsCache[formatStr][length] = mapMonths((dt2) => this.extract(dt2, intl, "month"));
        }
        return this.monthsCache[formatStr][length];
      });
    }
    weekdays(length, format = false) {
      return listStuff(this, length, weekdays, () => {
        const intl = format ? { weekday: length, year: "numeric", month: "long", day: "numeric" } : { weekday: length }, formatStr = format ? "format" : "standalone";
        if (!this.weekdaysCache[formatStr][length]) {
          this.weekdaysCache[formatStr][length] = mapWeekdays(
            (dt2) => this.extract(dt2, intl, "weekday")
          );
        }
        return this.weekdaysCache[formatStr][length];
      });
    }
    meridiems() {
      return listStuff(
        this,
        void 0,
        () => meridiems,
        () => {
          if (!this.meridiemCache) {
            const intl = { hour: "numeric", hourCycle: "h12" };
            this.meridiemCache = [DateTime.utc(2016, 11, 13, 9), DateTime.utc(2016, 11, 13, 19)].map(
              (dt2) => this.extract(dt2, intl, "dayperiod")
            );
          }
          return this.meridiemCache;
        }
      );
    }
    eras(length) {
      return listStuff(this, length, eras, () => {
        const intl = { era: length };
        if (!this.eraCache[length]) {
          this.eraCache[length] = [DateTime.utc(-40, 1, 1), DateTime.utc(2017, 1, 1)].map(
            (dt2) => this.extract(dt2, intl, "era")
          );
        }
        return this.eraCache[length];
      });
    }
    extract(dt2, intlOpts, field) {
      const df = this.dtFormatter(dt2, intlOpts), results = df.formatToParts(), matching = results.find((m2) => m2.type.toLowerCase() === field);
      return matching ? matching.value : null;
    }
    numberFormatter(opts = {}) {
      return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
    }
    dtFormatter(dt2, intlOpts = {}) {
      return new PolyDateFormatter(dt2, this.intl, intlOpts);
    }
    relFormatter(opts = {}) {
      return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
    }
    listFormatter(opts = {}) {
      return getCachedLF(this.intl, opts);
    }
    isEnglish() {
      return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
    }
    getWeekSettings() {
      if (this.weekSettings) {
        return this.weekSettings;
      } else if (!hasLocaleWeekInfo()) {
        return fallbackWeekSettings;
      } else {
        return getCachedWeekInfo(this.locale);
      }
    }
    getStartOfWeek() {
      return this.getWeekSettings().firstDay;
    }
    getMinDaysInFirstWeek() {
      return this.getWeekSettings().minimalDays;
    }
    getWeekendDays() {
      return this.getWeekSettings().weekend;
    }
    equals(other) {
      return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
    }
  };

  // node_modules/luxon/src/zones/fixedOffsetZone.js
  var singleton2 = null;
  var FixedOffsetZone = class extends Zone {
    static get utcInstance() {
      if (singleton2 === null) {
        singleton2 = new FixedOffsetZone(0);
      }
      return singleton2;
    }
    static instance(offset2) {
      return offset2 === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset2);
    }
    static parseSpecifier(s3) {
      if (s3) {
        const r2 = s3.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
        if (r2) {
          return new FixedOffsetZone(signedOffset(r2[1], r2[2]));
        }
      }
      return null;
    }
    constructor(offset2) {
      super();
      this.fixed = offset2;
    }
    get type() {
      return "fixed";
    }
    get name() {
      return this.fixed === 0 ? "UTC" : `UTC${formatOffset(this.fixed, "narrow")}`;
    }
    get ianaName() {
      if (this.fixed === 0) {
        return "Etc/UTC";
      } else {
        return `Etc/GMT${formatOffset(-this.fixed, "narrow")}`;
      }
    }
    offsetName() {
      return this.name;
    }
    formatOffset(ts2, format) {
      return formatOffset(this.fixed, format);
    }
    get isUniversal() {
      return true;
    }
    offset() {
      return this.fixed;
    }
    equals(otherZone) {
      return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
    }
    get isValid() {
      return true;
    }
  };

  // node_modules/luxon/src/zones/invalidZone.js
  var InvalidZone = class extends Zone {
    constructor(zoneName) {
      super();
      this.zoneName = zoneName;
    }
    get type() {
      return "invalid";
    }
    get name() {
      return this.zoneName;
    }
    get isUniversal() {
      return false;
    }
    offsetName() {
      return null;
    }
    formatOffset() {
      return "";
    }
    offset() {
      return NaN;
    }
    equals() {
      return false;
    }
    get isValid() {
      return false;
    }
  };

  // node_modules/luxon/src/impl/zoneUtil.js
  function normalizeZone(input, defaultZone2) {
    let offset2;
    if (isUndefined(input) || input === null) {
      return defaultZone2;
    } else if (input instanceof Zone) {
      return input;
    } else if (isString(input)) {
      const lowered = input.toLowerCase();
      if (lowered === "default")
        return defaultZone2;
      else if (lowered === "local" || lowered === "system")
        return SystemZone.instance;
      else if (lowered === "utc" || lowered === "gmt")
        return FixedOffsetZone.utcInstance;
      else
        return FixedOffsetZone.parseSpecifier(lowered) || IANAZone.create(input);
    } else if (isNumber(input)) {
      return FixedOffsetZone.instance(input);
    } else if (typeof input === "object" && "offset" in input && typeof input.offset === "function") {
      return input;
    } else {
      return new InvalidZone(input);
    }
  }

  // node_modules/luxon/src/settings.js
  var now = () => Date.now();
  var defaultZone = "system";
  var defaultLocale = null;
  var defaultNumberingSystem = null;
  var defaultOutputCalendar = null;
  var twoDigitCutoffYear = 60;
  var throwOnInvalid;
  var defaultWeekSettings = null;
  var Settings = class {
    static get now() {
      return now;
    }
    static set now(n3) {
      now = n3;
    }
    static set defaultZone(zone) {
      defaultZone = zone;
    }
    static get defaultZone() {
      return normalizeZone(defaultZone, SystemZone.instance);
    }
    static get defaultLocale() {
      return defaultLocale;
    }
    static set defaultLocale(locale) {
      defaultLocale = locale;
    }
    static get defaultNumberingSystem() {
      return defaultNumberingSystem;
    }
    static set defaultNumberingSystem(numberingSystem) {
      defaultNumberingSystem = numberingSystem;
    }
    static get defaultOutputCalendar() {
      return defaultOutputCalendar;
    }
    static set defaultOutputCalendar(outputCalendar) {
      defaultOutputCalendar = outputCalendar;
    }
    static get defaultWeekSettings() {
      return defaultWeekSettings;
    }
    static set defaultWeekSettings(weekSettings) {
      defaultWeekSettings = validateWeekSettings(weekSettings);
    }
    static get twoDigitCutoffYear() {
      return twoDigitCutoffYear;
    }
    static set twoDigitCutoffYear(cutoffYear) {
      twoDigitCutoffYear = cutoffYear % 100;
    }
    static get throwOnInvalid() {
      return throwOnInvalid;
    }
    static set throwOnInvalid(t2) {
      throwOnInvalid = t2;
    }
    static resetCaches() {
      Locale.resetCache();
      IANAZone.resetCache();
    }
  };

  // node_modules/luxon/src/impl/invalid.js
  var Invalid = class {
    constructor(reason, explanation) {
      this.reason = reason;
      this.explanation = explanation;
    }
    toMessage() {
      if (this.explanation) {
        return `${this.reason}: ${this.explanation}`;
      } else {
        return this.reason;
      }
    }
  };

  // node_modules/luxon/src/impl/conversions.js
  var nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  function unitOutOfRange(unit, value) {
    return new Invalid(
      "unit out of range",
      `you specified ${value} (of type ${typeof value}) as a ${unit}, which is invalid`
    );
  }
  function dayOfWeek(year, month, day) {
    const d2 = new Date(Date.UTC(year, month - 1, day));
    if (year < 100 && year >= 0) {
      d2.setUTCFullYear(d2.getUTCFullYear() - 1900);
    }
    const js = d2.getUTCDay();
    return js === 0 ? 7 : js;
  }
  function computeOrdinal(year, month, day) {
    return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
  }
  function uncomputeOrdinal(year, ordinal) {
    const table = isLeapYear(year) ? leapLadder : nonLeapLadder, month0 = table.findIndex((i2) => i2 < ordinal), day = ordinal - table[month0];
    return { month: month0 + 1, day };
  }
  function isoWeekdayToLocal(isoWeekday, startOfWeek) {
    return (isoWeekday - startOfWeek + 7) % 7 + 1;
  }
  function gregorianToWeek(gregObj, minDaysInFirstWeek = 4, startOfWeek = 1) {
    const { year, month, day } = gregObj, ordinal = computeOrdinal(year, month, day), weekday = isoWeekdayToLocal(dayOfWeek(year, month, day), startOfWeek);
    let weekNumber = Math.floor((ordinal - weekday + 14 - minDaysInFirstWeek) / 7), weekYear;
    if (weekNumber < 1) {
      weekYear = year - 1;
      weekNumber = weeksInWeekYear(weekYear, minDaysInFirstWeek, startOfWeek);
    } else if (weekNumber > weeksInWeekYear(year, minDaysInFirstWeek, startOfWeek)) {
      weekYear = year + 1;
      weekNumber = 1;
    } else {
      weekYear = year;
    }
    return { weekYear, weekNumber, weekday, ...timeObject(gregObj) };
  }
  function weekToGregorian(weekData, minDaysInFirstWeek = 4, startOfWeek = 1) {
    const { weekYear, weekNumber, weekday } = weekData, weekdayOfJan4 = isoWeekdayToLocal(dayOfWeek(weekYear, 1, minDaysInFirstWeek), startOfWeek), yearInDays = daysInYear(weekYear);
    let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 7 + minDaysInFirstWeek, year;
    if (ordinal < 1) {
      year = weekYear - 1;
      ordinal += daysInYear(year);
    } else if (ordinal > yearInDays) {
      year = weekYear + 1;
      ordinal -= daysInYear(weekYear);
    } else {
      year = weekYear;
    }
    const { month, day } = uncomputeOrdinal(year, ordinal);
    return { year, month, day, ...timeObject(weekData) };
  }
  function gregorianToOrdinal(gregData) {
    const { year, month, day } = gregData;
    const ordinal = computeOrdinal(year, month, day);
    return { year, ordinal, ...timeObject(gregData) };
  }
  function ordinalToGregorian(ordinalData) {
    const { year, ordinal } = ordinalData;
    const { month, day } = uncomputeOrdinal(year, ordinal);
    return { year, month, day, ...timeObject(ordinalData) };
  }
  function usesLocalWeekValues(obj, loc) {
    const hasLocaleWeekData = !isUndefined(obj.localWeekday) || !isUndefined(obj.localWeekNumber) || !isUndefined(obj.localWeekYear);
    if (hasLocaleWeekData) {
      const hasIsoWeekData = !isUndefined(obj.weekday) || !isUndefined(obj.weekNumber) || !isUndefined(obj.weekYear);
      if (hasIsoWeekData) {
        throw new ConflictingSpecificationError(
          "Cannot mix locale-based week fields with ISO-based week fields"
        );
      }
      if (!isUndefined(obj.localWeekday))
        obj.weekday = obj.localWeekday;
      if (!isUndefined(obj.localWeekNumber))
        obj.weekNumber = obj.localWeekNumber;
      if (!isUndefined(obj.localWeekYear))
        obj.weekYear = obj.localWeekYear;
      delete obj.localWeekday;
      delete obj.localWeekNumber;
      delete obj.localWeekYear;
      return {
        minDaysInFirstWeek: loc.getMinDaysInFirstWeek(),
        startOfWeek: loc.getStartOfWeek()
      };
    } else {
      return { minDaysInFirstWeek: 4, startOfWeek: 1 };
    }
  }
  function hasInvalidWeekData(obj, minDaysInFirstWeek = 4, startOfWeek = 1) {
    const validYear = isInteger(obj.weekYear), validWeek = integerBetween(
      obj.weekNumber,
      1,
      weeksInWeekYear(obj.weekYear, minDaysInFirstWeek, startOfWeek)
    ), validWeekday = integerBetween(obj.weekday, 1, 7);
    if (!validYear) {
      return unitOutOfRange("weekYear", obj.weekYear);
    } else if (!validWeek) {
      return unitOutOfRange("week", obj.weekNumber);
    } else if (!validWeekday) {
      return unitOutOfRange("weekday", obj.weekday);
    } else
      return false;
  }
  function hasInvalidOrdinalData(obj) {
    const validYear = isInteger(obj.year), validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));
    if (!validYear) {
      return unitOutOfRange("year", obj.year);
    } else if (!validOrdinal) {
      return unitOutOfRange("ordinal", obj.ordinal);
    } else
      return false;
  }
  function hasInvalidGregorianData(obj) {
    const validYear = isInteger(obj.year), validMonth = integerBetween(obj.month, 1, 12), validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));
    if (!validYear) {
      return unitOutOfRange("year", obj.year);
    } else if (!validMonth) {
      return unitOutOfRange("month", obj.month);
    } else if (!validDay) {
      return unitOutOfRange("day", obj.day);
    } else
      return false;
  }
  function hasInvalidTimeData(obj) {
    const { hour, minute, second, millisecond } = obj;
    const validHour = integerBetween(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0, validMinute = integerBetween(minute, 0, 59), validSecond = integerBetween(second, 0, 59), validMillisecond = integerBetween(millisecond, 0, 999);
    if (!validHour) {
      return unitOutOfRange("hour", hour);
    } else if (!validMinute) {
      return unitOutOfRange("minute", minute);
    } else if (!validSecond) {
      return unitOutOfRange("second", second);
    } else if (!validMillisecond) {
      return unitOutOfRange("millisecond", millisecond);
    } else
      return false;
  }

  // node_modules/luxon/src/impl/util.js
  function isUndefined(o2) {
    return typeof o2 === "undefined";
  }
  function isNumber(o2) {
    return typeof o2 === "number";
  }
  function isInteger(o2) {
    return typeof o2 === "number" && o2 % 1 === 0;
  }
  function isString(o2) {
    return typeof o2 === "string";
  }
  function isDate(o2) {
    return Object.prototype.toString.call(o2) === "[object Date]";
  }
  function hasRelative() {
    try {
      return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
    } catch (e5) {
      return false;
    }
  }
  function hasLocaleWeekInfo() {
    try {
      return typeof Intl !== "undefined" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
    } catch (e5) {
      return false;
    }
  }
  function maybeArray(thing) {
    return Array.isArray(thing) ? thing : [thing];
  }
  function bestBy(arr, by, compare) {
    if (arr.length === 0) {
      return void 0;
    }
    return arr.reduce((best, next) => {
      const pair = [by(next), next];
      if (!best) {
        return pair;
      } else if (compare(best[0], pair[0]) === best[0]) {
        return best;
      } else {
        return pair;
      }
    }, null)[1];
  }
  function pick(obj, keys) {
    return keys.reduce((a2, k2) => {
      a2[k2] = obj[k2];
      return a2;
    }, {});
  }
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  function validateWeekSettings(settings) {
    if (settings == null) {
      return null;
    } else if (typeof settings !== "object") {
      throw new InvalidArgumentError("Week settings must be an object");
    } else {
      if (!integerBetween(settings.firstDay, 1, 7) || !integerBetween(settings.minimalDays, 1, 7) || !Array.isArray(settings.weekend) || settings.weekend.some((v2) => !integerBetween(v2, 1, 7))) {
        throw new InvalidArgumentError("Invalid week settings");
      }
      return {
        firstDay: settings.firstDay,
        minimalDays: settings.minimalDays,
        weekend: Array.from(settings.weekend)
      };
    }
  }
  function integerBetween(thing, bottom, top) {
    return isInteger(thing) && thing >= bottom && thing <= top;
  }
  function floorMod(x2, n3) {
    return x2 - n3 * Math.floor(x2 / n3);
  }
  function padStart(input, n3 = 2) {
    const isNeg = input < 0;
    let padded;
    if (isNeg) {
      padded = "-" + ("" + -input).padStart(n3, "0");
    } else {
      padded = ("" + input).padStart(n3, "0");
    }
    return padded;
  }
  function parseInteger(string) {
    if (isUndefined(string) || string === null || string === "") {
      return void 0;
    } else {
      return parseInt(string, 10);
    }
  }
  function parseFloating(string) {
    if (isUndefined(string) || string === null || string === "") {
      return void 0;
    } else {
      return parseFloat(string);
    }
  }
  function parseMillis(fraction) {
    if (isUndefined(fraction) || fraction === null || fraction === "") {
      return void 0;
    } else {
      const f2 = parseFloat("0." + fraction) * 1e3;
      return Math.floor(f2);
    }
  }
  function roundTo(number, digits, towardZero = false) {
    const factor = 10 ** digits, rounder = towardZero ? Math.trunc : Math.round;
    return rounder(number * factor) / factor;
  }
  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
  function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
  }
  function daysInMonth(year, month) {
    const modMonth = floorMod(month - 1, 12) + 1, modYear = year + (month - modMonth) / 12;
    if (modMonth === 2) {
      return isLeapYear(modYear) ? 29 : 28;
    } else {
      return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
    }
  }
  function objToLocalTS(obj) {
    let d2 = Date.UTC(
      obj.year,
      obj.month - 1,
      obj.day,
      obj.hour,
      obj.minute,
      obj.second,
      obj.millisecond
    );
    if (obj.year < 100 && obj.year >= 0) {
      d2 = new Date(d2);
      d2.setUTCFullYear(obj.year, obj.month - 1, obj.day);
    }
    return +d2;
  }
  function firstWeekOffset(year, minDaysInFirstWeek, startOfWeek) {
    const fwdlw = isoWeekdayToLocal(dayOfWeek(year, 1, minDaysInFirstWeek), startOfWeek);
    return -fwdlw + minDaysInFirstWeek - 1;
  }
  function weeksInWeekYear(weekYear, minDaysInFirstWeek = 4, startOfWeek = 1) {
    const weekOffset = firstWeekOffset(weekYear, minDaysInFirstWeek, startOfWeek);
    const weekOffsetNext = firstWeekOffset(weekYear + 1, minDaysInFirstWeek, startOfWeek);
    return (daysInYear(weekYear) - weekOffset + weekOffsetNext) / 7;
  }
  function untruncateYear(year) {
    if (year > 99) {
      return year;
    } else
      return year > Settings.twoDigitCutoffYear ? 1900 + year : 2e3 + year;
  }
  function parseZoneInfo(ts2, offsetFormat, locale, timeZone = null) {
    const date = new Date(ts2), intlOpts = {
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    };
    if (timeZone) {
      intlOpts.timeZone = timeZone;
    }
    const modified = { timeZoneName: offsetFormat, ...intlOpts };
    const parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find((m2) => m2.type.toLowerCase() === "timezonename");
    return parsed ? parsed.value : null;
  }
  function signedOffset(offHourStr, offMinuteStr) {
    let offHour = parseInt(offHourStr, 10);
    if (Number.isNaN(offHour)) {
      offHour = 0;
    }
    const offMin = parseInt(offMinuteStr, 10) || 0, offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
    return offHour * 60 + offMinSigned;
  }
  function asNumber(value) {
    const numericValue = Number(value);
    if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue))
      throw new InvalidArgumentError(`Invalid unit value ${value}`);
    return numericValue;
  }
  function normalizeObject(obj, normalizer) {
    const normalized = {};
    for (const u2 in obj) {
      if (hasOwnProperty(obj, u2)) {
        const v2 = obj[u2];
        if (v2 === void 0 || v2 === null)
          continue;
        normalized[normalizer(u2)] = asNumber(v2);
      }
    }
    return normalized;
  }
  function formatOffset(offset2, format) {
    const hours = Math.trunc(Math.abs(offset2 / 60)), minutes = Math.trunc(Math.abs(offset2 % 60)), sign = offset2 >= 0 ? "+" : "-";
    switch (format) {
      case "short":
        return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
      case "narrow":
        return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
      case "techie":
        return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
      default:
        throw new RangeError(`Value format ${format} is out of range for property format`);
    }
  }
  function timeObject(obj) {
    return pick(obj, ["hour", "minute", "second", "millisecond"]);
  }

  // node_modules/luxon/src/impl/english.js
  var monthsLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  function months(length) {
    switch (length) {
      case "narrow":
        return [...monthsNarrow];
      case "short":
        return [...monthsShort];
      case "long":
        return [...monthsLong];
      case "numeric":
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      case "2-digit":
        return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      default:
        return null;
    }
  }
  var weekdaysLong = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  var weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];
  function weekdays(length) {
    switch (length) {
      case "narrow":
        return [...weekdaysNarrow];
      case "short":
        return [...weekdaysShort];
      case "long":
        return [...weekdaysLong];
      case "numeric":
        return ["1", "2", "3", "4", "5", "6", "7"];
      default:
        return null;
    }
  }
  var meridiems = ["AM", "PM"];
  var erasLong = ["Before Christ", "Anno Domini"];
  var erasShort = ["BC", "AD"];
  var erasNarrow = ["B", "A"];
  function eras(length) {
    switch (length) {
      case "narrow":
        return [...erasNarrow];
      case "short":
        return [...erasShort];
      case "long":
        return [...erasLong];
      default:
        return null;
    }
  }
  function meridiemForDateTime(dt2) {
    return meridiems[dt2.hour < 12 ? 0 : 1];
  }
  function weekdayForDateTime(dt2, length) {
    return weekdays(length)[dt2.weekday - 1];
  }
  function monthForDateTime(dt2, length) {
    return months(length)[dt2.month - 1];
  }
  function eraForDateTime(dt2, length) {
    return eras(length)[dt2.year < 0 ? 0 : 1];
  }
  function formatRelativeTime(unit, count, numeric = "always", narrow = false) {
    const units = {
      years: ["year", "yr."],
      quarters: ["quarter", "qtr."],
      months: ["month", "mo."],
      weeks: ["week", "wk."],
      days: ["day", "day", "days"],
      hours: ["hour", "hr."],
      minutes: ["minute", "min."],
      seconds: ["second", "sec."]
    };
    const lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;
    if (numeric === "auto" && lastable) {
      const isDay = unit === "days";
      switch (count) {
        case 1:
          return isDay ? "tomorrow" : `next ${units[unit][0]}`;
        case -1:
          return isDay ? "yesterday" : `last ${units[unit][0]}`;
        case 0:
          return isDay ? "today" : `this ${units[unit][0]}`;
        default:
      }
    }
    const isInPast = Object.is(count, -0) || count < 0, fmtValue = Math.abs(count), singular = fmtValue === 1, lilUnits = units[unit], fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
    return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
  }

  // node_modules/luxon/src/impl/formatter.js
  function stringifyTokens(splits, tokenToString) {
    let s3 = "";
    for (const token of splits) {
      if (token.literal) {
        s3 += token.val;
      } else {
        s3 += tokenToString(token.val);
      }
    }
    return s3;
  }
  var macroTokenToFormatOpts = {
    D: DATE_SHORT,
    DD: DATE_MED,
    DDD: DATE_FULL,
    DDDD: DATE_HUGE,
    t: TIME_SIMPLE,
    tt: TIME_WITH_SECONDS,
    ttt: TIME_WITH_SHORT_OFFSET,
    tttt: TIME_WITH_LONG_OFFSET,
    T: TIME_24_SIMPLE,
    TT: TIME_24_WITH_SECONDS,
    TTT: TIME_24_WITH_SHORT_OFFSET,
    TTTT: TIME_24_WITH_LONG_OFFSET,
    f: DATETIME_SHORT,
    ff: DATETIME_MED,
    fff: DATETIME_FULL,
    ffff: DATETIME_HUGE,
    F: DATETIME_SHORT_WITH_SECONDS,
    FF: DATETIME_MED_WITH_SECONDS,
    FFF: DATETIME_FULL_WITH_SECONDS,
    FFFF: DATETIME_HUGE_WITH_SECONDS
  };
  var Formatter = class {
    static create(locale, opts = {}) {
      return new Formatter(locale, opts);
    }
    static parseFormat(fmt) {
      let current = null, currentFull = "", bracketed = false;
      const splits = [];
      for (let i2 = 0; i2 < fmt.length; i2++) {
        const c2 = fmt.charAt(i2);
        if (c2 === "'") {
          if (currentFull.length > 0) {
            splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
          }
          current = null;
          currentFull = "";
          bracketed = !bracketed;
        } else if (bracketed) {
          currentFull += c2;
        } else if (c2 === current) {
          currentFull += c2;
        } else {
          if (currentFull.length > 0) {
            splits.push({ literal: /^\s+$/.test(currentFull), val: currentFull });
          }
          currentFull = c2;
          current = c2;
        }
      }
      if (currentFull.length > 0) {
        splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
      }
      return splits;
    }
    static macroTokenToFormatOpts(token) {
      return macroTokenToFormatOpts[token];
    }
    constructor(locale, formatOpts) {
      this.opts = formatOpts;
      this.loc = locale;
      this.systemLoc = null;
    }
    formatWithSystemDefault(dt2, opts) {
      if (this.systemLoc === null) {
        this.systemLoc = this.loc.redefaultToSystem();
      }
      const df = this.systemLoc.dtFormatter(dt2, { ...this.opts, ...opts });
      return df.format();
    }
    dtFormatter(dt2, opts = {}) {
      return this.loc.dtFormatter(dt2, { ...this.opts, ...opts });
    }
    formatDateTime(dt2, opts) {
      return this.dtFormatter(dt2, opts).format();
    }
    formatDateTimeParts(dt2, opts) {
      return this.dtFormatter(dt2, opts).formatToParts();
    }
    formatInterval(interval, opts) {
      const df = this.dtFormatter(interval.start, opts);
      return df.dtf.formatRange(interval.start.toJSDate(), interval.end.toJSDate());
    }
    resolvedOptions(dt2, opts) {
      return this.dtFormatter(dt2, opts).resolvedOptions();
    }
    num(n3, p2 = 0) {
      if (this.opts.forceSimple) {
        return padStart(n3, p2);
      }
      const opts = { ...this.opts };
      if (p2 > 0) {
        opts.padTo = p2;
      }
      return this.loc.numberFormatter(opts).format(n3);
    }
    formatDateTimeFromString(dt2, fmt) {
      const knownEnglish = this.loc.listingMode() === "en", useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", string = (opts, extract) => this.loc.extract(dt2, opts, extract), formatOffset2 = (opts) => {
        if (dt2.isOffsetFixed && dt2.offset === 0 && opts.allowZ) {
          return "Z";
        }
        return dt2.isValid ? dt2.zone.formatOffset(dt2.ts, opts.format) : "";
      }, meridiem = () => knownEnglish ? meridiemForDateTime(dt2) : string({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), month = (length, standalone) => knownEnglish ? monthForDateTime(dt2, length) : string(standalone ? { month: length } : { month: length, day: "numeric" }, "month"), weekday = (length, standalone) => knownEnglish ? weekdayForDateTime(dt2, length) : string(
        standalone ? { weekday: length } : { weekday: length, month: "long", day: "numeric" },
        "weekday"
      ), maybeMacro = (token) => {
        const formatOpts = Formatter.macroTokenToFormatOpts(token);
        if (formatOpts) {
          return this.formatWithSystemDefault(dt2, formatOpts);
        } else {
          return token;
        }
      }, era = (length) => knownEnglish ? eraForDateTime(dt2, length) : string({ era: length }, "era"), tokenToString = (token) => {
        switch (token) {
          case "S":
            return this.num(dt2.millisecond);
          case "u":
          case "SSS":
            return this.num(dt2.millisecond, 3);
          case "s":
            return this.num(dt2.second);
          case "ss":
            return this.num(dt2.second, 2);
          case "uu":
            return this.num(Math.floor(dt2.millisecond / 10), 2);
          case "uuu":
            return this.num(Math.floor(dt2.millisecond / 100));
          case "m":
            return this.num(dt2.minute);
          case "mm":
            return this.num(dt2.minute, 2);
          case "h":
            return this.num(dt2.hour % 12 === 0 ? 12 : dt2.hour % 12);
          case "hh":
            return this.num(dt2.hour % 12 === 0 ? 12 : dt2.hour % 12, 2);
          case "H":
            return this.num(dt2.hour);
          case "HH":
            return this.num(dt2.hour, 2);
          case "Z":
            return formatOffset2({ format: "narrow", allowZ: this.opts.allowZ });
          case "ZZ":
            return formatOffset2({ format: "short", allowZ: this.opts.allowZ });
          case "ZZZ":
            return formatOffset2({ format: "techie", allowZ: this.opts.allowZ });
          case "ZZZZ":
            return dt2.zone.offsetName(dt2.ts, { format: "short", locale: this.loc.locale });
          case "ZZZZZ":
            return dt2.zone.offsetName(dt2.ts, { format: "long", locale: this.loc.locale });
          case "z":
            return dt2.zoneName;
          case "a":
            return meridiem();
          case "d":
            return useDateTimeFormatter ? string({ day: "numeric" }, "day") : this.num(dt2.day);
          case "dd":
            return useDateTimeFormatter ? string({ day: "2-digit" }, "day") : this.num(dt2.day, 2);
          case "c":
            return this.num(dt2.weekday);
          case "ccc":
            return weekday("short", true);
          case "cccc":
            return weekday("long", true);
          case "ccccc":
            return weekday("narrow", true);
          case "E":
            return this.num(dt2.weekday);
          case "EEE":
            return weekday("short", false);
          case "EEEE":
            return weekday("long", false);
          case "EEEEE":
            return weekday("narrow", false);
          case "L":
            return useDateTimeFormatter ? string({ month: "numeric", day: "numeric" }, "month") : this.num(dt2.month);
          case "LL":
            return useDateTimeFormatter ? string({ month: "2-digit", day: "numeric" }, "month") : this.num(dt2.month, 2);
          case "LLL":
            return month("short", true);
          case "LLLL":
            return month("long", true);
          case "LLLLL":
            return month("narrow", true);
          case "M":
            return useDateTimeFormatter ? string({ month: "numeric" }, "month") : this.num(dt2.month);
          case "MM":
            return useDateTimeFormatter ? string({ month: "2-digit" }, "month") : this.num(dt2.month, 2);
          case "MMM":
            return month("short", false);
          case "MMMM":
            return month("long", false);
          case "MMMMM":
            return month("narrow", false);
          case "y":
            return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt2.year);
          case "yy":
            return useDateTimeFormatter ? string({ year: "2-digit" }, "year") : this.num(dt2.year.toString().slice(-2), 2);
          case "yyyy":
            return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt2.year, 4);
          case "yyyyyy":
            return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt2.year, 6);
          case "G":
            return era("short");
          case "GG":
            return era("long");
          case "GGGGG":
            return era("narrow");
          case "kk":
            return this.num(dt2.weekYear.toString().slice(-2), 2);
          case "kkkk":
            return this.num(dt2.weekYear, 4);
          case "W":
            return this.num(dt2.weekNumber);
          case "WW":
            return this.num(dt2.weekNumber, 2);
          case "n":
            return this.num(dt2.localWeekNumber);
          case "nn":
            return this.num(dt2.localWeekNumber, 2);
          case "ii":
            return this.num(dt2.localWeekYear.toString().slice(-2), 2);
          case "iiii":
            return this.num(dt2.localWeekYear, 4);
          case "o":
            return this.num(dt2.ordinal);
          case "ooo":
            return this.num(dt2.ordinal, 3);
          case "q":
            return this.num(dt2.quarter);
          case "qq":
            return this.num(dt2.quarter, 2);
          case "X":
            return this.num(Math.floor(dt2.ts / 1e3));
          case "x":
            return this.num(dt2.ts);
          default:
            return maybeMacro(token);
        }
      };
      return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
    }
    formatDurationFromString(dur, fmt) {
      const tokenToField = (token) => {
        switch (token[0]) {
          case "S":
            return "millisecond";
          case "s":
            return "second";
          case "m":
            return "minute";
          case "h":
            return "hour";
          case "d":
            return "day";
          case "w":
            return "week";
          case "M":
            return "month";
          case "y":
            return "year";
          default:
            return null;
        }
      }, tokenToString = (lildur) => (token) => {
        const mapped = tokenToField(token);
        if (mapped) {
          return this.num(lildur.get(mapped), token.length);
        } else {
          return token;
        }
      }, tokens = Formatter.parseFormat(fmt), realTokens = tokens.reduce(
        (found, { literal, val }) => literal ? found : found.concat(val),
        []
      ), collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t2) => t2));
      return stringifyTokens(tokens, tokenToString(collapsed));
    }
  };

  // node_modules/luxon/src/impl/regexParser.js
  var ianaRegex = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
  function combineRegexes(...regexes) {
    const full = regexes.reduce((f2, r2) => f2 + r2.source, "");
    return RegExp(`^${full}$`);
  }
  function combineExtractors(...extractors) {
    return (m2) => extractors.reduce(
      ([mergedVals, mergedZone, cursor], ex) => {
        const [val, zone, next] = ex(m2, cursor);
        return [{ ...mergedVals, ...val }, zone || mergedZone, next];
      },
      [{}, null, 1]
    ).slice(0, 2);
  }
  function parse(s3, ...patterns) {
    if (s3 == null) {
      return [null, null];
    }
    for (const [regex, extractor] of patterns) {
      const m2 = regex.exec(s3);
      if (m2) {
        return extractor(m2);
      }
    }
    return [null, null];
  }
  function simpleParse(...keys) {
    return (match2, cursor) => {
      const ret = {};
      let i2;
      for (i2 = 0; i2 < keys.length; i2++) {
        ret[keys[i2]] = parseInteger(match2[cursor + i2]);
      }
      return [ret, null, cursor + i2];
    };
  }
  var offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
  var isoExtendedZone = `(?:${offsetRegex.source}?(?:\\[(${ianaRegex.source})\\])?)?`;
  var isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
  var isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${isoExtendedZone}`);
  var isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`);
  var isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
  var isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
  var isoOrdinalRegex = /(\d{4})-?(\d{3})/;
  var extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay");
  var extractISOOrdinalData = simpleParse("year", "ordinal");
  var sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/;
  var sqlTimeRegex = RegExp(
    `${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex.source}))?`
  );
  var sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);
  function int2(match2, pos, fallback) {
    const m2 = match2[pos];
    return isUndefined(m2) ? fallback : parseInteger(m2);
  }
  function extractISOYmd(match2, cursor) {
    const item = {
      year: int2(match2, cursor),
      month: int2(match2, cursor + 1, 1),
      day: int2(match2, cursor + 2, 1)
    };
    return [item, null, cursor + 3];
  }
  function extractISOTime(match2, cursor) {
    const item = {
      hours: int2(match2, cursor, 0),
      minutes: int2(match2, cursor + 1, 0),
      seconds: int2(match2, cursor + 2, 0),
      milliseconds: parseMillis(match2[cursor + 3])
    };
    return [item, null, cursor + 4];
  }
  function extractISOOffset(match2, cursor) {
    const local = !match2[cursor] && !match2[cursor + 1], fullOffset = signedOffset(match2[cursor + 1], match2[cursor + 2]), zone = local ? null : FixedOffsetZone.instance(fullOffset);
    return [{}, zone, cursor + 3];
  }
  function extractIANAZone(match2, cursor) {
    const zone = match2[cursor] ? IANAZone.create(match2[cursor]) : null;
    return [{}, zone, cursor + 1];
  }
  var isoTimeOnly = RegExp(`^T?${isoTimeBaseRegex.source}$`);
  var isoDuration = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
  function extractISODuration(match2) {
    const [s3, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] = match2;
    const hasNegativePrefix = s3[0] === "-";
    const negativeSeconds = secondStr && secondStr[0] === "-";
    const maybeNegate = (num, force = false) => num !== void 0 && (force || num && hasNegativePrefix) ? -num : num;
    return [
      {
        years: maybeNegate(parseFloating(yearStr)),
        months: maybeNegate(parseFloating(monthStr)),
        weeks: maybeNegate(parseFloating(weekStr)),
        days: maybeNegate(parseFloating(dayStr)),
        hours: maybeNegate(parseFloating(hourStr)),
        minutes: maybeNegate(parseFloating(minuteStr)),
        seconds: maybeNegate(parseFloating(secondStr), secondStr === "-0"),
        milliseconds: maybeNegate(parseMillis(millisecondsStr), negativeSeconds)
      }
    ];
  }
  var obsOffsets = {
    GMT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60
  };
  function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
    const result = {
      year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
      month: monthsShort.indexOf(monthStr) + 1,
      day: parseInteger(dayStr),
      hour: parseInteger(hourStr),
      minute: parseInteger(minuteStr)
    };
    if (secondStr)
      result.second = parseInteger(secondStr);
    if (weekdayStr) {
      result.weekday = weekdayStr.length > 3 ? weekdaysLong.indexOf(weekdayStr) + 1 : weekdaysShort.indexOf(weekdayStr) + 1;
    }
    return result;
  }
  var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
  function extractRFC2822(match2) {
    const [
      ,
      weekdayStr,
      dayStr,
      monthStr,
      yearStr,
      hourStr,
      minuteStr,
      secondStr,
      obsOffset,
      milOffset,
      offHourStr,
      offMinuteStr
    ] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    let offset2;
    if (obsOffset) {
      offset2 = obsOffsets[obsOffset];
    } else if (milOffset) {
      offset2 = 0;
    } else {
      offset2 = signedOffset(offHourStr, offMinuteStr);
    }
    return [result, new FixedOffsetZone(offset2)];
  }
  function preprocessRFC2822(s3) {
    return s3.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
  }
  var rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/;
  var rfc850 = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/;
  var ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
  function extractRFC1123Or850(match2) {
    const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    return [result, FixedOffsetZone.utcInstance];
  }
  function extractASCII(match2) {
    const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    return [result, FixedOffsetZone.utcInstance];
  }
  var isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
  var isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
  var isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
  var isoTimeCombinedRegex = combineRegexes(isoTimeRegex);
  var extractISOYmdTimeAndOffset = combineExtractors(
    extractISOYmd,
    extractISOTime,
    extractISOOffset,
    extractIANAZone
  );
  var extractISOWeekTimeAndOffset = combineExtractors(
    extractISOWeekData,
    extractISOTime,
    extractISOOffset,
    extractIANAZone
  );
  var extractISOOrdinalDateAndTime = combineExtractors(
    extractISOOrdinalData,
    extractISOTime,
    extractISOOffset,
    extractIANAZone
  );
  var extractISOTimeAndOffset = combineExtractors(
    extractISOTime,
    extractISOOffset,
    extractIANAZone
  );
  function parseISODate(s3) {
    return parse(
      s3,
      [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
      [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset],
      [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDateAndTime],
      [isoTimeCombinedRegex, extractISOTimeAndOffset]
    );
  }
  function parseRFC2822Date(s3) {
    return parse(preprocessRFC2822(s3), [rfc2822, extractRFC2822]);
  }
  function parseHTTPDate(s3) {
    return parse(
      s3,
      [rfc1123, extractRFC1123Or850],
      [rfc850, extractRFC1123Or850],
      [ascii, extractASCII]
    );
  }
  function parseISODuration(s3) {
    return parse(s3, [isoDuration, extractISODuration]);
  }
  var extractISOTimeOnly = combineExtractors(extractISOTime);
  function parseISOTimeOnly(s3) {
    return parse(s3, [isoTimeOnly, extractISOTimeOnly]);
  }
  var sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
  var sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
  var extractISOTimeOffsetAndIANAZone = combineExtractors(
    extractISOTime,
    extractISOOffset,
    extractIANAZone
  );
  function parseSQL(s3) {
    return parse(
      s3,
      [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
      [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]
    );
  }

  // node_modules/luxon/src/duration.js
  var INVALID = "Invalid Duration";
  var lowOrderMatrix = {
    weeks: {
      days: 7,
      hours: 7 * 24,
      minutes: 7 * 24 * 60,
      seconds: 7 * 24 * 60 * 60,
      milliseconds: 7 * 24 * 60 * 60 * 1e3
    },
    days: {
      hours: 24,
      minutes: 24 * 60,
      seconds: 24 * 60 * 60,
      milliseconds: 24 * 60 * 60 * 1e3
    },
    hours: { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1e3 },
    minutes: { seconds: 60, milliseconds: 60 * 1e3 },
    seconds: { milliseconds: 1e3 }
  };
  var casualMatrix = {
    years: {
      quarters: 4,
      months: 12,
      weeks: 52,
      days: 365,
      hours: 365 * 24,
      minutes: 365 * 24 * 60,
      seconds: 365 * 24 * 60 * 60,
      milliseconds: 365 * 24 * 60 * 60 * 1e3
    },
    quarters: {
      months: 3,
      weeks: 13,
      days: 91,
      hours: 91 * 24,
      minutes: 91 * 24 * 60,
      seconds: 91 * 24 * 60 * 60,
      milliseconds: 91 * 24 * 60 * 60 * 1e3
    },
    months: {
      weeks: 4,
      days: 30,
      hours: 30 * 24,
      minutes: 30 * 24 * 60,
      seconds: 30 * 24 * 60 * 60,
      milliseconds: 30 * 24 * 60 * 60 * 1e3
    },
    ...lowOrderMatrix
  };
  var daysInYearAccurate = 146097 / 400;
  var daysInMonthAccurate = 146097 / 4800;
  var accurateMatrix = {
    years: {
      quarters: 4,
      months: 12,
      weeks: daysInYearAccurate / 7,
      days: daysInYearAccurate,
      hours: daysInYearAccurate * 24,
      minutes: daysInYearAccurate * 24 * 60,
      seconds: daysInYearAccurate * 24 * 60 * 60,
      milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3
    },
    quarters: {
      months: 3,
      weeks: daysInYearAccurate / 28,
      days: daysInYearAccurate / 4,
      hours: daysInYearAccurate * 24 / 4,
      minutes: daysInYearAccurate * 24 * 60 / 4,
      seconds: daysInYearAccurate * 24 * 60 * 60 / 4,
      milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3 / 4
    },
    months: {
      weeks: daysInMonthAccurate / 7,
      days: daysInMonthAccurate,
      hours: daysInMonthAccurate * 24,
      minutes: daysInMonthAccurate * 24 * 60,
      seconds: daysInMonthAccurate * 24 * 60 * 60,
      milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1e3
    },
    ...lowOrderMatrix
  };
  var orderedUnits = [
    "years",
    "quarters",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds"
  ];
  var reverseUnits = orderedUnits.slice(0).reverse();
  function clone(dur, alts, clear = false) {
    const conf = {
      values: clear ? alts.values : { ...dur.values, ...alts.values || {} },
      loc: dur.loc.clone(alts.loc),
      conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy,
      matrix: alts.matrix || dur.matrix
    };
    return new Duration(conf);
  }
  function durationToMillis(matrix, vals) {
    let sum = vals.milliseconds ?? 0;
    for (const unit of reverseUnits.slice(1)) {
      if (vals[unit]) {
        sum += vals[unit] * matrix[unit]["milliseconds"];
      }
    }
    return sum;
  }
  function normalizeValues(matrix, vals) {
    const factor = durationToMillis(matrix, vals) < 0 ? -1 : 1;
    orderedUnits.reduceRight((previous, current) => {
      if (!isUndefined(vals[current])) {
        if (previous) {
          const previousVal = vals[previous] * factor;
          const conv = matrix[current][previous];
          const rollUp = Math.floor(previousVal / conv);
          vals[current] += rollUp * factor;
          vals[previous] -= rollUp * conv * factor;
        }
        return current;
      } else {
        return previous;
      }
    }, null);
    orderedUnits.reduce((previous, current) => {
      if (!isUndefined(vals[current])) {
        if (previous) {
          const fraction = vals[previous] % 1;
          vals[previous] -= fraction;
          vals[current] += fraction * matrix[previous][current];
        }
        return current;
      } else {
        return previous;
      }
    }, null);
  }
  function removeZeroes(vals) {
    const newVals = {};
    for (const [key, value] of Object.entries(vals)) {
      if (value !== 0) {
        newVals[key] = value;
      }
    }
    return newVals;
  }
  var Duration = class {
    constructor(config) {
      const accurate = config.conversionAccuracy === "longterm" || false;
      let matrix = accurate ? accurateMatrix : casualMatrix;
      if (config.matrix) {
        matrix = config.matrix;
      }
      this.values = config.values;
      this.loc = config.loc || Locale.create();
      this.conversionAccuracy = accurate ? "longterm" : "casual";
      this.invalid = config.invalid || null;
      this.matrix = matrix;
      this.isLuxonDuration = true;
    }
    static fromMillis(count, opts) {
      return Duration.fromObject({ milliseconds: count }, opts);
    }
    static fromObject(obj, opts = {}) {
      if (obj == null || typeof obj !== "object") {
        throw new InvalidArgumentError(
          `Duration.fromObject: argument expected to be an object, got ${obj === null ? "null" : typeof obj}`
        );
      }
      return new Duration({
        values: normalizeObject(obj, Duration.normalizeUnit),
        loc: Locale.fromObject(opts),
        conversionAccuracy: opts.conversionAccuracy,
        matrix: opts.matrix
      });
    }
    static fromDurationLike(durationLike) {
      if (isNumber(durationLike)) {
        return Duration.fromMillis(durationLike);
      } else if (Duration.isDuration(durationLike)) {
        return durationLike;
      } else if (typeof durationLike === "object") {
        return Duration.fromObject(durationLike);
      } else {
        throw new InvalidArgumentError(
          `Unknown duration argument ${durationLike} of type ${typeof durationLike}`
        );
      }
    }
    static fromISO(text, opts) {
      const [parsed] = parseISODuration(text);
      if (parsed) {
        return Duration.fromObject(parsed, opts);
      } else {
        return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
      }
    }
    static fromISOTime(text, opts) {
      const [parsed] = parseISOTimeOnly(text);
      if (parsed) {
        return Duration.fromObject(parsed, opts);
      } else {
        return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
      }
    }
    static invalid(reason, explanation = null) {
      if (!reason) {
        throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
      }
      const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
      if (Settings.throwOnInvalid) {
        throw new InvalidDurationError(invalid);
      } else {
        return new Duration({ invalid });
      }
    }
    static normalizeUnit(unit) {
      const normalized = {
        year: "years",
        years: "years",
        quarter: "quarters",
        quarters: "quarters",
        month: "months",
        months: "months",
        week: "weeks",
        weeks: "weeks",
        day: "days",
        days: "days",
        hour: "hours",
        hours: "hours",
        minute: "minutes",
        minutes: "minutes",
        second: "seconds",
        seconds: "seconds",
        millisecond: "milliseconds",
        milliseconds: "milliseconds"
      }[unit ? unit.toLowerCase() : unit];
      if (!normalized)
        throw new InvalidUnitError(unit);
      return normalized;
    }
    static isDuration(o2) {
      return o2 && o2.isLuxonDuration || false;
    }
    get locale() {
      return this.isValid ? this.loc.locale : null;
    }
    get numberingSystem() {
      return this.isValid ? this.loc.numberingSystem : null;
    }
    toFormat(fmt, opts = {}) {
      const fmtOpts = {
        ...opts,
        floor: opts.round !== false && opts.floor !== false
      };
      return this.isValid ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt) : INVALID;
    }
    toHuman(opts = {}) {
      if (!this.isValid)
        return INVALID;
      const l3 = orderedUnits.map((unit) => {
        const val = this.values[unit];
        if (isUndefined(val)) {
          return null;
        }
        return this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...opts, unit: unit.slice(0, -1) }).format(val);
      }).filter((n3) => n3);
      return this.loc.listFormatter({ type: "conjunction", style: opts.listStyle || "narrow", ...opts }).format(l3);
    }
    toObject() {
      if (!this.isValid)
        return {};
      return { ...this.values };
    }
    toISO() {
      if (!this.isValid)
        return null;
      let s3 = "P";
      if (this.years !== 0)
        s3 += this.years + "Y";
      if (this.months !== 0 || this.quarters !== 0)
        s3 += this.months + this.quarters * 3 + "M";
      if (this.weeks !== 0)
        s3 += this.weeks + "W";
      if (this.days !== 0)
        s3 += this.days + "D";
      if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0)
        s3 += "T";
      if (this.hours !== 0)
        s3 += this.hours + "H";
      if (this.minutes !== 0)
        s3 += this.minutes + "M";
      if (this.seconds !== 0 || this.milliseconds !== 0)
        s3 += roundTo(this.seconds + this.milliseconds / 1e3, 3) + "S";
      if (s3 === "P")
        s3 += "T0S";
      return s3;
    }
    toISOTime(opts = {}) {
      if (!this.isValid)
        return null;
      const millis = this.toMillis();
      if (millis < 0 || millis >= 864e5)
        return null;
      opts = {
        suppressMilliseconds: false,
        suppressSeconds: false,
        includePrefix: false,
        format: "extended",
        ...opts,
        includeOffset: false
      };
      const dateTime = DateTime.fromMillis(millis, { zone: "UTC" });
      return dateTime.toISOTime(opts);
    }
    toJSON() {
      return this.toISO();
    }
    toString() {
      return this.toISO();
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      if (this.isValid) {
        return `Duration { values: ${JSON.stringify(this.values)} }`;
      } else {
        return `Duration { Invalid, reason: ${this.invalidReason} }`;
      }
    }
    toMillis() {
      if (!this.isValid)
        return NaN;
      return durationToMillis(this.matrix, this.values);
    }
    valueOf() {
      return this.toMillis();
    }
    plus(duration2) {
      if (!this.isValid)
        return this;
      const dur = Duration.fromDurationLike(duration2), result = {};
      for (const k2 of orderedUnits) {
        if (hasOwnProperty(dur.values, k2) || hasOwnProperty(this.values, k2)) {
          result[k2] = dur.get(k2) + this.get(k2);
        }
      }
      return clone(this, { values: result }, true);
    }
    minus(duration2) {
      if (!this.isValid)
        return this;
      const dur = Duration.fromDurationLike(duration2);
      return this.plus(dur.negate());
    }
    mapUnits(fn2) {
      if (!this.isValid)
        return this;
      const result = {};
      for (const k2 of Object.keys(this.values)) {
        result[k2] = asNumber(fn2(this.values[k2], k2));
      }
      return clone(this, { values: result }, true);
    }
    get(unit) {
      return this[Duration.normalizeUnit(unit)];
    }
    set(values) {
      if (!this.isValid)
        return this;
      const mixed = { ...this.values, ...normalizeObject(values, Duration.normalizeUnit) };
      return clone(this, { values: mixed });
    }
    reconfigure({ locale, numberingSystem, conversionAccuracy, matrix } = {}) {
      const loc = this.loc.clone({ locale, numberingSystem });
      const opts = { loc, matrix, conversionAccuracy };
      return clone(this, opts);
    }
    as(unit) {
      return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
    }
    normalize() {
      if (!this.isValid)
        return this;
      const vals = this.toObject();
      normalizeValues(this.matrix, vals);
      return clone(this, { values: vals }, true);
    }
    rescale() {
      if (!this.isValid)
        return this;
      const vals = removeZeroes(this.normalize().shiftToAll().toObject());
      return clone(this, { values: vals }, true);
    }
    shiftTo(...units) {
      if (!this.isValid)
        return this;
      if (units.length === 0) {
        return this;
      }
      units = units.map((u2) => Duration.normalizeUnit(u2));
      const built = {}, accumulated = {}, vals = this.toObject();
      let lastUnit;
      for (const k2 of orderedUnits) {
        if (units.indexOf(k2) >= 0) {
          lastUnit = k2;
          let own = 0;
          for (const ak in accumulated) {
            own += this.matrix[ak][k2] * accumulated[ak];
            accumulated[ak] = 0;
          }
          if (isNumber(vals[k2])) {
            own += vals[k2];
          }
          const i2 = Math.trunc(own);
          built[k2] = i2;
          accumulated[k2] = (own * 1e3 - i2 * 1e3) / 1e3;
        } else if (isNumber(vals[k2])) {
          accumulated[k2] = vals[k2];
        }
      }
      for (const key in accumulated) {
        if (accumulated[key] !== 0) {
          built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
        }
      }
      normalizeValues(this.matrix, built);
      return clone(this, { values: built }, true);
    }
    shiftToAll() {
      if (!this.isValid)
        return this;
      return this.shiftTo(
        "years",
        "months",
        "weeks",
        "days",
        "hours",
        "minutes",
        "seconds",
        "milliseconds"
      );
    }
    negate() {
      if (!this.isValid)
        return this;
      const negated = {};
      for (const k2 of Object.keys(this.values)) {
        negated[k2] = this.values[k2] === 0 ? 0 : -this.values[k2];
      }
      return clone(this, { values: negated }, true);
    }
    get years() {
      return this.isValid ? this.values.years || 0 : NaN;
    }
    get quarters() {
      return this.isValid ? this.values.quarters || 0 : NaN;
    }
    get months() {
      return this.isValid ? this.values.months || 0 : NaN;
    }
    get weeks() {
      return this.isValid ? this.values.weeks || 0 : NaN;
    }
    get days() {
      return this.isValid ? this.values.days || 0 : NaN;
    }
    get hours() {
      return this.isValid ? this.values.hours || 0 : NaN;
    }
    get minutes() {
      return this.isValid ? this.values.minutes || 0 : NaN;
    }
    get seconds() {
      return this.isValid ? this.values.seconds || 0 : NaN;
    }
    get milliseconds() {
      return this.isValid ? this.values.milliseconds || 0 : NaN;
    }
    get isValid() {
      return this.invalid === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    equals(other) {
      if (!this.isValid || !other.isValid) {
        return false;
      }
      if (!this.loc.equals(other.loc)) {
        return false;
      }
      function eq(v1, v2) {
        if (v1 === void 0 || v1 === 0)
          return v2 === void 0 || v2 === 0;
        return v1 === v2;
      }
      for (const u2 of orderedUnits) {
        if (!eq(this.values[u2], other.values[u2])) {
          return false;
        }
      }
      return true;
    }
  };

  // node_modules/luxon/src/interval.js
  var INVALID2 = "Invalid Interval";
  function validateStartEnd(start, end) {
    if (!start || !start.isValid) {
      return Interval.invalid("missing or invalid start");
    } else if (!end || !end.isValid) {
      return Interval.invalid("missing or invalid end");
    } else if (end < start) {
      return Interval.invalid(
        "end before start",
        `The end of an interval must be after its start, but you had start=${start.toISO()} and end=${end.toISO()}`
      );
    } else {
      return null;
    }
  }
  var Interval = class {
    constructor(config) {
      this.s = config.start;
      this.e = config.end;
      this.invalid = config.invalid || null;
      this.isLuxonInterval = true;
    }
    static invalid(reason, explanation = null) {
      if (!reason) {
        throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
      }
      const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
      if (Settings.throwOnInvalid) {
        throw new InvalidIntervalError(invalid);
      } else {
        return new Interval({ invalid });
      }
    }
    static fromDateTimes(start, end) {
      const builtStart = friendlyDateTime(start), builtEnd = friendlyDateTime(end);
      const validateError = validateStartEnd(builtStart, builtEnd);
      if (validateError == null) {
        return new Interval({
          start: builtStart,
          end: builtEnd
        });
      } else {
        return validateError;
      }
    }
    static after(start, duration2) {
      const dur = Duration.fromDurationLike(duration2), dt2 = friendlyDateTime(start);
      return Interval.fromDateTimes(dt2, dt2.plus(dur));
    }
    static before(end, duration2) {
      const dur = Duration.fromDurationLike(duration2), dt2 = friendlyDateTime(end);
      return Interval.fromDateTimes(dt2.minus(dur), dt2);
    }
    static fromISO(text, opts) {
      const [s3, e5] = (text || "").split("/", 2);
      if (s3 && e5) {
        let start, startIsValid;
        try {
          start = DateTime.fromISO(s3, opts);
          startIsValid = start.isValid;
        } catch (e6) {
          startIsValid = false;
        }
        let end, endIsValid;
        try {
          end = DateTime.fromISO(e5, opts);
          endIsValid = end.isValid;
        } catch (e6) {
          endIsValid = false;
        }
        if (startIsValid && endIsValid) {
          return Interval.fromDateTimes(start, end);
        }
        if (startIsValid) {
          const dur = Duration.fromISO(e5, opts);
          if (dur.isValid) {
            return Interval.after(start, dur);
          }
        } else if (endIsValid) {
          const dur = Duration.fromISO(s3, opts);
          if (dur.isValid) {
            return Interval.before(end, dur);
          }
        }
      }
      return Interval.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
    static isInterval(o2) {
      return o2 && o2.isLuxonInterval || false;
    }
    get start() {
      return this.isValid ? this.s : null;
    }
    get end() {
      return this.isValid ? this.e : null;
    }
    get isValid() {
      return this.invalidReason === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    length(unit = "milliseconds") {
      return this.isValid ? this.toDuration(...[unit]).get(unit) : NaN;
    }
    count(unit = "milliseconds", opts) {
      if (!this.isValid)
        return NaN;
      const start = this.start.startOf(unit, opts);
      let end;
      if (opts?.useLocaleWeeks) {
        end = this.end.reconfigure({ locale: start.locale });
      } else {
        end = this.end;
      }
      end = end.startOf(unit, opts);
      return Math.floor(end.diff(start, unit).get(unit)) + (end.valueOf() !== this.end.valueOf());
    }
    hasSame(unit) {
      return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
    }
    isEmpty() {
      return this.s.valueOf() === this.e.valueOf();
    }
    isAfter(dateTime) {
      if (!this.isValid)
        return false;
      return this.s > dateTime;
    }
    isBefore(dateTime) {
      if (!this.isValid)
        return false;
      return this.e <= dateTime;
    }
    contains(dateTime) {
      if (!this.isValid)
        return false;
      return this.s <= dateTime && this.e > dateTime;
    }
    set({ start, end } = {}) {
      if (!this.isValid)
        return this;
      return Interval.fromDateTimes(start || this.s, end || this.e);
    }
    splitAt(...dateTimes) {
      if (!this.isValid)
        return [];
      const sorted = dateTimes.map(friendlyDateTime).filter((d2) => this.contains(d2)).sort((a2, b2) => a2.toMillis() - b2.toMillis()), results = [];
      let { s: s3 } = this, i2 = 0;
      while (s3 < this.e) {
        const added = sorted[i2] || this.e, next = +added > +this.e ? this.e : added;
        results.push(Interval.fromDateTimes(s3, next));
        s3 = next;
        i2 += 1;
      }
      return results;
    }
    splitBy(duration2) {
      const dur = Duration.fromDurationLike(duration2);
      if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
        return [];
      }
      let { s: s3 } = this, idx = 1, next;
      const results = [];
      while (s3 < this.e) {
        const added = this.start.plus(dur.mapUnits((x2) => x2 * idx));
        next = +added > +this.e ? this.e : added;
        results.push(Interval.fromDateTimes(s3, next));
        s3 = next;
        idx += 1;
      }
      return results;
    }
    divideEqually(numberOfParts) {
      if (!this.isValid)
        return [];
      return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
    }
    overlaps(other) {
      return this.e > other.s && this.s < other.e;
    }
    abutsStart(other) {
      if (!this.isValid)
        return false;
      return +this.e === +other.s;
    }
    abutsEnd(other) {
      if (!this.isValid)
        return false;
      return +other.e === +this.s;
    }
    engulfs(other) {
      if (!this.isValid)
        return false;
      return this.s <= other.s && this.e >= other.e;
    }
    equals(other) {
      if (!this.isValid || !other.isValid) {
        return false;
      }
      return this.s.equals(other.s) && this.e.equals(other.e);
    }
    intersection(other) {
      if (!this.isValid)
        return this;
      const s3 = this.s > other.s ? this.s : other.s, e5 = this.e < other.e ? this.e : other.e;
      if (s3 >= e5) {
        return null;
      } else {
        return Interval.fromDateTimes(s3, e5);
      }
    }
    union(other) {
      if (!this.isValid)
        return this;
      const s3 = this.s < other.s ? this.s : other.s, e5 = this.e > other.e ? this.e : other.e;
      return Interval.fromDateTimes(s3, e5);
    }
    static merge(intervals) {
      const [found, final] = intervals.sort((a2, b2) => a2.s - b2.s).reduce(
        ([sofar, current], item) => {
          if (!current) {
            return [sofar, item];
          } else if (current.overlaps(item) || current.abutsStart(item)) {
            return [sofar, current.union(item)];
          } else {
            return [sofar.concat([current]), item];
          }
        },
        [[], null]
      );
      if (final) {
        found.push(final);
      }
      return found;
    }
    static xor(intervals) {
      let start = null, currentCount = 0;
      const results = [], ends = intervals.map((i2) => [
        { time: i2.s, type: "s" },
        { time: i2.e, type: "e" }
      ]), flattened = Array.prototype.concat(...ends), arr = flattened.sort((a2, b2) => a2.time - b2.time);
      for (const i2 of arr) {
        currentCount += i2.type === "s" ? 1 : -1;
        if (currentCount === 1) {
          start = i2.time;
        } else {
          if (start && +start !== +i2.time) {
            results.push(Interval.fromDateTimes(start, i2.time));
          }
          start = null;
        }
      }
      return Interval.merge(results);
    }
    difference(...intervals) {
      return Interval.xor([this].concat(intervals)).map((i2) => this.intersection(i2)).filter((i2) => i2 && !i2.isEmpty());
    }
    toString() {
      if (!this.isValid)
        return INVALID2;
      return `[${this.s.toISO()} \u2013 ${this.e.toISO()})`;
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      if (this.isValid) {
        return `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`;
      } else {
        return `Interval { Invalid, reason: ${this.invalidReason} }`;
      }
    }
    toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
      return this.isValid ? Formatter.create(this.s.loc.clone(opts), formatOpts).formatInterval(this) : INVALID2;
    }
    toISO(opts) {
      if (!this.isValid)
        return INVALID2;
      return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
    }
    toISODate() {
      if (!this.isValid)
        return INVALID2;
      return `${this.s.toISODate()}/${this.e.toISODate()}`;
    }
    toISOTime(opts) {
      if (!this.isValid)
        return INVALID2;
      return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
    }
    toFormat(dateFormat, { separator = " \u2013 " } = {}) {
      if (!this.isValid)
        return INVALID2;
      return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
    }
    toDuration(unit, opts) {
      if (!this.isValid) {
        return Duration.invalid(this.invalidReason);
      }
      return this.e.diff(this.s, unit, opts);
    }
    mapEndpoints(mapFn) {
      return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
    }
  };

  // node_modules/luxon/src/info.js
  var Info = class {
    static hasDST(zone = Settings.defaultZone) {
      const proto = DateTime.now().setZone(zone).set({ month: 12 });
      return !zone.isUniversal && proto.offset !== proto.set({ month: 6 }).offset;
    }
    static isValidIANAZone(zone) {
      return IANAZone.isValidZone(zone);
    }
    static normalizeZone(input) {
      return normalizeZone(input, Settings.defaultZone);
    }
    static getStartOfWeek({ locale = null, locObj = null } = {}) {
      return (locObj || Locale.create(locale)).getStartOfWeek();
    }
    static getMinimumDaysInFirstWeek({ locale = null, locObj = null } = {}) {
      return (locObj || Locale.create(locale)).getMinDaysInFirstWeek();
    }
    static getWeekendWeekdays({ locale = null, locObj = null } = {}) {
      return (locObj || Locale.create(locale)).getWeekendDays().slice();
    }
    static months(length = "long", { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}) {
      return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length);
    }
    static monthsFormat(length = "long", { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}) {
      return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length, true);
    }
    static weekdays(length = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
      return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length);
    }
    static weekdaysFormat(length = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
      return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length, true);
    }
    static meridiems({ locale = null } = {}) {
      return Locale.create(locale).meridiems();
    }
    static eras(length = "short", { locale = null } = {}) {
      return Locale.create(locale, null, "gregory").eras(length);
    }
    static features() {
      return { relative: hasRelative(), localeWeek: hasLocaleWeekInfo() };
    }
  };

  // node_modules/luxon/src/impl/diff.js
  function dayDiff(earlier, later) {
    const utcDayStart = (dt2) => dt2.toUTC(0, { keepLocalTime: true }).startOf("day").valueOf(), ms = utcDayStart(later) - utcDayStart(earlier);
    return Math.floor(Duration.fromMillis(ms).as("days"));
  }
  function highOrderDiffs(cursor, later, units) {
    const differs = [
      ["years", (a2, b2) => b2.year - a2.year],
      ["quarters", (a2, b2) => b2.quarter - a2.quarter + (b2.year - a2.year) * 4],
      ["months", (a2, b2) => b2.month - a2.month + (b2.year - a2.year) * 12],
      [
        "weeks",
        (a2, b2) => {
          const days = dayDiff(a2, b2);
          return (days - days % 7) / 7;
        }
      ],
      ["days", dayDiff]
    ];
    const results = {};
    const earlier = cursor;
    let lowestOrder, highWater;
    for (const [unit, differ] of differs) {
      if (units.indexOf(unit) >= 0) {
        lowestOrder = unit;
        results[unit] = differ(cursor, later);
        highWater = earlier.plus(results);
        if (highWater > later) {
          results[unit]--;
          cursor = earlier.plus(results);
          if (cursor > later) {
            highWater = cursor;
            results[unit]--;
            cursor = earlier.plus(results);
          }
        } else {
          cursor = highWater;
        }
      }
    }
    return [cursor, results, highWater, lowestOrder];
  }
  function diff_default(earlier, later, units, opts) {
    let [cursor, results, highWater, lowestOrder] = highOrderDiffs(earlier, later, units);
    const remainingMillis = later - cursor;
    const lowerOrderUnits = units.filter(
      (u2) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(u2) >= 0
    );
    if (lowerOrderUnits.length === 0) {
      if (highWater < later) {
        highWater = cursor.plus({ [lowestOrder]: 1 });
      }
      if (highWater !== cursor) {
        results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
      }
    }
    const duration2 = Duration.fromObject(results, opts);
    if (lowerOrderUnits.length > 0) {
      return Duration.fromMillis(remainingMillis, opts).shiftTo(...lowerOrderUnits).plus(duration2);
    } else {
      return duration2;
    }
  }

  // node_modules/luxon/src/impl/digits.js
  var numberingSystems = {
    arab: "[\u0660-\u0669]",
    arabext: "[\u06F0-\u06F9]",
    bali: "[\u1B50-\u1B59]",
    beng: "[\u09E6-\u09EF]",
    deva: "[\u0966-\u096F]",
    fullwide: "[\uFF10-\uFF19]",
    gujr: "[\u0AE6-\u0AEF]",
    hanidec: "[\u3007|\u4E00|\u4E8C|\u4E09|\u56DB|\u4E94|\u516D|\u4E03|\u516B|\u4E5D]",
    khmr: "[\u17E0-\u17E9]",
    knda: "[\u0CE6-\u0CEF]",
    laoo: "[\u0ED0-\u0ED9]",
    limb: "[\u1946-\u194F]",
    mlym: "[\u0D66-\u0D6F]",
    mong: "[\u1810-\u1819]",
    mymr: "[\u1040-\u1049]",
    orya: "[\u0B66-\u0B6F]",
    tamldec: "[\u0BE6-\u0BEF]",
    telu: "[\u0C66-\u0C6F]",
    thai: "[\u0E50-\u0E59]",
    tibt: "[\u0F20-\u0F29]",
    latn: "\\d"
  };
  var numberingSystemsUTF16 = {
    arab: [1632, 1641],
    arabext: [1776, 1785],
    bali: [6992, 7001],
    beng: [2534, 2543],
    deva: [2406, 2415],
    fullwide: [65296, 65303],
    gujr: [2790, 2799],
    khmr: [6112, 6121],
    knda: [3302, 3311],
    laoo: [3792, 3801],
    limb: [6470, 6479],
    mlym: [3430, 3439],
    mong: [6160, 6169],
    mymr: [4160, 4169],
    orya: [2918, 2927],
    tamldec: [3046, 3055],
    telu: [3174, 3183],
    thai: [3664, 3673],
    tibt: [3872, 3881]
  };
  var hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");
  function parseDigits(str) {
    let value = parseInt(str, 10);
    if (isNaN(value)) {
      value = "";
      for (let i2 = 0; i2 < str.length; i2++) {
        const code = str.charCodeAt(i2);
        if (str[i2].search(numberingSystems.hanidec) !== -1) {
          value += hanidecChars.indexOf(str[i2]);
        } else {
          for (const key in numberingSystemsUTF16) {
            const [min, max] = numberingSystemsUTF16[key];
            if (code >= min && code <= max) {
              value += code - min;
            }
          }
        }
      }
      return parseInt(value, 10);
    } else {
      return value;
    }
  }
  function digitRegex({ numberingSystem }, append = "") {
    return new RegExp(`${numberingSystems[numberingSystem || "latn"]}${append}`);
  }

  // node_modules/luxon/src/impl/tokenParser.js
  var MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";
  function intUnit(regex, post = (i2) => i2) {
    return { regex, deser: ([s3]) => post(parseDigits(s3)) };
  }
  var NBSP = String.fromCharCode(160);
  var spaceOrNBSP = `[ ${NBSP}]`;
  var spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");
  function fixListRegex(s3) {
    return s3.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
  }
  function stripInsensitivities(s3) {
    return s3.replace(/\./g, "").replace(spaceOrNBSPRegExp, " ").toLowerCase();
  }
  function oneOf(strings, startIndex) {
    if (strings === null) {
      return null;
    } else {
      return {
        regex: RegExp(strings.map(fixListRegex).join("|")),
        deser: ([s3]) => strings.findIndex((i2) => stripInsensitivities(s3) === stripInsensitivities(i2)) + startIndex
      };
    }
  }
  function offset(regex, groups) {
    return { regex, deser: ([, h2, m2]) => signedOffset(h2, m2), groups };
  }
  function simple(regex) {
    return { regex, deser: ([s3]) => s3 };
  }
  function escapeToken(value) {
    return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }
  function unitForToken(token, loc) {
    const one = digitRegex(loc), two = digitRegex(loc, "{2}"), three = digitRegex(loc, "{3}"), four = digitRegex(loc, "{4}"), six = digitRegex(loc, "{6}"), oneOrTwo = digitRegex(loc, "{1,2}"), oneToThree = digitRegex(loc, "{1,3}"), oneToSix = digitRegex(loc, "{1,6}"), oneToNine = digitRegex(loc, "{1,9}"), twoToFour = digitRegex(loc, "{2,4}"), fourToSix = digitRegex(loc, "{4,6}"), literal = (t2) => ({ regex: RegExp(escapeToken(t2.val)), deser: ([s3]) => s3, literal: true }), unitate = (t2) => {
      if (token.literal) {
        return literal(t2);
      }
      switch (t2.val) {
        case "G":
          return oneOf(loc.eras("short"), 0);
        case "GG":
          return oneOf(loc.eras("long"), 0);
        case "y":
          return intUnit(oneToSix);
        case "yy":
          return intUnit(twoToFour, untruncateYear);
        case "yyyy":
          return intUnit(four);
        case "yyyyy":
          return intUnit(fourToSix);
        case "yyyyyy":
          return intUnit(six);
        case "M":
          return intUnit(oneOrTwo);
        case "MM":
          return intUnit(two);
        case "MMM":
          return oneOf(loc.months("short", true), 1);
        case "MMMM":
          return oneOf(loc.months("long", true), 1);
        case "L":
          return intUnit(oneOrTwo);
        case "LL":
          return intUnit(two);
        case "LLL":
          return oneOf(loc.months("short", false), 1);
        case "LLLL":
          return oneOf(loc.months("long", false), 1);
        case "d":
          return intUnit(oneOrTwo);
        case "dd":
          return intUnit(two);
        case "o":
          return intUnit(oneToThree);
        case "ooo":
          return intUnit(three);
        case "HH":
          return intUnit(two);
        case "H":
          return intUnit(oneOrTwo);
        case "hh":
          return intUnit(two);
        case "h":
          return intUnit(oneOrTwo);
        case "mm":
          return intUnit(two);
        case "m":
          return intUnit(oneOrTwo);
        case "q":
          return intUnit(oneOrTwo);
        case "qq":
          return intUnit(two);
        case "s":
          return intUnit(oneOrTwo);
        case "ss":
          return intUnit(two);
        case "S":
          return intUnit(oneToThree);
        case "SSS":
          return intUnit(three);
        case "u":
          return simple(oneToNine);
        case "uu":
          return simple(oneOrTwo);
        case "uuu":
          return intUnit(one);
        case "a":
          return oneOf(loc.meridiems(), 0);
        case "kkkk":
          return intUnit(four);
        case "kk":
          return intUnit(twoToFour, untruncateYear);
        case "W":
          return intUnit(oneOrTwo);
        case "WW":
          return intUnit(two);
        case "E":
        case "c":
          return intUnit(one);
        case "EEE":
          return oneOf(loc.weekdays("short", false), 1);
        case "EEEE":
          return oneOf(loc.weekdays("long", false), 1);
        case "ccc":
          return oneOf(loc.weekdays("short", true), 1);
        case "cccc":
          return oneOf(loc.weekdays("long", true), 1);
        case "Z":
        case "ZZ":
          return offset(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
        case "ZZZ":
          return offset(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
        case "z":
          return simple(/[a-z_+-/]{1,256}?/i);
        case " ":
          return simple(/[^\S\n\r]/);
        default:
          return literal(t2);
      }
    };
    const unit = unitate(token) || {
      invalidReason: MISSING_FTP
    };
    unit.token = token;
    return unit;
  }
  var partTypeStyleToTokenVal = {
    year: {
      "2-digit": "yy",
      numeric: "yyyyy"
    },
    month: {
      numeric: "M",
      "2-digit": "MM",
      short: "MMM",
      long: "MMMM"
    },
    day: {
      numeric: "d",
      "2-digit": "dd"
    },
    weekday: {
      short: "EEE",
      long: "EEEE"
    },
    dayperiod: "a",
    dayPeriod: "a",
    hour12: {
      numeric: "h",
      "2-digit": "hh"
    },
    hour24: {
      numeric: "H",
      "2-digit": "HH"
    },
    minute: {
      numeric: "m",
      "2-digit": "mm"
    },
    second: {
      numeric: "s",
      "2-digit": "ss"
    },
    timeZoneName: {
      long: "ZZZZZ",
      short: "ZZZ"
    }
  };
  function tokenForPart(part, formatOpts, resolvedOpts) {
    const { type, value } = part;
    if (type === "literal") {
      const isSpace = /^\s+$/.test(value);
      return {
        literal: !isSpace,
        val: isSpace ? " " : value
      };
    }
    const style = formatOpts[type];
    let actualType = type;
    if (type === "hour") {
      if (formatOpts.hour12 != null) {
        actualType = formatOpts.hour12 ? "hour12" : "hour24";
      } else if (formatOpts.hourCycle != null) {
        if (formatOpts.hourCycle === "h11" || formatOpts.hourCycle === "h12") {
          actualType = "hour12";
        } else {
          actualType = "hour24";
        }
      } else {
        actualType = resolvedOpts.hour12 ? "hour12" : "hour24";
      }
    }
    let val = partTypeStyleToTokenVal[actualType];
    if (typeof val === "object") {
      val = val[style];
    }
    if (val) {
      return {
        literal: false,
        val
      };
    }
    return void 0;
  }
  function buildRegex(units) {
    const re2 = units.map((u2) => u2.regex).reduce((f2, r2) => `${f2}(${r2.source})`, "");
    return [`^${re2}$`, units];
  }
  function match(input, regex, handlers) {
    const matches = input.match(regex);
    if (matches) {
      const all = {};
      let matchIndex = 1;
      for (const i2 in handlers) {
        if (hasOwnProperty(handlers, i2)) {
          const h2 = handlers[i2], groups = h2.groups ? h2.groups + 1 : 1;
          if (!h2.literal && h2.token) {
            all[h2.token.val[0]] = h2.deser(matches.slice(matchIndex, matchIndex + groups));
          }
          matchIndex += groups;
        }
      }
      return [matches, all];
    } else {
      return [matches, {}];
    }
  }
  function dateTimeFromMatches(matches) {
    const toField = (token) => {
      switch (token) {
        case "S":
          return "millisecond";
        case "s":
          return "second";
        case "m":
          return "minute";
        case "h":
        case "H":
          return "hour";
        case "d":
          return "day";
        case "o":
          return "ordinal";
        case "L":
        case "M":
          return "month";
        case "y":
          return "year";
        case "E":
        case "c":
          return "weekday";
        case "W":
          return "weekNumber";
        case "k":
          return "weekYear";
        case "q":
          return "quarter";
        default:
          return null;
      }
    };
    let zone = null;
    let specificOffset;
    if (!isUndefined(matches.z)) {
      zone = IANAZone.create(matches.z);
    }
    if (!isUndefined(matches.Z)) {
      if (!zone) {
        zone = new FixedOffsetZone(matches.Z);
      }
      specificOffset = matches.Z;
    }
    if (!isUndefined(matches.q)) {
      matches.M = (matches.q - 1) * 3 + 1;
    }
    if (!isUndefined(matches.h)) {
      if (matches.h < 12 && matches.a === 1) {
        matches.h += 12;
      } else if (matches.h === 12 && matches.a === 0) {
        matches.h = 0;
      }
    }
    if (matches.G === 0 && matches.y) {
      matches.y = -matches.y;
    }
    if (!isUndefined(matches.u)) {
      matches.S = parseMillis(matches.u);
    }
    const vals = Object.keys(matches).reduce((r2, k2) => {
      const f2 = toField(k2);
      if (f2) {
        r2[f2] = matches[k2];
      }
      return r2;
    }, {});
    return [vals, zone, specificOffset];
  }
  var dummyDateTimeCache = null;
  function getDummyDateTime() {
    if (!dummyDateTimeCache) {
      dummyDateTimeCache = DateTime.fromMillis(1555555555555);
    }
    return dummyDateTimeCache;
  }
  function maybeExpandMacroToken(token, locale) {
    if (token.literal) {
      return token;
    }
    const formatOpts = Formatter.macroTokenToFormatOpts(token.val);
    const tokens = formatOptsToTokens(formatOpts, locale);
    if (tokens == null || tokens.includes(void 0)) {
      return token;
    }
    return tokens;
  }
  function expandMacroTokens(tokens, locale) {
    return Array.prototype.concat(...tokens.map((t2) => maybeExpandMacroToken(t2, locale)));
  }
  function explainFromTokens(locale, input, format) {
    const tokens = expandMacroTokens(Formatter.parseFormat(format), locale), units = tokens.map((t2) => unitForToken(t2, locale)), disqualifyingUnit = units.find((t2) => t2.invalidReason);
    if (disqualifyingUnit) {
      return { input, tokens, invalidReason: disqualifyingUnit.invalidReason };
    } else {
      const [regexString, handlers] = buildRegex(units), regex = RegExp(regexString, "i"), [rawMatches, matches] = match(input, regex, handlers), [result, zone, specificOffset] = matches ? dateTimeFromMatches(matches) : [null, null, void 0];
      if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
        throw new ConflictingSpecificationError(
          "Can't include meridiem when specifying 24-hour format"
        );
      }
      return { input, tokens, regex, rawMatches, matches, result, zone, specificOffset };
    }
  }
  function parseFromTokens(locale, input, format) {
    const { result, zone, specificOffset, invalidReason } = explainFromTokens(locale, input, format);
    return [result, zone, specificOffset, invalidReason];
  }
  function formatOptsToTokens(formatOpts, locale) {
    if (!formatOpts) {
      return null;
    }
    const formatter = Formatter.create(locale, formatOpts);
    const df = formatter.dtFormatter(getDummyDateTime());
    const parts = df.formatToParts();
    const resolvedOpts = df.resolvedOptions();
    return parts.map((p2) => tokenForPart(p2, formatOpts, resolvedOpts));
  }

  // node_modules/luxon/src/datetime.js
  var INVALID3 = "Invalid DateTime";
  var MAX_DATE = 864e13;
  function unsupportedZone(zone) {
    return new Invalid("unsupported zone", `the zone "${zone.name}" is not supported`);
  }
  function possiblyCachedWeekData(dt2) {
    if (dt2.weekData === null) {
      dt2.weekData = gregorianToWeek(dt2.c);
    }
    return dt2.weekData;
  }
  function possiblyCachedLocalWeekData(dt2) {
    if (dt2.localWeekData === null) {
      dt2.localWeekData = gregorianToWeek(
        dt2.c,
        dt2.loc.getMinDaysInFirstWeek(),
        dt2.loc.getStartOfWeek()
      );
    }
    return dt2.localWeekData;
  }
  function clone2(inst, alts) {
    const current = {
      ts: inst.ts,
      zone: inst.zone,
      c: inst.c,
      o: inst.o,
      loc: inst.loc,
      invalid: inst.invalid
    };
    return new DateTime({ ...current, ...alts, old: current });
  }
  function fixOffset(localTS, o2, tz) {
    let utcGuess = localTS - o2 * 60 * 1e3;
    const o22 = tz.offset(utcGuess);
    if (o2 === o22) {
      return [utcGuess, o2];
    }
    utcGuess -= (o22 - o2) * 60 * 1e3;
    const o3 = tz.offset(utcGuess);
    if (o22 === o3) {
      return [utcGuess, o22];
    }
    return [localTS - Math.min(o22, o3) * 60 * 1e3, Math.max(o22, o3)];
  }
  function tsToObj(ts2, offset2) {
    ts2 += offset2 * 60 * 1e3;
    const d2 = new Date(ts2);
    return {
      year: d2.getUTCFullYear(),
      month: d2.getUTCMonth() + 1,
      day: d2.getUTCDate(),
      hour: d2.getUTCHours(),
      minute: d2.getUTCMinutes(),
      second: d2.getUTCSeconds(),
      millisecond: d2.getUTCMilliseconds()
    };
  }
  function objToTS(obj, offset2, zone) {
    return fixOffset(objToLocalTS(obj), offset2, zone);
  }
  function adjustTime(inst, dur) {
    const oPre = inst.o, year = inst.c.year + Math.trunc(dur.years), month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3, c2 = {
      ...inst.c,
      year,
      month,
      day: Math.min(inst.c.day, daysInMonth(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
    }, millisToAdd = Duration.fromObject({
      years: dur.years - Math.trunc(dur.years),
      quarters: dur.quarters - Math.trunc(dur.quarters),
      months: dur.months - Math.trunc(dur.months),
      weeks: dur.weeks - Math.trunc(dur.weeks),
      days: dur.days - Math.trunc(dur.days),
      hours: dur.hours,
      minutes: dur.minutes,
      seconds: dur.seconds,
      milliseconds: dur.milliseconds
    }).as("milliseconds"), localTS = objToLocalTS(c2);
    let [ts2, o2] = fixOffset(localTS, oPre, inst.zone);
    if (millisToAdd !== 0) {
      ts2 += millisToAdd;
      o2 = inst.zone.offset(ts2);
    }
    return { ts: ts2, o: o2 };
  }
  function parseDataToDateTime(parsed, parsedZone, opts, format, text, specificOffset) {
    const { setZone, zone } = opts;
    if (parsed && Object.keys(parsed).length !== 0 || parsedZone) {
      const interpretationZone = parsedZone || zone, inst = DateTime.fromObject(parsed, {
        ...opts,
        zone: interpretationZone,
        specificOffset
      });
      return setZone ? inst : inst.setZone(zone);
    } else {
      return DateTime.invalid(
        new Invalid("unparsable", `the input "${text}" can't be parsed as ${format}`)
      );
    }
  }
  function toTechFormat(dt2, format, allowZ = true) {
    return dt2.isValid ? Formatter.create(Locale.create("en-US"), {
      allowZ,
      forceSimple: true
    }).formatDateTimeFromString(dt2, format) : null;
  }
  function toISODate(o2, extended) {
    const longFormat = o2.c.year > 9999 || o2.c.year < 0;
    let c2 = "";
    if (longFormat && o2.c.year >= 0)
      c2 += "+";
    c2 += padStart(o2.c.year, longFormat ? 6 : 4);
    if (extended) {
      c2 += "-";
      c2 += padStart(o2.c.month);
      c2 += "-";
      c2 += padStart(o2.c.day);
    } else {
      c2 += padStart(o2.c.month);
      c2 += padStart(o2.c.day);
    }
    return c2;
  }
  function toISOTime(o2, extended, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone) {
    let c2 = padStart(o2.c.hour);
    if (extended) {
      c2 += ":";
      c2 += padStart(o2.c.minute);
      if (o2.c.millisecond !== 0 || o2.c.second !== 0 || !suppressSeconds) {
        c2 += ":";
      }
    } else {
      c2 += padStart(o2.c.minute);
    }
    if (o2.c.millisecond !== 0 || o2.c.second !== 0 || !suppressSeconds) {
      c2 += padStart(o2.c.second);
      if (o2.c.millisecond !== 0 || !suppressMilliseconds) {
        c2 += ".";
        c2 += padStart(o2.c.millisecond, 3);
      }
    }
    if (includeOffset) {
      if (o2.isOffsetFixed && o2.offset === 0 && !extendedZone) {
        c2 += "Z";
      } else if (o2.o < 0) {
        c2 += "-";
        c2 += padStart(Math.trunc(-o2.o / 60));
        c2 += ":";
        c2 += padStart(Math.trunc(-o2.o % 60));
      } else {
        c2 += "+";
        c2 += padStart(Math.trunc(o2.o / 60));
        c2 += ":";
        c2 += padStart(Math.trunc(o2.o % 60));
      }
    }
    if (extendedZone) {
      c2 += "[" + o2.zone.ianaName + "]";
    }
    return c2;
  }
  var defaultUnitValues = {
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
  var defaultWeekUnitValues = {
    weekNumber: 1,
    weekday: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
  var defaultOrdinalUnitValues = {
    ordinal: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
  var orderedUnits2 = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
  var orderedWeekUnits = [
    "weekYear",
    "weekNumber",
    "weekday",
    "hour",
    "minute",
    "second",
    "millisecond"
  ];
  var orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
  function normalizeUnit(unit) {
    const normalized = {
      year: "year",
      years: "year",
      month: "month",
      months: "month",
      day: "day",
      days: "day",
      hour: "hour",
      hours: "hour",
      minute: "minute",
      minutes: "minute",
      quarter: "quarter",
      quarters: "quarter",
      second: "second",
      seconds: "second",
      millisecond: "millisecond",
      milliseconds: "millisecond",
      weekday: "weekday",
      weekdays: "weekday",
      weeknumber: "weekNumber",
      weeksnumber: "weekNumber",
      weeknumbers: "weekNumber",
      weekyear: "weekYear",
      weekyears: "weekYear",
      ordinal: "ordinal"
    }[unit.toLowerCase()];
    if (!normalized)
      throw new InvalidUnitError(unit);
    return normalized;
  }
  function normalizeUnitWithLocalWeeks(unit) {
    switch (unit.toLowerCase()) {
      case "localweekday":
      case "localweekdays":
        return "localWeekday";
      case "localweeknumber":
      case "localweeknumbers":
        return "localWeekNumber";
      case "localweekyear":
      case "localweekyears":
        return "localWeekYear";
      default:
        return normalizeUnit(unit);
    }
  }
  function quickDT(obj, opts) {
    const zone = normalizeZone(opts.zone, Settings.defaultZone), loc = Locale.fromObject(opts), tsNow = Settings.now();
    let ts2, o2;
    if (!isUndefined(obj.year)) {
      for (const u2 of orderedUnits2) {
        if (isUndefined(obj[u2])) {
          obj[u2] = defaultUnitValues[u2];
        }
      }
      const invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);
      if (invalid) {
        return DateTime.invalid(invalid);
      }
      const offsetProvis = zone.offset(tsNow);
      [ts2, o2] = objToTS(obj, offsetProvis, zone);
    } else {
      ts2 = tsNow;
    }
    return new DateTime({ ts: ts2, zone, loc, o: o2 });
  }
  function diffRelative(start, end, opts) {
    const round = isUndefined(opts.round) ? true : opts.round, format = (c2, unit) => {
      c2 = roundTo(c2, round || opts.calendary ? 0 : 2, true);
      const formatter = end.loc.clone(opts).relFormatter(opts);
      return formatter.format(c2, unit);
    }, differ = (unit) => {
      if (opts.calendary) {
        if (!end.hasSame(start, unit)) {
          return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
        } else
          return 0;
      } else {
        return end.diff(start, unit).get(unit);
      }
    };
    if (opts.unit) {
      return format(differ(opts.unit), opts.unit);
    }
    for (const unit of opts.units) {
      const count = differ(unit);
      if (Math.abs(count) >= 1) {
        return format(count, unit);
      }
    }
    return format(start > end ? -0 : 0, opts.units[opts.units.length - 1]);
  }
  function lastOpts(argList) {
    let opts = {}, args;
    if (argList.length > 0 && typeof argList[argList.length - 1] === "object") {
      opts = argList[argList.length - 1];
      args = Array.from(argList).slice(0, argList.length - 1);
    } else {
      args = Array.from(argList);
    }
    return [opts, args];
  }
  var DateTime = class {
    constructor(config) {
      const zone = config.zone || Settings.defaultZone;
      let invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) || (!zone.isValid ? unsupportedZone(zone) : null);
      this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;
      let c2 = null, o2 = null;
      if (!invalid) {
        const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);
        if (unchanged) {
          [c2, o2] = [config.old.c, config.old.o];
        } else {
          const ot2 = zone.offset(this.ts);
          c2 = tsToObj(this.ts, ot2);
          invalid = Number.isNaN(c2.year) ? new Invalid("invalid input") : null;
          c2 = invalid ? null : c2;
          o2 = invalid ? null : ot2;
        }
      }
      this._zone = zone;
      this.loc = config.loc || Locale.create();
      this.invalid = invalid;
      this.weekData = null;
      this.localWeekData = null;
      this.c = c2;
      this.o = o2;
      this.isLuxonDateTime = true;
    }
    static now() {
      return new DateTime({});
    }
    static local() {
      const [opts, args] = lastOpts(arguments), [year, month, day, hour, minute, second, millisecond] = args;
      return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
    }
    static utc() {
      const [opts, args] = lastOpts(arguments), [year, month, day, hour, minute, second, millisecond] = args;
      opts.zone = FixedOffsetZone.utcInstance;
      return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
    }
    static fromJSDate(date, options = {}) {
      const ts2 = isDate(date) ? date.valueOf() : NaN;
      if (Number.isNaN(ts2)) {
        return DateTime.invalid("invalid input");
      }
      const zoneToUse = normalizeZone(options.zone, Settings.defaultZone);
      if (!zoneToUse.isValid) {
        return DateTime.invalid(unsupportedZone(zoneToUse));
      }
      return new DateTime({
        ts: ts2,
        zone: zoneToUse,
        loc: Locale.fromObject(options)
      });
    }
    static fromMillis(milliseconds, options = {}) {
      if (!isNumber(milliseconds)) {
        throw new InvalidArgumentError(
          `fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`
        );
      } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
        return DateTime.invalid("Timestamp out of range");
      } else {
        return new DateTime({
          ts: milliseconds,
          zone: normalizeZone(options.zone, Settings.defaultZone),
          loc: Locale.fromObject(options)
        });
      }
    }
    static fromSeconds(seconds, options = {}) {
      if (!isNumber(seconds)) {
        throw new InvalidArgumentError("fromSeconds requires a numerical input");
      } else {
        return new DateTime({
          ts: seconds * 1e3,
          zone: normalizeZone(options.zone, Settings.defaultZone),
          loc: Locale.fromObject(options)
        });
      }
    }
    static fromObject(obj, opts = {}) {
      obj = obj || {};
      const zoneToUse = normalizeZone(opts.zone, Settings.defaultZone);
      if (!zoneToUse.isValid) {
        return DateTime.invalid(unsupportedZone(zoneToUse));
      }
      const loc = Locale.fromObject(opts);
      const normalized = normalizeObject(obj, normalizeUnitWithLocalWeeks);
      const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, loc);
      const tsNow = Settings.now(), offsetProvis = !isUndefined(opts.specificOffset) ? opts.specificOffset : zoneToUse.offset(tsNow), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
      if ((containsGregor || containsOrdinal) && definiteWeekDef) {
        throw new ConflictingSpecificationError(
          "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
        );
      }
      if (containsGregorMD && containsOrdinal) {
        throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
      }
      const useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;
      let units, defaultValues, objNow = tsToObj(tsNow, offsetProvis);
      if (useWeekData) {
        units = orderedWeekUnits;
        defaultValues = defaultWeekUnitValues;
        objNow = gregorianToWeek(objNow, minDaysInFirstWeek, startOfWeek);
      } else if (containsOrdinal) {
        units = orderedOrdinalUnits;
        defaultValues = defaultOrdinalUnitValues;
        objNow = gregorianToOrdinal(objNow);
      } else {
        units = orderedUnits2;
        defaultValues = defaultUnitValues;
      }
      let foundFirst = false;
      for (const u2 of units) {
        const v2 = normalized[u2];
        if (!isUndefined(v2)) {
          foundFirst = true;
        } else if (foundFirst) {
          normalized[u2] = defaultValues[u2];
        } else {
          normalized[u2] = objNow[u2];
        }
      }
      const higherOrderInvalid = useWeekData ? hasInvalidWeekData(normalized, minDaysInFirstWeek, startOfWeek) : containsOrdinal ? hasInvalidOrdinalData(normalized) : hasInvalidGregorianData(normalized), invalid = higherOrderInvalid || hasInvalidTimeData(normalized);
      if (invalid) {
        return DateTime.invalid(invalid);
      }
      const gregorian = useWeekData ? weekToGregorian(normalized, minDaysInFirstWeek, startOfWeek) : containsOrdinal ? ordinalToGregorian(normalized) : normalized, [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse), inst = new DateTime({
        ts: tsFinal,
        zone: zoneToUse,
        o: offsetFinal,
        loc
      });
      if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
        return DateTime.invalid(
          "mismatched weekday",
          `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`
        );
      }
      return inst;
    }
    static fromISO(text, opts = {}) {
      const [vals, parsedZone] = parseISODate(text);
      return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
    }
    static fromRFC2822(text, opts = {}) {
      const [vals, parsedZone] = parseRFC2822Date(text);
      return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
    }
    static fromHTTP(text, opts = {}) {
      const [vals, parsedZone] = parseHTTPDate(text);
      return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
    }
    static fromFormat(text, fmt, opts = {}) {
      if (isUndefined(text) || isUndefined(fmt)) {
        throw new InvalidArgumentError("fromFormat requires an input string and a format");
      }
      const { locale = null, numberingSystem = null } = opts, localeToUse = Locale.fromOpts({
        locale,
        numberingSystem,
        defaultToEN: true
      }), [vals, parsedZone, specificOffset, invalid] = parseFromTokens(localeToUse, text, fmt);
      if (invalid) {
        return DateTime.invalid(invalid);
      } else {
        return parseDataToDateTime(vals, parsedZone, opts, `format ${fmt}`, text, specificOffset);
      }
    }
    static fromString(text, fmt, opts = {}) {
      return DateTime.fromFormat(text, fmt, opts);
    }
    static fromSQL(text, opts = {}) {
      const [vals, parsedZone] = parseSQL(text);
      return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
    }
    static invalid(reason, explanation = null) {
      if (!reason) {
        throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
      }
      const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
      if (Settings.throwOnInvalid) {
        throw new InvalidDateTimeError(invalid);
      } else {
        return new DateTime({ invalid });
      }
    }
    static isDateTime(o2) {
      return o2 && o2.isLuxonDateTime || false;
    }
    static parseFormatForOpts(formatOpts, localeOpts = {}) {
      const tokenList = formatOptsToTokens(formatOpts, Locale.fromObject(localeOpts));
      return !tokenList ? null : tokenList.map((t2) => t2 ? t2.val : null).join("");
    }
    static expandFormat(fmt, localeOpts = {}) {
      const expanded = expandMacroTokens(Formatter.parseFormat(fmt), Locale.fromObject(localeOpts));
      return expanded.map((t2) => t2.val).join("");
    }
    get(unit) {
      return this[unit];
    }
    get isValid() {
      return this.invalid === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    get locale() {
      return this.isValid ? this.loc.locale : null;
    }
    get numberingSystem() {
      return this.isValid ? this.loc.numberingSystem : null;
    }
    get outputCalendar() {
      return this.isValid ? this.loc.outputCalendar : null;
    }
    get zone() {
      return this._zone;
    }
    get zoneName() {
      return this.isValid ? this.zone.name : null;
    }
    get year() {
      return this.isValid ? this.c.year : NaN;
    }
    get quarter() {
      return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
    }
    get month() {
      return this.isValid ? this.c.month : NaN;
    }
    get day() {
      return this.isValid ? this.c.day : NaN;
    }
    get hour() {
      return this.isValid ? this.c.hour : NaN;
    }
    get minute() {
      return this.isValid ? this.c.minute : NaN;
    }
    get second() {
      return this.isValid ? this.c.second : NaN;
    }
    get millisecond() {
      return this.isValid ? this.c.millisecond : NaN;
    }
    get weekYear() {
      return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
    }
    get weekNumber() {
      return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
    }
    get weekday() {
      return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
    }
    get isWeekend() {
      return this.isValid && this.loc.getWeekendDays().includes(this.weekday);
    }
    get localWeekday() {
      return this.isValid ? possiblyCachedLocalWeekData(this).weekday : NaN;
    }
    get localWeekNumber() {
      return this.isValid ? possiblyCachedLocalWeekData(this).weekNumber : NaN;
    }
    get localWeekYear() {
      return this.isValid ? possiblyCachedLocalWeekData(this).weekYear : NaN;
    }
    get ordinal() {
      return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
    }
    get monthShort() {
      return this.isValid ? Info.months("short", { locObj: this.loc })[this.month - 1] : null;
    }
    get monthLong() {
      return this.isValid ? Info.months("long", { locObj: this.loc })[this.month - 1] : null;
    }
    get weekdayShort() {
      return this.isValid ? Info.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
    }
    get weekdayLong() {
      return this.isValid ? Info.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
    }
    get offset() {
      return this.isValid ? +this.o : NaN;
    }
    get offsetNameShort() {
      if (this.isValid) {
        return this.zone.offsetName(this.ts, {
          format: "short",
          locale: this.locale
        });
      } else {
        return null;
      }
    }
    get offsetNameLong() {
      if (this.isValid) {
        return this.zone.offsetName(this.ts, {
          format: "long",
          locale: this.locale
        });
      } else {
        return null;
      }
    }
    get isOffsetFixed() {
      return this.isValid ? this.zone.isUniversal : null;
    }
    get isInDST() {
      if (this.isOffsetFixed) {
        return false;
      } else {
        return this.offset > this.set({ month: 1, day: 1 }).offset || this.offset > this.set({ month: 5 }).offset;
      }
    }
    getPossibleOffsets() {
      if (!this.isValid || this.isOffsetFixed) {
        return [this];
      }
      const dayMs = 864e5;
      const minuteMs = 6e4;
      const localTS = objToLocalTS(this.c);
      const oEarlier = this.zone.offset(localTS - dayMs);
      const oLater = this.zone.offset(localTS + dayMs);
      const o1 = this.zone.offset(localTS - oEarlier * minuteMs);
      const o2 = this.zone.offset(localTS - oLater * minuteMs);
      if (o1 === o2) {
        return [this];
      }
      const ts1 = localTS - o1 * minuteMs;
      const ts2 = localTS - o2 * minuteMs;
      const c1 = tsToObj(ts1, o1);
      const c2 = tsToObj(ts2, o2);
      if (c1.hour === c2.hour && c1.minute === c2.minute && c1.second === c2.second && c1.millisecond === c2.millisecond) {
        return [clone2(this, { ts: ts1 }), clone2(this, { ts: ts2 })];
      }
      return [this];
    }
    get isInLeapYear() {
      return isLeapYear(this.year);
    }
    get daysInMonth() {
      return daysInMonth(this.year, this.month);
    }
    get daysInYear() {
      return this.isValid ? daysInYear(this.year) : NaN;
    }
    get weeksInWeekYear() {
      return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
    }
    get weeksInLocalWeekYear() {
      return this.isValid ? weeksInWeekYear(
        this.localWeekYear,
        this.loc.getMinDaysInFirstWeek(),
        this.loc.getStartOfWeek()
      ) : NaN;
    }
    resolvedLocaleOptions(opts = {}) {
      const { locale, numberingSystem, calendar } = Formatter.create(
        this.loc.clone(opts),
        opts
      ).resolvedOptions(this);
      return { locale, numberingSystem, outputCalendar: calendar };
    }
    toUTC(offset2 = 0, opts = {}) {
      return this.setZone(FixedOffsetZone.instance(offset2), opts);
    }
    toLocal() {
      return this.setZone(Settings.defaultZone);
    }
    setZone(zone, { keepLocalTime = false, keepCalendarTime = false } = {}) {
      zone = normalizeZone(zone, Settings.defaultZone);
      if (zone.equals(this.zone)) {
        return this;
      } else if (!zone.isValid) {
        return DateTime.invalid(unsupportedZone(zone));
      } else {
        let newTS = this.ts;
        if (keepLocalTime || keepCalendarTime) {
          const offsetGuess = zone.offset(this.ts);
          const asObj = this.toObject();
          [newTS] = objToTS(asObj, offsetGuess, zone);
        }
        return clone2(this, { ts: newTS, zone });
      }
    }
    reconfigure({ locale, numberingSystem, outputCalendar } = {}) {
      const loc = this.loc.clone({ locale, numberingSystem, outputCalendar });
      return clone2(this, { loc });
    }
    setLocale(locale) {
      return this.reconfigure({ locale });
    }
    set(values) {
      if (!this.isValid)
        return this;
      const normalized = normalizeObject(values, normalizeUnitWithLocalWeeks);
      const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, this.loc);
      const settingWeekStuff = !isUndefined(normalized.weekYear) || !isUndefined(normalized.weekNumber) || !isUndefined(normalized.weekday), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
      if ((containsGregor || containsOrdinal) && definiteWeekDef) {
        throw new ConflictingSpecificationError(
          "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
        );
      }
      if (containsGregorMD && containsOrdinal) {
        throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
      }
      let mixed;
      if (settingWeekStuff) {
        mixed = weekToGregorian(
          { ...gregorianToWeek(this.c, minDaysInFirstWeek, startOfWeek), ...normalized },
          minDaysInFirstWeek,
          startOfWeek
        );
      } else if (!isUndefined(normalized.ordinal)) {
        mixed = ordinalToGregorian({ ...gregorianToOrdinal(this.c), ...normalized });
      } else {
        mixed = { ...this.toObject(), ...normalized };
        if (isUndefined(normalized.day)) {
          mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
        }
      }
      const [ts2, o2] = objToTS(mixed, this.o, this.zone);
      return clone2(this, { ts: ts2, o: o2 });
    }
    plus(duration2) {
      if (!this.isValid)
        return this;
      const dur = Duration.fromDurationLike(duration2);
      return clone2(this, adjustTime(this, dur));
    }
    minus(duration2) {
      if (!this.isValid)
        return this;
      const dur = Duration.fromDurationLike(duration2).negate();
      return clone2(this, adjustTime(this, dur));
    }
    startOf(unit, { useLocaleWeeks = false } = {}) {
      if (!this.isValid)
        return this;
      const o2 = {}, normalizedUnit = Duration.normalizeUnit(unit);
      switch (normalizedUnit) {
        case "years":
          o2.month = 1;
        case "quarters":
        case "months":
          o2.day = 1;
        case "weeks":
        case "days":
          o2.hour = 0;
        case "hours":
          o2.minute = 0;
        case "minutes":
          o2.second = 0;
        case "seconds":
          o2.millisecond = 0;
          break;
        case "milliseconds":
          break;
      }
      if (normalizedUnit === "weeks") {
        if (useLocaleWeeks) {
          const startOfWeek = this.loc.getStartOfWeek();
          const { weekday } = this;
          if (weekday < startOfWeek) {
            o2.weekNumber = this.weekNumber - 1;
          }
          o2.weekday = startOfWeek;
        } else {
          o2.weekday = 1;
        }
      }
      if (normalizedUnit === "quarters") {
        const q2 = Math.ceil(this.month / 3);
        o2.month = (q2 - 1) * 3 + 1;
      }
      return this.set(o2);
    }
    endOf(unit, opts) {
      return this.isValid ? this.plus({ [unit]: 1 }).startOf(unit, opts).minus(1) : this;
    }
    toFormat(fmt, opts = {}) {
      return this.isValid ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt) : INVALID3;
    }
    toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
      return this.isValid ? Formatter.create(this.loc.clone(opts), formatOpts).formatDateTime(this) : INVALID3;
    }
    toLocaleParts(opts = {}) {
      return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
    }
    toISO({
      format = "extended",
      suppressSeconds = false,
      suppressMilliseconds = false,
      includeOffset = true,
      extendedZone = false
    } = {}) {
      if (!this.isValid) {
        return null;
      }
      const ext = format === "extended";
      let c2 = toISODate(this, ext);
      c2 += "T";
      c2 += toISOTime(this, ext, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone);
      return c2;
    }
    toISODate({ format = "extended" } = {}) {
      if (!this.isValid) {
        return null;
      }
      return toISODate(this, format === "extended");
    }
    toISOWeekDate() {
      return toTechFormat(this, "kkkk-'W'WW-c");
    }
    toISOTime({
      suppressMilliseconds = false,
      suppressSeconds = false,
      includeOffset = true,
      includePrefix = false,
      extendedZone = false,
      format = "extended"
    } = {}) {
      if (!this.isValid) {
        return null;
      }
      let c2 = includePrefix ? "T" : "";
      return c2 + toISOTime(
        this,
        format === "extended",
        suppressSeconds,
        suppressMilliseconds,
        includeOffset,
        extendedZone
      );
    }
    toRFC2822() {
      return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
    }
    toHTTP() {
      return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
    }
    toSQLDate() {
      if (!this.isValid) {
        return null;
      }
      return toISODate(this, true);
    }
    toSQLTime({ includeOffset = true, includeZone = false, includeOffsetSpace = true } = {}) {
      let fmt = "HH:mm:ss.SSS";
      if (includeZone || includeOffset) {
        if (includeOffsetSpace) {
          fmt += " ";
        }
        if (includeZone) {
          fmt += "z";
        } else if (includeOffset) {
          fmt += "ZZ";
        }
      }
      return toTechFormat(this, fmt, true);
    }
    toSQL(opts = {}) {
      if (!this.isValid) {
        return null;
      }
      return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
    }
    toString() {
      return this.isValid ? this.toISO() : INVALID3;
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      if (this.isValid) {
        return `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`;
      } else {
        return `DateTime { Invalid, reason: ${this.invalidReason} }`;
      }
    }
    valueOf() {
      return this.toMillis();
    }
    toMillis() {
      return this.isValid ? this.ts : NaN;
    }
    toSeconds() {
      return this.isValid ? this.ts / 1e3 : NaN;
    }
    toUnixInteger() {
      return this.isValid ? Math.floor(this.ts / 1e3) : NaN;
    }
    toJSON() {
      return this.toISO();
    }
    toBSON() {
      return this.toJSDate();
    }
    toObject(opts = {}) {
      if (!this.isValid)
        return {};
      const base = { ...this.c };
      if (opts.includeConfig) {
        base.outputCalendar = this.outputCalendar;
        base.numberingSystem = this.loc.numberingSystem;
        base.locale = this.loc.locale;
      }
      return base;
    }
    toJSDate() {
      return new Date(this.isValid ? this.ts : NaN);
    }
    diff(otherDateTime, unit = "milliseconds", opts = {}) {
      if (!this.isValid || !otherDateTime.isValid) {
        return Duration.invalid("created by diffing an invalid DateTime");
      }
      const durOpts = { locale: this.locale, numberingSystem: this.numberingSystem, ...opts };
      const units = maybeArray(unit).map(Duration.normalizeUnit), otherIsLater = otherDateTime.valueOf() > this.valueOf(), earlier = otherIsLater ? this : otherDateTime, later = otherIsLater ? otherDateTime : this, diffed = diff_default(earlier, later, units, durOpts);
      return otherIsLater ? diffed.negate() : diffed;
    }
    diffNow(unit = "milliseconds", opts = {}) {
      return this.diff(DateTime.now(), unit, opts);
    }
    until(otherDateTime) {
      return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
    }
    hasSame(otherDateTime, unit, opts) {
      if (!this.isValid)
        return false;
      const inputMs = otherDateTime.valueOf();
      const adjustedToZone = this.setZone(otherDateTime.zone, { keepLocalTime: true });
      return adjustedToZone.startOf(unit, opts) <= inputMs && inputMs <= adjustedToZone.endOf(unit, opts);
    }
    equals(other) {
      return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
    }
    toRelative(options = {}) {
      if (!this.isValid)
        return null;
      const base = options.base || DateTime.fromObject({}, { zone: this.zone }), padding = options.padding ? this < base ? -options.padding : options.padding : 0;
      let units = ["years", "months", "days", "hours", "minutes", "seconds"];
      let unit = options.unit;
      if (Array.isArray(options.unit)) {
        units = options.unit;
        unit = void 0;
      }
      return diffRelative(base, this.plus(padding), {
        ...options,
        numeric: "always",
        units,
        unit
      });
    }
    toRelativeCalendar(options = {}) {
      if (!this.isValid)
        return null;
      return diffRelative(options.base || DateTime.fromObject({}, { zone: this.zone }), this, {
        ...options,
        numeric: "auto",
        units: ["years", "months", "days"],
        calendary: true
      });
    }
    static min(...dateTimes) {
      if (!dateTimes.every(DateTime.isDateTime)) {
        throw new InvalidArgumentError("min requires all arguments be DateTimes");
      }
      return bestBy(dateTimes, (i2) => i2.valueOf(), Math.min);
    }
    static max(...dateTimes) {
      if (!dateTimes.every(DateTime.isDateTime)) {
        throw new InvalidArgumentError("max requires all arguments be DateTimes");
      }
      return bestBy(dateTimes, (i2) => i2.valueOf(), Math.max);
    }
    static fromFormatExplain(text, fmt, options = {}) {
      const { locale = null, numberingSystem = null } = options, localeToUse = Locale.fromOpts({
        locale,
        numberingSystem,
        defaultToEN: true
      });
      return explainFromTokens(localeToUse, text, fmt);
    }
    static fromStringExplain(text, fmt, options = {}) {
      return DateTime.fromFormatExplain(text, fmt, options);
    }
    static get DATE_SHORT() {
      return DATE_SHORT;
    }
    static get DATE_MED() {
      return DATE_MED;
    }
    static get DATE_MED_WITH_WEEKDAY() {
      return DATE_MED_WITH_WEEKDAY;
    }
    static get DATE_FULL() {
      return DATE_FULL;
    }
    static get DATE_HUGE() {
      return DATE_HUGE;
    }
    static get TIME_SIMPLE() {
      return TIME_SIMPLE;
    }
    static get TIME_WITH_SECONDS() {
      return TIME_WITH_SECONDS;
    }
    static get TIME_WITH_SHORT_OFFSET() {
      return TIME_WITH_SHORT_OFFSET;
    }
    static get TIME_WITH_LONG_OFFSET() {
      return TIME_WITH_LONG_OFFSET;
    }
    static get TIME_24_SIMPLE() {
      return TIME_24_SIMPLE;
    }
    static get TIME_24_WITH_SECONDS() {
      return TIME_24_WITH_SECONDS;
    }
    static get TIME_24_WITH_SHORT_OFFSET() {
      return TIME_24_WITH_SHORT_OFFSET;
    }
    static get TIME_24_WITH_LONG_OFFSET() {
      return TIME_24_WITH_LONG_OFFSET;
    }
    static get DATETIME_SHORT() {
      return DATETIME_SHORT;
    }
    static get DATETIME_SHORT_WITH_SECONDS() {
      return DATETIME_SHORT_WITH_SECONDS;
    }
    static get DATETIME_MED() {
      return DATETIME_MED;
    }
    static get DATETIME_MED_WITH_SECONDS() {
      return DATETIME_MED_WITH_SECONDS;
    }
    static get DATETIME_MED_WITH_WEEKDAY() {
      return DATETIME_MED_WITH_WEEKDAY;
    }
    static get DATETIME_FULL() {
      return DATETIME_FULL;
    }
    static get DATETIME_FULL_WITH_SECONDS() {
      return DATETIME_FULL_WITH_SECONDS;
    }
    static get DATETIME_HUGE() {
      return DATETIME_HUGE;
    }
    static get DATETIME_HUGE_WITH_SECONDS() {
      return DATETIME_HUGE_WITH_SECONDS;
    }
  };
  function friendlyDateTime(dateTimeish) {
    if (DateTime.isDateTime(dateTimeish)) {
      return dateTimeish;
    } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
      return DateTime.fromJSDate(dateTimeish);
    } else if (dateTimeish && typeof dateTimeish === "object") {
      return DateTime.fromObject(dateTimeish);
    } else {
      throw new InvalidArgumentError(
        `Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`
      );
    }
  }

  // src/maternityCalc.ts
  var DAYS_IN_PREGNANCY = 280;
  var MS_PER_DAY = 1e3 * 60 * 60 * 24;
  var MaternityCalc = class {
    constructor(edd) {
      this._edd = edd;
    }
    get lmpDate() {
      const eddDate = new Date(this._edd);
      const lmpDate = new Date(
        eddDate.getTime() - DAYS_IN_PREGNANCY * MS_PER_DAY
      );
      return lmpDate;
    }
    get conceptionDate() {
      const lmpDate = new Date(this.lmpDate);
      const conceptionDate = new Date(
        lmpDate.getTime() + 14 * MS_PER_DAY
      );
      return conceptionDate;
    }
    get dayOf() {
      const today = DateTime.local().startOf("day");
      const eddDate = DateTime.fromJSDate(this.lmpDate).startOf("day");
      const diffDays = Math.ceil(today.diff(eddDate, "days").days);
      return diffDays + 1;
    }
    get weekOf() {
      const weeks = Math.floor(this.dayOf / 7);
      return weeks + 1;
    }
    getDayDate(day) {
      const lmpDate = DateTime.fromJSDate(this.lmpDate).startOf("day");
      const dayDate = lmpDate.plus({ days: day - 1 });
      return MaternityCalc.convertToJSDate(dayDate);
    }
    getWeekStartDate(week) {
      const lmpDate = DateTime.fromJSDate(this.lmpDate).startOf("day");
      const weekStartDate = lmpDate.plus({ weeks: week - 1 }).startOf("day");
      return MaternityCalc.convertToJSDate(weekStartDate);
    }
    getWeekEndDate(week) {
      const lmpDate = DateTime.fromJSDate(this.lmpDate).startOf("day");
      const weekEndDate = lmpDate.plus({ weeks: week - 1, days: 6 }).startOf("day");
      return MaternityCalc.convertToJSDate(weekEndDate);
    }
    static createFromLMP(lmp) {
      const lmpDate = DateTime.fromJSDate(lmp);
      let eddDate = lmpDate.plus({ days: 280 });
      const eddJSDate = this.convertToJSDate(eddDate);
      return new MaternityCalc(eddJSDate);
    }
    static convertToJSDate(dateTime) {
      return new Date(`${dateTime.year}-${String(dateTime.month).padStart(2, "0")}-${String(dateTime.day).padStart(2, "0")}`);
    }
    static createFromLMPNaegele(lmp) {
      const lmpDate = DateTime.fromJSDate(lmp);
      const eddDate = lmpDate.plus({ years: 1 }).minus({ months: 3 }).plus({ days: 7 }).startOf("day");
      const eddJSDate = new Date(`${eddDate.year}-${String(eddDate.month).padStart(2, "0")}-${String(eddDate.day).padStart(2, "0")}`);
      return new MaternityCalc(eddJSDate);
    }
  };

  // src/util.ts
  function formatISODate(date) {
    return date.toISOString().split("T")[0];
  }

  // node_modules/@sygnal/sse/dist/page.js
  var __awaiter = function(thisArg, _arguments, P2, generator) {
    function adopt(value) {
      return value instanceof P2 ? value : new P2(function(resolve) {
        resolve(value);
      });
    }
    return new (P2 || (P2 = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e5) {
          reject(e5);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e5) {
          reject(e5);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var Page = class {
    static getQueryParam(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }
    static loadScript(url) {
      const script = document.createElement("script");
      script.src = url;
      document.body.appendChild(script);
    }
    static loadCSS(url) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }
    static loadEngineCSS(cssFileName) {
      let libPath = window.SSE.baseUrl;
      const cssURL = `${libPath}/css/${cssFileName}`;
      this.loadCSS(cssURL);
    }
    static loadStyle(css) {
      const style = document.createElement("style");
      style.innerText = css;
      document.head.appendChild(style);
    }
    static replaceScriptSource(element, newSrc) {
      element.src = newSrc;
    }
    static replaceCSSLink(element, newHref) {
      element.href = newHref;
    }
    static prependToTitle(text) {
      document.title = `${text}${document.title}`;
    }
    static getCurrentScriptUrl() {
      if (document.currentScript) {
        const currentScript = document.currentScript;
        return currentScript.src;
      }
      console.error("document.currentScript is not supported in this browser.");
      return null;
    }
    static getCurrentScriptBaseUrl() {
      const currentScript = document.currentScript;
      if (currentScript) {
        const scriptURL = new URL(currentScript.src);
        const origin = scriptURL.origin;
        const path = scriptURL.pathname.substring(0, scriptURL.pathname.lastIndexOf("/"));
        const baseURL = `${origin}${path}`;
        return baseURL;
      } else {
        console.error("Unable to determine the currently executing script.");
      }
      return void 0;
    }
    static findAncestorWithAttribute(element, attributeName) {
      let currentElement = element;
      while (currentElement) {
        if (currentElement.hasAttribute(attributeName)) {
          return currentElement;
        }
        currentElement = currentElement.parentElement;
      }
      return null;
    }
    static getAncestorAttributeValue(element, attributeName) {
      let currentElement = element;
      while (currentElement) {
        if (currentElement.hasAttribute(attributeName)) {
          return currentElement.getAttribute(attributeName);
        }
        currentElement = currentElement.parentElement;
      }
      return null;
    }
    static hasAncestorWithAttribute(element, attributeName) {
      return this.findAncestorWithAttribute(element, attributeName) !== null;
    }
    static convertToPixels(value, contextElement = document.documentElement) {
      const match2 = value.match(/^(-?\d+\.?\d*)(rem|em|px|vh|vw|%)$/);
      if (!match2)
        throw new Error("Invalid value format");
      const [, amountStr, unit] = match2;
      const amount = parseFloat(amountStr);
      switch (unit) {
        case "px":
          return amount;
        case "rem":
          return amount * parseFloat(getComputedStyle(document.documentElement).fontSize);
        case "em":
          return amount * parseFloat(getComputedStyle(contextElement).fontSize);
        case "vh":
          return amount * window.innerHeight / 100;
        case "vw":
          return amount * window.innerWidth / 100;
        case "%":
          return amount * contextElement.clientWidth / 100;
        default:
          throw new Error("Unsupported unit");
      }
    }
    static getResponseHeader(headerName_1) {
      return __awaiter(this, arguments, void 0, function* (headerName, url = void 0) {
        const headers = yield this.getResponseHeaders(url);
        if (!headers)
          return void 0;
        if (!headers.has(headerName))
          return void 0;
        return headers.get(headerName) || void 0;
      });
    }
    static getResponseHeaders() {
      return __awaiter(this, arguments, void 0, function* (url = void 0) {
        try {
          if (!url) {
            url = window.location.href;
          }
          const response = yield fetch(url, {
            method: "HEAD"
          });
          return response.headers;
        } catch (error) {
          console.error("Error checking reverse proxy header:", error);
        }
        return void 0;
      });
    }
  };

  // node_modules/@sygnal/sse/dist/debug.js
  var DEFAULT_APP_NAME = "Site";
  var Debug = class {
    get persistentDebug() {
      return Boolean(localStorage.getItem(this._localStorageDebugFlag));
    }
    set persistentDebug(active) {
      if (active) {
        localStorage.setItem(this._localStorageDebugFlag, "true");
        console.debug(`${this._appName} debug enabled (persistent).`);
      } else {
        localStorage.removeItem(this._localStorageDebugFlag);
        console.debug(`${this._appName} debug disabled (persistent).`);
      }
    }
    get enabled() {
      var wfuDebugValue = Boolean(localStorage.getItem(this._localStorageDebugFlag));
      wfuDebugValue = wfuDebugValue || this._enabled;
      return wfuDebugValue;
    }
    set enabled(active) {
      this._enabled = active;
    }
    constructor(label, appName = DEFAULT_APP_NAME) {
      this._localStorageDebugFlag = "debug-mode";
      this._appName = DEFAULT_APP_NAME;
      this._enabled = false;
      this._appName = appName;
      this._label = label;
    }
    group(name) {
      if (this.enabled)
        console.group(name);
    }
    groupEnd() {
      if (this.enabled)
        console.groupEnd();
    }
    debug(...args) {
      if (this.enabled)
        console.debug(this._label, ...args);
    }
  };

  // node_modules/js-cookie/dist/js.cookie.mjs
  function assign(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target;
  }
  var defaultConverter = {
    read: function(value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function(value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      );
    }
  };
  function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
      if (typeof document === "undefined") {
        return;
      }
      attributes = assign({}, defaultAttributes, attributes);
      if (typeof attributes.expires === "number") {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }
      name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var stringifiedAttributes = "";
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }
        stringifiedAttributes += "; " + attributeName;
        if (attributes[attributeName] === true) {
          continue;
        }
        stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
      }
      return document.cookie = name + "=" + converter.write(value, name) + stringifiedAttributes;
    }
    function get(name) {
      if (typeof document === "undefined" || arguments.length && !name) {
        return;
      }
      var cookies = document.cookie ? document.cookie.split("; ") : [];
      var jar = {};
      for (var i2 = 0; i2 < cookies.length; i2++) {
        var parts = cookies[i2].split("=");
        var value = parts.slice(1).join("=");
        try {
          var found = decodeURIComponent(parts[0]);
          jar[found] = converter.read(value, found);
          if (name === found) {
            break;
          }
        } catch (e5) {
        }
      }
      return name ? jar[name] : jar;
    }
    return Object.create(
      {
        set,
        get,
        remove: function(name, attributes) {
          set(
            name,
            "",
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function(attributes) {
          return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function(converter2) {
          return init(assign({}, this.converter, converter2), this.attributes);
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    );
  }
  var api = init(defaultConverter, { path: "/" });

  // node_modules/@sygnal/sse/dist/routeDispatcher.js
  var RouteDispatcher = class {
    constructor(SiteClass) {
      this._SiteClass = SiteClass;
    }
    matchRoute(path) {
      for (const route in this.routes) {
        if (route.endsWith("*")) {
          const baseRoute = route.slice(0, -1);
          if (path.startsWith(baseRoute)) {
            return this.routes[route];
          }
        } else if (route === path) {
          return this.routes[route];
        }
      }
      return null;
    }
    setupRoute() {
      const site = new this._SiteClass();
      site.setup();
      const path = window.location.pathname;
      const HandlerClass = this.matchRoute(path);
      if (HandlerClass) {
        const handlerInstance = new HandlerClass();
        handlerInstance.setup();
      } else {
      }
    }
    execRoute() {
      const site = new this._SiteClass();
      site.exec();
      const path = window.location.pathname;
      const HandlerClass = this.matchRoute(path);
      if (HandlerClass) {
        const handlerInstance = new HandlerClass();
        handlerInstance.exec();
      } else {
      }
    }
  };

  // node_modules/@sygnal/sse/dist/index.js
  function initSSE() {
    if (!window.SSE) {
      window.SSE = {};
    }
    window.SSE.baseUrl = Page.getCurrentScriptBaseUrl();
  }

  // src/sa5/logic.ts
  var SA5Logic = class {
    constructor() {
    }
    init() {
      var elements;
      elements = document.querySelectorAll("[wfu-logic-if]");
      elements.forEach((element) => {
        new SA5LogicIf(element).init();
      });
      elements = document.querySelectorAll("[wfu-logic-switch]");
      elements.forEach((element) => {
        new SA5LogicSwitch(element).init();
      });
    }
  };
  var SA5LogicIf = class {
    constructor(elem) {
      this._data = {};
      this._elem = elem;
      this.debug = new Debug("SA5 Logic");
    }
    init() {
      console.log("SA5 logic IF ");
      const dataAttributes = this._elem.attributes;
      for (let i2 = 0; i2 < dataAttributes.length; i2++) {
        const attr = dataAttributes[i2];
        const attrName = attr.name.toLowerCase();
        if (attrName.startsWith("wfu-logic-param-")) {
          const key = attrName.slice("wfu-logic-param-".length);
          this._data[key] = attr.value !== "" ? attr.value : null;
        }
      }
      console.log();
      const descendants = this._elem.querySelectorAll("[wfu-logic-if-display]");
      descendants.forEach((descendant) => {
        const condition = descendant.getAttribute("wfu-logic-if-display");
        const shouldDisplay = this.evaluateCondition(condition, this._data);
        if (shouldDisplay) {
          descendant.style.display = "";
        } else {
          descendant.style.display = "none";
        }
      });
      this._elem.removeAttribute("wfu-preload");
    }
    evaluateCondition(condition, context) {
      try {
        return new Function("with(this) { return " + condition + "; }").call(context);
      } catch (e5) {
        console.error("Error evaluating condition:", condition, e5);
        return false;
      }
    }
  };
  var SA5LogicSwitch = class {
    constructor(elem) {
      this._elem = elem;
      this.debug = new Debug("SA5 Logic");
      this._val = elem.getAttribute("wfu-logic-switch");
    }
    init() {
      console.log("SA5 logic SWITCH ");
      console.log();
      const descendants = this._elem.querySelectorAll("[wfu-logic-switch-case]");
      descendants.forEach((descendant) => {
        const condition = descendant.getAttribute("wfu-logic-switch-case");
        const shouldDisplay = this.evaluateCondition(condition, this._val);
        if (shouldDisplay) {
          descendant.style.display = "";
        } else {
          descendant.style.display = "none";
        }
      });
      this._elem.removeAttribute("wfu-preload");
    }
    evaluateCondition(condition, context) {
      try {
        return condition == context;
      } catch (e5) {
        console.error("Error evaluating condition:", condition, e5);
        return false;
      }
    }
  };

  // src/page/maternityScanCalc.ts
  var QUERY_PARAM_EDD = "edd";
  var MaternityScanCalcPage = class {
    constructor() {
      this._mode = 0 /* Calc */;
      this._edd = null;
    }
    setup() {
      Page.loadStyle(`
            .simplybook-widget-button {
                display: none !important;
            }
            `);
      Page.loadCSS("https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css");
    }
    exec() {
      const currentUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams(currentUrl.search);
      this._fpEDD = esm_default("#edd", {
        mode: "single",
        dateFormat: "Y-m-d"
      });
      this._fpLMP = esm_default("#lmp", {
        mode: "single",
        dateFormat: "Y-m-d"
      });
      if (!this._fpEDD || !this._fpLMP) {
        console.error("Cannot initialize Flatpickr controls");
        return;
      }
      this._mode = 0 /* Calc */;
      const timelineElement = document.getElementById("timeline");
      if (timelineElement) {
        timelineElement.style.display = "none";
      } else {
        console.error("Element with ID 'timeline' not found.");
      }
      new SA5Logic().init();
      const eddValue = searchParams.get(QUERY_PARAM_EDD);
      if (eddValue) {
        const parsedDate = new Date(eddValue);
        if (!isNaN(parsedDate.getTime())) {
          this._mode = 1 /* Display */;
          this._edd = parsedDate;
          this._fpEDD.setDate(parsedDate, true);
        } else {
          console.error("Invalid date format:", eddValue);
        }
      }
      const button = document.getElementById("calc-edd");
      button == null ? void 0 : button.addEventListener("click", () => {
        const lmpInput = document.getElementById("lmp");
        if (lmpInput && lmpInput.value) {
          console.log("calc button clicked");
          const maternityCalc2 = MaternityCalc.createFromLMP(new Date(lmpInput.value));
          const edd = maternityCalc2._edd;
          console.log("calc button clicked", edd);
          const eddDate = new Date(edd);
          const formattedDate = formatISODate(eddDate);
          window.location.href = `${window.location.pathname}?edd=${formattedDate}`;
        }
      });
      const buttonCalc = document.getElementById("calc");
      buttonCalc == null ? void 0 : buttonCalc.addEventListener("click", () => {
        const selectedDate = this._fpEDD.selectedDates[0];
        if (selectedDate) {
          const formattedDate = formatISODate(selectedDate);
          window.location.href = `${window.location.pathname}?edd=${formattedDate}`;
        } else {
          console.error("No date selected.");
        }
      });
      if (this._mode != 1 /* Display */)
        return;
      if (!this._edd) {
        console.error("No EDD set.");
        return;
      }
      const maternityCalc = new MaternityCalc(this._edd);
      const weeks = Math.floor(maternityCalc.dayOf / 7);
      const days = maternityCalc.dayOf % 7;
      const readableDate = this._edd.toLocaleDateString("en-NZ", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      var data = {
        edd: readableDate,
        progress: `${weeks} weeks and ${days} days`
      };
      this.updateDisplayValues(data);
      const maternityWeek = maternityCalc.weekOf;
      this.calculateAndDisplayTimelineWeekDates(
        maternityCalc
      );
      this.updateVisibilityBasedOnWeek(maternityWeek);
      timelineElement.style.display = "block";
    }
    formatDateWithDifference(date) {
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1e3 * 60 * 60 * 24));
      let diffText;
      if (diffDays === 0) {
        diffText = "(today)";
      } else if (diffDays === 1) {
        diffText = "(tomorrow)";
      } else if (diffDays === -1) {
        diffText = "(yesterday)";
      } else if (diffDays > 1) {
        diffText = `(in ${diffDays} days)`;
      } else {
        diffText = `(${Math.abs(diffDays)} days ago)`;
      }
      return `${date.toDateString()} ${diffText}`;
    }
    calculateAndDisplayTimelineWeekDates(calc) {
      const startDateElements = document.querySelectorAll("[week-startdate]");
      startDateElements.forEach((element) => {
        const weekStr = element.getAttribute("week-startdate");
        if (weekStr) {
          const week = parseInt(weekStr);
          if (!isNaN(week)) {
            const calculatedDate = calc.getWeekStartDate(week);
            element.innerText = this.formatDateWithDifference(calculatedDate);
          }
        }
      });
      const endDateElements = document.querySelectorAll("[week-enddate]");
      endDateElements.forEach((element) => {
        const weekStr = element.getAttribute("week-enddate");
        if (weekStr) {
          const week = parseInt(weekStr);
          if (!isNaN(week)) {
            const calculatedDate = calc.getWeekEndDate(week);
            element.innerText = this.formatDateWithDifference(calculatedDate);
          }
        }
      });
    }
    updateVisibilityBasedOnWeek(maternityWeek) {
      const elements = document.querySelectorAll("[min-week], [max-week]");
      elements.forEach((element) => {
        const minWeek = element.getAttribute("min-week");
        const maxWeek = element.getAttribute("max-week");
        const displayRule = element.getAttribute("display-rule") || "current";
        let hide = false;
        switch (displayRule) {
          case "current":
            if (minWeek && maternityWeek < parseInt(minWeek) || maxWeek && maternityWeek > parseInt(maxWeek)) {
              hide = true;
            }
            break;
          case "future":
            if (minWeek && maternityWeek >= parseInt(minWeek)) {
              hide = true;
            }
            break;
          case "past":
            if (maxWeek && maternityWeek <= parseInt(maxWeek)) {
              hide = true;
            }
            break;
        }
        element.style.display = hide ? "none" : "";
        if (hide)
          element.remove();
      });
      const cardGroups = document.querySelectorAll("[card-group]");
      cardGroups.forEach((cardGroup) => {
        const cards = cardGroup.querySelectorAll("[card]");
        if (cards.length === 0) {
          cardGroup.remove();
        }
      });
    }
    updateDisplayValues(data) {
      const elements = document.querySelectorAll("[display-value]");
      elements.forEach((element) => {
        const displayValue = element.getAttribute("display-value");
        if (displayValue && data[displayValue] !== void 0) {
          element.innerText = data[displayValue];
        }
      });
    }
  };

  // src/page/home.ts
  var HomePage = class {
    constructor() {
    }
    setup() {
    }
    exec() {
    }
  };

  // src/page/test-wfu-if.ts
  var TestWfuIfPage = class {
    constructor() {
    }
    setup() {
    }
    exec() {
      console.log("Test Wfu If.");
      new SA5Logic().init();
    }
  };

  // node_modules/posthog-js/dist/module.js
  var e = "undefined" != typeof window ? window : void 0;
  var t = "undefined" != typeof globalThis ? globalThis : e;
  var n2 = Array.prototype;
  var i = n2.forEach;
  var r = n2.indexOf;
  var s2 = null == t ? void 0 : t.navigator;
  var o = null == t ? void 0 : t.document;
  var a = null == t ? void 0 : t.location;
  var u = null == t ? void 0 : t.fetch;
  var l2 = null != t && t.XMLHttpRequest && "withCredentials" in new t.XMLHttpRequest() ? t.XMLHttpRequest : void 0;
  var c = null == t ? void 0 : t.AbortController;
  var d = null == s2 ? void 0 : s2.userAgent;
  var h = null != e ? e : {};
  var f = { DEBUG: false, LIB_VERSION: "1.165.0" };
  var v = Array.isArray;
  var p = Object.prototype;
  var g = p.hasOwnProperty;
  var _ = p.toString;
  var m = v || function(e5) {
    return "[object Array]" === _.call(e5);
  };
  var y = function(e5) {
    return "function" == typeof e5;
  };
  var b = function(e5) {
    return e5 === Object(e5) && !m(e5);
  };
  var k = function(e5) {
    if (b(e5)) {
      for (var t2 in e5)
        if (g.call(e5, t2))
          return false;
      return true;
    }
    return false;
  };
  var w = function(e5) {
    return void 0 === e5;
  };
  var S = function(e5) {
    return "[object String]" == _.call(e5);
  };
  var E = function(e5) {
    return S(e5) && 0 === e5.trim().length;
  };
  var x = function(e5) {
    return null === e5;
  };
  var I = function(e5) {
    return w(e5) || x(e5);
  };
  var F = function(e5) {
    return "[object Number]" == _.call(e5);
  };
  var P = function(e5) {
    return "[object Boolean]" === _.call(e5);
  };
  var R = function(e5) {
    return e5 instanceof FormData;
  };
  var C = "[PostHog.js]";
  var T = { _log: function(t2) {
    if (e && (f.DEBUG || h.POSTHOG_DEBUG) && !w(e.console) && e.console) {
      for (var n3 = ("__rrweb_original__" in e.console[t2]) ? e.console[t2].__rrweb_original__ : e.console[t2], i2 = arguments.length, r2 = new Array(i2 > 1 ? i2 - 1 : 0), s3 = 1; s3 < i2; s3++)
        r2[s3 - 1] = arguments[s3];
      n3.apply(void 0, [C].concat(r2));
    }
  }, info: function() {
    for (var e5 = arguments.length, t2 = new Array(e5), n3 = 0; n3 < e5; n3++)
      t2[n3] = arguments[n3];
    T._log.apply(T, ["log"].concat(t2));
  }, warn: function() {
    for (var e5 = arguments.length, t2 = new Array(e5), n3 = 0; n3 < e5; n3++)
      t2[n3] = arguments[n3];
    T._log.apply(T, ["warn"].concat(t2));
  }, error: function() {
    for (var e5 = arguments.length, t2 = new Array(e5), n3 = 0; n3 < e5; n3++)
      t2[n3] = arguments[n3];
    T._log.apply(T, ["error"].concat(t2));
  }, critical: function() {
    for (var e5, t2 = arguments.length, n3 = new Array(t2), i2 = 0; i2 < t2; i2++)
      n3[i2] = arguments[i2];
    (e5 = console).error.apply(e5, [C].concat(n3));
  }, uninitializedWarning: function(e5) {
    T.error("You must initialize PostHog before calling ".concat(e5));
  } };
  var $ = function(e5, t2, n3) {
    if (e5.config.disable_external_dependency_loading)
      return T.warn("".concat(t2, " was requested but loading of external scripts is disabled.")), n3("Loading of external scripts is disabled");
    var i2 = function() {
      if (!o)
        return n3("document not found");
      var e6 = o.createElement("script");
      e6.type = "text/javascript", e6.src = t2, e6.onload = function(e7) {
        return n3(void 0, e7);
      }, e6.onerror = function(e7) {
        return n3(e7);
      };
      var i3, r2 = o.querySelectorAll("body > script");
      r2.length > 0 ? null === (i3 = r2[0].parentNode) || void 0 === i3 || i3.insertBefore(e6, r2[0]) : o.body.appendChild(e6);
    };
    null != o && o.body ? i2() : null == o || o.addEventListener("DOMContentLoaded", i2);
  };
  function O(e5, t2) {
    var n3 = Object.keys(e5);
    if (Object.getOwnPropertySymbols) {
      var i2 = Object.getOwnPropertySymbols(e5);
      t2 && (i2 = i2.filter(function(t3) {
        return Object.getOwnPropertyDescriptor(e5, t3).enumerable;
      })), n3.push.apply(n3, i2);
    }
    return n3;
  }
  function M(e5) {
    for (var t2 = 1; t2 < arguments.length; t2++) {
      var n3 = null != arguments[t2] ? arguments[t2] : {};
      t2 % 2 ? O(Object(n3), true).forEach(function(t3) {
        q(e5, t3, n3[t3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e5, Object.getOwnPropertyDescriptors(n3)) : O(Object(n3)).forEach(function(t3) {
        Object.defineProperty(e5, t3, Object.getOwnPropertyDescriptor(n3, t3));
      });
    }
    return e5;
  }
  function A(e5) {
    return A = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e6) {
      return typeof e6;
    } : function(e6) {
      return e6 && "function" == typeof Symbol && e6.constructor === Symbol && e6 !== Symbol.prototype ? "symbol" : typeof e6;
    }, A(e5);
  }
  function L(e5, t2) {
    if (!(e5 instanceof t2))
      throw new TypeError("Cannot call a class as a function");
  }
  function D(e5, t2) {
    for (var n3 = 0; n3 < t2.length; n3++) {
      var i2 = t2[n3];
      i2.enumerable = i2.enumerable || false, i2.configurable = true, "value" in i2 && (i2.writable = true), Object.defineProperty(e5, i2.key, i2);
    }
  }
  function N(e5, t2, n3) {
    return t2 && D(e5.prototype, t2), n3 && D(e5, n3), Object.defineProperty(e5, "prototype", { writable: false }), e5;
  }
  function q(e5, t2, n3) {
    return t2 in e5 ? Object.defineProperty(e5, t2, { value: n3, enumerable: true, configurable: true, writable: true }) : e5[t2] = n3, e5;
  }
  function B(e5, t2) {
    if (null == e5)
      return {};
    var n3, i2, r2 = function(e6, t3) {
      if (null == e6)
        return {};
      var n4, i3, r3 = {}, s4 = Object.keys(e6);
      for (i3 = 0; i3 < s4.length; i3++)
        n4 = s4[i3], t3.indexOf(n4) >= 0 || (r3[n4] = e6[n4]);
      return r3;
    }(e5, t2);
    if (Object.getOwnPropertySymbols) {
      var s3 = Object.getOwnPropertySymbols(e5);
      for (i2 = 0; i2 < s3.length; i2++)
        n3 = s3[i2], t2.indexOf(n3) >= 0 || Object.prototype.propertyIsEnumerable.call(e5, n3) && (r2[n3] = e5[n3]);
    }
    return r2;
  }
  function H(e5, t2) {
    return function(e6) {
      if (Array.isArray(e6))
        return e6;
    }(e5) || function(e6, t3) {
      var n3 = null == e6 ? null : "undefined" != typeof Symbol && e6[Symbol.iterator] || e6["@@iterator"];
      if (null == n3)
        return;
      var i2, r2, s3 = [], o2 = true, a2 = false;
      try {
        for (n3 = n3.call(e6); !(o2 = (i2 = n3.next()).done) && (s3.push(i2.value), !t3 || s3.length !== t3); o2 = true)
          ;
      } catch (e7) {
        a2 = true, r2 = e7;
      } finally {
        try {
          o2 || null == n3.return || n3.return();
        } finally {
          if (a2)
            throw r2;
        }
      }
      return s3;
    }(e5, t2) || j(e5, t2) || function() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function U(e5) {
    return function(e6) {
      if (Array.isArray(e6))
        return W(e6);
    }(e5) || function(e6) {
      if ("undefined" != typeof Symbol && null != e6[Symbol.iterator] || null != e6["@@iterator"])
        return Array.from(e6);
    }(e5) || j(e5) || function() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function j(e5, t2) {
    if (e5) {
      if ("string" == typeof e5)
        return W(e5, t2);
      var n3 = Object.prototype.toString.call(e5).slice(8, -1);
      return "Object" === n3 && e5.constructor && (n3 = e5.constructor.name), "Map" === n3 || "Set" === n3 ? Array.from(e5) : "Arguments" === n3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n3) ? W(e5, t2) : void 0;
    }
  }
  function W(e5, t2) {
    (null == t2 || t2 > e5.length) && (t2 = e5.length);
    for (var n3 = 0, i2 = new Array(t2); n3 < t2; n3++)
      i2[n3] = e5[n3];
    return i2;
  }
  function z(e5, t2) {
    var n3 = "undefined" != typeof Symbol && e5[Symbol.iterator] || e5["@@iterator"];
    if (!n3) {
      if (Array.isArray(e5) || (n3 = j(e5)) || t2 && e5 && "number" == typeof e5.length) {
        n3 && (e5 = n3);
        var i2 = 0, r2 = function() {
        };
        return { s: r2, n: function() {
          return i2 >= e5.length ? { done: true } : { done: false, value: e5[i2++] };
        }, e: function(e6) {
          throw e6;
        }, f: r2 };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var s3, o2 = true, a2 = false;
    return { s: function() {
      n3 = n3.call(e5);
    }, n: function() {
      var e6 = n3.next();
      return o2 = e6.done, e6;
    }, e: function(e6) {
      a2 = true, s3 = e6;
    }, f: function() {
      try {
        o2 || null == n3.return || n3.return();
      } finally {
        if (a2)
          throw s3;
      }
    } };
  }
  h.__PosthogExtensions__ = h.__PosthogExtensions__ || {}, h.__PosthogExtensions__.loadExternalDependency = function(e5, t2, n3) {
    var i2 = "/static/".concat(t2, ".js") + "?v=".concat(e5.version);
    if ("toolbar" === t2) {
      var r2 = 3e5, s3 = Math.floor(Date.now() / r2) * r2;
      i2 = "".concat(i2, "?&=").concat(s3);
    }
    var o2 = e5.requestRouter.endpointFor("assets", i2);
    $(e5, o2, n3);
  }, h.__PosthogExtensions__.loadSiteApp = function(e5, t2, n3) {
    var i2 = e5.requestRouter.endpointFor("api", t2);
    $(e5, i2, n3);
  };
  var V = {};
  var G = function(e5) {
    return e5.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
  function Q(e5, t2, n3) {
    if (m(e5)) {
      if (i && e5.forEach === i)
        e5.forEach(t2, n3);
      else if ("length" in e5 && e5.length === +e5.length) {
        for (var r2 = 0, s3 = e5.length; r2 < s3; r2++)
          if (r2 in e5 && t2.call(n3, e5[r2], r2) === V)
            return;
      }
    }
  }
  function J(e5, t2, n3) {
    if (!I(e5)) {
      if (m(e5))
        return Q(e5, t2, n3);
      if (R(e5)) {
        var i2, r2 = z(e5.entries());
        try {
          for (r2.s(); !(i2 = r2.n()).done; ) {
            var s3 = i2.value;
            if (t2.call(n3, s3[1], s3[0]) === V)
              return;
          }
        } catch (e6) {
          r2.e(e6);
        } finally {
          r2.f();
        }
      } else
        for (var o2 in e5)
          if (g.call(e5, o2) && t2.call(n3, e5[o2], o2) === V)
            return;
    }
  }
  var Y = function(e5) {
    for (var t2 = arguments.length, n3 = new Array(t2 > 1 ? t2 - 1 : 0), i2 = 1; i2 < t2; i2++)
      n3[i2 - 1] = arguments[i2];
    return Q(n3, function(t3) {
      for (var n4 in t3)
        void 0 !== t3[n4] && (e5[n4] = t3[n4]);
    }), e5;
  };
  function X(e5, t2) {
    return -1 !== e5.indexOf(t2);
  }
  function K(e5) {
    for (var t2 = Object.keys(e5), n3 = t2.length, i2 = new Array(n3); n3--; )
      i2[n3] = [t2[n3], e5[t2[n3]]];
    return i2;
  }
  var Z = function(e5) {
    try {
      return e5();
    } catch (e6) {
      return;
    }
  };
  var ee = function(e5) {
    return function() {
      try {
        for (var t2 = arguments.length, n3 = new Array(t2), i2 = 0; i2 < t2; i2++)
          n3[i2] = arguments[i2];
        return e5.apply(this, n3);
      } catch (e6) {
        T.critical("Implementation error. Please turn on debug mode and open a ticket on https://app.posthog.com/home#panel=support%3Asupport%3A."), T.critical(e6);
      }
    };
  };
  var te = function(e5) {
    var t2 = {};
    return J(e5, function(e6, n3) {
      S(e6) && e6.length > 0 && (t2[n3] = e6);
    }), t2;
  };
  var ne = function(e5) {
    return e5.replace(/^\$/, "");
  };
  function ie(e5, t2) {
    return n3 = e5, i2 = function(e6) {
      return S(e6) && !x(t2) ? e6.slice(0, t2) : e6;
    }, r2 = /* @__PURE__ */ new Set(), function e6(t3, n4) {
      return t3 !== Object(t3) ? i2 ? i2(t3, n4) : t3 : r2.has(t3) ? void 0 : (r2.add(t3), m(t3) ? (s3 = [], Q(t3, function(t4) {
        s3.push(e6(t4));
      })) : (s3 = {}, J(t3, function(t4, n5) {
        r2.has(t4) || (s3[n5] = e6(t4, n5));
      })), s3);
      var s3;
    }(n3);
    var n3, i2, r2;
  }
  var re;
  var se = function(e5) {
    var t2, n3, i2, r2, s3 = "";
    for (t2 = n3 = 0, i2 = (e5 = (e5 + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")).length, r2 = 0; r2 < i2; r2++) {
      var o2 = e5.charCodeAt(r2), a2 = null;
      o2 < 128 ? n3++ : a2 = o2 > 127 && o2 < 2048 ? String.fromCharCode(o2 >> 6 | 192, 63 & o2 | 128) : String.fromCharCode(o2 >> 12 | 224, o2 >> 6 & 63 | 128, 63 & o2 | 128), x(a2) || (n3 > t2 && (s3 += e5.substring(t2, n3)), s3 += a2, t2 = n3 = r2 + 1);
    }
    return n3 > t2 && (s3 += e5.substring(t2, e5.length)), s3;
  };
  var oe = function() {
    function t2(e5) {
      return e5 && (e5.preventDefault = t2.preventDefault, e5.stopPropagation = t2.stopPropagation), e5;
    }
    return t2.preventDefault = function() {
      this.returnValue = false;
    }, t2.stopPropagation = function() {
      this.cancelBubble = true;
    }, function(n3, i2, r2, s3, o2) {
      if (n3)
        if (n3.addEventListener && !s3)
          n3.addEventListener(i2, r2, !!o2);
        else {
          var a2 = "on" + i2, u2 = n3[a2];
          n3[a2] = function(n4, i3, r3) {
            return function(s4) {
              if (s4 = s4 || t2(null == e ? void 0 : e.event)) {
                var o3, a3 = true;
                y(r3) && (o3 = r3(s4));
                var u3 = i3.call(n4, s4);
                return false !== o3 && false !== u3 || (a3 = false), a3;
              }
            };
          }(n3, r2, u2);
        }
      else
        T.error("No valid element provided to register_event");
    };
  }();
  function ae(e5, t2) {
    for (var n3 = 0; n3 < e5.length; n3++)
      if (t2(e5[n3]))
        return e5[n3];
  }
  !function(e5) {
    e5.GZipJS = "gzip-js", e5.Base64 = "base64";
  }(re || (re = {}));
  var le = "$people_distinct_id";
  var ce = "__alias";
  var de = "__timers";
  var he = "$autocapture_disabled_server_side";
  var fe = "$heatmaps_enabled_server_side";
  var ve = "$exception_capture_enabled_server_side";
  var pe = "$exception_capture_endpoint_suffix";
  var ge = "$web_vitals_enabled_server_side";
  var _e = "$web_vitals_allowed_metrics";
  var me = "$session_recording_enabled_server_side";
  var ye = "$console_log_recording_enabled_server_side";
  var be = "$session_recording_network_payload_capture";
  var ke = "$session_recording_canvas_recording";
  var we = "$replay_sample_rate";
  var Se = "$replay_minimum_duration";
  var Ee = "$sesid";
  var xe = "$session_is_sampled";
  var Ie = "$enabled_feature_flags";
  var Fe = "$early_access_features";
  var Pe = "$stored_person_properties";
  var Re = "$stored_group_properties";
  var Ce = "$surveys";
  var Te = "$surveys_activated";
  var $e = "$flag_call_reported";
  var Oe = "$user_state";
  var Me = "$client_session_props";
  var Ae = "$capture_rate_limit";
  var Le = "$initial_campaign_params";
  var De = "$initial_referrer_info";
  var Ne = "$initial_person_info";
  var qe = "$epp";
  var Be = "__POSTHOG_TOOLBAR__";
  var He = [le, ce, "__cmpns", de, me, fe, Ee, Ie, Oe, Fe, Re, Pe, Ce, $e, Me, Ae, Le, De, qe];
  var Ue = "$active_feature_flags";
  var je = "$override_feature_flags";
  var We = "$feature_flag_payloads";
  var ze = function(e5) {
    var t2, n3 = {}, i2 = z(K(e5 || {}));
    try {
      for (i2.s(); !(t2 = i2.n()).done; ) {
        var r2 = H(t2.value, 2), s3 = r2[0], o2 = r2[1];
        o2 && (n3[s3] = o2);
      }
    } catch (e6) {
      i2.e(e6);
    } finally {
      i2.f();
    }
    return n3;
  };
  var Ve = function() {
    function e5(t2) {
      L(this, e5), this.instance = t2, this._override_warning = false, this.featureFlagEventHandlers = [], this.reloadFeatureFlagsQueued = false, this.reloadFeatureFlagsInAction = false;
    }
    return N(e5, [{ key: "getFlags", value: function() {
      return Object.keys(this.getFlagVariants());
    } }, { key: "getFlagVariants", value: function() {
      var e6 = this.instance.get_property(Ie), t2 = this.instance.get_property(je);
      if (!t2)
        return e6 || {};
      for (var n3 = Y({}, e6), i2 = Object.keys(t2), r2 = 0; r2 < i2.length; r2++)
        n3[i2[r2]] = t2[i2[r2]];
      return this._override_warning || (T.warn(" Overriding feature flags!", { enabledFlags: e6, overriddenFlags: t2, finalFlags: n3 }), this._override_warning = true), n3;
    } }, { key: "getFlagPayloads", value: function() {
      return this.instance.get_property(We) || {};
    } }, { key: "reloadFeatureFlags", value: function() {
      this.reloadFeatureFlagsQueued || (this.reloadFeatureFlagsQueued = true, this._startReloadTimer());
    } }, { key: "setAnonymousDistinctId", value: function(e6) {
      this.$anon_distinct_id = e6;
    } }, { key: "setReloadingPaused", value: function(e6) {
      this.reloadFeatureFlagsInAction = e6;
    } }, { key: "resetRequestQueue", value: function() {
      this.reloadFeatureFlagsQueued = false;
    } }, { key: "_startReloadTimer", value: function() {
      var e6 = this;
      this.reloadFeatureFlagsQueued && !this.reloadFeatureFlagsInAction && setTimeout(function() {
        !e6.reloadFeatureFlagsInAction && e6.reloadFeatureFlagsQueued && (e6.reloadFeatureFlagsQueued = false, e6._reloadFeatureFlagsRequest());
      }, 5);
    } }, { key: "_reloadFeatureFlagsRequest", value: function() {
      var e6 = this;
      if (!this.instance.config.advanced_disable_feature_flags) {
        this.setReloadingPaused(true);
        var t2 = this.instance.config.token, n3 = this.instance.get_property(Pe), i2 = this.instance.get_property(Re), r2 = { token: t2, distinct_id: this.instance.get_distinct_id(), groups: this.instance.getGroups(), $anon_distinct_id: this.$anon_distinct_id, person_properties: n3, group_properties: i2, disable_flags: this.instance.config.advanced_disable_feature_flags || void 0 };
        this.instance._send_request({ method: "POST", url: this.instance.requestRouter.endpointFor("api", "/decide/?v=3"), data: r2, compression: this.instance.config.disable_compression ? void 0 : re.Base64, timeout: this.instance.config.feature_flag_request_timeout_ms, callback: function(t3) {
          var n4;
          e6.setReloadingPaused(false);
          var i3 = true;
          200 === t3.statusCode && (e6.$anon_distinct_id = void 0, i3 = false), e6.receivedFeatureFlags(null !== (n4 = t3.json) && void 0 !== n4 ? n4 : {}, i3), e6._startReloadTimer();
        } });
      }
    } }, { key: "getFeatureFlag", value: function(e6) {
      var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (this.instance.decideEndpointWasHit || this.getFlags() && this.getFlags().length > 0) {
        var n3, i2 = this.getFlagVariants()[e6], r2 = "".concat(i2), s3 = this.instance.get_property($e) || {};
        if (t2.send_event || !("send_event" in t2)) {
          if (!(e6 in s3) || !s3[e6].includes(r2))
            m(s3[e6]) ? s3[e6].push(r2) : s3[e6] = [r2], null === (n3 = this.instance.persistence) || void 0 === n3 || n3.register(q({}, $e, s3)), this.instance.capture("$feature_flag_called", { $feature_flag: e6, $feature_flag_response: i2 });
        }
        return i2;
      }
      T.warn('getFeatureFlag for key "' + e6 + `" failed. Feature flags didn't load in time.`);
    } }, { key: "getFeatureFlagPayload", value: function(e6) {
      return this.getFlagPayloads()[e6];
    } }, { key: "isFeatureEnabled", value: function(e6) {
      var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (this.instance.decideEndpointWasHit || this.getFlags() && this.getFlags().length > 0)
        return !!this.getFeatureFlag(e6, t2);
      T.warn('isFeatureEnabled for key "' + e6 + `" failed. Feature flags didn't load in time.`);
    } }, { key: "addFeatureFlagsHandler", value: function(e6) {
      this.featureFlagEventHandlers.push(e6);
    } }, { key: "removeFeatureFlagsHandler", value: function(e6) {
      this.featureFlagEventHandlers = this.featureFlagEventHandlers.filter(function(t2) {
        return t2 !== e6;
      });
    } }, { key: "receivedFeatureFlags", value: function(e6, t2) {
      if (this.instance.persistence) {
        this.instance.decideEndpointWasHit = true;
        var n3 = this.getFlagVariants(), i2 = this.getFlagPayloads();
        !function(e7, t3) {
          var n4, i3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, s3 = e7.featureFlags, o2 = e7.featureFlagPayloads;
          if (s3)
            if (m(s3)) {
              var a2, u2 = {};
              if (s3)
                for (var l3 = 0; l3 < s3.length; l3++)
                  u2[s3[l3]] = true;
              t3 && t3.register((q(a2 = {}, Ue, s3), q(a2, Ie, u2), a2));
            } else {
              var c2 = s3, d2 = o2;
              e7.errorsWhileComputingFlags && (c2 = M(M({}, i3), c2), d2 = M(M({}, r2), d2)), t3 && t3.register((q(n4 = {}, Ue, Object.keys(ze(c2))), q(n4, Ie, c2 || {}), q(n4, We, d2 || {}), n4));
            }
        }(e6, this.instance.persistence, n3, i2), this._fireFeatureFlagsCallbacks(t2);
      }
    } }, { key: "override", value: function(e6) {
      var t2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      if (!this.instance.__loaded || !this.instance.persistence)
        return T.uninitializedWarning("posthog.feature_flags.override");
      if (this._override_warning = t2, false === e6)
        this.instance.persistence.unregister(je);
      else if (m(e6)) {
        for (var n3 = {}, i2 = 0; i2 < e6.length; i2++)
          n3[e6[i2]] = true;
        this.instance.persistence.register(q({}, je, n3));
      } else
        this.instance.persistence.register(q({}, je, e6));
    } }, { key: "onFeatureFlags", value: function(e6) {
      var t2 = this;
      if (this.addFeatureFlagsHandler(e6), this.instance.decideEndpointWasHit) {
        var n3 = this._prepareFeatureFlagsForCallbacks(), i2 = n3.flags, r2 = n3.flagVariants;
        e6(i2, r2);
      }
      return function() {
        return t2.removeFeatureFlagsHandler(e6);
      };
    } }, { key: "updateEarlyAccessFeatureEnrollment", value: function(e6, t2) {
      var n3, i2, r2 = q({}, "$feature_enrollment/".concat(e6), t2);
      this.instance.capture("$feature_enrollment_update", { $feature_flag: e6, $feature_enrollment: t2, $set: r2 }), this.setPersonPropertiesForFlags(r2, false);
      var s3 = M(M({}, this.getFlagVariants()), {}, q({}, e6, t2));
      null === (n3 = this.instance.persistence) || void 0 === n3 || n3.register((q(i2 = {}, Ue, Object.keys(ze(s3))), q(i2, Ie, s3), i2)), this._fireFeatureFlagsCallbacks();
    } }, { key: "getEarlyAccessFeatures", value: function(e6) {
      var t2 = this, n3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], i2 = this.instance.get_property(Fe);
      if (i2 && !n3)
        return e6(i2);
      this.instance._send_request({ transport: "XHR", url: this.instance.requestRouter.endpointFor("api", "/api/early_access_features/?token=".concat(this.instance.config.token)), method: "GET", callback: function(n4) {
        var i3;
        if (n4.json) {
          var r2 = n4.json.earlyAccessFeatures;
          return null === (i3 = t2.instance.persistence) || void 0 === i3 || i3.register(q({}, Fe, r2)), e6(r2);
        }
      } });
    } }, { key: "_prepareFeatureFlagsForCallbacks", value: function() {
      var e6 = this.getFlags(), t2 = this.getFlagVariants();
      return { flags: e6.filter(function(e7) {
        return t2[e7];
      }), flagVariants: Object.keys(t2).filter(function(e7) {
        return t2[e7];
      }).reduce(function(e7, n3) {
        return e7[n3] = t2[n3], e7;
      }, {}) };
    } }, { key: "_fireFeatureFlagsCallbacks", value: function(e6) {
      var t2 = this._prepareFeatureFlagsForCallbacks(), n3 = t2.flags, i2 = t2.flagVariants;
      this.featureFlagEventHandlers.forEach(function(t3) {
        return t3(n3, i2, { errorsLoading: e6 });
      });
    } }, { key: "setPersonPropertiesForFlags", value: function(e6) {
      var t2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], n3 = this.instance.get_property(Pe) || {};
      this.instance.register(q({}, Pe, M(M({}, n3), e6))), t2 && this.instance.reloadFeatureFlags();
    } }, { key: "resetPersonPropertiesForFlags", value: function() {
      this.instance.unregister(Pe);
    } }, { key: "setGroupPropertiesForFlags", value: function(e6) {
      var t2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], n3 = this.instance.get_property(Re) || {};
      0 !== Object.keys(n3).length && Object.keys(n3).forEach(function(t3) {
        n3[t3] = M(M({}, n3[t3]), e6[t3]), delete e6[t3];
      }), this.instance.register(q({}, Re, M(M({}, n3), e6))), t2 && this.instance.reloadFeatureFlags();
    } }, { key: "resetGroupPropertiesForFlags", value: function(e6) {
      if (e6) {
        var t2 = this.instance.get_property(Re) || {};
        this.instance.register(q({}, Re, M(M({}, t2), {}, q({}, e6, {}))));
      } else
        this.instance.unregister(Re);
    } }]), e5;
  }();
  Math.trunc || (Math.trunc = function(e5) {
    return e5 < 0 ? Math.ceil(e5) : Math.floor(e5);
  }), Number.isInteger || (Number.isInteger = function(e5) {
    return F(e5) && isFinite(e5) && Math.floor(e5) === e5;
  });
  var Ge = "0123456789abcdef";
  var Qe = function() {
    function e5(t2) {
      if (L(this, e5), this.bytes = t2, 16 !== t2.length)
        throw new TypeError("not 128-bit length");
    }
    return N(e5, [{ key: "toString", value: function() {
      for (var e6 = "", t2 = 0; t2 < this.bytes.length; t2++)
        e6 = e6 + Ge.charAt(this.bytes[t2] >>> 4) + Ge.charAt(15 & this.bytes[t2]), 3 !== t2 && 5 !== t2 && 7 !== t2 && 9 !== t2 || (e6 += "-");
      if (36 !== e6.length)
        throw new Error("Invalid UUIDv7 was generated");
      return e6;
    } }, { key: "clone", value: function() {
      return new e5(this.bytes.slice(0));
    } }, { key: "equals", value: function(e6) {
      return 0 === this.compareTo(e6);
    } }, { key: "compareTo", value: function(e6) {
      for (var t2 = 0; t2 < 16; t2++) {
        var n3 = this.bytes[t2] - e6.bytes[t2];
        if (0 !== n3)
          return Math.sign(n3);
      }
      return 0;
    } }], [{ key: "fromFieldsV7", value: function(t2, n3, i2, r2) {
      if (!Number.isInteger(t2) || !Number.isInteger(n3) || !Number.isInteger(i2) || !Number.isInteger(r2) || t2 < 0 || n3 < 0 || i2 < 0 || r2 < 0 || t2 > 281474976710655 || n3 > 4095 || i2 > 1073741823 || r2 > 4294967295)
        throw new RangeError("invalid field value");
      var s3 = new Uint8Array(16);
      return s3[0] = t2 / Math.pow(2, 40), s3[1] = t2 / Math.pow(2, 32), s3[2] = t2 / Math.pow(2, 24), s3[3] = t2 / Math.pow(2, 16), s3[4] = t2 / Math.pow(2, 8), s3[5] = t2, s3[6] = 112 | n3 >>> 8, s3[7] = n3, s3[8] = 128 | i2 >>> 24, s3[9] = i2 >>> 16, s3[10] = i2 >>> 8, s3[11] = i2, s3[12] = r2 >>> 24, s3[13] = r2 >>> 16, s3[14] = r2 >>> 8, s3[15] = r2, new e5(s3);
    } }]), e5;
  }();
  var Je = function() {
    function e5() {
      L(this, e5), q(this, "timestamp", 0), q(this, "counter", 0), q(this, "random", new Ke());
    }
    return N(e5, [{ key: "generate", value: function() {
      var e6 = this.generateOrAbort();
      if (w(e6)) {
        this.timestamp = 0;
        var t2 = this.generateOrAbort();
        if (w(t2))
          throw new Error("Could not generate UUID after timestamp reset");
        return t2;
      }
      return e6;
    } }, { key: "generateOrAbort", value: function() {
      var e6 = Date.now();
      if (e6 > this.timestamp)
        this.timestamp = e6, this.resetCounter();
      else {
        if (!(e6 + 1e4 > this.timestamp))
          return;
        this.counter++, this.counter > 4398046511103 && (this.timestamp++, this.resetCounter());
      }
      return Qe.fromFieldsV7(this.timestamp, Math.trunc(this.counter / Math.pow(2, 30)), this.counter & Math.pow(2, 30) - 1, this.random.nextUint32());
    } }, { key: "resetCounter", value: function() {
      this.counter = 1024 * this.random.nextUint32() + (1023 & this.random.nextUint32());
    } }]), e5;
  }();
  var Ye = function(e5) {
    if ("undefined" != typeof UUIDV7_DENY_WEAK_RNG && UUIDV7_DENY_WEAK_RNG)
      throw new Error("no cryptographically strong RNG available");
    for (var t2 = 0; t2 < e5.length; t2++)
      e5[t2] = 65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random());
    return e5;
  };
  e && !w(e.crypto) && crypto.getRandomValues && (Ye = function(e5) {
    return crypto.getRandomValues(e5);
  });
  var Xe;
  var Ke = function() {
    function e5() {
      L(this, e5), q(this, "buffer", new Uint32Array(8)), q(this, "cursor", 1 / 0);
    }
    return N(e5, [{ key: "nextUint32", value: function() {
      return this.cursor >= this.buffer.length && (Ye(this.buffer), this.cursor = 0), this.buffer[this.cursor++];
    } }]), e5;
  }();
  var Ze = function() {
    return et().toString();
  };
  var et = function() {
    return (Xe || (Xe = new Je())).generate();
  };
  var tt = "Thu, 01 Jan 1970 00:00:00 GMT";
  var nt = "";
  var it = /[a-z0-9][a-z0-9-]+\.[a-z]{2,}$/i;
  function rt(e5, t2) {
    if (t2) {
      var n3 = function(e6) {
        var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o;
        if (nt)
          return nt;
        if (!t3)
          return "";
        if (["localhost", "127.0.0.1"].includes(e6))
          return "";
        for (var n4 = e6.split("."), i3 = Math.min(n4.length, 8), r2 = "dmn_chk_" + Ze(), s3 = new RegExp("(^|;)\\s*" + r2 + "=1"); !nt && i3--; ) {
          var a2 = n4.slice(i3).join("."), u2 = r2 + "=1;domain=." + a2;
          t3.cookie = u2, s3.test(t3.cookie) && (t3.cookie = u2 + ";expires=" + tt, nt = a2);
        }
        return nt;
      }(e5);
      if (!n3) {
        var i2 = function(e6) {
          var t3 = e6.match(it);
          return t3 ? t3[0] : "";
        }(e5);
        i2 !== n3 && T.info("Warning: cookie subdomain discovery mismatch", i2, n3), n3 = i2;
      }
      return n3 ? "; domain=." + n3 : "";
    }
    return "";
  }
  var st;
  var ot = { is_supported: function() {
    return !!o;
  }, error: function(e5) {
    T.error("cookieStore error: " + e5);
  }, get: function(e5) {
    if (o) {
      try {
        for (var t2 = e5 + "=", n3 = o.cookie.split(";").filter(function(e6) {
          return e6.length;
        }), i2 = 0; i2 < n3.length; i2++) {
          for (var r2 = n3[i2]; " " == r2.charAt(0); )
            r2 = r2.substring(1, r2.length);
          if (0 === r2.indexOf(t2))
            return decodeURIComponent(r2.substring(t2.length, r2.length));
        }
      } catch (e6) {
      }
      return null;
    }
  }, parse: function(e5) {
    var t2;
    try {
      t2 = JSON.parse(ot.get(e5)) || {};
    } catch (e6) {
    }
    return t2;
  }, set: function(e5, t2, n3, i2, r2) {
    if (o)
      try {
        var s3 = "", a2 = "", u2 = rt(o.location.hostname, i2);
        if (n3) {
          var l3 = new Date();
          l3.setTime(l3.getTime() + 24 * n3 * 60 * 60 * 1e3), s3 = "; expires=" + l3.toUTCString();
        }
        r2 && (a2 = "; secure");
        var c2 = e5 + "=" + encodeURIComponent(JSON.stringify(t2)) + s3 + "; SameSite=Lax; path=/" + u2 + a2;
        return c2.length > 3686.4 && T.warn("cookieStore warning: large cookie, len=" + c2.length), o.cookie = c2, c2;
      } catch (e6) {
        return;
      }
  }, remove: function(e5, t2) {
    try {
      ot.set(e5, "", -1, t2);
    } catch (e6) {
      return;
    }
  } };
  var at = null;
  var ut = { is_supported: function() {
    if (!x(at))
      return at;
    var t2 = true;
    if (w(e))
      t2 = false;
    else
      try {
        var n3 = "__mplssupport__";
        ut.set(n3, "xyz"), '"xyz"' !== ut.get(n3) && (t2 = false), ut.remove(n3);
      } catch (e5) {
        t2 = false;
      }
    return t2 || T.error("localStorage unsupported; falling back to cookie store"), at = t2, t2;
  }, error: function(e5) {
    T.error("localStorage error: " + e5);
  }, get: function(t2) {
    try {
      return null == e ? void 0 : e.localStorage.getItem(t2);
    } catch (e5) {
      ut.error(e5);
    }
    return null;
  }, parse: function(e5) {
    try {
      return JSON.parse(ut.get(e5)) || {};
    } catch (e6) {
    }
    return null;
  }, set: function(t2, n3) {
    try {
      null == e || e.localStorage.setItem(t2, JSON.stringify(n3));
    } catch (e5) {
      ut.error(e5);
    }
  }, remove: function(t2) {
    try {
      null == e || e.localStorage.removeItem(t2);
    } catch (e5) {
      ut.error(e5);
    }
  } };
  var lt = ["distinct_id", Ee, xe, qe];
  var ct = M(M({}, ut), {}, { parse: function(e5) {
    try {
      var t2 = {};
      try {
        t2 = ot.parse(e5) || {};
      } catch (e6) {
      }
      var n3 = Y(t2, JSON.parse(ut.get(e5) || "{}"));
      return ut.set(e5, n3), n3;
    } catch (e6) {
    }
    return null;
  }, set: function(e5, t2, n3, i2, r2, s3) {
    try {
      ut.set(e5, t2, void 0, void 0, s3);
      var o2 = {};
      lt.forEach(function(e6) {
        t2[e6] && (o2[e6] = t2[e6]);
      }), Object.keys(o2).length && ot.set(e5, o2, n3, i2, r2, s3);
    } catch (e6) {
      ut.error(e6);
    }
  }, remove: function(t2, n3) {
    try {
      null == e || e.localStorage.removeItem(t2), ot.remove(t2, n3);
    } catch (e5) {
      ut.error(e5);
    }
  } });
  var dt = {};
  var ht = { is_supported: function() {
    return true;
  }, error: function(e5) {
    T.error("memoryStorage error: " + e5);
  }, get: function(e5) {
    return dt[e5] || null;
  }, parse: function(e5) {
    return dt[e5] || null;
  }, set: function(e5, t2) {
    dt[e5] = t2;
  }, remove: function(e5) {
    delete dt[e5];
  } };
  var ft = null;
  var vt = { is_supported: function() {
    if (!x(ft))
      return ft;
    if (ft = true, w(e))
      ft = false;
    else
      try {
        var t2 = "__support__";
        vt.set(t2, "xyz"), '"xyz"' !== vt.get(t2) && (ft = false), vt.remove(t2);
      } catch (e5) {
        ft = false;
      }
    return ft;
  }, error: function(e5) {
    T.error("sessionStorage error: ", e5);
  }, get: function(t2) {
    try {
      return null == e ? void 0 : e.sessionStorage.getItem(t2);
    } catch (e5) {
      vt.error(e5);
    }
    return null;
  }, parse: function(e5) {
    try {
      return JSON.parse(vt.get(e5)) || null;
    } catch (e6) {
    }
    return null;
  }, set: function(t2, n3) {
    try {
      null == e || e.sessionStorage.setItem(t2, JSON.stringify(n3));
    } catch (e5) {
      vt.error(e5);
    }
  }, remove: function(t2) {
    try {
      null == e || e.sessionStorage.removeItem(t2);
    } catch (e5) {
      vt.error(e5);
    }
  } };
  var pt = ["localhost", "127.0.0.1"];
  var gt = function(e5) {
    var t2 = null == o ? void 0 : o.createElement("a");
    return w(t2) ? null : (t2.href = e5, t2);
  };
  var _t = function(e5, t2) {
    return !!function(e6) {
      try {
        new RegExp(e6);
      } catch (e7) {
        return false;
      }
      return true;
    }(t2) && new RegExp(t2).test(e5);
  };
  var mt = function(e5) {
    var t2, n3, i2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "&", r2 = [];
    return J(e5, function(e6, i3) {
      w(e6) || w(i3) || "undefined" === i3 || (t2 = encodeURIComponent(function(e7) {
        return e7 instanceof File;
      }(e6) ? e6.name : e6.toString()), n3 = encodeURIComponent(i3), r2[r2.length] = n3 + "=" + t2);
    }), r2.join(i2);
  };
  var yt = function(e5, t2) {
    for (var n3, i2 = ((e5.split("#")[0] || "").split("?")[1] || "").split("&"), r2 = 0; r2 < i2.length; r2++) {
      var s3 = i2[r2].split("=");
      if (s3[0] === t2) {
        n3 = s3;
        break;
      }
    }
    if (!m(n3) || n3.length < 2)
      return "";
    var o2 = n3[1];
    try {
      o2 = decodeURIComponent(o2);
    } catch (e6) {
      T.error("Skipping decoding for malformed query param: " + o2);
    }
    return o2.replace(/\+/g, " ");
  };
  var bt = function(e5, t2) {
    var n3 = e5.match(new RegExp(t2 + "=([^&]*)"));
    return n3 ? n3[1] : null;
  };
  var kt = "Mobile";
  var wt = "iOS";
  var St = "Android";
  var Et = "Tablet";
  var xt = St + " " + Et;
  var It = "iPad";
  var Ft = "Apple";
  var Pt = Ft + " Watch";
  var Rt = "Safari";
  var Ct = "BlackBerry";
  var Tt = "Samsung";
  var $t = Tt + "Browser";
  var Ot = Tt + " Internet";
  var Mt = "Chrome";
  var At = Mt + " OS";
  var Lt = Mt + " " + wt;
  var Dt = "Internet Explorer";
  var Nt = Dt + " " + kt;
  var qt = "Opera";
  var Bt = qt + " Mini";
  var Ht = "Edge";
  var Ut = "Microsoft " + Ht;
  var jt = "Firefox";
  var Wt = jt + " " + wt;
  var zt = "Nintendo";
  var Vt = "PlayStation";
  var Gt = "Xbox";
  var Qt = St + " " + kt;
  var Jt = kt + " " + Rt;
  var Yt = "Windows";
  var Xt = Yt + " Phone";
  var Kt = "Nokia";
  var Zt = "Ouya";
  var en = "Generic";
  var tn = en + " " + kt.toLowerCase();
  var nn = en + " " + Et.toLowerCase();
  var rn = "Konqueror";
  var sn = "(\\d+(\\.\\d+)?)";
  var on = new RegExp("Version/" + sn);
  var an = new RegExp(Gt, "i");
  var un = new RegExp(Vt + " \\w+", "i");
  var ln = new RegExp(zt + " \\w+", "i");
  var cn = new RegExp(Ct + "|PlayBook|BB10", "i");
  var dn = { "NT3.51": "NT 3.11", "NT4.0": "NT 4.0", "5.0": "2000", 5.1: "XP", 5.2: "XP", "6.0": "Vista", 6.1: "7", 6.2: "8", 6.3: "8.1", 6.4: "10", "10.0": "10" };
  var hn = function(e5, t2) {
    return t2 && X(t2, Ft) || function(e6) {
      return X(e6, Rt) && !X(e6, Mt) && !X(e6, St);
    }(e5);
  };
  var fn = function(e5, t2) {
    return t2 = t2 || "", X(e5, " OPR/") && X(e5, "Mini") ? Bt : X(e5, " OPR/") ? qt : cn.test(e5) ? Ct : X(e5, "IE" + kt) || X(e5, "WPDesktop") ? Nt : X(e5, $t) ? Ot : X(e5, Ht) || X(e5, "Edg/") ? Ut : X(e5, "FBIOS") ? "Facebook " + kt : X(e5, "UCWEB") || X(e5, "UCBrowser") ? "UC Browser" : X(e5, "CriOS") ? Lt : X(e5, "CrMo") ? Mt : X(e5, St) && X(e5, Rt) ? Qt : X(e5, Mt) ? Mt : X(e5, "FxiOS") ? Wt : X(e5.toLowerCase(), rn.toLowerCase()) ? rn : hn(e5, t2) ? X(e5, kt) ? Jt : Rt : X(e5, jt) ? jt : X(e5, "MSIE") || X(e5, "Trident/") ? Dt : X(e5, "Gecko") ? jt : "";
  };
  var vn = (q(st = {}, Nt, [new RegExp("rv:" + sn)]), q(st, Ut, [new RegExp(Ht + "?\\/" + sn)]), q(st, Mt, [new RegExp("(" + Mt + "|CrMo)\\/" + sn)]), q(st, Lt, [new RegExp("CriOS\\/" + sn)]), q(st, "UC Browser", [new RegExp("(UCBrowser|UCWEB)\\/" + sn)]), q(st, Rt, [on]), q(st, Jt, [on]), q(st, qt, [new RegExp("(Opera|OPR)\\/" + sn)]), q(st, jt, [new RegExp(jt + "\\/" + sn)]), q(st, Wt, [new RegExp("FxiOS\\/" + sn)]), q(st, rn, [new RegExp("Konqueror[:/]?" + sn, "i")]), q(st, Ct, [new RegExp(Ct + " " + sn), on]), q(st, Qt, [new RegExp("android\\s" + sn, "i")]), q(st, Ot, [new RegExp($t + "\\/" + sn)]), q(st, Dt, [new RegExp("(rv:|MSIE )" + sn)]), q(st, "Mozilla", [new RegExp("rv:" + sn)]), st);
  var pn = [[new RegExp(Gt + "; " + Gt + " (.*?)[);]", "i"), function(e5) {
    return [Gt, e5 && e5[1] || ""];
  }], [new RegExp(zt, "i"), [zt, ""]], [new RegExp(Vt, "i"), [Vt, ""]], [cn, [Ct, ""]], [new RegExp(Yt, "i"), function(e5, t2) {
    if (/Phone/.test(t2) || /WPDesktop/.test(t2))
      return [Xt, ""];
    if (new RegExp(kt).test(t2) && !/IEMobile\b/.test(t2))
      return [Yt + " " + kt, ""];
    var n3 = /Windows NT ([0-9.]+)/i.exec(t2);
    if (n3 && n3[1]) {
      var i2 = n3[1], r2 = dn[i2] || "";
      return /arm/i.test(t2) && (r2 = "RT"), [Yt, r2];
    }
    return [Yt, ""];
  }], [/((iPhone|iPad|iPod).*?OS (\d+)_(\d+)_?(\d+)?|iPhone)/, function(e5) {
    if (e5 && e5[3]) {
      var t2 = [e5[3], e5[4], e5[5] || "0"];
      return [wt, t2.join(".")];
    }
    return [wt, ""];
  }], [/(watch.*\/(\d+\.\d+\.\d+)|watch os,(\d+\.\d+),)/i, function(e5) {
    var t2 = "";
    return e5 && e5.length >= 3 && (t2 = w(e5[2]) ? e5[3] : e5[2]), ["watchOS", t2];
  }], [new RegExp("(" + St + " (\\d+)\\.(\\d+)\\.?(\\d+)?|" + St + ")", "i"), function(e5) {
    if (e5 && e5[2]) {
      var t2 = [e5[2], e5[3], e5[4] || "0"];
      return [St, t2.join(".")];
    }
    return [St, ""];
  }], [/Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i, function(e5) {
    var t2 = ["Mac OS X", ""];
    if (e5 && e5[1]) {
      var n3 = [e5[1], e5[2], e5[3] || "0"];
      t2[1] = n3.join(".");
    }
    return t2;
  }], [/Mac/i, ["Mac OS X", ""]], [/CrOS/, [At, ""]], [/Linux|debian/i, ["Linux", ""]]];
  var gn = function(e5) {
    return ln.test(e5) ? zt : un.test(e5) ? Vt : an.test(e5) ? Gt : new RegExp(Zt, "i").test(e5) ? Zt : new RegExp("(" + Xt + "|WPDesktop)", "i").test(e5) ? Xt : /iPad/.test(e5) ? It : /iPod/.test(e5) ? "iPod Touch" : /iPhone/.test(e5) ? "iPhone" : /(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i.test(e5) ? Pt : cn.test(e5) ? Ct : /(kobo)\s(ereader|touch)/i.test(e5) ? "Kobo" : new RegExp(Kt, "i").test(e5) ? Kt : /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i.test(e5) || /(kf[a-z]+)( bui|\)).+silk\//i.test(e5) ? "Kindle Fire" : /(Android|ZTE)/i.test(e5) ? !new RegExp(kt).test(e5) || /(9138B|TB782B|Nexus [97]|pixel c|HUAWEISHT|BTV|noble nook|smart ultra 6)/i.test(e5) ? /pixel[\daxl ]{1,6}/i.test(e5) && !/pixel c/i.test(e5) || /(huaweimed-al00|tah-|APA|SM-G92|i980|zte|U304AA)/i.test(e5) || /lmy47v/i.test(e5) && !/QTAQZ3/i.test(e5) ? St : xt : St : new RegExp("(pda|" + kt + ")", "i").test(e5) ? tn : new RegExp(Et, "i").test(e5) && !new RegExp(Et + " pc", "i").test(e5) ? nn : "";
  };
  var _n = "https?://(.*)";
  var mn = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gad_source", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "mc_cid", "igshid", "ttclid", "rdt_cid"];
  var yn = { campaignParams: function(e5) {
    return o ? this._campaignParamsFromUrl(o.URL, e5) : {};
  }, _campaignParamsFromUrl: function(e5, t2) {
    var n3 = mn.concat(t2 || []), i2 = {};
    return J(n3, function(t3) {
      var n4 = yt(e5, t3);
      n4 && (i2[t3] = n4);
    }), i2;
  }, _searchEngine: function(e5) {
    return e5 ? 0 === e5.search(_n + "google.([^/?]*)") ? "google" : 0 === e5.search(_n + "bing.com") ? "bing" : 0 === e5.search(_n + "yahoo.com") ? "yahoo" : 0 === e5.search(_n + "duckduckgo.com") ? "duckduckgo" : null : null;
  }, _searchInfoFromReferrer: function(e5) {
    var t2 = yn._searchEngine(e5), n3 = "yahoo" != t2 ? "q" : "p", i2 = {};
    if (!x(t2)) {
      i2.$search_engine = t2;
      var r2 = o ? yt(o.referrer, n3) : "";
      r2.length && (i2.ph_keyword = r2);
    }
    return i2;
  }, searchInfo: function() {
    var e5 = null == o ? void 0 : o.referrer;
    return e5 ? this._searchInfoFromReferrer(e5) : {};
  }, browser: fn, browserVersion: function(e5, t2) {
    var n3 = fn(e5, t2), i2 = vn[n3];
    if (w(i2))
      return null;
    for (var r2 = 0; r2 < i2.length; r2++) {
      var s3 = i2[r2], o2 = e5.match(s3);
      if (o2)
        return parseFloat(o2[o2.length - 2]);
    }
    return null;
  }, browserLanguage: function() {
    return navigator.language || navigator.userLanguage;
  }, os: function(e5) {
    for (var t2 = 0; t2 < pn.length; t2++) {
      var n3 = H(pn[t2], 2), i2 = n3[0], r2 = n3[1], s3 = i2.exec(e5), o2 = s3 && (y(r2) ? r2(s3, e5) : r2);
      if (o2)
        return o2;
    }
    return ["", ""];
  }, device: gn, deviceType: function(e5) {
    var t2 = gn(e5);
    return t2 === It || t2 === xt || "Kobo" === t2 || "Kindle Fire" === t2 || t2 === nn ? Et : t2 === zt || t2 === Gt || t2 === Vt || t2 === Zt ? "Console" : t2 === Pt ? "Wearable" : t2 ? kt : "Desktop";
  }, referrer: function() {
    return (null == o ? void 0 : o.referrer) || "$direct";
  }, referringDomain: function() {
    var e5;
    return null != o && o.referrer && (null === (e5 = gt(o.referrer)) || void 0 === e5 ? void 0 : e5.host) || "$direct";
  }, referrerInfo: function() {
    return { $referrer: this.referrer(), $referring_domain: this.referringDomain() };
  }, initialPersonInfo: function() {
    return { r: this.referrer(), u: null == a ? void 0 : a.href };
  }, initialPersonPropsFromInfo: function(e5) {
    var t2, n3 = e5.r, i2 = e5.u, r2 = { $initial_referrer: n3, $initial_referring_domain: null == n3 ? void 0 : "$direct" == n3 ? "$direct" : null === (t2 = gt(n3)) || void 0 === t2 ? void 0 : t2.host };
    if (i2) {
      r2.$initial_current_url = i2;
      var s3 = gt(i2);
      r2.$initial_host = null == s3 ? void 0 : s3.host, r2.$initial_pathname = null == s3 ? void 0 : s3.pathname, J(this._campaignParamsFromUrl(i2), function(e6, t3) {
        r2["$initial_" + ne(t3)] = e6;
      });
    }
    n3 && J(this._searchInfoFromReferrer(n3), function(e6, t3) {
      r2["$initial_" + ne(t3)] = e6;
    });
    return r2;
  }, properties: function() {
    if (!d)
      return {};
    var t2 = H(yn.os(d), 2), n3 = t2[0], i2 = t2[1];
    return Y(te({ $os: n3, $os_version: i2, $browser: yn.browser(d, navigator.vendor), $device: yn.device(d), $device_type: yn.deviceType(d) }), { $current_url: null == a ? void 0 : a.href, $host: null == a ? void 0 : a.host, $pathname: null == a ? void 0 : a.pathname, $raw_user_agent: d.length > 1e3 ? d.substring(0, 997) + "..." : d, $browser_version: yn.browserVersion(d, navigator.vendor), $browser_language: yn.browserLanguage(), $screen_height: null == e ? void 0 : e.screen.height, $screen_width: null == e ? void 0 : e.screen.width, $viewport_height: null == e ? void 0 : e.innerHeight, $viewport_width: null == e ? void 0 : e.innerWidth, $lib: "web", $lib_version: f.LIB_VERSION, $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10), $time: Date.now() / 1e3 });
  }, people_properties: function() {
    if (!d)
      return {};
    var e5 = H(yn.os(d), 2), t2 = e5[0], n3 = e5[1];
    return Y(te({ $os: t2, $os_version: n3, $browser: yn.browser(d, navigator.vendor) }), { $browser_version: yn.browserVersion(d, navigator.vendor) });
  } };
  var bn = ["cookie", "localstorage", "localstorage+cookie", "sessionstorage", "memory"];
  var kn = function() {
    function e5(t2) {
      L(this, e5), this.config = t2, this.props = {}, this.campaign_params_saved = false, this.name = function(e6) {
        var t3 = "";
        return e6.token && (t3 = e6.token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")), e6.persistence_name ? "ph_" + e6.persistence_name : "ph_" + t3 + "_posthog";
      }(t2), this.storage = this.buildStorage(t2), this.load(), t2.debug && T.info("Persistence loaded", t2.persistence, M({}, this.props)), this.update_config(t2, t2), this.save();
    }
    return N(e5, [{ key: "buildStorage", value: function(e6) {
      -1 === bn.indexOf(e6.persistence.toLowerCase()) && (T.critical("Unknown persistence type " + e6.persistence + "; falling back to localStorage+cookie"), e6.persistence = "localStorage+cookie");
      var t2 = e6.persistence.toLowerCase();
      return "localstorage" === t2 && ut.is_supported() ? ut : "localstorage+cookie" === t2 && ct.is_supported() ? ct : "sessionstorage" === t2 && vt.is_supported() ? vt : "memory" === t2 ? ht : "cookie" === t2 ? ot : ct.is_supported() ? ct : ot;
    } }, { key: "properties", value: function() {
      var e6 = {};
      return J(this.props, function(t2, n3) {
        if (n3 === Ie && b(t2))
          for (var i2 = Object.keys(t2), s3 = 0; s3 < i2.length; s3++)
            e6["$feature/".concat(i2[s3])] = t2[i2[s3]];
        else
          a2 = n3, u2 = false, (x(o2 = He) ? u2 : r && o2.indexOf === r ? -1 != o2.indexOf(a2) : (J(o2, function(e7) {
            if (u2 || (u2 = e7 === a2))
              return V;
          }), u2)) || (e6[n3] = t2);
        var o2, a2, u2;
      }), e6;
    } }, { key: "load", value: function() {
      if (!this.disabled) {
        var e6 = this.storage.parse(this.name);
        e6 && (this.props = Y({}, e6));
      }
    } }, { key: "save", value: function() {
      this.disabled || this.storage.set(this.name, this.props, this.expire_days, this.cross_subdomain, this.secure, this.config.debug);
    } }, { key: "remove", value: function() {
      this.storage.remove(this.name, false), this.storage.remove(this.name, true);
    } }, { key: "clear", value: function() {
      this.remove(), this.props = {};
    } }, { key: "register_once", value: function(e6, t2, n3) {
      var i2 = this;
      if (b(e6)) {
        w(t2) && (t2 = "None"), this.expire_days = w(n3) ? this.default_expiry : n3;
        var r2 = false;
        if (J(e6, function(e7, n4) {
          i2.props.hasOwnProperty(n4) && i2.props[n4] !== t2 || (i2.props[n4] = e7, r2 = true);
        }), r2)
          return this.save(), true;
      }
      return false;
    } }, { key: "register", value: function(e6, t2) {
      var n3 = this;
      if (b(e6)) {
        this.expire_days = w(t2) ? this.default_expiry : t2;
        var i2 = false;
        if (J(e6, function(t3, r2) {
          e6.hasOwnProperty(r2) && n3.props[r2] !== t3 && (n3.props[r2] = t3, i2 = true);
        }), i2)
          return this.save(), true;
      }
      return false;
    } }, { key: "unregister", value: function(e6) {
      e6 in this.props && (delete this.props[e6], this.save());
    } }, { key: "update_campaign_params", value: function() {
      this.campaign_params_saved || (this.register(yn.campaignParams(this.config.custom_campaign_params)), this.campaign_params_saved = true);
    } }, { key: "update_search_keyword", value: function() {
      this.register(yn.searchInfo());
    } }, { key: "update_referrer_info", value: function() {
      this.register_once(yn.referrerInfo(), void 0);
    } }, { key: "set_initial_person_info", value: function() {
      this.props[Le] || this.props[De] || this.register_once(q({}, Ne, yn.initialPersonInfo()), void 0);
    } }, { key: "get_referrer_info", value: function() {
      return te({ $referrer: this.props.$referrer, $referring_domain: this.props.$referring_domain });
    } }, { key: "get_initial_props", value: function() {
      var e6 = this, t2 = {};
      J([De, Le], function(n4) {
        var i3 = e6.props[n4];
        i3 && J(i3, function(e7, n5) {
          t2["$initial_" + ne(n5)] = e7;
        });
      });
      var n3 = this.props[Ne];
      if (n3) {
        var i2 = yn.initialPersonPropsFromInfo(n3);
        Y(t2, i2);
      }
      return t2;
    } }, { key: "safe_merge", value: function(e6) {
      return J(this.props, function(t2, n3) {
        n3 in e6 || (e6[n3] = t2);
      }), e6;
    } }, { key: "update_config", value: function(e6, t2) {
      if (this.default_expiry = this.expire_days = e6.cookie_expiration, this.set_disabled(e6.disable_persistence), this.set_cross_subdomain(e6.cross_subdomain_cookie), this.set_secure(e6.secure_cookie), e6.persistence !== t2.persistence) {
        var n3 = this.buildStorage(e6), i2 = this.props;
        this.clear(), this.storage = n3, this.props = i2, this.save();
      }
    } }, { key: "set_disabled", value: function(e6) {
      this.disabled = e6, this.disabled ? this.remove() : this.save();
    } }, { key: "set_cross_subdomain", value: function(e6) {
      e6 !== this.cross_subdomain && (this.cross_subdomain = e6, this.remove(), this.save());
    } }, { key: "get_cross_subdomain", value: function() {
      return !!this.cross_subdomain;
    } }, { key: "set_secure", value: function(e6) {
      e6 !== this.secure && (this.secure = e6, this.remove(), this.save());
    } }, { key: "set_event_timer", value: function(e6, t2) {
      var n3 = this.props[de] || {};
      n3[e6] = t2, this.props[de] = n3, this.save();
    } }, { key: "remove_event_timer", value: function(e6) {
      var t2 = (this.props[de] || {})[e6];
      return w(t2) || (delete this.props[de][e6], this.save()), t2;
    } }, { key: "get_property", value: function(e6) {
      return this.props[e6];
    } }, { key: "set_property", value: function(e6, t2) {
      this.props[e6] = t2, this.save();
    } }]), e5;
  }();
  function wn(e5) {
    return JSON.stringify(e5, (t2 = [], function(e6, n3) {
      if (b(n3)) {
        for (; t2.length > 0 && t2.at(-1) !== this; )
          t2.pop();
        return t2.includes(n3) ? "[Circular]" : (t2.push(n3), n3);
      }
      return n3;
    })).length;
    var t2;
  }
  function Sn(e5) {
    var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 66060288e-1;
    if (e5.size >= t2 && e5.data.length > 1) {
      var n3 = Math.floor(e5.data.length / 2), i2 = e5.data.slice(0, n3), r2 = e5.data.slice(n3);
      return [Sn({ size: wn(i2), data: i2, sessionId: e5.sessionId, windowId: e5.windowId }), Sn({ size: wn(r2), data: r2, sessionId: e5.sessionId, windowId: e5.windowId })].flatMap(function(e6) {
        return e6;
      });
    }
    return [e5];
  }
  var En = function(e5) {
    return e5[e5.DomContentLoaded = 0] = "DomContentLoaded", e5[e5.Load = 1] = "Load", e5[e5.FullSnapshot = 2] = "FullSnapshot", e5[e5.IncrementalSnapshot = 3] = "IncrementalSnapshot", e5[e5.Meta = 4] = "Meta", e5[e5.Custom = 5] = "Custom", e5[e5.Plugin = 6] = "Plugin", e5;
  }(En || {});
  var xn = function(e5) {
    return e5[e5.Mutation = 0] = "Mutation", e5[e5.MouseMove = 1] = "MouseMove", e5[e5.MouseInteraction = 2] = "MouseInteraction", e5[e5.Scroll = 3] = "Scroll", e5[e5.ViewportResize = 4] = "ViewportResize", e5[e5.Input = 5] = "Input", e5[e5.TouchMove = 6] = "TouchMove", e5[e5.MediaInteraction = 7] = "MediaInteraction", e5[e5.StyleSheetRule = 8] = "StyleSheetRule", e5[e5.CanvasMutation = 9] = "CanvasMutation", e5[e5.Font = 10] = "Font", e5[e5.Log = 11] = "Log", e5[e5.Drag = 12] = "Drag", e5[e5.StyleDeclaration = 13] = "StyleDeclaration", e5[e5.Selection = 14] = "Selection", e5[e5.AdoptedStyleSheet = 15] = "AdoptedStyleSheet", e5[e5.CustomElement = 16] = "CustomElement", e5;
  }(xn || {});
  function In(e5) {
    return e5 ? G(e5).split(/\s+/) : [];
  }
  function Fn(t2) {
    var n3 = null == e ? void 0 : e.location.href;
    return !!(n3 && t2 && t2.some(function(e5) {
      return n3.match(e5);
    }));
  }
  function Pn(e5) {
    var t2 = "";
    switch (A(e5.className)) {
      case "string":
        t2 = e5.className;
        break;
      case "object":
        t2 = (e5.className && "baseVal" in e5.className ? e5.className.baseVal : null) || e5.getAttribute("class") || "";
        break;
      default:
        t2 = "";
    }
    return In(t2);
  }
  function Rn(e5) {
    return I(e5) ? null : G(e5).split(/(\s+)/).filter(function(e6) {
      return Gn(e6);
    }).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255);
  }
  function Cn(e5) {
    var t2 = "";
    return qn(e5) && !Bn(e5) && e5.childNodes && e5.childNodes.length && J(e5.childNodes, function(e6) {
      var n3;
      Mn(e6) && e6.textContent && (t2 += null !== (n3 = Rn(e6.textContent)) && void 0 !== n3 ? n3 : "");
    }), G(t2);
  }
  function Tn(e5) {
    return w(e5.target) ? e5.srcElement || null : null !== (t2 = e5.target) && void 0 !== t2 && t2.shadowRoot ? e5.composedPath()[0] || null : e5.target || null;
    var t2;
  }
  function $n(e5) {
    return !!e5 && 1 === e5.nodeType;
  }
  function On(e5, t2) {
    return !!e5 && !!e5.tagName && e5.tagName.toLowerCase() === t2.toLowerCase();
  }
  function Mn(e5) {
    return !!e5 && 3 === e5.nodeType;
  }
  function An(e5) {
    return !!e5 && 11 === e5.nodeType;
  }
  var Ln = ["a", "button", "form", "input", "select", "textarea", "label"];
  function Dn(e5) {
    var t2 = e5.parentNode;
    return !(!t2 || !$n(t2)) && t2;
  }
  function Nn(t2, n3) {
    var i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0, r2 = arguments.length > 3 ? arguments[3] : void 0, s3 = arguments.length > 4 ? arguments[4] : void 0;
    if (!e || !t2 || On(t2, "html") || !$n(t2))
      return false;
    if (null != i2 && i2.url_allowlist && !Fn(i2.url_allowlist))
      return false;
    if (null != i2 && i2.url_ignorelist && Fn(i2.url_ignorelist))
      return false;
    if (null != i2 && i2.dom_event_allowlist) {
      var o2 = i2.dom_event_allowlist;
      if (o2 && !o2.some(function(e5) {
        return n3.type === e5;
      }))
        return false;
    }
    for (var a2 = false, u2 = [t2], l3 = true, c2 = t2; c2.parentNode && !On(c2, "body"); )
      if (An(c2.parentNode))
        u2.push(c2.parentNode.host), c2 = c2.parentNode.host;
      else {
        if (!(l3 = Dn(c2)))
          break;
        if (r2 || Ln.indexOf(l3.tagName.toLowerCase()) > -1)
          a2 = true;
        else {
          var d2 = e.getComputedStyle(l3);
          d2 && "pointer" === d2.getPropertyValue("cursor") && (a2 = true);
        }
        u2.push(l3), c2 = l3;
      }
    if (!function(e5, t3) {
      var n4 = null == t3 ? void 0 : t3.element_allowlist;
      if (w(n4))
        return true;
      var i3, r3 = z(e5);
      try {
        var s4 = function() {
          var e6 = i3.value;
          if (n4.some(function(t4) {
            return e6.tagName.toLowerCase() === t4;
          }))
            return { v: true };
        };
        for (r3.s(); !(i3 = r3.n()).done; ) {
          var o3 = s4();
          if ("object" === A(o3))
            return o3.v;
        }
      } catch (e6) {
        r3.e(e6);
      } finally {
        r3.f();
      }
      return false;
    }(u2, i2))
      return false;
    if (!function(e5, t3) {
      var n4 = null == t3 ? void 0 : t3.css_selector_allowlist;
      if (w(n4))
        return true;
      var i3, r3 = z(e5);
      try {
        var s4 = function() {
          var e6 = i3.value;
          if (n4.some(function(t4) {
            return e6.matches(t4);
          }))
            return { v: true };
        };
        for (r3.s(); !(i3 = r3.n()).done; ) {
          var o3 = s4();
          if ("object" === A(o3))
            return o3.v;
        }
      } catch (e6) {
        r3.e(e6);
      } finally {
        r3.f();
      }
      return false;
    }(u2, i2))
      return false;
    var h2 = e.getComputedStyle(t2);
    if (h2 && "pointer" === h2.getPropertyValue("cursor") && "click" === n3.type)
      return true;
    var f2 = t2.tagName.toLowerCase();
    switch (f2) {
      case "html":
        return false;
      case "form":
        return (s3 || ["submit"]).indexOf(n3.type) >= 0;
      case "input":
      case "select":
      case "textarea":
        return (s3 || ["change", "click"]).indexOf(n3.type) >= 0;
      default:
        return a2 ? (s3 || ["click"]).indexOf(n3.type) >= 0 : (s3 || ["click"]).indexOf(n3.type) >= 0 && (Ln.indexOf(f2) > -1 || "true" === t2.getAttribute("contenteditable"));
    }
  }
  function qn(e5) {
    for (var t2 = e5; t2.parentNode && !On(t2, "body"); t2 = t2.parentNode) {
      var n3 = Pn(t2);
      if (X(n3, "ph-sensitive") || X(n3, "ph-no-capture"))
        return false;
    }
    if (X(Pn(e5), "ph-include"))
      return true;
    var i2 = e5.type || "";
    if (S(i2))
      switch (i2.toLowerCase()) {
        case "hidden":
        case "password":
          return false;
      }
    var r2 = e5.name || e5.id || "";
    if (S(r2)) {
      if (/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test(r2.replace(/[^a-zA-Z0-9]/g, "")))
        return false;
    }
    return true;
  }
  function Bn(e5) {
    return !!(On(e5, "input") && !["button", "checkbox", "submit", "reset"].includes(e5.type) || On(e5, "select") || On(e5, "textarea") || "true" === e5.getAttribute("contenteditable"));
  }
  var Hn = "(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11})";
  var Un = new RegExp("^(?:".concat(Hn, ")$"));
  var jn = new RegExp(Hn);
  var Wn = "\\d{3}-?\\d{2}-?\\d{4}";
  var zn = new RegExp("^(".concat(Wn, ")$"));
  var Vn = new RegExp("(".concat(Wn, ")"));
  function Gn(e5) {
    var t2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
    if (I(e5))
      return false;
    if (S(e5)) {
      if (e5 = G(e5), (t2 ? Un : jn).test((e5 || "").replace(/[- ]/g, "")))
        return false;
      if ((t2 ? zn : Vn).test(e5))
        return false;
    }
    return true;
  }
  function Qn(e5) {
    var t2 = Cn(e5);
    return Gn(t2 = "".concat(t2, " ").concat(Jn(e5)).trim()) ? t2 : "";
  }
  function Jn(e5) {
    var t2 = "";
    return e5 && e5.childNodes && e5.childNodes.length && J(e5.childNodes, function(e6) {
      var n3;
      if (e6 && "span" === (null === (n3 = e6.tagName) || void 0 === n3 ? void 0 : n3.toLowerCase()))
        try {
          var i2 = Cn(e6);
          t2 = "".concat(t2, " ").concat(i2).trim(), e6.childNodes && e6.childNodes.length && (t2 = "".concat(t2, " ").concat(Jn(e6)).trim());
        } catch (e7) {
          T.error(e7);
        }
    }), t2;
  }
  function Yn(e5) {
    return function(e6) {
      var t2 = e6.map(function(e7) {
        var t3, n3, i2 = "";
        if (e7.tag_name && (i2 += e7.tag_name), e7.attr_class) {
          e7.attr_class.sort();
          var r2, s3 = z(e7.attr_class);
          try {
            for (s3.s(); !(r2 = s3.n()).done; ) {
              var o2 = r2.value;
              i2 += ".".concat(o2.replace(/"/g, ""));
            }
          } catch (e8) {
            s3.e(e8);
          } finally {
            s3.f();
          }
        }
        var a2 = M(M(M(M({}, e7.text ? { text: e7.text } : {}), {}, { "nth-child": null !== (t3 = e7.nth_child) && void 0 !== t3 ? t3 : 0, "nth-of-type": null !== (n3 = e7.nth_of_type) && void 0 !== n3 ? n3 : 0 }, e7.href ? { href: e7.href } : {}), e7.attr_id ? { attr_id: e7.attr_id } : {}), e7.attributes), u2 = {};
        return K(a2).sort(function(e8, t4) {
          var n4 = H(e8, 1)[0], i3 = H(t4, 1)[0];
          return n4.localeCompare(i3);
        }).forEach(function(e8) {
          var t4 = H(e8, 2), n4 = t4[0], i3 = t4[1];
          return u2[Xn(n4.toString())] = Xn(i3.toString());
        }), i2 += ":", i2 += K(a2).map(function(e8) {
          var t4 = H(e8, 2), n4 = t4[0], i3 = t4[1];
          return "".concat(n4, '="').concat(i3, '"');
        }).join("");
      });
      return t2.join(";");
    }(function(e6) {
      return e6.map(function(e7) {
        var t2, n3, i2 = { text: null === (t2 = e7.$el_text) || void 0 === t2 ? void 0 : t2.slice(0, 400), tag_name: e7.tag_name, href: null === (n3 = e7.attr__href) || void 0 === n3 ? void 0 : n3.slice(0, 2048), attr_class: Kn(e7), attr_id: e7.attr__id, nth_child: e7.nth_child, nth_of_type: e7.nth_of_type, attributes: {} };
        return K(e7).filter(function(e8) {
          return 0 === H(e8, 1)[0].indexOf("attr__");
        }).forEach(function(e8) {
          var t3 = H(e8, 2), n4 = t3[0], r2 = t3[1];
          return i2.attributes[n4] = r2;
        }), i2;
      });
    }(e5));
  }
  function Xn(e5) {
    return e5.replace(/"|\\"/g, '\\"');
  }
  function Kn(e5) {
    var t2 = e5.attr__class;
    return t2 ? m(t2) ? t2 : In(t2) : void 0;
  }
  var Zn = "[SessionRecording]";
  var ei = "redacted";
  var ti = { initiatorTypes: ["audio", "beacon", "body", "css", "early-hint", "embed", "fetch", "frame", "iframe", "icon", "image", "img", "input", "link", "navigation", "object", "ping", "script", "track", "video", "xmlhttprequest"], maskRequestFn: function(e5) {
    return e5;
  }, recordHeaders: false, recordBody: false, recordInitialRequests: false, recordPerformance: false, performanceEntryTypeToObserve: ["first-input", "navigation", "paint", "resource"], payloadSizeLimitBytes: 1e6, payloadHostDenyList: [".lr-ingest.io", ".ingest.sentry.io"] };
  var ni = ["authorization", "x-forwarded-for", "authorization", "cookie", "set-cookie", "x-api-key", "x-real-ip", "remote-addr", "forwarded", "proxy-authorization", "x-csrf-token", "x-csrftoken", "x-xsrf-token"];
  var ii = ["password", "secret", "passwd", "api_key", "apikey", "auth", "credentials", "mysql_pwd", "privatekey", "private_key", "token"];
  var ri = ["/s/", "/e/", "/i/"];
  function si(e5, t2, n3, i2) {
    if (I(e5))
      return e5;
    var r2 = (null == t2 ? void 0 : t2["content-length"]) || function(e6) {
      return new Blob([e6]).size;
    }(e5);
    return S(r2) && (r2 = parseInt(r2)), r2 > n3 ? Zn + " ".concat(i2, " body too large to record (").concat(r2, " bytes)") : e5;
  }
  function oi(e5, t2) {
    if (I(e5))
      return e5;
    var n3 = e5;
    return Gn(n3, false) || (n3 = Zn + " " + t2 + " body " + ei), J(ii, function(e6) {
      var i2, r2;
      null !== (i2 = n3) && void 0 !== i2 && i2.length && -1 !== (null === (r2 = n3) || void 0 === r2 ? void 0 : r2.indexOf(e6)) && (n3 = Zn + " " + t2 + " body " + ei + " as might contain: " + e6);
    }), n3;
  }
  var ai = function(e5, t2) {
    var n3, i2, r2, s3 = { payloadSizeLimitBytes: ti.payloadSizeLimitBytes, performanceEntryTypeToObserve: U(ti.performanceEntryTypeToObserve), payloadHostDenyList: [].concat(U(t2.payloadHostDenyList || []), U(ti.payloadHostDenyList)) }, o2 = false !== e5.session_recording.recordHeaders && t2.recordHeaders, a2 = false !== e5.session_recording.recordBody && t2.recordBody, u2 = false !== e5.capture_performance && t2.recordPerformance, l3 = (n3 = s3, r2 = Math.min(1e6, null !== (i2 = n3.payloadSizeLimitBytes) && void 0 !== i2 ? i2 : 1e6), function(e6) {
      return null != e6 && e6.requestBody && (e6.requestBody = si(e6.requestBody, e6.requestHeaders, r2, "Request")), null != e6 && e6.responseBody && (e6.responseBody = si(e6.responseBody, e6.responseHeaders, r2, "Response")), e6;
    }), c2 = function(e6) {
      return l3(function(e7) {
        var t4 = gt(e7.name);
        if (!(t4 && t4.pathname && ri.some(function(e8) {
          return 0 === t4.pathname.indexOf(e8);
        })))
          return e7;
      }((n4 = (t3 = e6).requestHeaders, I(n4) || J(Object.keys(null != n4 ? n4 : {}), function(e7) {
        ni.includes(e7.toLowerCase()) && (n4[e7] = ei);
      }), t3)));
      var t3, n4;
    }, d2 = y(e5.session_recording.maskNetworkRequestFn);
    return d2 && y(e5.session_recording.maskCapturedNetworkRequestFn) && T.warn("Both `maskNetworkRequestFn` and `maskCapturedNetworkRequestFn` are defined. `maskNetworkRequestFn` will be ignored."), d2 && (e5.session_recording.maskCapturedNetworkRequestFn = function(t3) {
      var n4 = e5.session_recording.maskNetworkRequestFn({ url: t3.name });
      return M(M({}, t3), {}, { name: null == n4 ? void 0 : n4.url });
    }), s3.maskRequestFn = y(e5.session_recording.maskCapturedNetworkRequestFn) ? function(t3) {
      var n4, i3, r3, s4 = c2(t3);
      return s4 && null !== (n4 = null === (i3 = (r3 = e5.session_recording).maskCapturedNetworkRequestFn) || void 0 === i3 ? void 0 : i3.call(r3, s4)) && void 0 !== n4 ? n4 : void 0;
    } : function(e6) {
      return function(e7) {
        if (!w(e7))
          return e7.requestBody = oi(e7.requestBody, "Request"), e7.responseBody = oi(e7.responseBody, "Response"), e7;
      }(c2(e6));
    }, M(M(M({}, ti), s3), {}, { recordHeaders: o2, recordBody: a2, recordPerformance: u2, recordInitialRequests: u2 });
  };
  var ui = N(function e2(t2) {
    var n3, i2, r2 = this, s3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    L(this, e2), q(this, "bucketSize", 100), q(this, "refillRate", 10), q(this, "mutationBuckets", {}), q(this, "loggedTracker", {}), q(this, "refillBuckets", function() {
      Object.keys(r2.mutationBuckets).forEach(function(e5) {
        r2.mutationBuckets[e5] = r2.mutationBuckets[e5] + r2.refillRate, r2.mutationBuckets[e5] >= r2.bucketSize && delete r2.mutationBuckets[e5];
      });
    }), q(this, "getNodeOrRelevantParent", function(e5) {
      var t3 = r2.rrweb.mirror.getNode(e5);
      if ("svg" !== (null == t3 ? void 0 : t3.nodeName) && t3 instanceof Element) {
        var n4 = t3.closest("svg");
        if (n4)
          return [r2.rrweb.mirror.getId(n4), n4];
      }
      return [e5, t3];
    }), q(this, "numberOfChanges", function(e5) {
      var t3, n4, i3, r3, s4, o2, a2, u2;
      return (null !== (t3 = null === (n4 = e5.removes) || void 0 === n4 ? void 0 : n4.length) && void 0 !== t3 ? t3 : 0) + (null !== (i3 = null === (r3 = e5.attributes) || void 0 === r3 ? void 0 : r3.length) && void 0 !== i3 ? i3 : 0) + (null !== (s4 = null === (o2 = e5.texts) || void 0 === o2 ? void 0 : o2.length) && void 0 !== s4 ? s4 : 0) + (null !== (a2 = null === (u2 = e5.adds) || void 0 === u2 ? void 0 : u2.length) && void 0 !== a2 ? a2 : 0);
    }), q(this, "throttleMutations", function(e5) {
      if (3 !== e5.type || 0 !== e5.data.source)
        return e5;
      var t3 = e5.data, n4 = r2.numberOfChanges(t3);
      t3.attributes && (t3.attributes = t3.attributes.filter(function(e6) {
        var t4, n5, i4, s4 = H(r2.getNodeOrRelevantParent(e6.id), 2), o2 = s4[0], a2 = s4[1];
        if (0 === r2.mutationBuckets[o2])
          return false;
        (r2.mutationBuckets[o2] = null !== (t4 = r2.mutationBuckets[o2]) && void 0 !== t4 ? t4 : r2.bucketSize, r2.mutationBuckets[o2] = Math.max(r2.mutationBuckets[o2] - 1, 0), 0 === r2.mutationBuckets[o2]) && (r2.loggedTracker[o2] || (r2.loggedTracker[o2] = true, null === (n5 = (i4 = r2.options).onBlockedNode) || void 0 === n5 || n5.call(i4, o2, a2)));
        return e6;
      }));
      var i3 = r2.numberOfChanges(t3);
      return 0 !== i3 || n4 === i3 ? e5 : void 0;
    }), this.rrweb = t2, this.options = s3, this.refillRate = null !== (n3 = this.options.refillRate) && void 0 !== n3 ? n3 : this.refillRate, this.bucketSize = null !== (i2 = this.options.bucketSize) && void 0 !== i2 ? i2 : this.bucketSize, setInterval(function() {
      r2.refillBuckets();
    }, 1e3);
  });
  var li = Uint8Array;
  var ci = Uint16Array;
  var di = Uint32Array;
  var hi = new li([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]);
  var fi = new li([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]);
  var vi = new li([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var pi = function(e5, t2) {
    for (var n3 = new ci(31), i2 = 0; i2 < 31; ++i2)
      n3[i2] = t2 += 1 << e5[i2 - 1];
    var r2 = new di(n3[30]);
    for (i2 = 1; i2 < 30; ++i2)
      for (var s3 = n3[i2]; s3 < n3[i2 + 1]; ++s3)
        r2[s3] = s3 - n3[i2] << 5 | i2;
    return [n3, r2];
  };
  var gi = pi(hi, 2);
  var _i = gi[0];
  var mi = gi[1];
  _i[28] = 258, mi[258] = 28;
  for (yi = pi(fi, 0)[1], bi = new ci(32768), ki = 0; ki < 32768; ++ki) {
    wi = (43690 & ki) >>> 1 | (21845 & ki) << 1;
    wi = (61680 & (wi = (52428 & wi) >>> 2 | (13107 & wi) << 2)) >>> 4 | (3855 & wi) << 4, bi[ki] = ((65280 & wi) >>> 8 | (255 & wi) << 8) >>> 1;
  }
  var wi;
  var yi;
  var bi;
  var ki;
  var Si = function(e5, t2, n3) {
    for (var i2 = e5.length, r2 = 0, s3 = new ci(t2); r2 < i2; ++r2)
      ++s3[e5[r2] - 1];
    var o2, a2 = new ci(t2);
    for (r2 = 0; r2 < t2; ++r2)
      a2[r2] = a2[r2 - 1] + s3[r2 - 1] << 1;
    if (n3) {
      o2 = new ci(1 << t2);
      var u2 = 15 - t2;
      for (r2 = 0; r2 < i2; ++r2)
        if (e5[r2])
          for (var l3 = r2 << 4 | e5[r2], c2 = t2 - e5[r2], d2 = a2[e5[r2] - 1]++ << c2, h2 = d2 | (1 << c2) - 1; d2 <= h2; ++d2)
            o2[bi[d2] >>> u2] = l3;
    } else
      for (o2 = new ci(i2), r2 = 0; r2 < i2; ++r2)
        o2[r2] = bi[a2[e5[r2] - 1]++] >>> 15 - e5[r2];
    return o2;
  };
  var Ei = new li(288);
  for (ki = 0; ki < 144; ++ki)
    Ei[ki] = 8;
  for (ki = 144; ki < 256; ++ki)
    Ei[ki] = 9;
  for (ki = 256; ki < 280; ++ki)
    Ei[ki] = 7;
  for (ki = 280; ki < 288; ++ki)
    Ei[ki] = 8;
  var xi = new li(32);
  for (ki = 0; ki < 32; ++ki)
    xi[ki] = 5;
  var Ii = Si(Ei, 9, 0);
  var Fi = Si(xi, 5, 0);
  var Pi = function(e5) {
    return (e5 / 8 >> 0) + (7 & e5 && 1);
  };
  var Ri = function(e5, t2, n3) {
    (null == t2 || t2 < 0) && (t2 = 0), (null == n3 || n3 > e5.length) && (n3 = e5.length);
    var i2 = new (e5 instanceof ci ? ci : e5 instanceof di ? di : li)(n3 - t2);
    return i2.set(e5.subarray(t2, n3)), i2;
  };
  var Ci = function(e5, t2, n3) {
    n3 <<= 7 & t2;
    var i2 = t2 / 8 >> 0;
    e5[i2] |= n3, e5[i2 + 1] |= n3 >>> 8;
  };
  var Ti = function(e5, t2, n3) {
    n3 <<= 7 & t2;
    var i2 = t2 / 8 >> 0;
    e5[i2] |= n3, e5[i2 + 1] |= n3 >>> 8, e5[i2 + 2] |= n3 >>> 16;
  };
  var $i = function(e5, t2) {
    for (var n3 = [], i2 = 0; i2 < e5.length; ++i2)
      e5[i2] && n3.push({ s: i2, f: e5[i2] });
    var r2 = n3.length, s3 = n3.slice();
    if (!r2)
      return [new li(0), 0];
    if (1 == r2) {
      var o2 = new li(n3[0].s + 1);
      return o2[n3[0].s] = 1, [o2, 1];
    }
    n3.sort(function(e6, t3) {
      return e6.f - t3.f;
    }), n3.push({ s: -1, f: 25001 });
    var a2 = n3[0], u2 = n3[1], l3 = 0, c2 = 1, d2 = 2;
    for (n3[0] = { s: -1, f: a2.f + u2.f, l: a2, r: u2 }; c2 != r2 - 1; )
      a2 = n3[n3[l3].f < n3[d2].f ? l3++ : d2++], u2 = n3[l3 != c2 && n3[l3].f < n3[d2].f ? l3++ : d2++], n3[c2++] = { s: -1, f: a2.f + u2.f, l: a2, r: u2 };
    var h2 = s3[0].s;
    for (i2 = 1; i2 < r2; ++i2)
      s3[i2].s > h2 && (h2 = s3[i2].s);
    var f2 = new ci(h2 + 1), v2 = Oi(n3[c2 - 1], f2, 0);
    if (v2 > t2) {
      i2 = 0;
      var p2 = 0, g2 = v2 - t2, _2 = 1 << g2;
      for (s3.sort(function(e6, t3) {
        return f2[t3.s] - f2[e6.s] || e6.f - t3.f;
      }); i2 < r2; ++i2) {
        var m2 = s3[i2].s;
        if (!(f2[m2] > t2))
          break;
        p2 += _2 - (1 << v2 - f2[m2]), f2[m2] = t2;
      }
      for (p2 >>>= g2; p2 > 0; ) {
        var y2 = s3[i2].s;
        f2[y2] < t2 ? p2 -= 1 << t2 - f2[y2]++ - 1 : ++i2;
      }
      for (; i2 >= 0 && p2; --i2) {
        var b2 = s3[i2].s;
        f2[b2] == t2 && (--f2[b2], ++p2);
      }
      v2 = t2;
    }
    return [new li(f2), v2];
  };
  var Oi = function e3(t2, n3, i2) {
    return -1 == t2.s ? Math.max(e3(t2.l, n3, i2 + 1), e3(t2.r, n3, i2 + 1)) : n3[t2.s] = i2;
  };
  var Mi = function(e5) {
    for (var t2 = e5.length; t2 && !e5[--t2]; )
      ;
    for (var n3 = new ci(++t2), i2 = 0, r2 = e5[0], s3 = 1, o2 = function(e6) {
      n3[i2++] = e6;
    }, a2 = 1; a2 <= t2; ++a2)
      if (e5[a2] == r2 && a2 != t2)
        ++s3;
      else {
        if (!r2 && s3 > 2) {
          for (; s3 > 138; s3 -= 138)
            o2(32754);
          s3 > 2 && (o2(s3 > 10 ? s3 - 11 << 5 | 28690 : s3 - 3 << 5 | 12305), s3 = 0);
        } else if (s3 > 3) {
          for (o2(r2), --s3; s3 > 6; s3 -= 6)
            o2(8304);
          s3 > 2 && (o2(s3 - 3 << 5 | 8208), s3 = 0);
        }
        for (; s3--; )
          o2(r2);
        s3 = 1, r2 = e5[a2];
      }
    return [n3.subarray(0, i2), t2];
  };
  var Ai = function(e5, t2) {
    for (var n3 = 0, i2 = 0; i2 < t2.length; ++i2)
      n3 += e5[i2] * t2[i2];
    return n3;
  };
  var Li = function(e5, t2, n3) {
    var i2 = n3.length, r2 = Pi(t2 + 2);
    e5[r2] = 255 & i2, e5[r2 + 1] = i2 >>> 8, e5[r2 + 2] = 255 ^ e5[r2], e5[r2 + 3] = 255 ^ e5[r2 + 1];
    for (var s3 = 0; s3 < i2; ++s3)
      e5[r2 + s3 + 4] = n3[s3];
    return 8 * (r2 + 4 + i2);
  };
  var Di = function(e5, t2, n3, i2, r2, s3, o2, a2, u2, l3, c2) {
    Ci(t2, c2++, n3), ++r2[256];
    for (var d2 = $i(r2, 15), h2 = d2[0], f2 = d2[1], v2 = $i(s3, 15), p2 = v2[0], g2 = v2[1], _2 = Mi(h2), m2 = _2[0], y2 = _2[1], b2 = Mi(p2), k2 = b2[0], w2 = b2[1], S2 = new ci(19), E2 = 0; E2 < m2.length; ++E2)
      S2[31 & m2[E2]]++;
    for (E2 = 0; E2 < k2.length; ++E2)
      S2[31 & k2[E2]]++;
    for (var x2 = $i(S2, 7), I2 = x2[0], F2 = x2[1], P2 = 19; P2 > 4 && !I2[vi[P2 - 1]]; --P2)
      ;
    var R2, C2, T2, $2, O2 = l3 + 5 << 3, M2 = Ai(r2, Ei) + Ai(s3, xi) + o2, A2 = Ai(r2, h2) + Ai(s3, p2) + o2 + 14 + 3 * P2 + Ai(S2, I2) + (2 * S2[16] + 3 * S2[17] + 7 * S2[18]);
    if (O2 <= M2 && O2 <= A2)
      return Li(t2, c2, e5.subarray(u2, u2 + l3));
    if (Ci(t2, c2, 1 + (A2 < M2)), c2 += 2, A2 < M2) {
      R2 = Si(h2, f2, 0), C2 = h2, T2 = Si(p2, g2, 0), $2 = p2;
      var L2 = Si(I2, F2, 0);
      Ci(t2, c2, y2 - 257), Ci(t2, c2 + 5, w2 - 1), Ci(t2, c2 + 10, P2 - 4), c2 += 14;
      for (E2 = 0; E2 < P2; ++E2)
        Ci(t2, c2 + 3 * E2, I2[vi[E2]]);
      c2 += 3 * P2;
      for (var D2 = [m2, k2], N2 = 0; N2 < 2; ++N2) {
        var q2 = D2[N2];
        for (E2 = 0; E2 < q2.length; ++E2) {
          var B2 = 31 & q2[E2];
          Ci(t2, c2, L2[B2]), c2 += I2[B2], B2 > 15 && (Ci(t2, c2, q2[E2] >>> 5 & 127), c2 += q2[E2] >>> 12);
        }
      }
    } else
      R2 = Ii, C2 = Ei, T2 = Fi, $2 = xi;
    for (E2 = 0; E2 < a2; ++E2)
      if (i2[E2] > 255) {
        B2 = i2[E2] >>> 18 & 31;
        Ti(t2, c2, R2[B2 + 257]), c2 += C2[B2 + 257], B2 > 7 && (Ci(t2, c2, i2[E2] >>> 23 & 31), c2 += hi[B2]);
        var H2 = 31 & i2[E2];
        Ti(t2, c2, T2[H2]), c2 += $2[H2], H2 > 3 && (Ti(t2, c2, i2[E2] >>> 5 & 8191), c2 += fi[H2]);
      } else
        Ti(t2, c2, R2[i2[E2]]), c2 += C2[i2[E2]];
    return Ti(t2, c2, R2[256]), c2 + C2[256];
  };
  var Ni = new di([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
  var qi = new li(0);
  var Bi = function() {
    for (var e5 = new di(256), t2 = 0; t2 < 256; ++t2) {
      for (var n3 = t2, i2 = 9; --i2; )
        n3 = (1 & n3 && 3988292384) ^ n3 >>> 1;
      e5[t2] = n3;
    }
    return e5;
  }();
  var Hi = function() {
    var e5 = 4294967295;
    return { p: function(t2) {
      for (var n3 = e5, i2 = 0; i2 < t2.length; ++i2)
        n3 = Bi[255 & n3 ^ t2[i2]] ^ n3 >>> 8;
      e5 = n3;
    }, d: function() {
      return 4294967295 ^ e5;
    } };
  };
  var Ui = function(e5, t2, n3, i2, r2) {
    return function(e6, t3, n4, i3, r3, s3) {
      var o2 = e6.length, a2 = new li(i3 + o2 + 5 * (1 + Math.floor(o2 / 7e3)) + r3), u2 = a2.subarray(i3, a2.length - r3), l3 = 0;
      if (!t3 || o2 < 8)
        for (var c2 = 0; c2 <= o2; c2 += 65535) {
          var d2 = c2 + 65535;
          d2 < o2 ? l3 = Li(u2, l3, e6.subarray(c2, d2)) : (u2[c2] = s3, l3 = Li(u2, l3, e6.subarray(c2, o2)));
        }
      else {
        for (var h2 = Ni[t3 - 1], f2 = h2 >>> 13, v2 = 8191 & h2, p2 = (1 << n4) - 1, g2 = new ci(32768), _2 = new ci(p2 + 1), m2 = Math.ceil(n4 / 3), y2 = 2 * m2, b2 = function(t4) {
          return (e6[t4] ^ e6[t4 + 1] << m2 ^ e6[t4 + 2] << y2) & p2;
        }, k2 = new di(25e3), w2 = new ci(288), S2 = new ci(32), E2 = 0, x2 = 0, I2 = (c2 = 0, 0), F2 = 0, P2 = 0; c2 < o2; ++c2) {
          var R2 = b2(c2), C2 = 32767 & c2, T2 = _2[R2];
          if (g2[C2] = T2, _2[R2] = C2, F2 <= c2) {
            var $2 = o2 - c2;
            if ((E2 > 7e3 || I2 > 24576) && $2 > 423) {
              l3 = Di(e6, u2, 0, k2, w2, S2, x2, I2, P2, c2 - P2, l3), I2 = E2 = x2 = 0, P2 = c2;
              for (var O2 = 0; O2 < 286; ++O2)
                w2[O2] = 0;
              for (O2 = 0; O2 < 30; ++O2)
                S2[O2] = 0;
            }
            var M2 = 2, A2 = 0, L2 = v2, D2 = C2 - T2 & 32767;
            if ($2 > 2 && R2 == b2(c2 - D2))
              for (var N2 = Math.min(f2, $2) - 1, q2 = Math.min(32767, c2), B2 = Math.min(258, $2); D2 <= q2 && --L2 && C2 != T2; ) {
                if (e6[c2 + M2] == e6[c2 + M2 - D2]) {
                  for (var H2 = 0; H2 < B2 && e6[c2 + H2] == e6[c2 + H2 - D2]; ++H2)
                    ;
                  if (H2 > M2) {
                    if (M2 = H2, A2 = D2, H2 > N2)
                      break;
                    var U2 = Math.min(D2, H2 - 2), j2 = 0;
                    for (O2 = 0; O2 < U2; ++O2) {
                      var W2 = c2 - D2 + O2 + 32768 & 32767, z2 = W2 - g2[W2] + 32768 & 32767;
                      z2 > j2 && (j2 = z2, T2 = W2);
                    }
                  }
                }
                D2 += (C2 = T2) - (T2 = g2[C2]) + 32768 & 32767;
              }
            if (A2) {
              k2[I2++] = 268435456 | mi[M2] << 18 | yi[A2];
              var V2 = 31 & mi[M2], G2 = 31 & yi[A2];
              x2 += hi[V2] + fi[G2], ++w2[257 + V2], ++S2[G2], F2 = c2 + M2, ++E2;
            } else
              k2[I2++] = e6[c2], ++w2[e6[c2]];
          }
        }
        l3 = Di(e6, u2, s3, k2, w2, S2, x2, I2, P2, c2 - P2, l3), s3 || (l3 = Li(u2, l3, qi));
      }
      return Ri(a2, 0, i3 + Pi(l3) + r3);
    }(e5, null == t2.level ? 6 : t2.level, null == t2.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(e5.length)))) : 12 + t2.mem, n3, i2, !r2);
  };
  var ji = function(e5, t2, n3) {
    for (; n3; ++t2)
      e5[t2] = n3, n3 >>>= 8;
  };
  var Wi = function(e5, t2) {
    var n3 = t2.filename;
    if (e5[0] = 31, e5[1] = 139, e5[2] = 8, e5[8] = t2.level < 2 ? 4 : 9 == t2.level ? 2 : 0, e5[9] = 3, 0 != t2.mtime && ji(e5, 4, Math.floor(new Date(t2.mtime || Date.now()) / 1e3)), n3) {
      e5[3] = 8;
      for (var i2 = 0; i2 <= n3.length; ++i2)
        e5[i2 + 10] = n3.charCodeAt(i2);
    }
  };
  var zi = function(e5) {
    return 10 + (e5.filename && e5.filename.length + 1 || 0);
  };
  function Vi(e5, t2) {
    void 0 === t2 && (t2 = {});
    var n3 = Hi(), i2 = e5.length;
    n3.p(e5);
    var r2 = Ui(e5, t2, zi(t2), 8), s3 = r2.length;
    return Wi(r2, t2), ji(r2, s3 - 8, n3.d()), ji(r2, s3 - 4, i2), r2;
  }
  function Gi(e5, t2) {
    var n3 = e5.length;
    if (!t2 && "undefined" != typeof TextEncoder)
      return new TextEncoder().encode(e5);
    for (var i2 = new li(e5.length + (e5.length >>> 1)), r2 = 0, s3 = function(e6) {
      i2[r2++] = e6;
    }, o2 = 0; o2 < n3; ++o2) {
      if (r2 + 5 > i2.length) {
        var a2 = new li(r2 + 8 + (n3 - o2 << 1));
        a2.set(i2), i2 = a2;
      }
      var u2 = e5.charCodeAt(o2);
      u2 < 128 || t2 ? s3(u2) : u2 < 2048 ? (s3(192 | u2 >>> 6), s3(128 | 63 & u2)) : u2 > 55295 && u2 < 57344 ? (s3(240 | (u2 = 65536 + (1047552 & u2) | 1023 & e5.charCodeAt(++o2)) >>> 18), s3(128 | u2 >>> 12 & 63), s3(128 | u2 >>> 6 & 63), s3(128 | 63 & u2)) : (s3(224 | u2 >>> 12), s3(128 | u2 >>> 6 & 63), s3(128 | 63 & u2));
    }
    return Ri(i2, 0, r2);
  }
  var Qi = 3e5;
  var Ji = Qi;
  var Yi = [xn.MouseMove, xn.MouseInteraction, xn.Scroll, xn.ViewportResize, xn.Input, xn.TouchMove, xn.MediaInteraction, xn.Drag];
  var Xi = function(e5) {
    return { rrwebMethod: e5, enqueuedAt: Date.now(), attempt: 1 };
  };
  var Ki = "[SessionRecording]";
  function Zi(e5) {
    return function(e6, t2) {
      var n3 = "";
      if (!t2 && "undefined" != typeof TextDecoder)
        return new TextDecoder().decode(e6);
      for (var i2 = 0; i2 < e6.length; ) {
        var r2 = e6[i2++];
        r2 < 128 || t2 ? n3 += String.fromCharCode(r2) : r2 < 224 ? n3 += String.fromCharCode((31 & r2) << 6 | 63 & e6[i2++]) : r2 < 240 ? n3 += String.fromCharCode((15 & r2) << 12 | (63 & e6[i2++]) << 6 | 63 & e6[i2++]) : (r2 = ((15 & r2) << 18 | (63 & e6[i2++]) << 12 | (63 & e6[i2++]) << 6 | 63 & e6[i2++]) - 65536, n3 += String.fromCharCode(55296 | r2 >> 10, 56320 | 1023 & r2));
      }
      return n3;
    }(Vi(Gi(JSON.stringify(e5))), true);
  }
  var er;
  var tr = function() {
    function t2(e5) {
      var n3 = this;
      if (L(this, t2), q(this, "queuedRRWebEvents", []), q(this, "isIdle", false), q(this, "_linkedFlagSeen", false), q(this, "_lastActivityTimestamp", Date.now()), q(this, "_linkedFlag", null), q(this, "_removePageViewCaptureHook", void 0), q(this, "_onSessionIdListener", void 0), q(this, "_persistDecideOnSessionListener", void 0), q(this, "_samplingSessionListener", void 0), q(this, "_forceAllowLocalhostNetworkCapture", false), q(this, "_onBeforeUnload", function() {
        n3._flushBuffer();
      }), q(this, "_onOffline", function() {
        n3._tryAddCustomEvent("browser offline", {});
      }), q(this, "_onOnline", function() {
        n3._tryAddCustomEvent("browser online", {});
      }), q(this, "_onVisibilityChange", function() {
        if (null != o && o.visibilityState) {
          var e6 = "window " + o.visibilityState;
          n3._tryAddCustomEvent(e6, {});
        }
      }), this.instance = e5, this._captureStarted = false, this._endpoint = "/s/", this.stopRrweb = void 0, this.receivedDecide = false, !this.instance.sessionManager)
        throw T.error(Ki + " started without valid sessionManager"), new Error(Ki + " started without valid sessionManager. This is a bug.");
      var i2 = this.sessionManager.checkAndGetSessionAndWindowId(), r2 = i2.sessionId, s3 = i2.windowId;
      this.sessionId = r2, this.windowId = s3, this.buffer = this.clearBuffer();
    }
    return N(t2, [{ key: "rrwebRecord", get: function() {
      var e5, t3;
      return null == h || null === (e5 = h.__PosthogExtensions__) || void 0 === e5 || null === (t3 = e5.rrweb) || void 0 === t3 ? void 0 : t3.record;
    } }, { key: "started", get: function() {
      return this._captureStarted;
    } }, { key: "sessionManager", get: function() {
      if (!this.instance.sessionManager)
        throw new Error(Ki + " must be started with a valid sessionManager.");
      return this.instance.sessionManager;
    } }, { key: "fullSnapshotIntervalMillis", get: function() {
      var e5;
      return (null === (e5 = this.instance.config.session_recording) || void 0 === e5 ? void 0 : e5.full_snapshot_interval_millis) || Qi;
    } }, { key: "isSampled", get: function() {
      var e5 = this.instance.get_property(xe);
      return P(e5) ? e5 : null;
    } }, { key: "sessionDuration", get: function() {
      var e5, t3, n3 = null === (e5 = this.buffer) || void 0 === e5 ? void 0 : e5.data[(null === (t3 = this.buffer) || void 0 === t3 ? void 0 : t3.data.length) - 1], i2 = this.sessionManager.checkAndGetSessionAndWindowId(true).sessionStartTimestamp;
      return n3 ? n3.timestamp - i2 : null;
    } }, { key: "isRecordingEnabled", get: function() {
      var t3 = !!this.instance.get_property(me), n3 = !this.instance.config.disable_session_recording;
      return e && t3 && n3;
    } }, { key: "isConsoleLogCaptureEnabled", get: function() {
      var e5 = !!this.instance.get_property(ye), t3 = this.instance.config.enable_recording_console_log;
      return null != t3 ? t3 : e5;
    } }, { key: "canvasRecording", get: function() {
      var e5 = this.instance.get_property(ke);
      return e5 && e5.fps && e5.quality ? { enabled: e5.enabled, fps: e5.fps, quality: e5.quality } : void 0;
    } }, { key: "networkPayloadCapture", get: function() {
      var e5, t3, n3 = this.instance.get_property(be), i2 = { recordHeaders: null === (e5 = this.instance.config.session_recording) || void 0 === e5 ? void 0 : e5.recordHeaders, recordBody: null === (t3 = this.instance.config.session_recording) || void 0 === t3 ? void 0 : t3.recordBody }, r2 = (null == i2 ? void 0 : i2.recordHeaders) || (null == n3 ? void 0 : n3.recordHeaders), s3 = (null == i2 ? void 0 : i2.recordBody) || (null == n3 ? void 0 : n3.recordBody), o2 = b(this.instance.config.capture_performance) ? this.instance.config.capture_performance.network_timing : this.instance.config.capture_performance, a2 = !!(P(o2) ? o2 : null == n3 ? void 0 : n3.capturePerformance);
      return r2 || s3 || a2 ? { recordHeaders: r2, recordBody: s3, recordPerformance: a2 } : void 0;
    } }, { key: "sampleRate", get: function() {
      var e5 = this.instance.get_property(we);
      return F(e5) ? e5 : null;
    } }, { key: "minimumDuration", get: function() {
      var e5 = this.instance.get_property(Se);
      return F(e5) ? e5 : null;
    } }, { key: "status", get: function() {
      return this.receivedDecide ? this.isRecordingEnabled ? I(this._linkedFlag) || this._linkedFlagSeen ? P(this.isSampled) ? this.isSampled ? "sampled" : "disabled" : "active" : "buffering" : "disabled" : "buffering";
    } }, { key: "startIfEnabledOrStop", value: function() {
      var t3 = this;
      this.isRecordingEnabled ? (this._startCapture(), null == e || e.addEventListener("beforeunload", this._onBeforeUnload), null == e || e.addEventListener("offline", this._onOffline), null == e || e.addEventListener("online", this._onOnline), null == e || e.addEventListener("visibilitychange", this._onVisibilityChange), this._setupSampling(), I(this._removePageViewCaptureHook) && (this._removePageViewCaptureHook = this.instance._addCaptureHook(function(n3) {
        try {
          if ("$pageview" === n3) {
            var i2 = e ? t3._maskUrl(e.location.href) : "";
            if (!i2)
              return;
            t3._tryAddCustomEvent("$pageview", { href: i2 });
          }
        } catch (e5) {
          T.error("Could not add $pageview to rrweb session", e5);
        }
      })), this._onSessionIdListener || (this._onSessionIdListener = this.sessionManager.onSessionId(function(e5, n3, i2) {
        i2 && t3._tryAddCustomEvent("$session_id_change", { sessionId: e5, windowId: n3, changeReason: i2 });
      })), T.info(Ki + " started")) : this.stopRecording();
    } }, { key: "stopRecording", value: function() {
      var t3, n3, i2;
      this._captureStarted && this.stopRrweb && (this.stopRrweb(), this.stopRrweb = void 0, this._captureStarted = false, null == e || e.removeEventListener("beforeunload", this._onBeforeUnload), null == e || e.removeEventListener("offline", this._onOffline), null == e || e.removeEventListener("online", this._onOnline), null == e || e.removeEventListener("visibilitychange", this._onVisibilityChange), this.clearBuffer(), clearInterval(this._fullSnapshotTimer), null === (t3 = this._removePageViewCaptureHook) || void 0 === t3 || t3.call(this), this._removePageViewCaptureHook = void 0, null === (n3 = this._onSessionIdListener) || void 0 === n3 || n3.call(this), this._onSessionIdListener = void 0, null === (i2 = this._samplingSessionListener) || void 0 === i2 || i2.call(this), this._samplingSessionListener = void 0, T.info(Ki + " stopped"));
    } }, { key: "makeSamplingDecision", value: function(e5) {
      var t3, n3 = this.sessionId !== e5, i2 = this.sampleRate;
      if (F(i2)) {
        var r2, s3 = this.isSampled, o2 = n3 || !P(s3);
        if (o2)
          r2 = Math.random() < i2;
        else
          r2 = s3;
        !r2 && o2 && T.warn(Ki + " Sample rate (".concat(i2, ") has determined that this sessionId (").concat(e5, ") will not be sent to the server.")), this._tryAddCustomEvent("samplingDecisionMade", { sampleRate: i2 }), null === (t3 = this.instance.persistence) || void 0 === t3 || t3.register(q({}, xe, r2));
      } else {
        var a2;
        null === (a2 = this.instance.persistence) || void 0 === a2 || a2.register(q({}, xe, null));
      }
    } }, { key: "afterDecideResponse", value: function(e5) {
      var t3, n3, i2, r2 = this;
      (this._persistDecideResponse(e5), this._linkedFlag = (null === (t3 = e5.sessionRecording) || void 0 === t3 ? void 0 : t3.linkedFlag) || null, null !== (n3 = e5.sessionRecording) && void 0 !== n3 && n3.endpoint) && (this._endpoint = null === (i2 = e5.sessionRecording) || void 0 === i2 ? void 0 : i2.endpoint);
      if (this._setupSampling(), !I(this._linkedFlag) && !this._linkedFlagSeen) {
        var s3 = S(this._linkedFlag) ? this._linkedFlag : this._linkedFlag.flag, o2 = S(this._linkedFlag) ? null : this._linkedFlag.variant;
        this.instance.onFeatureFlags(function(e6, t4) {
          var n4 = b(t4) && s3 in t4, i3 = o2 ? t4[s3] === o2 : n4;
          if (i3) {
            var a2 = { linkedFlag: s3, linkedVariant: o2 }, u2 = "linked flag matched";
            T.info(Ki + " " + u2, a2), r2._tryAddCustomEvent(u2, a2);
          }
          r2._linkedFlagSeen = i3;
        });
      }
      this.receivedDecide = true, this.startIfEnabledOrStop();
    } }, { key: "_setupSampling", value: function() {
      var e5 = this;
      F(this.sampleRate) && I(this._samplingSessionListener) && (this._samplingSessionListener = this.sessionManager.onSessionId(function(t3) {
        e5.makeSamplingDecision(t3);
      }));
    } }, { key: "_persistDecideResponse", value: function(e5) {
      if (this.instance.persistence) {
        var t3, n3 = this.instance.persistence, i2 = function() {
          var t4, i3, r2, s3, o2, a2, u2, l3, c2 = null === (t4 = e5.sessionRecording) || void 0 === t4 ? void 0 : t4.sampleRate, d2 = I(c2) ? null : parseFloat(c2), h2 = null === (i3 = e5.sessionRecording) || void 0 === i3 ? void 0 : i3.minimumDurationMilliseconds;
          n3.register((q(l3 = {}, me, !!e5.sessionRecording), q(l3, ye, null === (r2 = e5.sessionRecording) || void 0 === r2 ? void 0 : r2.consoleLogRecordingEnabled), q(l3, be, M({ capturePerformance: e5.capturePerformance }, null === (s3 = e5.sessionRecording) || void 0 === s3 ? void 0 : s3.networkPayloadCapture)), q(l3, ke, { enabled: null === (o2 = e5.sessionRecording) || void 0 === o2 ? void 0 : o2.recordCanvas, fps: null === (a2 = e5.sessionRecording) || void 0 === a2 ? void 0 : a2.canvasFps, quality: null === (u2 = e5.sessionRecording) || void 0 === u2 ? void 0 : u2.canvasQuality }), q(l3, we, d2), q(l3, Se, w(h2) ? null : h2), l3));
        };
        i2(), null === (t3 = this._persistDecideOnSessionListener) || void 0 === t3 || t3.call(this), this._persistDecideOnSessionListener = this.sessionManager.onSessionId(i2);
      }
    } }, { key: "log", value: function(e5) {
      var t3, n3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "log";
      null === (t3 = this.instance.sessionRecording) || void 0 === t3 || t3.onRRwebEmit({ type: 6, data: { plugin: "rrweb/console@1", payload: { level: n3, trace: [], payload: [JSON.stringify(e5)] } }, timestamp: Date.now() });
    } }, { key: "_startCapture", value: function() {
      var e5, t3, n3 = this;
      w(Object.assign) || (this._captureStarted || this.instance.config.disable_session_recording || this.instance.consent.isOptedOut() || (this._captureStarted = true, this.sessionManager.checkAndGetSessionAndWindowId(), this.rrwebRecord ? this._onScriptLoaded() : null === (e5 = h.__PosthogExtensions__) || void 0 === e5 || null === (t3 = e5.loadExternalDependency) || void 0 === t3 || t3.call(e5, this.instance, "recorder", function(e6) {
        if (e6)
          return T.error(Ki + " could not load recorder", e6);
        n3._onScriptLoaded();
      })));
    } }, { key: "isInteractiveEvent", value: function(e5) {
      var t3;
      return 3 === e5.type && -1 !== Yi.indexOf(null === (t3 = e5.data) || void 0 === t3 ? void 0 : t3.source);
    } }, { key: "_updateWindowAndSessionIds", value: function(e5) {
      var t3 = this.isInteractiveEvent(e5);
      t3 || this.isIdle || e5.timestamp - this._lastActivityTimestamp > Ji && (this.isIdle = true, clearInterval(this._fullSnapshotTimer), this._tryAddCustomEvent("sessionIdle", { eventTimestamp: e5.timestamp, lastActivityTimestamp: this._lastActivityTimestamp, threshold: Ji, bufferLength: this.buffer.data.length, bufferSize: this.buffer.size }), this._flushBuffer());
      var n3 = false;
      if (t3 && (this._lastActivityTimestamp = e5.timestamp, this.isIdle && (this.isIdle = false, this._tryAddCustomEvent("sessionNoLongerIdle", { reason: "user activity", type: e5.type }), n3 = true)), !this.isIdle) {
        var i2 = this.sessionManager.checkAndGetSessionAndWindowId(!t3, e5.timestamp), r2 = i2.windowId, s3 = i2.sessionId, o2 = this.sessionId !== s3, a2 = this.windowId !== r2;
        this.windowId = r2, this.sessionId = s3, o2 || a2 ? (this.stopRecording(), this.startIfEnabledOrStop()) : n3 && this._scheduleFullSnapshot();
      }
    } }, { key: "_tryRRWebMethod", value: function(e5) {
      try {
        return e5.rrwebMethod(), true;
      } catch (t3) {
        return this.queuedRRWebEvents.length < 10 ? this.queuedRRWebEvents.push({ enqueuedAt: e5.enqueuedAt || Date.now(), attempt: e5.attempt++, rrwebMethod: e5.rrwebMethod }) : T.warn(Ki + " could not emit queued rrweb event.", t3, e5), false;
      }
    } }, { key: "_tryAddCustomEvent", value: function(e5, t3) {
      var n3 = this;
      return this._tryRRWebMethod(Xi(function() {
        return n3.rrwebRecord.addCustomEvent(e5, t3);
      }));
    } }, { key: "_tryTakeFullSnapshot", value: function() {
      var e5 = this;
      return this._tryRRWebMethod(Xi(function() {
        return e5.rrwebRecord.takeFullSnapshot();
      }));
    } }, { key: "_onScriptLoaded", value: function() {
      for (var e5, t3 = this, n3 = { blockClass: "ph-no-capture", blockSelector: void 0, ignoreClass: "ph-ignore-input", maskTextClass: "ph-mask", maskTextSelector: void 0, maskTextFn: void 0, maskAllInputs: true, maskInputOptions: { password: true }, maskInputFn: void 0, slimDOMOptions: {}, collectFonts: false, inlineStylesheet: true, recordCrossOriginIframes: false }, i2 = this.instance.config.session_recording, r2 = 0, s3 = Object.entries(i2 || {}); r2 < s3.length; r2++) {
        var o2 = H(s3[r2], 2), a2 = o2[0], u2 = o2[1];
        a2 in n3 && ("maskInputOptions" === a2 ? n3.maskInputOptions = M({ password: true }, u2) : n3[a2] = u2);
      }
      if (this.canvasRecording && this.canvasRecording.enabled && (n3.recordCanvas = true, n3.sampling = { canvas: this.canvasRecording.fps }, n3.dataURLOptions = { type: "image/webp", quality: this.canvasRecording.quality }), this.rrwebRecord) {
        this.mutationRateLimiter = null !== (e5 = this.mutationRateLimiter) && void 0 !== e5 ? e5 : new ui(this.rrwebRecord, { onBlockedNode: function(e6, n4) {
          var i3 = "Too many mutations on node '".concat(e6, "'. Rate limiting. This could be due to SVG animations or something similar");
          T.info(i3, { node: n4 }), t3.log(Ki + " " + i3, "warn");
        } });
        var l3 = this._gatherRRWebPlugins();
        this.stopRrweb = this.rrwebRecord(M({ emit: function(e6) {
          t3.onRRwebEmit(e6);
        }, plugins: l3 }, n3)), this._lastActivityTimestamp = Date.now(), this.isIdle = false, this._tryAddCustomEvent("$session_options", { sessionRecordingOptions: n3, activePlugins: l3.map(function(e6) {
          return null == e6 ? void 0 : e6.name;
        }) }), this._tryAddCustomEvent("$posthog_config", { config: this.instance.config });
      } else
        T.error(Ki + "onScriptLoaded was called but rrwebRecord is not available. This indicates something has gone wrong.");
    } }, { key: "_scheduleFullSnapshot", value: function() {
      var e5 = this;
      if (this._fullSnapshotTimer && clearInterval(this._fullSnapshotTimer), !this.isIdle) {
        var t3 = this.fullSnapshotIntervalMillis;
        t3 && (this._fullSnapshotTimer = setInterval(function() {
          e5._tryTakeFullSnapshot();
        }, t3));
      }
    } }, { key: "_gatherRRWebPlugins", value: function() {
      var e5, t3, n3, i2, r2 = [], s3 = null === (e5 = h.__PosthogExtensions__) || void 0 === e5 || null === (t3 = e5.rrwebPlugins) || void 0 === t3 ? void 0 : t3.getRecordConsolePlugin;
      s3 && this.isConsoleLogCaptureEnabled && r2.push(s3());
      var o2 = null === (n3 = h.__PosthogExtensions__) || void 0 === n3 || null === (i2 = n3.rrwebPlugins) || void 0 === i2 ? void 0 : i2.getRecordNetworkPlugin;
      this.networkPayloadCapture && y(o2) && (!pt.includes(location.hostname) || this._forceAllowLocalhostNetworkCapture ? r2.push(o2(ai(this.instance.config, this.networkPayloadCapture))) : T.info(Ki + " NetworkCapture not started because we are on localhost."));
      return r2;
    } }, { key: "onRRwebEmit", value: function(e5) {
      if (this._processQueuedEvents(), e5 && b(e5)) {
        if (e5.type === En.Meta) {
          var t3 = this._maskUrl(e5.data.href);
          if (this._lastHref = t3, !t3)
            return;
          e5.data.href = t3;
        } else
          this._pageViewFallBack();
        e5.type === En.FullSnapshot && this._scheduleFullSnapshot();
        var n3 = this.mutationRateLimiter ? this.mutationRateLimiter.throttleMutations(e5) : e5;
        if (n3) {
          var i2 = function(e6) {
            var t4 = e6;
            if (t4 && b(t4) && 6 === t4.type && b(t4.data) && "rrweb/console@1" === t4.data.plugin) {
              t4.data.payload.payload.length > 10 && (t4.data.payload.payload = t4.data.payload.payload.slice(0, 10), t4.data.payload.payload.push("...[truncated]"));
              for (var n4 = [], i3 = 0; i3 < t4.data.payload.payload.length; i3++)
                t4.data.payload.payload[i3] && t4.data.payload.payload[i3].length > 2e3 ? n4.push(t4.data.payload.payload[i3].slice(0, 2e3) + "...[truncated]") : n4.push(t4.data.payload.payload[i3]);
              return t4.data.payload.payload = n4, e6;
            }
            return e6;
          }(n3);
          if (this._updateWindowAndSessionIds(i2), !this.isIdle || i2.type === En.Custom) {
            if (i2.type === En.Custom && "sessionIdle" === i2.data.tag) {
              var r2 = i2.data.payload;
              if (r2) {
                var s3 = r2.lastActivityTimestamp, o2 = r2.threshold;
                i2.timestamp = s3 + o2;
              }
            }
            var a2 = this.instance.config.session_recording.compress_events ? function(e6, t4) {
              try {
                if (e6.type === En.FullSnapshot)
                  return M(M({}, e6), {}, { data: Zi(e6.data), cv: "2024-10" });
                if (e6.type === En.IncrementalSnapshot && e6.data.source === xn.Mutation)
                  return M(M({}, e6), {}, { cv: "2024-10", data: M(M({}, e6.data), {}, { texts: Zi(e6.data.texts), attributes: Zi(e6.data.attributes), removes: Zi(e6.data.removes), adds: Zi(e6.data.adds) }) });
                if (e6.type === En.IncrementalSnapshot && e6.data.source === xn.StyleSheetRule)
                  return M(M({}, e6), {}, { cv: "2024-10", data: M(M({}, e6.data), {}, { adds: Zi(e6.data.adds), removes: Zi(e6.data.removes) }) });
              } catch (n4) {
                T.error(Ki + " could not compress event", n4), t4.captureException(n4 || "e was not an error", { attempted_event_type: (null == e6 ? void 0 : e6.type) || "no event type" });
              }
              return e6;
            }(i2, this.instance) : i2, u2 = { $snapshot_bytes: wn(a2), $snapshot_data: a2, $session_id: this.sessionId, $window_id: this.windowId };
            "disabled" !== this.status ? this._captureSnapshotBuffered(u2) : this.clearBuffer();
          }
        }
      }
    } }, { key: "_pageViewFallBack", value: function() {
      if (!this.instance.config.capture_pageview && e) {
        var t3 = this._maskUrl(e.location.href);
        this._lastHref !== t3 && (this._tryAddCustomEvent("$url_changed", { href: t3 }), this._lastHref = t3);
      }
    } }, { key: "_processQueuedEvents", value: function() {
      var e5 = this;
      if (this.queuedRRWebEvents.length) {
        var t3 = U(this.queuedRRWebEvents);
        this.queuedRRWebEvents = [], t3.forEach(function(t4) {
          Date.now() - t4.enqueuedAt <= 2e3 && e5._tryRRWebMethod(t4);
        });
      }
    } }, { key: "_maskUrl", value: function(e5) {
      var t3 = this.instance.config.session_recording;
      if (t3.maskNetworkRequestFn) {
        var n3, i2 = { url: e5 };
        return null === (n3 = i2 = t3.maskNetworkRequestFn(i2)) || void 0 === n3 ? void 0 : n3.url;
      }
      return e5;
    } }, { key: "clearBuffer", value: function() {
      return this.buffer = { size: 0, data: [], sessionId: this.sessionId, windowId: this.windowId }, this.buffer;
    } }, { key: "_flushBuffer", value: function() {
      var e5 = this;
      this.flushBufferTimer && (clearTimeout(this.flushBufferTimer), this.flushBufferTimer = void 0);
      var t3 = this.minimumDuration, n3 = this.sessionDuration, i2 = F(n3) && n3 >= 0, r2 = F(t3) && i2 && n3 < t3;
      if ("buffering" === this.status || r2)
        return this.flushBufferTimer = setTimeout(function() {
          e5._flushBuffer();
        }, 2e3), this.buffer;
      this.buffer.data.length > 0 && Sn(this.buffer).forEach(function(t4) {
        e5._captureSnapshot({ $snapshot_bytes: t4.size, $snapshot_data: t4.data, $session_id: t4.sessionId, $window_id: t4.windowId });
      });
      return this.clearBuffer();
    } }, { key: "_captureSnapshotBuffered", value: function(e5) {
      var t3, n3 = this, i2 = 2 + ((null === (t3 = this.buffer) || void 0 === t3 ? void 0 : t3.data.length) || 0);
      !this.isIdle && (this.buffer.size + e5.$snapshot_bytes + i2 > 943718.4 || this.buffer.sessionId !== this.sessionId) && (this.buffer = this._flushBuffer()), this.buffer.size += e5.$snapshot_bytes, this.buffer.data.push(e5.$snapshot_data), this.flushBufferTimer || this.isIdle || (this.flushBufferTimer = setTimeout(function() {
        n3._flushBuffer();
      }, 2e3));
    } }, { key: "_captureSnapshot", value: function(e5) {
      this.instance.capture("$snapshot", e5, { _url: this.instance.requestRouter.endpointFor("api", this._endpoint), _noTruncate: true, _batchKey: "recordings", skip_client_rate_limiting: true });
    } }, { key: "overrideLinkedFlag", value: function() {
      this._linkedFlagSeen = true;
    } }]), t2;
  }();
  var nr = function() {
    function e5(t2) {
      L(this, e5), this.instance = t2, this.instance.decideEndpointWasHit = this.instance._hasBootstrappedFeatureFlags();
    }
    return N(e5, [{ key: "call", value: function() {
      var e6 = this, t2 = { token: this.instance.config.token, distinct_id: this.instance.get_distinct_id(), groups: this.instance.getGroups(), person_properties: this.instance.get_property(Pe), group_properties: this.instance.get_property(Re), disable_flags: this.instance.config.advanced_disable_feature_flags || this.instance.config.advanced_disable_feature_flags_on_first_load || void 0 };
      this.instance._send_request({ method: "POST", url: this.instance.requestRouter.endpointFor("api", "/decide/?v=3"), data: t2, compression: this.instance.config.disable_compression ? void 0 : re.Base64, timeout: this.instance.config.feature_flag_request_timeout_ms, callback: function(t3) {
        return e6.parseDecideResponse(t3.json);
      } });
    } }, { key: "parseDecideResponse", value: function(e6) {
      var t2 = this;
      this.instance.featureFlags.setReloadingPaused(false), this.instance.featureFlags._startReloadTimer();
      var n3 = !e6;
      if (this.instance.config.advanced_disable_feature_flags_on_first_load || this.instance.config.advanced_disable_feature_flags || this.instance.featureFlags.receivedFeatureFlags(null != e6 ? e6 : {}, n3), n3)
        T.error("Failed to fetch feature flags from PostHog.");
      else {
        if (!o || !o.body)
          return T.info("document not ready yet, trying again in 500 milliseconds..."), void setTimeout(function() {
            t2.parseDecideResponse(e6);
          }, 500);
        if (this.instance._afterDecideResponse(e6), e6.siteApps)
          if (this.instance.config.opt_in_site_apps) {
            var i2, r2 = z(e6.siteApps);
            try {
              var s3 = function() {
                var e7, n4, r3 = i2.value, s4 = r3.id, o2 = r3.url;
                h["__$$ph_site_app_".concat(s4)] = t2.instance, null === (e7 = h.__PosthogExtensions__) || void 0 === e7 || null === (n4 = e7.loadSiteApp) || void 0 === n4 || n4.call(e7, t2.instance, o2, function(e8) {
                  if (e8)
                    return T.error("Error while initializing PostHog app with config id ".concat(s4), e8);
                });
              };
              for (r2.s(); !(i2 = r2.n()).done; )
                s3();
            } catch (e7) {
              r2.e(e7);
            } finally {
              r2.f();
            }
          } else
            e6.siteApps.length > 0 && T.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
      }
    } }]), e5;
  }();
  var ir = null != e && e.location ? bt(e.location.hash, "__posthog") || bt(location.hash, "state") : null;
  var rr = "_postHogToolbarParams";
  !function(e5) {
    e5[e5.UNINITIALIZED = 0] = "UNINITIALIZED", e5[e5.LOADING = 1] = "LOADING", e5[e5.LOADED = 2] = "LOADED";
  }(er || (er = {}));
  var sr = function() {
    function t2(e5) {
      L(this, t2), this.instance = e5;
    }
    return N(t2, [{ key: "setToolbarState", value: function(e5) {
      h.ph_toolbar_state = e5;
    } }, { key: "getToolbarState", value: function() {
      var e5;
      return null !== (e5 = h.ph_toolbar_state) && void 0 !== e5 ? e5 : er.UNINITIALIZED;
    } }, { key: "maybeLoadToolbar", value: function() {
      var t3, n3, i2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0, r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0, s3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
      if (!e || !o)
        return false;
      i2 = null !== (t3 = i2) && void 0 !== t3 ? t3 : e.location, s3 = null !== (n3 = s3) && void 0 !== n3 ? n3 : e.history;
      try {
        if (!r2) {
          try {
            e.localStorage.setItem("test", "test"), e.localStorage.removeItem("test");
          } catch (e5) {
            return false;
          }
          r2 = null == e ? void 0 : e.localStorage;
        }
        var a2, u2 = ir || bt(i2.hash, "__posthog") || bt(i2.hash, "state"), l3 = u2 ? Z(function() {
          return JSON.parse(atob(decodeURIComponent(u2)));
        }) || Z(function() {
          return JSON.parse(decodeURIComponent(u2));
        }) : null;
        return l3 && "ph_authorize" === l3.action ? ((a2 = l3).source = "url", a2 && Object.keys(a2).length > 0 && (l3.desiredHash ? i2.hash = l3.desiredHash : s3 ? s3.replaceState(s3.state, "", i2.pathname + i2.search) : i2.hash = "")) : ((a2 = JSON.parse(r2.getItem(rr) || "{}")).source = "localstorage", delete a2.userIntent), !(!a2.token || this.instance.config.token !== a2.token) && (this.loadToolbar(a2), true);
      } catch (e5) {
        return false;
      }
    } }, { key: "_callLoadToolbar", value: function(e5) {
      (h.ph_load_toolbar || h.ph_load_editor)(e5, this.instance);
    } }, { key: "loadToolbar", value: function(t3) {
      var n3 = this, i2 = !(null == o || !o.getElementById(Be));
      if (!e || i2)
        return false;
      var r2 = "custom" === this.instance.requestRouter.region && this.instance.config.advanced_disable_toolbar_metrics, s3 = M(M({ token: this.instance.config.token }, t3), {}, { apiURL: this.instance.requestRouter.endpointFor("ui") }, r2 ? { instrument: false } : {});
      if (e.localStorage.setItem(rr, JSON.stringify(M(M({}, s3), {}, { source: void 0 }))), this.getToolbarState() === er.LOADED)
        this._callLoadToolbar(s3);
      else if (this.getToolbarState() === er.UNINITIALIZED) {
        var a2, u2;
        this.setToolbarState(er.LOADING), null === (a2 = h.__PosthogExtensions__) || void 0 === a2 || null === (u2 = a2.loadExternalDependency) || void 0 === u2 || u2.call(a2, this.instance, "toolbar", function(e5) {
          if (e5)
            return T.error("Failed to load toolbar", e5), void n3.setToolbarState(er.UNINITIALIZED);
          n3.setToolbarState(er.LOADED), n3._callLoadToolbar(s3);
        }), oe(e, "turbolinks:load", function() {
          n3.setToolbarState(er.UNINITIALIZED), n3.loadToolbar(s3);
        });
      }
      return true;
    } }, { key: "_loadEditor", value: function(e5) {
      return this.loadToolbar(e5);
    } }, { key: "maybeLoadEditor", value: function() {
      var e5 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0, t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0, n3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
      return this.maybeLoadToolbar(e5, t3, n3);
    } }]), t2;
  }();
  var or = function() {
    function e5(t2) {
      L(this, e5), q(this, "isPaused", true), q(this, "queue", []), q(this, "flushTimeoutMs", 3e3), this.sendRequest = t2;
    }
    return N(e5, [{ key: "enqueue", value: function(e6) {
      this.queue.push(e6), this.flushTimeout || this.setFlushTimeout();
    } }, { key: "unload", value: function() {
      var e6 = this;
      this.clearFlushTimeout();
      var t2 = this.queue.length > 0 ? this.formatQueue() : {}, n3 = Object.values(t2);
      [].concat(U(n3.filter(function(e7) {
        return 0 === e7.url.indexOf("/e");
      })), U(n3.filter(function(e7) {
        return 0 !== e7.url.indexOf("/e");
      }))).map(function(t3) {
        e6.sendRequest(M(M({}, t3), {}, { transport: "sendBeacon" }));
      });
    } }, { key: "enable", value: function() {
      this.isPaused = false, this.setFlushTimeout();
    } }, { key: "setFlushTimeout", value: function() {
      var e6 = this;
      this.isPaused || (this.flushTimeout = setTimeout(function() {
        if (e6.clearFlushTimeout(), e6.queue.length > 0) {
          var t2 = e6.formatQueue(), n3 = function(n4) {
            var i3 = t2[n4], r2 = new Date().getTime();
            i3.data && m(i3.data) && J(i3.data, function(e7) {
              e7.offset = Math.abs(e7.timestamp - r2), delete e7.timestamp;
            }), e6.sendRequest(i3);
          };
          for (var i2 in t2)
            n3(i2);
        }
      }, this.flushTimeoutMs));
    } }, { key: "clearFlushTimeout", value: function() {
      clearTimeout(this.flushTimeout), this.flushTimeout = void 0;
    } }, { key: "formatQueue", value: function() {
      var e6 = {};
      return J(this.queue, function(t2) {
        var n3, i2 = t2, r2 = (i2 ? i2.batchKey : null) || i2.url;
        w(e6[r2]) && (e6[r2] = M(M({}, i2), {}, { data: [] })), null === (n3 = e6[r2].data) || void 0 === n3 || n3.push(i2.data);
      }), this.queue = [], e6;
    } }]), e5;
  }();
  var ar = !!l2 || !!u;
  var ur = "text/plain";
  var lr = function(e5, t2) {
    var n3 = H(e5.split("?"), 2), i2 = n3[0], r2 = n3[1], s3 = M({}, t2);
    null == r2 || r2.split("&").forEach(function(e6) {
      var t3 = H(e6.split("="), 1)[0];
      delete s3[t3];
    });
    var o2 = mt(s3);
    return o2 = o2 ? (r2 ? r2 + "&" : "") + o2 : r2, "".concat(i2, "?").concat(o2);
  };
  var cr = function(e5) {
    var t2 = e5.data, n3 = e5.compression;
    if (t2) {
      if (n3 === re.GZipJS) {
        var i2 = Vi(Gi(JSON.stringify(t2)), { mtime: 0 }), r2 = new Blob([i2], { type: ur });
        return { contentType: ur, body: r2, estimatedSize: r2.size };
      }
      if (n3 === re.Base64) {
        var s3 = function(e6) {
          var t3, n4, i3, r3, s4, o3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", a3 = 0, u2 = 0, l3 = "", c2 = [];
          if (!e6)
            return e6;
          e6 = se(e6);
          do {
            t3 = (s4 = e6.charCodeAt(a3++) << 16 | e6.charCodeAt(a3++) << 8 | e6.charCodeAt(a3++)) >> 18 & 63, n4 = s4 >> 12 & 63, i3 = s4 >> 6 & 63, r3 = 63 & s4, c2[u2++] = o3.charAt(t3) + o3.charAt(n4) + o3.charAt(i3) + o3.charAt(r3);
          } while (a3 < e6.length);
          switch (l3 = c2.join(""), e6.length % 3) {
            case 1:
              l3 = l3.slice(0, -2) + "==";
              break;
            case 2:
              l3 = l3.slice(0, -1) + "=";
          }
          return l3;
        }(JSON.stringify(t2)), o2 = function(e6) {
          return "data=" + encodeURIComponent("string" == typeof e6 ? e6 : JSON.stringify(e6));
        }(s3);
        return { contentType: "application/x-www-form-urlencoded", body: o2, estimatedSize: new Blob([o2]).size };
      }
      var a2 = JSON.stringify(t2);
      return { contentType: "application/json", body: a2, estimatedSize: new Blob([a2]).size };
    }
  };
  var dr = [];
  l2 && dr.push({ transport: "XHR", method: function(e5) {
    var t2, n3 = new l2();
    n3.open(e5.method || "GET", e5.url, true);
    var i2 = null !== (t2 = cr(e5)) && void 0 !== t2 ? t2 : {}, r2 = i2.contentType, s3 = i2.body;
    J(e5.headers, function(e6, t3) {
      n3.setRequestHeader(t3, e6);
    }), r2 && n3.setRequestHeader("Content-Type", r2), e5.timeout && (n3.timeout = e5.timeout), n3.withCredentials = true, n3.onreadystatechange = function() {
      if (4 === n3.readyState) {
        var t3, i3 = { statusCode: n3.status, text: n3.responseText };
        if (200 === n3.status)
          try {
            i3.json = JSON.parse(n3.responseText);
          } catch (e6) {
          }
        null === (t3 = e5.callback) || void 0 === t3 || t3.call(e5, i3);
      }
    }, n3.send(s3);
  } }), u && dr.push({ transport: "fetch", method: function(e5) {
    var t2, n3, i2 = null !== (t2 = cr(e5)) && void 0 !== t2 ? t2 : {}, r2 = i2.contentType, s3 = i2.body, o2 = i2.estimatedSize, a2 = new Headers();
    J(e5.headers, function(e6, t3) {
      a2.append(t3, e6);
    }), r2 && a2.append("Content-Type", r2);
    var l3 = e5.url, d2 = null;
    if (c) {
      var h2 = new c();
      d2 = { signal: h2.signal, timeout: setTimeout(function() {
        return h2.abort();
      }, e5.timeout) };
    }
    u(l3, { method: (null == e5 ? void 0 : e5.method) || "GET", headers: a2, keepalive: "POST" === e5.method && (o2 || 0) < 65536, body: s3, signal: null === (n3 = d2) || void 0 === n3 ? void 0 : n3.signal }).then(function(t3) {
      return t3.text().then(function(n4) {
        var i3, r3 = { statusCode: t3.status, text: n4 };
        if (200 === t3.status)
          try {
            r3.json = JSON.parse(n4);
          } catch (e6) {
            T.error(e6);
          }
        null === (i3 = e5.callback) || void 0 === i3 || i3.call(e5, r3);
      });
    }).catch(function(t3) {
      var n4;
      T.error(t3), null === (n4 = e5.callback) || void 0 === n4 || n4.call(e5, { statusCode: 0, text: t3 });
    }).finally(function() {
      return d2 ? clearTimeout(d2.timeout) : null;
    });
  } }), null != s2 && s2.sendBeacon && dr.push({ transport: "sendBeacon", method: function(e5) {
    var t2 = lr(e5.url, { beacon: "1" });
    try {
      var n3, i2 = null !== (n3 = cr(e5)) && void 0 !== n3 ? n3 : {}, r2 = i2.contentType, o2 = i2.body, a2 = "string" == typeof o2 ? new Blob([o2], { type: r2 }) : o2;
      s2.sendBeacon(t2, a2);
    } catch (e6) {
    }
  } });
  var hr = ["retriesPerformedSoFar"];
  var fr;
  var vr = function() {
    function t2(n3) {
      var i2 = this;
      L(this, t2), q(this, "isPolling", false), q(this, "pollIntervalMs", 3e3), q(this, "queue", []), this.instance = n3, this.queue = [], this.areWeOnline = true, !w(e) && "onLine" in e.navigator && (this.areWeOnline = e.navigator.onLine, e.addEventListener("online", function() {
        i2.areWeOnline = true, i2.flush();
      }), e.addEventListener("offline", function() {
        i2.areWeOnline = false;
      }));
    }
    return N(t2, [{ key: "retriableRequest", value: function(e5) {
      var t3 = this, n3 = e5.retriesPerformedSoFar, i2 = B(e5, hr);
      F(n3) && n3 > 0 && (i2.url = lr(i2.url, { retry_count: n3 })), this.instance._send_request(M(M({}, i2), {}, { callback: function(e6) {
        var r2;
        200 !== e6.statusCode && (e6.statusCode < 400 || e6.statusCode >= 500) && (null != n3 ? n3 : 0) < 10 ? t3.enqueue(M({ retriesPerformedSoFar: n3 }, i2)) : null === (r2 = i2.callback) || void 0 === r2 || r2.call(i2, e6);
      } }));
    } }, { key: "enqueue", value: function(e5) {
      var t3 = e5.retriesPerformedSoFar || 0;
      e5.retriesPerformedSoFar = t3 + 1;
      var n3 = function(e6) {
        var t4 = 3e3 * Math.pow(2, e6), n4 = t4 / 2, i3 = Math.min(18e5, t4), r3 = (Math.random() - 0.5) * (i3 - n4);
        return Math.ceil(i3 + r3);
      }(t3), i2 = Date.now() + n3;
      this.queue.push({ retryAt: i2, requestOptions: e5 });
      var r2 = "Enqueued failed request for retry in ".concat(n3);
      navigator.onLine || (r2 += " (Browser is offline)"), T.warn(r2), this.isPolling || (this.isPolling = true, this.poll());
    } }, { key: "poll", value: function() {
      var e5 = this;
      this.poller && clearTimeout(this.poller), this.poller = setTimeout(function() {
        e5.areWeOnline && e5.queue.length > 0 && e5.flush(), e5.poll();
      }, this.pollIntervalMs);
    } }, { key: "flush", value: function() {
      var e5 = Date.now(), t3 = [], n3 = this.queue.filter(function(n4) {
        return n4.retryAt < e5 || (t3.push(n4), false);
      });
      if (this.queue = t3, n3.length > 0) {
        var i2, r2 = z(n3);
        try {
          for (r2.s(); !(i2 = r2.n()).done; ) {
            var s3 = i2.value.requestOptions;
            this.retriableRequest(s3);
          }
        } catch (e6) {
          r2.e(e6);
        } finally {
          r2.f();
        }
      }
    } }, { key: "unload", value: function() {
      this.poller && (clearTimeout(this.poller), this.poller = void 0);
      var e5, t3 = z(this.queue);
      try {
        for (t3.s(); !(e5 = t3.n()).done; ) {
          var n3 = e5.value.requestOptions;
          try {
            this.instance._send_request(M(M({}, n3), {}, { transport: "sendBeacon" }));
          } catch (e6) {
            T.error(e6);
          }
        }
      } catch (e6) {
        t3.e(e6);
      } finally {
        t3.f();
      }
      this.queue = [];
    } }]), t2;
  }();
  var pr = 1800;
  var gr = function() {
    function t2(e5, n3, i2, r2) {
      var s3;
      L(this, t2), q(this, "_sessionIdChangedHandlers", []), this.config = e5, this.persistence = n3, this._windowId = void 0, this._sessionId = void 0, this._sessionStartTimestamp = null, this._sessionActivityTimestamp = null, this._sessionIdGenerator = i2 || Ze, this._windowIdGenerator = r2 || Ze;
      var o2 = e5.persistence_name || e5.token, a2 = e5.session_idle_timeout_seconds || pr;
      if (F(a2) ? a2 > pr ? T.warn("session_idle_timeout_seconds cannot be  greater than 30 minutes. Using 30 minutes instead.") : a2 < 60 && T.warn("session_idle_timeout_seconds cannot be less than 60 seconds. Using 60 seconds instead.") : (T.warn("session_idle_timeout_seconds must be a number. Defaulting to 30 minutes."), a2 = pr), this._sessionTimeoutMs = 1e3 * Math.min(Math.max(a2, 60), pr), this._window_id_storage_key = "ph_" + o2 + "_window_id", this._primary_window_exists_storage_key = "ph_" + o2 + "_primary_window_exists", this._canUseSessionStorage()) {
        var u2 = vt.parse(this._window_id_storage_key), l3 = vt.parse(this._primary_window_exists_storage_key);
        u2 && !l3 ? this._windowId = u2 : vt.remove(this._window_id_storage_key), vt.set(this._primary_window_exists_storage_key, true);
      }
      if (null !== (s3 = this.config.bootstrap) && void 0 !== s3 && s3.sessionID)
        try {
          var c2 = function(e6) {
            var t3 = e6.replace(/-/g, "");
            if (32 !== t3.length)
              throw new Error("Not a valid UUID");
            if ("7" !== t3[12])
              throw new Error("Not a UUIDv7");
            return parseInt(t3.substring(0, 12), 16);
          }(this.config.bootstrap.sessionID);
          this._setSessionId(this.config.bootstrap.sessionID, new Date().getTime(), c2);
        } catch (e6) {
          T.error("Invalid sessionID in bootstrap", e6);
        }
      this._listenToReloadWindow();
    }
    return N(t2, [{ key: "onSessionId", value: function(e5) {
      var t3 = this;
      return w(this._sessionIdChangedHandlers) && (this._sessionIdChangedHandlers = []), this._sessionIdChangedHandlers.push(e5), this._sessionId && e5(this._sessionId, this._windowId), function() {
        t3._sessionIdChangedHandlers = t3._sessionIdChangedHandlers.filter(function(t4) {
          return t4 !== e5;
        });
      };
    } }, { key: "_canUseSessionStorage", value: function() {
      return "memory" !== this.config.persistence && !this.persistence.disabled && vt.is_supported();
    } }, { key: "_setWindowId", value: function(e5) {
      e5 !== this._windowId && (this._windowId = e5, this._canUseSessionStorage() && vt.set(this._window_id_storage_key, e5));
    } }, { key: "_getWindowId", value: function() {
      return this._windowId ? this._windowId : this._canUseSessionStorage() ? vt.parse(this._window_id_storage_key) : null;
    } }, { key: "_setSessionId", value: function(e5, t3, n3) {
      e5 === this._sessionId && t3 === this._sessionActivityTimestamp && n3 === this._sessionStartTimestamp || (this._sessionStartTimestamp = n3, this._sessionActivityTimestamp = t3, this._sessionId = e5, this.persistence.register(q({}, Ee, [t3, e5, n3])));
    } }, { key: "_getSessionId", value: function() {
      if (this._sessionId && this._sessionActivityTimestamp && this._sessionStartTimestamp)
        return [this._sessionActivityTimestamp, this._sessionId, this._sessionStartTimestamp];
      var e5 = this.persistence.props[Ee];
      return m(e5) && 2 === e5.length && e5.push(e5[0]), e5 || [0, null, 0];
    } }, { key: "resetSessionId", value: function() {
      this._setSessionId(null, null, null);
    } }, { key: "_listenToReloadWindow", value: function() {
      var t3 = this;
      null == e || e.addEventListener("beforeunload", function() {
        t3._canUseSessionStorage() && vt.remove(t3._primary_window_exists_storage_key);
      });
    } }, { key: "checkAndGetSessionAndWindowId", value: function() {
      var e5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], t3 = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null) || new Date().getTime(), n3 = H(this._getSessionId(), 3), i2 = n3[0], r2 = n3[1], s3 = n3[2], o2 = this._getWindowId(), a2 = F(s3) && s3 > 0 && Math.abs(t3 - s3) > 864e5, u2 = false, l3 = !r2, c2 = !e5 && Math.abs(t3 - i2) > this._sessionTimeoutMs;
      l3 || c2 || a2 ? (r2 = this._sessionIdGenerator(), o2 = this._windowIdGenerator(), T.info("[SessionId] new session ID generated", { sessionId: r2, windowId: o2, changeReason: { noSessionId: l3, activityTimeout: c2, sessionPastMaximumLength: a2 } }), s3 = t3, u2 = true) : o2 || (o2 = this._windowIdGenerator(), u2 = true);
      var d2 = 0 === i2 || !e5 || a2 ? t3 : i2, h2 = 0 === s3 ? new Date().getTime() : s3;
      return this._setWindowId(o2), this._setSessionId(r2, d2, h2), u2 && this._sessionIdChangedHandlers.forEach(function(e6) {
        return e6(r2, o2, u2 ? { noSessionId: l3, activityTimeout: c2, sessionPastMaximumLength: a2 } : void 0);
      }), { sessionId: r2, windowId: o2, sessionStartTimestamp: h2, changeReason: u2 ? { noSessionId: l3, activityTimeout: c2, sessionPastMaximumLength: a2 } : void 0 };
    } }]), t2;
  }();
  !function(e5) {
    e5.US = "us", e5.EU = "eu", e5.CUSTOM = "custom";
  }(fr || (fr = {}));
  var _r = "i.posthog.com";
  var mr = function() {
    function e5(t2) {
      L(this, e5), q(this, "_regionCache", {}), this.instance = t2;
    }
    return N(e5, [{ key: "apiHost", get: function() {
      var e6 = this.instance.config.api_host.trim().replace(/\/$/, "");
      return "https://app.posthog.com" === e6 ? "https://us.i.posthog.com" : e6;
    } }, { key: "uiHost", get: function() {
      var e6, t2 = null === (e6 = this.instance.config.ui_host) || void 0 === e6 ? void 0 : e6.replace(/\/$/, "");
      return t2 || (t2 = this.apiHost.replace(".".concat(_r), ".posthog.com")), "https://app.posthog.com" === t2 ? "https://us.posthog.com" : t2;
    } }, { key: "region", get: function() {
      return this._regionCache[this.apiHost] || (/https:\/\/(app|us|us-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? this._regionCache[this.apiHost] = fr.US : /https:\/\/(eu|eu-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? this._regionCache[this.apiHost] = fr.EU : this._regionCache[this.apiHost] = fr.CUSTOM), this._regionCache[this.apiHost];
    } }, { key: "endpointFor", value: function(e6) {
      var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
      if (t2 && (t2 = "/" === t2[0] ? t2 : "/".concat(t2)), "ui" === e6)
        return this.uiHost + t2;
      if (this.region === fr.CUSTOM)
        return this.apiHost + t2;
      var n3 = _r + t2;
      switch (e6) {
        case "assets":
          return "https://".concat(this.region, "-assets.").concat(n3);
        case "api":
          return "https://".concat(this.region, ".").concat(n3);
      }
    } }]), e5;
  }();
  var yr = "posthog-js";
  function br(e5) {
    var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n3 = t2.organization, i2 = t2.projectId, r2 = t2.prefix, s3 = t2.severityAllowList, o2 = void 0 === s3 ? ["error"] : s3;
    return function(t3) {
      var s4, a2, u2, l3, c2;
      if (!("*" === o2 || o2.includes(t3.level)) || !e5.__loaded)
        return t3;
      t3.tags || (t3.tags = {});
      var d2 = e5.requestRouter.endpointFor("ui", "/project/".concat(e5.config.token, "/person/").concat(e5.get_distinct_id()));
      t3.tags["PostHog Person URL"] = d2, e5.sessionRecordingStarted() && (t3.tags["PostHog Recording URL"] = e5.get_session_replay_url({ withTimestamp: true }));
      var h2 = (null === (s4 = t3.exception) || void 0 === s4 ? void 0 : s4.values) || [], f2 = { $exception_message: (null === (a2 = h2[0]) || void 0 === a2 ? void 0 : a2.value) || t3.message, $exception_type: null === (u2 = h2[0]) || void 0 === u2 ? void 0 : u2.type, $exception_personURL: d2, $exception_level: t3.level, $sentry_event_id: t3.event_id, $sentry_exception: t3.exception, $sentry_exception_message: (null === (l3 = h2[0]) || void 0 === l3 ? void 0 : l3.value) || t3.message, $sentry_exception_type: null === (c2 = h2[0]) || void 0 === c2 ? void 0 : c2.type, $sentry_tags: t3.tags, $level: t3.level };
      return n3 && i2 && (f2.$sentry_url = (r2 || "https://sentry.io/organizations/") + n3 + "/issues/?project=" + i2 + "&query=" + t3.event_id), e5.exceptions.sendExceptionEvent(f2), t3;
    };
  }
  var kr = N(function e4(t2, n3, i2, r2, s3) {
    L(this, e4), this.name = yr, this.setupOnce = function(e5) {
      e5(br(t2, { organization: n3, projectId: i2, prefix: r2, severityAllowList: s3 }));
    };
  });
  function wr(e5, t2) {
    var n3 = e5.config.segment;
    if (!n3)
      return t2();
    !function(e6, t3) {
      var n4 = e6.config.segment;
      if (!n4)
        return t3();
      var i2 = function(n5) {
        var i3 = function() {
          return n5.anonymousId() || Ze();
        };
        e6.config.get_device_id = i3, n5.id() && (e6.register({ distinct_id: n5.id(), $device_id: i3() }), e6.persistence.set_property(Oe, "identified")), t3();
      }, r2 = n4.user();
      "then" in r2 && y(r2.then) ? r2.then(function(e7) {
        return i2(e7);
      }) : i2(r2);
    }(e5, function() {
      n3.register(function(e6) {
        Promise && Promise.resolve || T.warn("This browser does not have Promise support, and can not use the segment integration");
        var t3 = function(t4, n4) {
          var i2;
          if (!n4)
            return t4;
          t4.event.userId || t4.event.anonymousId === e6.get_distinct_id() || (T.info("Segment integration does not have a userId set, resetting PostHog"), e6.reset()), t4.event.userId && t4.event.userId !== e6.get_distinct_id() && (T.info("Segment integration has a userId set, identifying with PostHog"), e6.identify(t4.event.userId));
          var r2 = e6._calculate_event_properties(n4, null !== (i2 = t4.event.properties) && void 0 !== i2 ? i2 : {}, new Date());
          return t4.event.properties = Object.assign({}, r2, t4.event.properties), t4;
        };
        return { name: "PostHog JS", type: "enrichment", version: "1.0.0", isLoaded: function() {
          return true;
        }, load: function() {
          return Promise.resolve();
        }, track: function(e7) {
          return t3(e7, e7.event.event);
        }, page: function(e7) {
          return t3(e7, "$pageview");
        }, identify: function(e7) {
          return t3(e7, "$identify");
        }, screen: function(e7) {
          return t3(e7, "$screen");
        } };
      }(e5)).then(function() {
        t2();
      });
    });
  }
  var Sr;
  var Er;
  var xr;
  var Ir = function() {
    function t2(e5) {
      L(this, t2), this._instance = e5;
    }
    return N(t2, [{ key: "doPageView", value: function(t3) {
      var n3, i2 = this._previousPageViewProperties(t3);
      return this._currentPath = null !== (n3 = null == e ? void 0 : e.location.pathname) && void 0 !== n3 ? n3 : "", this._instance.scrollManager.resetContext(), this._prevPageviewTimestamp = t3, i2;
    } }, { key: "doPageLeave", value: function(e5) {
      return this._previousPageViewProperties(e5);
    } }, { key: "_previousPageViewProperties", value: function(e5) {
      var t3 = this._currentPath, n3 = this._prevPageviewTimestamp, i2 = this._instance.scrollManager.getContext();
      if (!n3)
        return {};
      var r2 = {};
      if (i2) {
        var s3 = i2.maxScrollHeight, o2 = i2.lastScrollY, a2 = i2.maxScrollY, u2 = i2.maxContentHeight, l3 = i2.lastContentY, c2 = i2.maxContentY;
        if (!(w(s3) || w(o2) || w(a2) || w(u2) || w(l3) || w(c2)))
          s3 = Math.ceil(s3), o2 = Math.ceil(o2), a2 = Math.ceil(a2), u2 = Math.ceil(u2), l3 = Math.ceil(l3), c2 = Math.ceil(c2), r2 = { $prev_pageview_last_scroll: o2, $prev_pageview_last_scroll_percentage: s3 <= 1 ? 1 : Fr(o2 / s3, 0, 1), $prev_pageview_max_scroll: a2, $prev_pageview_max_scroll_percentage: s3 <= 1 ? 1 : Fr(a2 / s3, 0, 1), $prev_pageview_last_content: l3, $prev_pageview_last_content_percentage: u2 <= 1 ? 1 : Fr(l3 / u2, 0, 1), $prev_pageview_max_content: c2, $prev_pageview_max_content_percentage: u2 <= 1 ? 1 : Fr(c2 / u2, 0, 1) };
      }
      return t3 && (r2.$prev_pageview_pathname = t3), n3 && (r2.$prev_pageview_duration = (e5.getTime() - n3.getTime()) / 1e3), r2;
    } }]), t2;
  }();
  function Fr(e5, t2, n3) {
    return Math.max(t2, Math.min(e5, n3));
  }
  !function(e5) {
    e5.Popover = "popover", e5.API = "api", e5.Widget = "widget";
  }(Sr || (Sr = {})), function(e5) {
    e5.Open = "open", e5.MultipleChoice = "multiple_choice", e5.SingleChoice = "single_choice", e5.Rating = "rating", e5.Link = "link";
  }(Er || (Er = {})), function(e5) {
    e5.NextQuestion = "next_question", e5.End = "end", e5.ResponseBased = "response_based", e5.SpecificQuestion = "specific_question";
  }(xr || (xr = {}));
  var Pr = function() {
    function e5() {
      L(this, e5), q(this, "events", {}), this.events = {};
    }
    return N(e5, [{ key: "on", value: function(e6, t2) {
      var n3 = this;
      return this.events[e6] || (this.events[e6] = []), this.events[e6].push(t2), function() {
        n3.events[e6] = n3.events[e6].filter(function(e7) {
          return e7 !== t2;
        });
      };
    } }, { key: "emit", value: function(e6, t2) {
      var n3, i2 = z(this.events[e6] || []);
      try {
        for (i2.s(); !(n3 = i2.n()).done; ) {
          (0, n3.value)(t2);
        }
      } catch (e7) {
        i2.e(e7);
      } finally {
        i2.f();
      }
      var r2, s3 = z(this.events["*"] || []);
      try {
        for (s3.s(); !(r2 = s3.n()).done; ) {
          (0, r2.value)(e6, t2);
        }
      } catch (e7) {
        s3.e(e7);
      } finally {
        s3.f();
      }
    } }]), e5;
  }();
  var Rr = function() {
    function t2(e5) {
      var n3 = this;
      L(this, t2), q(this, "_debugEventEmitter", new Pr()), q(this, "checkStep", function(e6, t3) {
        return n3.checkStepEvent(e6, t3) && n3.checkStepUrl(e6, t3) && n3.checkStepElement(e6, t3);
      }), q(this, "checkStepEvent", function(e6, t3) {
        return null == t3 || !t3.event || (null == e6 ? void 0 : e6.event) === (null == t3 ? void 0 : t3.event);
      }), this.instance = e5, this.actionEvents = /* @__PURE__ */ new Set(), this.actionRegistry = /* @__PURE__ */ new Set();
    }
    return N(t2, [{ key: "init", value: function() {
      var e5, t3 = this;
      if (!w(null === (e5 = this.instance) || void 0 === e5 ? void 0 : e5._addCaptureHook)) {
        var n3;
        null === (n3 = this.instance) || void 0 === n3 || n3._addCaptureHook(function(e6, n4) {
          t3.on(e6, n4);
        });
      }
    } }, { key: "register", value: function(e5) {
      var t3, n3, i2 = this;
      if (!w(null === (t3 = this.instance) || void 0 === t3 ? void 0 : t3._addCaptureHook) && (e5.forEach(function(e6) {
        var t4, n4;
        null === (t4 = i2.actionRegistry) || void 0 === t4 || t4.add(e6), null === (n4 = e6.steps) || void 0 === n4 || n4.forEach(function(e7) {
          var t5;
          null === (t5 = i2.actionEvents) || void 0 === t5 || t5.add((null == e7 ? void 0 : e7.event) || "");
        });
      }), null !== (n3 = this.instance) && void 0 !== n3 && n3.autocapture)) {
        var r2, s3 = /* @__PURE__ */ new Set();
        e5.forEach(function(e6) {
          var t4;
          null === (t4 = e6.steps) || void 0 === t4 || t4.forEach(function(e7) {
            null != e7 && e7.selector && s3.add(null == e7 ? void 0 : e7.selector);
          });
        }), null === (r2 = this.instance) || void 0 === r2 || r2.autocapture.setElementSelectors(s3);
      }
    } }, { key: "on", value: function(e5, t3) {
      var n3, i2 = this;
      null != t3 && 0 != e5.length && (this.actionEvents.has(e5) || this.actionEvents.has(null == t3 ? void 0 : t3.event)) && this.actionRegistry && (null === (n3 = this.actionRegistry) || void 0 === n3 ? void 0 : n3.size) > 0 && this.actionRegistry.forEach(function(e6) {
        i2.checkAction(t3, e6) && i2._debugEventEmitter.emit("actionCaptured", e6.name);
      });
    } }, { key: "_addActionHook", value: function(e5) {
      this.onAction("actionCaptured", function(t3) {
        return e5(t3);
      });
    } }, { key: "checkAction", value: function(e5, t3) {
      if (null == (null == t3 ? void 0 : t3.steps))
        return false;
      var n3, i2 = z(t3.steps);
      try {
        for (i2.s(); !(n3 = i2.n()).done; ) {
          var r2 = n3.value;
          if (this.checkStep(e5, r2))
            return true;
        }
      } catch (e6) {
        i2.e(e6);
      } finally {
        i2.f();
      }
      return false;
    } }, { key: "onAction", value: function(e5, t3) {
      return this._debugEventEmitter.on(e5, t3);
    } }, { key: "checkStepUrl", value: function(e5, n3) {
      if (null != n3 && n3.url) {
        var i2, r2 = null == e5 || null === (i2 = e5.properties) || void 0 === i2 ? void 0 : i2.$current_url;
        if (!r2 || "string" != typeof r2)
          return false;
        if (!t2.matchString(r2, null == n3 ? void 0 : n3.url, (null == n3 ? void 0 : n3.url_matching) || "contains"))
          return false;
      }
      return true;
    } }, { key: "checkStepElement", value: function(e5, n3) {
      if ((null != n3 && n3.href || null != n3 && n3.tag_name || null != n3 && n3.text) && !this.getElementsList(e5).some(function(e6) {
        return !(null != n3 && n3.href && !t2.matchString(e6.href || "", null == n3 ? void 0 : n3.href, (null == n3 ? void 0 : n3.href_matching) || "exact")) && ((null == n3 || !n3.tag_name || e6.tag_name === (null == n3 ? void 0 : n3.tag_name)) && !(null != n3 && n3.text && !t2.matchString(e6.text || "", null == n3 ? void 0 : n3.text, (null == n3 ? void 0 : n3.text_matching) || "exact") && !t2.matchString(e6.$el_text || "", null == n3 ? void 0 : n3.text, (null == n3 ? void 0 : n3.text_matching) || "exact")));
      }))
        return false;
      if (null != n3 && n3.selector) {
        var i2, r2 = null == e5 || null === (i2 = e5.properties) || void 0 === i2 ? void 0 : i2.$element_selectors;
        if (!r2)
          return false;
        if (!r2.includes(null == n3 ? void 0 : n3.selector))
          return false;
      }
      return true;
    } }, { key: "getElementsList", value: function(e5) {
      return null == (null == e5 ? void 0 : e5.properties.$elements) ? [] : null == e5 ? void 0 : e5.properties.$elements;
    } }], [{ key: "matchString", value: function(n3, i2, r2) {
      switch (r2) {
        case "regex":
          return !!e && _t(n3, i2);
        case "exact":
          return i2 === n3;
        case "contains":
          var s3 = t2.escapeStringRegexp(i2).replace(/_/g, ".").replace(/%/g, ".*");
          return _t(n3, s3);
        default:
          return false;
      }
    } }, { key: "escapeStringRegexp", value: function(e5) {
      return e5.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    } }]), t2;
  }();
  var Cr = function() {
    function e5(t2) {
      L(this, e5), this.instance = t2, this.eventToSurveys = /* @__PURE__ */ new Map(), this.actionToSurveys = /* @__PURE__ */ new Map();
    }
    return N(e5, [{ key: "register", value: function(e6) {
      var t2;
      w(null === (t2 = this.instance) || void 0 === t2 ? void 0 : t2._addCaptureHook) || (this.setupEventBasedSurveys(e6), this.setupActionBasedSurveys(e6));
    } }, { key: "setupActionBasedSurveys", value: function(e6) {
      var t2 = this, n3 = e6.filter(function(e7) {
        var t3, n4, i2, r2;
        return (null === (t3 = e7.conditions) || void 0 === t3 ? void 0 : t3.actions) && (null === (n4 = e7.conditions) || void 0 === n4 || null === (i2 = n4.actions) || void 0 === i2 || null === (r2 = i2.values) || void 0 === r2 ? void 0 : r2.length) > 0;
      });
      if (0 !== n3.length) {
        if (null == this.actionMatcher) {
          this.actionMatcher = new Rr(this.instance), this.actionMatcher.init();
          this.actionMatcher._addActionHook(function(e7) {
            t2.onAction(e7);
          });
        }
        n3.forEach(function(e7) {
          var n4, i2, r2, s3, o2, a2, u2, l3, c2, d2;
          e7.conditions && null !== (n4 = e7.conditions) && void 0 !== n4 && n4.actions && null !== (i2 = e7.conditions) && void 0 !== i2 && null !== (r2 = i2.actions) && void 0 !== r2 && r2.values && (null === (s3 = e7.conditions) || void 0 === s3 || null === (o2 = s3.actions) || void 0 === o2 || null === (a2 = o2.values) || void 0 === a2 ? void 0 : a2.length) > 0 && (null === (u2 = t2.actionMatcher) || void 0 === u2 || u2.register(e7.conditions.actions.values), null === (l3 = e7.conditions) || void 0 === l3 || null === (c2 = l3.actions) || void 0 === c2 || null === (d2 = c2.values) || void 0 === d2 || d2.forEach(function(n5) {
            if (n5 && n5.name) {
              var i3 = t2.actionToSurveys.get(n5.name);
              i3 && i3.push(e7.id), t2.actionToSurveys.set(n5.name, i3 || [e7.id]);
            }
          }));
        });
      }
    } }, { key: "setupEventBasedSurveys", value: function(e6) {
      var t2, n3 = this;
      if (0 !== e6.filter(function(e7) {
        var t3, n4, i2, r2;
        return (null === (t3 = e7.conditions) || void 0 === t3 ? void 0 : t3.events) && (null === (n4 = e7.conditions) || void 0 === n4 || null === (i2 = n4.events) || void 0 === i2 || null === (r2 = i2.values) || void 0 === r2 ? void 0 : r2.length) > 0;
      }).length) {
        null === (t2 = this.instance) || void 0 === t2 || t2._addCaptureHook(function(e7, t3) {
          n3.onEvent(e7, t3);
        }), e6.forEach(function(e7) {
          var t3, i2, r2;
          null === (t3 = e7.conditions) || void 0 === t3 || null === (i2 = t3.events) || void 0 === i2 || null === (r2 = i2.values) || void 0 === r2 || r2.forEach(function(t4) {
            if (t4 && t4.name) {
              var i3 = n3.eventToSurveys.get(t4.name);
              i3 && i3.push(e7.id), n3.eventToSurveys.set(t4.name, i3 || [e7.id]);
            }
          });
        });
      }
    } }, { key: "onEvent", value: function(t2, n3) {
      var i2, r2, s3 = (null === (i2 = this.instance) || void 0 === i2 || null === (r2 = i2.persistence) || void 0 === r2 ? void 0 : r2.props[Te]) || [];
      if (e5.SURVEY_SHOWN_EVENT_NAME == t2 && n3 && s3.length > 0) {
        var o2, a2 = null == n3 || null === (o2 = n3.properties) || void 0 === o2 ? void 0 : o2.$survey_id;
        if (a2) {
          var u2 = s3.indexOf(a2);
          u2 >= 0 && (s3.splice(u2, 1), this._updateActivatedSurveys(s3));
        }
      } else
        this.eventToSurveys.has(t2) && this._updateActivatedSurveys(s3.concat(this.eventToSurveys.get(t2) || []));
    } }, { key: "onAction", value: function(e6) {
      var t2, n3, i2 = (null === (t2 = this.instance) || void 0 === t2 || null === (n3 = t2.persistence) || void 0 === n3 ? void 0 : n3.props[Te]) || [];
      this.actionToSurveys.has(e6) && this._updateActivatedSurveys(i2.concat(this.actionToSurveys.get(e6) || []));
    } }, { key: "_updateActivatedSurveys", value: function(e6) {
      var t2, n3;
      null === (t2 = this.instance) || void 0 === t2 || null === (n3 = t2.persistence) || void 0 === n3 || n3.register(q({}, Te, U(new Set(e6))));
    } }, { key: "getSurveys", value: function() {
      var e6, t2, n3 = null === (e6 = this.instance) || void 0 === e6 || null === (t2 = e6.persistence) || void 0 === t2 ? void 0 : t2.props[Te];
      return n3 || [];
    } }, { key: "getEventToSurveys", value: function() {
      return this.eventToSurveys;
    } }, { key: "_getActionMatcher", value: function() {
      return this.actionMatcher;
    } }]), e5;
  }();
  q(Cr, "SURVEY_SHOWN_EVENT_NAME", "survey shown");
  var Tr = "[Surveys]";
  var $r = { icontains: function(t2) {
    return !!e && e.location.href.toLowerCase().indexOf(t2.toLowerCase()) > -1;
  }, not_icontains: function(t2) {
    return !!e && -1 === e.location.href.toLowerCase().indexOf(t2.toLowerCase());
  }, regex: function(t2) {
    return !!e && _t(e.location.href, t2);
  }, not_regex: function(t2) {
    return !!e && !_t(e.location.href, t2);
  }, exact: function(t2) {
    return (null == e ? void 0 : e.location.href) === t2;
  }, is_not: function(t2) {
    return (null == e ? void 0 : e.location.href) !== t2;
  } };
  var Or = function() {
    function e5(t2) {
      L(this, e5), this.instance = t2, this._surveyEventReceiver = null;
    }
    return N(e5, [{ key: "afterDecideResponse", value: function(e6) {
      this._decideServerResponse = !!e6.surveys, this.loadIfEnabled();
    } }, { key: "loadIfEnabled", value: function() {
      var e6, t2, n3, i2 = this, r2 = null == h || null === (e6 = h.__PosthogExtensions__) || void 0 === e6 ? void 0 : e6.generateSurveys;
      this.instance.config.disable_surveys || !this._decideServerResponse || r2 || (null == this._surveyEventReceiver && (this._surveyEventReceiver = new Cr(this.instance)), null === (t2 = h.__PosthogExtensions__) || void 0 === t2 || null === (n3 = t2.loadExternalDependency) || void 0 === n3 || n3.call(t2, this.instance, "surveys", function(e7) {
        var t3, n4;
        if (e7)
          return T.error(Tr, "Could not load surveys script", e7);
        i2._surveyManager = null === (t3 = h.__PosthogExtensions__) || void 0 === t3 || null === (n4 = t3.generateSurveys) || void 0 === n4 ? void 0 : n4.call(t3, i2.instance);
      }));
    } }, { key: "getSurveys", value: function(e6) {
      var t2 = this, n3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      if (this.instance.config.disable_surveys)
        return e6([]);
      null == this._surveyEventReceiver && (this._surveyEventReceiver = new Cr(this.instance));
      var i2 = this.instance.get_property(Ce);
      if (i2 && !n3)
        return e6(i2);
      this.instance._send_request({ url: this.instance.requestRouter.endpointFor("api", "/api/surveys/?token=".concat(this.instance.config.token)), method: "GET", transport: "XHR", callback: function(n4) {
        var i3;
        if (200 !== n4.statusCode || !n4.json)
          return e6([]);
        var r2, s3 = n4.json.surveys || [], o2 = s3.filter(function(e7) {
          var t3, n5, i4, r3, s4, o3, a2, u2, l3, c2, d2, h2;
          return (null === (t3 = e7.conditions) || void 0 === t3 ? void 0 : t3.events) && (null === (n5 = e7.conditions) || void 0 === n5 || null === (i4 = n5.events) || void 0 === i4 ? void 0 : i4.values) && (null === (r3 = e7.conditions) || void 0 === r3 || null === (s4 = r3.events) || void 0 === s4 || null === (o3 = s4.values) || void 0 === o3 ? void 0 : o3.length) > 0 || (null === (a2 = e7.conditions) || void 0 === a2 ? void 0 : a2.actions) && (null === (u2 = e7.conditions) || void 0 === u2 || null === (l3 = u2.actions) || void 0 === l3 ? void 0 : l3.values) && (null === (c2 = e7.conditions) || void 0 === c2 || null === (d2 = c2.actions) || void 0 === d2 || null === (h2 = d2.values) || void 0 === h2 ? void 0 : h2.length) > 0;
        });
        o2.length > 0 && (null === (r2 = t2._surveyEventReceiver) || void 0 === r2 || r2.register(o2));
        return null === (i3 = t2.instance.persistence) || void 0 === i3 || i3.register(q({}, Ce, s3)), e6(s3);
      } });
    } }, { key: "getActiveMatchingSurveys", value: function(e6) {
      var t2 = this, n3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      this.getSurveys(function(n4) {
        var i2, r2 = n4.filter(function(e7) {
          return !(!e7.start_date || e7.end_date);
        }).filter(function(e7) {
          var t3, n5, i3, r3;
          if (!e7.conditions)
            return true;
          var s4 = null === (t3 = e7.conditions) || void 0 === t3 || !t3.url || $r[null !== (n5 = null === (i3 = e7.conditions) || void 0 === i3 ? void 0 : i3.urlMatchType) && void 0 !== n5 ? n5 : "icontains"](e7.conditions.url), a3 = null === (r3 = e7.conditions) || void 0 === r3 || !r3.selector || (null == o ? void 0 : o.querySelector(e7.conditions.selector));
          return s4 && a3;
        }), s3 = null === (i2 = t2._surveyEventReceiver) || void 0 === i2 ? void 0 : i2.getSurveys(), a2 = r2.filter(function(e7) {
          var n5, i3, r3, o2, a3, u2, l3, c2, d2, h2;
          if (!e7.linked_flag_key && !e7.targeting_flag_key && !e7.internal_targeting_flag_key)
            return true;
          var f2 = !e7.linked_flag_key || t2.instance.featureFlags.isFeatureEnabled(e7.linked_flag_key), v2 = !e7.targeting_flag_key || t2.instance.featureFlags.isFeatureEnabled(e7.targeting_flag_key), p2 = (null === (n5 = e7.conditions) || void 0 === n5 ? void 0 : n5.events) && (null === (i3 = e7.conditions) || void 0 === i3 || null === (r3 = i3.events) || void 0 === r3 ? void 0 : r3.values) && (null === (o2 = e7.conditions) || void 0 === o2 || null === (a3 = o2.events) || void 0 === a3 ? void 0 : a3.values.length) > 0, g2 = (null === (u2 = e7.conditions) || void 0 === u2 ? void 0 : u2.actions) && (null === (l3 = e7.conditions) || void 0 === l3 || null === (c2 = l3.actions) || void 0 === c2 ? void 0 : c2.values) && (null === (d2 = e7.conditions) || void 0 === d2 || null === (h2 = d2.actions) || void 0 === h2 ? void 0 : h2.values.length) > 0, _2 = !p2 && !g2 || (null == s3 ? void 0 : s3.includes(e7.id)), m2 = t2._canActivateRepeatedly(e7), y2 = !(e7.internal_targeting_flag_key && !m2) || t2.instance.featureFlags.isFeatureEnabled(e7.internal_targeting_flag_key);
          return f2 && v2 && y2 && _2;
        });
        return e6(a2);
      }, n3);
    } }, { key: "getNextSurveyStep", value: function(e6, t2, n3) {
      var i2, r2 = e6.questions[t2], s3 = t2 + 1;
      if (null === (i2 = r2.branching) || void 0 === i2 || !i2.type)
        return t2 === e6.questions.length - 1 ? xr.End : s3;
      if (r2.branching.type === xr.End)
        return xr.End;
      if (r2.branching.type === xr.SpecificQuestion) {
        if (Number.isInteger(r2.branching.index))
          return r2.branching.index;
      } else if (r2.branching.type === xr.ResponseBased) {
        if (r2.type === Er.SingleChoice) {
          var o2, a2, u2 = r2.choices.indexOf("".concat(n3));
          if (null !== (o2 = r2.branching) && void 0 !== o2 && null !== (a2 = o2.responseValues) && void 0 !== a2 && a2.hasOwnProperty(u2)) {
            var l3 = r2.branching.responseValues[u2];
            return Number.isInteger(l3) ? l3 : l3 === xr.End ? xr.End : s3;
          }
        } else if (r2.type === Er.Rating) {
          var c2, d2;
          if ("number" != typeof n3 || !Number.isInteger(n3))
            throw new Error("The response type must be an integer");
          var h2 = function(e7, t3) {
            if (3 === t3) {
              if (e7 < 1 || e7 > 3)
                throw new Error("The response must be in range 1-3");
              return 1 === e7 ? "negative" : 2 === e7 ? "neutral" : "positive";
            }
            if (5 === t3) {
              if (e7 < 1 || e7 > 5)
                throw new Error("The response must be in range 1-5");
              return e7 <= 2 ? "negative" : 3 === e7 ? "neutral" : "positive";
            }
            if (7 === t3) {
              if (e7 < 1 || e7 > 7)
                throw new Error("The response must be in range 1-7");
              return e7 <= 3 ? "negative" : 4 === e7 ? "neutral" : "positive";
            }
            if (10 === t3) {
              if (e7 < 0 || e7 > 10)
                throw new Error("The response must be in range 0-10");
              return e7 <= 6 ? "detractors" : e7 <= 8 ? "passives" : "promoters";
            }
            throw new Error("The scale must be one of: 3, 5, 7, 10");
          }(n3, r2.scale);
          if (null !== (c2 = r2.branching) && void 0 !== c2 && null !== (d2 = c2.responseValues) && void 0 !== d2 && d2.hasOwnProperty(h2)) {
            var f2 = r2.branching.responseValues[h2];
            return Number.isInteger(f2) ? f2 : f2 === xr.End ? xr.End : s3;
          }
        }
        return s3;
      }
      return T.warn(Tr, "Falling back to next question index due to unexpected branching type"), s3;
    } }, { key: "_canActivateRepeatedly", value: function(e6) {
      var t2;
      return I(null === (t2 = h.__PosthogExtensions__) || void 0 === t2 ? void 0 : t2.canActivateRepeatedly) ? (T.warn(Tr, "canActivateRepeatedly is not defined, must init before calling"), false) : h.__PosthogExtensions__.canActivateRepeatedly(e6);
    } }, { key: "canRenderSurvey", value: function(e6) {
      var t2 = this;
      I(this._surveyManager) ? T.warn(Tr, "canActivateRepeatedly is not defined, must init before calling") : this.getSurveys(function(n3) {
        var i2 = n3.filter(function(t3) {
          return t3.id === e6;
        })[0];
        t2._surveyManager.canRenderSurvey(i2);
      });
    } }, { key: "renderSurvey", value: function(e6, t2) {
      var n3 = this;
      I(this._surveyManager) ? T.warn(Tr, "canActivateRepeatedly is not defined, must init before calling") : this.getSurveys(function(i2) {
        var r2 = i2.filter(function(t3) {
          return t3.id === e6;
        })[0];
        n3._surveyManager.renderSurvey(r2, null == o ? void 0 : o.querySelector(t2));
      });
    } }]), e5;
  }();
  var Mr = function() {
    function e5(t2) {
      var n3, i2, r2 = this;
      L(this, e5), q(this, "serverLimits", {}), q(this, "lastEventRateLimited", false), q(this, "checkForLimiting", function(e6) {
        var t3 = e6.text;
        if (t3 && t3.length)
          try {
            (JSON.parse(t3).quota_limited || []).forEach(function(e7) {
              T.info("[RateLimiter] ".concat(e7 || "events", " is quota limited.")), r2.serverLimits[e7] = new Date().getTime() + 6e4;
            });
          } catch (e7) {
            return void T.warn('[RateLimiter] could not rate limit - continuing. Error: "'.concat(null == e7 ? void 0 : e7.message, '"'), { text: t3 });
          }
      }), this.instance = t2, this.captureEventsPerSecond = (null === (n3 = t2.config.rate_limiting) || void 0 === n3 ? void 0 : n3.events_per_second) || 10, this.captureEventsBurstLimit = Math.max((null === (i2 = t2.config.rate_limiting) || void 0 === i2 ? void 0 : i2.events_burst_limit) || 10 * this.captureEventsPerSecond, this.captureEventsPerSecond), this.lastEventRateLimited = this.clientRateLimitContext(true).isRateLimited;
    }
    return N(e5, [{ key: "clientRateLimitContext", value: function() {
      var e6, t2, n3, i2 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], r2 = new Date().getTime(), s3 = null !== (e6 = null === (t2 = this.instance.persistence) || void 0 === t2 ? void 0 : t2.get_property(Ae)) && void 0 !== e6 ? e6 : { tokens: this.captureEventsBurstLimit, last: r2 };
      s3.tokens += (r2 - s3.last) / 1e3 * this.captureEventsPerSecond, s3.last = r2, s3.tokens > this.captureEventsBurstLimit && (s3.tokens = this.captureEventsBurstLimit);
      var o2 = s3.tokens < 1;
      return o2 || i2 || (s3.tokens = Math.max(0, s3.tokens - 1)), !o2 || this.lastEventRateLimited || i2 || this.instance.capture("$$client_ingestion_warning", { $$client_ingestion_warning_message: "posthog-js client rate limited. Config is set to ".concat(this.captureEventsPerSecond, " events per second and ").concat(this.captureEventsBurstLimit, " events burst limit.") }, { skip_client_rate_limiting: true }), this.lastEventRateLimited = o2, null === (n3 = this.instance.persistence) || void 0 === n3 || n3.set_property(Ae, s3), { isRateLimited: o2, remainingTokens: s3.tokens };
    } }, { key: "isServerRateLimited", value: function(e6) {
      var t2 = this.serverLimits[e6 || "events"] || false;
      return false !== t2 && new Date().getTime() < t2;
    } }]), e5;
  }();
  var Ar = function() {
    return M({ initialPathName: (null == a ? void 0 : a.pathname) || "", referringDomain: yn.referringDomain() }, yn.campaignParams());
  };
  var Lr = function() {
    function e5(t2, n3, i2) {
      var r2 = this;
      L(this, e5), q(this, "_onSessionIdCallback", function(e6) {
        var t3 = r2._getStoredProps();
        if (!t3 || t3.sessionId !== e6) {
          var n4 = { sessionId: e6, props: r2._sessionSourceParamGenerator() };
          r2._persistence.register(q({}, Me, n4));
        }
      }), this._sessionIdManager = t2, this._persistence = n3, this._sessionSourceParamGenerator = i2 || Ar, this._sessionIdManager.onSessionId(this._onSessionIdCallback);
    }
    return N(e5, [{ key: "_getStoredProps", value: function() {
      return this._persistence.props[Me];
    } }, { key: "getSessionProps", value: function() {
      var e6, t2 = null === (e6 = this._getStoredProps()) || void 0 === e6 ? void 0 : e6.props;
      return t2 ? { $client_session_initial_referring_host: t2.referringDomain, $client_session_initial_pathname: t2.initialPathName, $client_session_initial_utm_source: t2.utm_source, $client_session_initial_utm_campaign: t2.utm_campaign, $client_session_initial_utm_medium: t2.utm_medium, $client_session_initial_utm_content: t2.utm_content, $client_session_initial_utm_term: t2.utm_term } : {};
    } }]), e5;
  }();
  var Dr = ["ahrefsbot", "ahrefssiteaudit", "applebot", "baiduspider", "bingbot", "bingpreview", "bot.htm", "bot.php", "crawler", "deepscan", "duckduckbot", "facebookexternal", "facebookcatalog", "gptbot", "http://yandex.com/bots", "hubspot", "ia_archiver", "linkedinbot", "mj12bot", "msnbot", "nessus", "petalbot", "pinterest", "prerender", "rogerbot", "screaming frog", "semrushbot", "sitebulb", "slurp", "turnitin", "twitterbot", "vercelbot", "yahoo! slurp", "yandexbot", "headlesschrome", "cypress", "Google-HotelAdsVerifier", "adsbot-google", "apis-google", "duplexweb-google", "feedfetcher-google", "google favicon", "google web preview", "google-read-aloud", "googlebot", "googleweblight", "mediapartners-google", "storebot-google", "Bytespider;"];
  var Nr = function(e5, t2) {
    if (!e5)
      return false;
    var n3 = e5.toLowerCase();
    return Dr.concat(t2 || []).some(function(e6) {
      var t3 = e6.toLowerCase();
      return -1 !== n3.indexOf(t3);
    });
  };
  var qr = function() {
    function e5() {
      L(this, e5), this.clicks = [];
    }
    return N(e5, [{ key: "isRageClick", value: function(e6, t2, n3) {
      var i2 = this.clicks[this.clicks.length - 1];
      if (i2 && Math.abs(e6 - i2.x) + Math.abs(t2 - i2.y) < 30 && n3 - i2.timestamp < 1e3) {
        if (this.clicks.push({ x: e6, y: t2, timestamp: n3 }), 3 === this.clicks.length)
          return true;
      } else
        this.clicks = [{ x: e6, y: t2, timestamp: n3 }];
      return false;
    } }]), e5;
  }();
  function Br(e5) {
    var t2;
    return e5.id === Be || !(null === (t2 = e5.closest) || void 0 === t2 || !t2.call(e5, "#" + Be));
  }
  var Hr = function() {
    function t2(n3) {
      var i2, r2 = this;
      L(this, t2), q(this, "rageclicks", new qr()), q(this, "_enabledServerSide", false), q(this, "_initialized", false), q(this, "_flushInterval", null), this.instance = n3, this._enabledServerSide = !(null === (i2 = this.instance.persistence) || void 0 === i2 || !i2.props[fe]), null == e || e.addEventListener("beforeunload", function() {
        r2.flush();
      });
    }
    return N(t2, [{ key: "flushIntervalMilliseconds", get: function() {
      var e5 = 5e3;
      return b(this.instance.config.capture_heatmaps) && this.instance.config.capture_heatmaps.flush_interval_milliseconds && (e5 = this.instance.config.capture_heatmaps.flush_interval_milliseconds), e5;
    } }, { key: "isEnabled", get: function() {
      return w(this.instance.config.capture_heatmaps) ? w(this.instance.config.enable_heatmaps) ? this._enabledServerSide : this.instance.config.enable_heatmaps : false !== this.instance.config.capture_heatmaps;
    } }, { key: "startIfEnabled", value: function() {
      if (this.isEnabled) {
        if (this._initialized)
          return;
        T.info("[heatmaps] starting..."), this._setupListeners(), this._flushInterval = setInterval(this.flush.bind(this), this.flushIntervalMilliseconds);
      } else {
        var e5;
        clearInterval(null !== (e5 = this._flushInterval) && void 0 !== e5 ? e5 : void 0), this.getAndClearBuffer();
      }
    } }, { key: "afterDecideResponse", value: function(e5) {
      var t3 = !!e5.heatmaps;
      this.instance.persistence && this.instance.persistence.register(q({}, fe, t3)), this._enabledServerSide = t3, this.startIfEnabled();
    } }, { key: "getAndClearBuffer", value: function() {
      var e5 = this.buffer;
      return this.buffer = void 0, e5;
    } }, { key: "_setupListeners", value: function() {
      var t3 = this;
      e && o && (oe(o, "click", function(n3) {
        return t3._onClick(n3 || (null == e ? void 0 : e.event));
      }, false, true), oe(o, "mousemove", function(n3) {
        return t3._onMouseMove(n3 || (null == e ? void 0 : e.event));
      }, false, true), this._initialized = true);
    } }, { key: "_getProperties", value: function(t3, n3) {
      var i2 = this.instance.scrollManager.scrollY(), r2 = this.instance.scrollManager.scrollX(), s3 = this.instance.scrollManager.scrollElement(), o2 = function(t4, n4, i3) {
        for (var r3 = t4; r3 && $n(r3) && !On(r3, "body"); ) {
          if (r3 === i3)
            return false;
          if (X(n4, null == e ? void 0 : e.getComputedStyle(r3).position))
            return true;
          r3 = Dn(r3);
        }
        return false;
      }(Tn(t3), ["fixed", "sticky"], s3);
      return { x: t3.clientX + (o2 ? 0 : r2), y: t3.clientY + (o2 ? 0 : i2), target_fixed: o2, type: n3 };
    } }, { key: "_onClick", value: function(e5) {
      var t3;
      if (!Br(e5.target)) {
        var n3 = this._getProperties(e5, "click");
        null !== (t3 = this.rageclicks) && void 0 !== t3 && t3.isRageClick(e5.clientX, e5.clientY, new Date().getTime()) && this._capture(M(M({}, n3), {}, { type: "rageclick" })), this._capture(n3);
      }
    } }, { key: "_onMouseMove", value: function(e5) {
      var t3 = this;
      Br(e5.target) || (clearTimeout(this._mouseMoveTimeout), this._mouseMoveTimeout = setTimeout(function() {
        t3._capture(t3._getProperties(e5, "mousemove"));
      }, 500));
    } }, { key: "_capture", value: function(t3) {
      if (e) {
        var n3 = e.location.href;
        this.buffer = this.buffer || {}, this.buffer[n3] || (this.buffer[n3] = []), this.buffer[n3].push(t3);
      }
    } }, { key: "flush", value: function() {
      this.buffer && !k(this.buffer) && this.instance.capture("$$heatmap", { $heatmap_data: this.getAndClearBuffer() });
    } }]), t2;
  }();
  var Ur = function() {
    function t2(e5) {
      var n3 = this;
      L(this, t2), q(this, "_updateScrollData", function() {
        var e6, t3, i2, r2;
        n3.context || (n3.context = {});
        var s3 = n3.scrollElement(), o2 = n3.scrollY(), a2 = s3 ? Math.max(0, s3.scrollHeight - s3.clientHeight) : 0, u2 = o2 + ((null == s3 ? void 0 : s3.clientHeight) || 0), l3 = (null == s3 ? void 0 : s3.scrollHeight) || 0;
        n3.context.lastScrollY = Math.ceil(o2), n3.context.maxScrollY = Math.max(o2, null !== (e6 = n3.context.maxScrollY) && void 0 !== e6 ? e6 : 0), n3.context.maxScrollHeight = Math.max(a2, null !== (t3 = n3.context.maxScrollHeight) && void 0 !== t3 ? t3 : 0), n3.context.lastContentY = u2, n3.context.maxContentY = Math.max(u2, null !== (i2 = n3.context.maxContentY) && void 0 !== i2 ? i2 : 0), n3.context.maxContentHeight = Math.max(l3, null !== (r2 = n3.context.maxContentHeight) && void 0 !== r2 ? r2 : 0);
      }), this.instance = e5;
    }
    return N(t2, [{ key: "getContext", value: function() {
      return this.context;
    } }, { key: "resetContext", value: function() {
      var e5 = this.context;
      return setTimeout(this._updateScrollData, 0), e5;
    } }, { key: "startMeasuringScrollPosition", value: function() {
      null == e || e.addEventListener("scroll", this._updateScrollData, true), null == e || e.addEventListener("scrollend", this._updateScrollData, true), null == e || e.addEventListener("resize", this._updateScrollData);
    } }, { key: "scrollElement", value: function() {
      if (!this.instance.config.scroll_root_selector)
        return null == e ? void 0 : e.document.documentElement;
      var t3, n3 = z(m(this.instance.config.scroll_root_selector) ? this.instance.config.scroll_root_selector : [this.instance.config.scroll_root_selector]);
      try {
        for (n3.s(); !(t3 = n3.n()).done; ) {
          var i2 = t3.value, r2 = null == e ? void 0 : e.document.querySelector(i2);
          if (r2)
            return r2;
        }
      } catch (e5) {
        n3.e(e5);
      } finally {
        n3.f();
      }
    } }, { key: "scrollY", value: function() {
      if (this.instance.config.scroll_root_selector) {
        var t3 = this.scrollElement();
        return t3 && t3.scrollTop || 0;
      }
      return e && (e.scrollY || e.pageYOffset || e.document.documentElement.scrollTop) || 0;
    } }, { key: "scrollX", value: function() {
      if (this.instance.config.scroll_root_selector) {
        var t3 = this.scrollElement();
        return t3 && t3.scrollLeft || 0;
      }
      return e && (e.scrollX || e.pageXOffset || e.document.documentElement.scrollLeft) || 0;
    } }]), t2;
  }();
  var jr = "$copy_autocapture";
  function Wr(e5, t2) {
    return t2.length > e5 ? t2.slice(0, e5) + "..." : t2;
  }
  var zr;
  var Vr = function() {
    function t2(e5) {
      L(this, t2), q(this, "_initialized", false), q(this, "_isDisabledServerSide", null), q(this, "rageclicks", new qr()), q(this, "_elementsChainAsString", false), this.instance = e5, this._elementSelectors = null;
    }
    return N(t2, [{ key: "config", get: function() {
      var e5, t3, n3 = b(this.instance.config.autocapture) ? this.instance.config.autocapture : {};
      return n3.url_allowlist = null === (e5 = n3.url_allowlist) || void 0 === e5 ? void 0 : e5.map(function(e6) {
        return new RegExp(e6);
      }), n3.url_ignorelist = null === (t3 = n3.url_ignorelist) || void 0 === t3 ? void 0 : t3.map(function(e6) {
        return new RegExp(e6);
      }), n3;
    } }, { key: "_addDomEventHandlers", value: function() {
      var t3 = this;
      if (this.isBrowserSupported()) {
        if (e && o) {
          var n3 = function(n4) {
            n4 = n4 || (null == e ? void 0 : e.event);
            try {
              t3._captureEvent(n4);
            } catch (e5) {
              T.error("Failed to capture event", e5);
            }
          }, i2 = function(n4) {
            n4 = n4 || (null == e ? void 0 : e.event), t3._captureEvent(n4, jr);
          };
          oe(o, "submit", n3, false, true), oe(o, "change", n3, false, true), oe(o, "click", n3, false, true), this.config.capture_copied_text && (oe(o, "copy", i2, false, true), oe(o, "cut", i2, false, true));
        }
      } else
        T.info("Disabling Automatic Event Collection because this browser is not supported");
    } }, { key: "startIfEnabled", value: function() {
      this.isEnabled && !this._initialized && (this._addDomEventHandlers(), this._initialized = true);
    } }, { key: "afterDecideResponse", value: function(e5) {
      e5.elementsChainAsString && (this._elementsChainAsString = e5.elementsChainAsString), this.instance.persistence && this.instance.persistence.register(q({}, he, !!e5.autocapture_opt_out)), this._isDisabledServerSide = !!e5.autocapture_opt_out, this.startIfEnabled();
    } }, { key: "setElementSelectors", value: function(e5) {
      this._elementSelectors = e5;
    } }, { key: "getElementSelectors", value: function(e5) {
      var t3, n3 = [];
      return null === (t3 = this._elementSelectors) || void 0 === t3 || t3.forEach(function(t4) {
        var i2 = null == o ? void 0 : o.querySelectorAll(t4);
        null == i2 || i2.forEach(function(i3) {
          e5 === i3 && n3.push(t4);
        });
      }), n3;
    } }, { key: "isEnabled", get: function() {
      var e5, t3, n3 = null === (e5 = this.instance.persistence) || void 0 === e5 ? void 0 : e5.props[he], i2 = this._isDisabledServerSide;
      if (x(i2) && !P(n3) && !this.instance.config.advanced_disable_decide)
        return false;
      var r2 = null !== (t3 = this._isDisabledServerSide) && void 0 !== t3 ? t3 : !!n3;
      return !!this.instance.config.autocapture && !r2;
    } }, { key: "_previousElementSibling", value: function(e5) {
      if (e5.previousElementSibling)
        return e5.previousElementSibling;
      var t3 = e5;
      do {
        t3 = t3.previousSibling;
      } while (t3 && !$n(t3));
      return t3;
    } }, { key: "_getAugmentPropertiesFromElement", value: function(e5) {
      if (!qn(e5))
        return {};
      var t3 = {};
      return J(e5.attributes, function(e6) {
        if (e6.name && 0 === e6.name.indexOf("data-ph-capture-attribute")) {
          var n3 = e6.name.replace("data-ph-capture-attribute-", ""), i2 = e6.value;
          n3 && i2 && Gn(i2) && (t3[n3] = i2);
        }
      }), t3;
    } }, { key: "_getPropertiesFromElement", value: function(e5, t3, n3) {
      var i2, r2 = e5.tagName.toLowerCase(), s3 = { tag_name: r2 };
      Ln.indexOf(r2) > -1 && !n3 && ("a" === r2.toLowerCase() || "button" === r2.toLowerCase() ? s3.$el_text = Wr(1024, Qn(e5)) : s3.$el_text = Wr(1024, Cn(e5)));
      var o2 = Pn(e5);
      o2.length > 0 && (s3.classes = o2.filter(function(e6) {
        return "" !== e6;
      }));
      var a2 = null === (i2 = this.config) || void 0 === i2 ? void 0 : i2.element_attribute_ignorelist;
      J(e5.attributes, function(n4) {
        var i3;
        if ((!Bn(e5) || -1 !== ["name", "id", "class", "aria-label"].indexOf(n4.name)) && ((null == a2 || !a2.includes(n4.name)) && !t3 && Gn(n4.value) && (i3 = n4.name, !S(i3) || "_ngcontent" !== i3.substring(0, 10) && "_nghost" !== i3.substring(0, 7)))) {
          var r3 = n4.value;
          "class" === n4.name && (r3 = In(r3).join(" ")), s3["attr__" + n4.name] = Wr(1024, r3);
        }
      });
      for (var u2 = 1, l3 = 1, c2 = e5; c2 = this._previousElementSibling(c2); )
        u2++, c2.tagName === e5.tagName && l3++;
      return s3.nth_child = u2, s3.nth_of_type = l3, s3;
    } }, { key: "_getDefaultProperties", value: function(e5) {
      return { $event_type: e5, $ce_version: 1 };
    } }, { key: "_captureEvent", value: function(t3) {
      var n3 = this, i2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "$autocapture";
      if (this.isEnabled) {
        var r2, s3 = Tn(t3);
        if (Mn(s3) && (s3 = s3.parentNode || null), "$autocapture" === i2 && "click" === t3.type && t3 instanceof MouseEvent)
          this.instance.config.rageclick && null !== (r2 = this.rageclicks) && void 0 !== r2 && r2.isRageClick(t3.clientX, t3.clientY, new Date().getTime()) && this._captureEvent(t3, "$rageclick");
        var o2 = i2 === jr;
        if (s3 && Nn(s3, t3, this.config, o2, o2 ? ["copy", "cut"] : void 0)) {
          for (var a2, u2, l3 = [s3], c2 = s3; c2.parentNode && !On(c2, "body"); )
            An(c2.parentNode) ? (l3.push(c2.parentNode.host), c2 = c2.parentNode.host) : (l3.push(c2.parentNode), c2 = c2.parentNode);
          var d2, h2, f2 = [], v2 = {}, p2 = false;
          if (J(l3, function(e5) {
            var t4 = qn(e5);
            "a" === e5.tagName.toLowerCase() && (d2 = e5.getAttribute("href"), d2 = t4 && Gn(d2) && d2), X(Pn(e5), "ph-no-capture") && (p2 = true), f2.push(n3._getPropertiesFromElement(e5, n3.instance.config.mask_all_element_attributes, n3.instance.config.mask_all_text));
            var i3 = n3._getAugmentPropertiesFromElement(e5);
            Y(v2, i3);
          }), this.instance.config.mask_all_text || ("a" === s3.tagName.toLowerCase() || "button" === s3.tagName.toLowerCase() ? f2[0].$el_text = Qn(s3) : f2[0].$el_text = Cn(s3)), d2) {
            var g2, _2;
            f2[0].attr__href = d2;
            var m2 = null === (g2 = gt(d2)) || void 0 === g2 ? void 0 : g2.host, y2 = null == e || null === (_2 = e.location) || void 0 === _2 ? void 0 : _2.host;
            m2 && y2 && m2 !== y2 && (h2 = d2);
          }
          if (p2)
            return false;
          var b2 = Y(this._getDefaultProperties(t3.type), this._elementsChainAsString ? { $elements_chain: Yn(f2) } : { $elements: f2 }, null !== (a2 = f2[0]) && void 0 !== a2 && a2.$el_text ? { $el_text: null === (u2 = f2[0]) || void 0 === u2 ? void 0 : u2.$el_text } : {}, h2 && "click" === t3.type ? { $external_click_url: h2 } : {}, v2), k2 = this.getElementSelectors(s3);
          if (k2 && k2.length > 0 && (b2.$element_selectors = k2), i2 === jr) {
            var w2, S2 = Rn(null == e || null === (w2 = e.getSelection()) || void 0 === w2 ? void 0 : w2.toString()), E2 = t3.type || "clipboard";
            if (!S2)
              return false;
            b2.$selected_content = S2, b2.$copy_type = E2;
          }
          return this.instance.capture(i2, b2), true;
        }
      }
    } }, { key: "isBrowserSupported", value: function() {
      return y(null == o ? void 0 : o.querySelectorAll);
    } }]), t2;
  }();
  var Gr = function() {
    function e5(t2) {
      var n3 = this;
      L(this, e5), q(this, "_restoreXHRPatch", void 0), q(this, "_restoreFetchPatch", void 0), q(this, "_startCapturing", function() {
        var e6, t3, i2, r2;
        w(n3._restoreXHRPatch) && (null === (e6 = h.__PosthogExtensions__) || void 0 === e6 || null === (t3 = e6.tracingHeadersPatchFns) || void 0 === t3 || t3._patchXHR(n3.instance.sessionManager));
        w(n3._restoreFetchPatch) && (null === (i2 = h.__PosthogExtensions__) || void 0 === i2 || null === (r2 = i2.tracingHeadersPatchFns) || void 0 === r2 || r2._patchFetch(n3.instance.sessionManager));
      }), this.instance = t2;
    }
    return N(e5, [{ key: "_loadScript", value: function(e6) {
      var t2, n3, i2;
      null !== (t2 = h.__PosthogExtensions__) && void 0 !== t2 && t2.tracingHeadersPatchFns && e6(), null === (n3 = h.__PosthogExtensions__) || void 0 === n3 || null === (i2 = n3.loadExternalDependency) || void 0 === i2 || i2.call(n3, this.instance, "tracing-headers", function(t3) {
        if (t3)
          return T.error("[TRACING-HEADERS] failed to load script", t3);
        e6();
      });
    } }, { key: "startIfEnabledOrStop", value: function() {
      var e6, t2;
      this.instance.config.__add_tracing_headers ? this._loadScript(this._startCapturing) : (null === (e6 = this._restoreXHRPatch) || void 0 === e6 || e6.call(this), null === (t2 = this._restoreFetchPatch) || void 0 === t2 || t2.call(this), this._restoreXHRPatch = void 0, this._restoreFetchPatch = void 0);
    } }]), e5;
  }();
  !function(e5) {
    e5[e5.PENDING = -1] = "PENDING", e5[e5.DENIED = 0] = "DENIED", e5[e5.GRANTED = 1] = "GRANTED";
  }(zr || (zr = {}));
  var Qr = function() {
    function e5(t2) {
      L(this, e5), this.instance = t2;
    }
    return N(e5, [{ key: "config", get: function() {
      return this.instance.config;
    } }, { key: "consent", get: function() {
      return this.getDnt() ? zr.DENIED : this.storedConsent;
    } }, { key: "isOptedOut", value: function() {
      return this.consent === zr.DENIED || this.consent === zr.PENDING && this.config.opt_out_capturing_by_default;
    } }, { key: "isOptedIn", value: function() {
      return !this.isOptedOut();
    } }, { key: "optInOut", value: function(e6) {
      this.storage.set(this.storageKey, e6 ? 1 : 0, this.config.cookie_expiration, this.config.cross_subdomain_cookie, this.config.secure_cookie);
    } }, { key: "reset", value: function() {
      this.storage.remove(this.storageKey, this.config.cross_subdomain_cookie);
    } }, { key: "storageKey", get: function() {
      var e6 = this.instance.config, t2 = e6.token;
      return (e6.opt_out_capturing_cookie_prefix || "__ph_opt_in_out_") + t2;
    } }, { key: "storedConsent", get: function() {
      var e6 = this.storage.get(this.storageKey);
      return "1" === e6 ? zr.GRANTED : "0" === e6 ? zr.DENIED : zr.PENDING;
    } }, { key: "storage", get: function() {
      if (!this._storage) {
        var e6 = this.config.opt_out_capturing_persistence_type;
        this._storage = "localStorage" === e6 ? ut : ot;
        var t2 = "localStorage" === e6 ? ot : ut;
        t2.get(this.storageKey) && (this._storage.get(this.storageKey) || this.optInOut("1" === t2.get(this.storageKey)), t2.remove(this.storageKey, this.config.cross_subdomain_cookie));
      }
      return this._storage;
    } }, { key: "getDnt", value: function() {
      return !!this.config.respect_dnt && !!ae([null == s2 ? void 0 : s2.doNotTrack, null == s2 ? void 0 : s2.msDoNotTrack, h.doNotTrack], function(e6) {
        return X([true, 1, "1", "yes"], e6);
      });
    } }]), e5;
  }();
  var Jr = "[Exception Autocapture]";
  var Yr = function() {
    function t2(n3) {
      var i2, r2 = this;
      L(this, t2), q(this, "originalOnUnhandledRejectionHandler", void 0), q(this, "startCapturing", function() {
        var t3, n4, i3, s3;
        if (e && r2.isEnabled && !r2.hasHandlers && !r2.isCapturing) {
          var o2 = null === (t3 = h.__PosthogExtensions__) || void 0 === t3 || null === (n4 = t3.errorWrappingFunctions) || void 0 === n4 ? void 0 : n4.wrapOnError, a2 = null === (i3 = h.__PosthogExtensions__) || void 0 === i3 || null === (s3 = i3.errorWrappingFunctions) || void 0 === s3 ? void 0 : s3.wrapUnhandledRejection;
          if (o2 && a2)
            try {
              r2.unwrapOnError = o2(r2.captureException.bind(r2)), r2.unwrapUnhandledRejection = a2(r2.captureException.bind(r2));
            } catch (e5) {
              T.error(Jr + " failed to start", e5), r2.stopCapturing();
            }
          else
            T.error(Jr + " failed to load error wrapping functions - cannot start");
        }
      }), this.instance = n3, this.remoteEnabled = !(null === (i2 = this.instance.persistence) || void 0 === i2 || !i2.props[ve]), this.startIfEnabled();
    }
    return N(t2, [{ key: "isEnabled", get: function() {
      var e5;
      return null !== (e5 = this.remoteEnabled) && void 0 !== e5 && e5;
    } }, { key: "isCapturing", get: function() {
      var t3;
      return !(null == e || null === (t3 = e.onerror) || void 0 === t3 || !t3.__POSTHOG_INSTRUMENTED__);
    } }, { key: "hasHandlers", get: function() {
      return this.originalOnUnhandledRejectionHandler || this.unwrapOnError;
    } }, { key: "startIfEnabled", value: function() {
      this.isEnabled && !this.isCapturing && (T.info(Jr + " enabled, starting..."), this.loadScript(this.startCapturing));
    } }, { key: "loadScript", value: function(e5) {
      var t3, n3;
      this.hasHandlers && e5(), null === (t3 = h.__PosthogExtensions__) || void 0 === t3 || null === (n3 = t3.loadExternalDependency) || void 0 === n3 || n3.call(t3, this.instance, "exception-autocapture", function(t4) {
        if (t4)
          return T.error(Jr + " failed to load script", t4);
        e5();
      });
    } }, { key: "stopCapturing", value: function() {
      var e5, t3;
      null === (e5 = this.unwrapOnError) || void 0 === e5 || e5.call(this), null === (t3 = this.unwrapUnhandledRejection) || void 0 === t3 || t3.call(this);
    } }, { key: "afterDecideResponse", value: function(e5) {
      var t3 = e5.autocaptureExceptions;
      this.remoteEnabled = !!t3 || false, this.instance.persistence && this.instance.persistence.register(q({}, ve, this.remoteEnabled)), this.startIfEnabled();
    } }, { key: "captureException", value: function(e5) {
      var t3 = this.instance.requestRouter.endpointFor("ui");
      e5.$exception_personURL = "".concat(t3, "/project/").concat(this.instance.config.token, "/person/").concat(this.instance.get_distinct_id()), this.instance.exceptions.sendExceptionEvent(e5);
    } }]), t2;
  }();
  var Xr = 9e5;
  var Kr = "[Web Vitals]";
  var Zr = function() {
    function t2(e5) {
      var n3, i2 = this;
      L(this, t2), q(this, "_enabledServerSide", false), q(this, "_initialized", false), q(this, "buffer", { url: void 0, metrics: [], firstMetricTimestamp: void 0 }), q(this, "_flushToCapture", function() {
        clearTimeout(i2._delayedFlushTimer), 0 !== i2.buffer.metrics.length && (i2.instance.capture("$web_vitals", i2.buffer.metrics.reduce(function(e6, t3) {
          var n4;
          return M(M({}, e6), {}, (q(n4 = {}, "$web_vitals_".concat(t3.name, "_event"), M({}, t3)), q(n4, "$web_vitals_".concat(t3.name, "_value"), t3.value), n4));
        }, {})), i2.buffer = { url: void 0, metrics: [], firstMetricTimestamp: void 0 });
      }), q(this, "_addToBuffer", function(e6) {
        var t3, n4 = null === (t3 = i2.instance.sessionManager) || void 0 === t3 ? void 0 : t3.checkAndGetSessionAndWindowId(true);
        if (w(n4))
          T.error(Kr + "Could not read session ID. Dropping metrics!");
        else {
          i2.buffer = i2.buffer || { url: void 0, metrics: [], firstMetricTimestamp: void 0 };
          var r2 = i2._currentURL();
          if (!w(r2))
            if (I(null == e6 ? void 0 : e6.name) || I(null == e6 ? void 0 : e6.value))
              T.error(Kr + "Invalid metric received", e6);
            else if (i2._maxAllowedValue && e6.value >= i2._maxAllowedValue)
              T.error(Kr + "Ignoring metric with value >= " + i2._maxAllowedValue, e6);
            else
              i2.buffer.url !== r2 && (i2._flushToCapture(), i2._delayedFlushTimer = setTimeout(i2._flushToCapture, 8e3)), w(i2.buffer.url) && (i2.buffer.url = r2), i2.buffer.firstMetricTimestamp = w(i2.buffer.firstMetricTimestamp) ? Date.now() : i2.buffer.firstMetricTimestamp, i2.buffer.metrics.push(M(M({}, e6), {}, { $current_url: r2, $session_id: n4.sessionId, $window_id: n4.windowId, timestamp: Date.now() })), i2.buffer.metrics.length === i2.allowedMetrics.length && i2._flushToCapture();
        }
      }), q(this, "_startCapturing", function() {
        var e6, t3, n4, r2, s3 = h.__PosthogExtensions__;
        if (!w(s3) && !w(s3.postHogWebVitalsCallbacks)) {
          var o2 = s3.postHogWebVitalsCallbacks;
          e6 = o2.onLCP, t3 = o2.onCLS, n4 = o2.onFCP, r2 = o2.onINP;
        }
        e6 && t3 && n4 && r2 ? (i2.allowedMetrics.indexOf("LCP") > -1 && e6(i2._addToBuffer.bind(i2)), i2.allowedMetrics.indexOf("CLS") > -1 && t3(i2._addToBuffer.bind(i2)), i2.allowedMetrics.indexOf("FCP") > -1 && n4(i2._addToBuffer.bind(i2)), i2.allowedMetrics.indexOf("INP") > -1 && r2(i2._addToBuffer.bind(i2)), i2._initialized = true) : T.error(Kr + "web vitals callbacks not loaded - not starting");
      }), this.instance = e5, this._enabledServerSide = !(null === (n3 = this.instance.persistence) || void 0 === n3 || !n3.props[ge]), this.startIfEnabled();
    }
    return N(t2, [{ key: "allowedMetrics", get: function() {
      var e5, t3, n3 = b(this.instance.config.capture_performance) ? null === (e5 = this.instance.config.capture_performance) || void 0 === e5 ? void 0 : e5.web_vitals_allowed_metrics : void 0;
      return w(n3) ? (null === (t3 = this.instance.persistence) || void 0 === t3 ? void 0 : t3.props[_e]) || ["CLS", "FCP", "INP", "LCP"] : n3;
    } }, { key: "_maxAllowedValue", get: function() {
      var e5 = b(this.instance.config.capture_performance) && F(this.instance.config.capture_performance.__web_vitals_max_value) ? this.instance.config.capture_performance.__web_vitals_max_value : Xr;
      return 0 < e5 && e5 <= 6e4 ? Xr : e5;
    } }, { key: "isEnabled", get: function() {
      var e5 = b(this.instance.config.capture_performance) ? this.instance.config.capture_performance.web_vitals : void 0;
      return P(e5) ? e5 : this._enabledServerSide;
    } }, { key: "startIfEnabled", value: function() {
      this.isEnabled && !this._initialized && (T.info(Kr + " enabled, starting..."), this.loadScript(this._startCapturing));
    } }, { key: "afterDecideResponse", value: function(e5) {
      var t3 = b(e5.capturePerformance) && !!e5.capturePerformance.web_vitals, n3 = b(e5.capturePerformance) ? e5.capturePerformance.web_vitals_allowed_metrics : void 0;
      this.instance.persistence && (this.instance.persistence.register(q({}, ge, t3)), this.instance.persistence.register(q({}, _e, n3))), this._enabledServerSide = t3, this.startIfEnabled();
    } }, { key: "loadScript", value: function(e5) {
      var t3, n3, i2;
      null !== (t3 = h.__PosthogExtensions__) && void 0 !== t3 && t3.postHogWebVitalsCallbacks && e5(), null === (n3 = h.__PosthogExtensions__) || void 0 === n3 || null === (i2 = n3.loadExternalDependency) || void 0 === i2 || i2.call(n3, this.instance, "web-vitals", function(t4) {
        t4 ? T.error(Kr + " failed to load script", t4) : e5();
      });
    } }, { key: "_currentURL", value: function() {
      var t3 = e ? e.location.href : void 0;
      return t3 || T.error(Kr + "Could not determine current URL"), t3;
    } }]), t2;
  }();
  var es = { icontains: function(t2, n3) {
    return !!e && n3.href.toLowerCase().indexOf(t2.toLowerCase()) > -1;
  }, not_icontains: function(t2, n3) {
    return !!e && -1 === n3.href.toLowerCase().indexOf(t2.toLowerCase());
  }, regex: function(t2, n3) {
    return !!e && _t(n3.href, t2);
  }, not_regex: function(t2, n3) {
    return !!e && !_t(n3.href, t2);
  }, exact: function(e5, t2) {
    return t2.href === e5;
  }, is_not: function(e5, t2) {
    return t2.href !== e5;
  } };
  var ts = function() {
    function t2(e5) {
      var n3 = this;
      L(this, t2), q(this, "getWebExperimentsAndEvaluateDisplayLogic", function() {
        var e6 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        n3.getWebExperiments(function(e7) {
          t2.logInfo("retrieved web experiments from the server"), n3._flagToExperiments = /* @__PURE__ */ new Map(), e7.forEach(function(e8) {
            if (e8.feature_flag_key && n3._featureFlags && n3._featureFlags[e8.feature_flag_key]) {
              var i2;
              if (n3._flagToExperiments)
                t2.logInfo("setting flag key ", e8.feature_flag_key, " to web experiment ", e8), null === (i2 = n3._flagToExperiments) || void 0 === i2 || i2.set(e8.feature_flag_key, e8);
              var r2 = n3._featureFlags[e8.feature_flag_key];
              r2 && e8.variants[r2] && t2.applyTransforms(e8.name, r2, e8.variants[r2].transforms);
            } else if (e8.variants)
              for (var s3 in e8.variants) {
                var o2 = e8.variants[s3];
                t2.matchesTestVariant(o2) && t2.applyTransforms(e8.name, s3, o2.transforms);
              }
          });
        }, e6);
      }), this.instance = e5;
      this.instance.onFeatureFlags && this.instance.onFeatureFlags(function(e6) {
        n3.applyFeatureFlagChanges(e6);
      }), this._flagToExperiments = /* @__PURE__ */ new Map();
    }
    return N(t2, [{ key: "applyFeatureFlagChanges", value: function(e5) {
      var n3 = this;
      t2.logInfo("applying feature flags", e5), I(this._flagToExperiments) || this.instance.config.disable_web_experiments || e5.forEach(function(e6) {
        var i2;
        if (n3._flagToExperiments && null !== (i2 = n3._flagToExperiments) && void 0 !== i2 && i2.has(e6)) {
          var r2, s3 = n3.instance.getFeatureFlag(e6), o2 = null === (r2 = n3._flagToExperiments) || void 0 === r2 ? void 0 : r2.get(e6);
          s3 && null != o2 && o2.variants[s3] && t2.applyTransforms(o2.name, s3, o2.variants[s3].transforms);
        }
      });
    } }, { key: "afterDecideResponse", value: function(e5) {
      this._featureFlags = e5.featureFlags, this.loadIfEnabled();
    } }, { key: "loadIfEnabled", value: function() {
      this.instance.config.disable_web_experiments || this.getWebExperimentsAndEvaluateDisplayLogic();
    } }, { key: "getWebExperiments", value: function(e5, t3) {
      if (this.instance.config.disable_web_experiments)
        return e5([]);
      var n3 = this.instance.get_property("$web_experiments");
      if (n3 && !t3)
        return e5(n3);
      this.instance._send_request({ url: this.instance.requestRouter.endpointFor("api", "/api/web_experiments/?token=".concat(this.instance.config.token)), method: "GET", transport: "XHR", callback: function(t4) {
        if (200 !== t4.statusCode || !t4.json)
          return e5([]);
        var n4 = t4.json.experiments || [];
        return e5(n4);
      } });
    } }], [{ key: "matchesTestVariant", value: function(e5) {
      return !I(e5.conditions) && (t2.matchUrlConditions(e5) && t2.matchUTMConditions(e5));
    } }, { key: "matchUrlConditions", value: function(e5) {
      var n3;
      if (I(e5.conditions) || I(null === (n3 = e5.conditions) || void 0 === n3 ? void 0 : n3.url))
        return true;
      var i2, r2, s3, o2 = t2.getWindowLocation();
      return !!o2 && (null === (i2 = e5.conditions) || void 0 === i2 || !i2.url || es[null !== (r2 = null === (s3 = e5.conditions) || void 0 === s3 ? void 0 : s3.urlMatchType) && void 0 !== r2 ? r2 : "icontains"](e5.conditions.url, o2));
    } }, { key: "getWindowLocation", value: function() {
      return null == e ? void 0 : e.location;
    } }, { key: "matchUTMConditions", value: function(e5) {
      var t3;
      if (I(e5.conditions) || I(null === (t3 = e5.conditions) || void 0 === t3 ? void 0 : t3.utm))
        return true;
      var n3 = yn.campaignParams();
      if (n3.utm_source) {
        var i2, r2, s3, o2, a2, u2, l3, c2, d2, h2, f2, v2, p2, g2, _2, m2, y2 = null === (i2 = e5.conditions) || void 0 === i2 || null === (r2 = i2.utm) || void 0 === r2 || !r2.utm_campaign || (null === (s3 = e5.conditions) || void 0 === s3 || null === (o2 = s3.utm) || void 0 === o2 ? void 0 : o2.utm_campaign) == n3.utm_campaign, b2 = null === (a2 = e5.conditions) || void 0 === a2 || null === (u2 = a2.utm) || void 0 === u2 || !u2.utm_source || (null === (l3 = e5.conditions) || void 0 === l3 || null === (c2 = l3.utm) || void 0 === c2 ? void 0 : c2.utm_source) == n3.utm_source, k2 = null === (d2 = e5.conditions) || void 0 === d2 || null === (h2 = d2.utm) || void 0 === h2 || !h2.utm_medium || (null === (f2 = e5.conditions) || void 0 === f2 || null === (v2 = f2.utm) || void 0 === v2 ? void 0 : v2.utm_medium) == n3.utm_medium, w2 = null === (p2 = e5.conditions) || void 0 === p2 || null === (g2 = p2.utm) || void 0 === g2 || !g2.utm_term || (null === (_2 = e5.conditions) || void 0 === _2 || null === (m2 = _2.utm) || void 0 === m2 ? void 0 : m2.utm_term) == n3.utm_term;
        return y2 && k2 && w2 && b2;
      }
      return false;
    } }, { key: "logInfo", value: function(e5) {
      for (var t3 = arguments.length, n3 = new Array(t3 > 1 ? t3 - 1 : 0), i2 = 1; i2 < t3; i2++)
        n3[i2 - 1] = arguments[i2];
      T.info("[WebExperiments] ".concat(e5), n3);
    } }, { key: "applyTransforms", value: function(e5, n3, i2) {
      i2.forEach(function(i3) {
        if (i3.selector) {
          var r2;
          t2.logInfo("applying transform of variant ".concat(n3, " for experiment ").concat(e5, " "), i3);
          var s3 = null === (r2 = document) || void 0 === r2 ? void 0 : r2.querySelectorAll(i3.selector);
          null == s3 || s3.forEach(function(e6) {
            var t3 = e6;
            i3.attributes && i3.attributes.forEach(function(e7) {
              switch (e7.name) {
                case "text":
                  t3.innerText = e7.value;
                  break;
                case "html":
                  t3.innerHTML = e7.value;
                  break;
                case "cssClass":
                  t3.className = e7.value;
                  break;
                default:
                  t3.setAttribute(e7.name, e7.value);
              }
            }), i3.text && (t3.innerText = i3.text), i3.html && (t3.innerHTML = i3.html), i3.className && (t3.className = i3.className);
          });
        }
      });
    } }]), t2;
  }();
  var ns = "/e/";
  var is = function() {
    function e5(t2) {
      var n3;
      L(this, e5), this.instance = t2, this._endpointSuffix = (null === (n3 = this.instance.persistence) || void 0 === n3 ? void 0 : n3.props[pe]) || ns;
    }
    return N(e5, [{ key: "endpoint", get: function() {
      return this.instance.requestRouter.endpointFor("api", this._endpointSuffix);
    } }, { key: "afterDecideResponse", value: function(e6) {
      var t2 = e6.autocaptureExceptions;
      this._endpointSuffix = b(t2) && t2.endpoint || ns, this.instance.persistence && this.instance.persistence.register(q({}, pe, this._endpointSuffix));
    } }, { key: "sendExceptionEvent", value: function(e6) {
      this.instance.capture("$exception", e6, { _noTruncate: true, _batchKey: "exceptionEvent", _url: this.endpoint });
    } }]), e5;
  }();
  var rs = {};
  var ss = function() {
  };
  var os = "posthog";
  var as = !ar && -1 === (null == d ? void 0 : d.indexOf("MSIE")) && -1 === (null == d ? void 0 : d.indexOf("Mozilla"));
  var us = function() {
    var t2, n3, i2;
    return { api_host: "https://us.i.posthog.com", ui_host: null, token: "", autocapture: true, rageclick: true, cross_subdomain_cookie: (n3 = null == o ? void 0 : o.location, i2 = null == n3 ? void 0 : n3.hostname, !!S(i2) && "herokuapp.com" !== i2.split(".").slice(-2).join(".")), persistence: "localStorage+cookie", persistence_name: "", loaded: ss, store_google: true, custom_campaign_params: [], custom_blocked_useragents: [], save_referrer: true, capture_pageview: true, capture_pageleave: "if_capture_pageview", debug: a && S(null == a ? void 0 : a.search) && -1 !== a.search.indexOf("__posthog_debug=true") || false, verbose: false, cookie_expiration: 365, upgrade: false, disable_session_recording: false, disable_persistence: false, disable_web_experiments: true, disable_surveys: false, enable_recording_console_log: void 0, secure_cookie: "https:" === (null == e || null === (t2 = e.location) || void 0 === t2 ? void 0 : t2.protocol), ip: true, opt_out_capturing_by_default: false, opt_out_persistence_by_default: false, opt_out_useragent_filter: false, opt_out_capturing_persistence_type: "localStorage", opt_out_capturing_cookie_prefix: null, opt_in_site_apps: false, property_denylist: [], respect_dnt: false, sanitize_properties: null, request_headers: {}, inapp_protocol: "//", inapp_link_new_window: false, request_batching: true, properties_string_max_length: 65535, session_recording: {}, mask_all_element_attributes: false, mask_all_text: false, advanced_disable_decide: false, advanced_disable_feature_flags: false, advanced_disable_feature_flags_on_first_load: false, advanced_disable_toolbar_metrics: false, feature_flag_request_timeout_ms: 3e3, on_request_error: function(e5) {
      var t3 = "Bad HTTP status: " + e5.statusCode + " " + e5.text;
      T.error(t3);
    }, get_device_id: function(e5) {
      return e5;
    }, _onCapture: ss, capture_performance: void 0, name: "posthog", bootstrap: {}, disable_compression: false, session_idle_timeout_seconds: 1800, person_profiles: "always", __add_tracing_headers: false };
  };
  var ls = function(e5) {
    var t2 = {};
    w(e5.process_person) || (t2.person_profiles = e5.process_person), w(e5.xhr_headers) || (t2.request_headers = e5.xhr_headers), w(e5.cookie_name) || (t2.persistence_name = e5.cookie_name), w(e5.disable_cookie) || (t2.disable_persistence = e5.disable_cookie);
    var n3 = Y({}, t2, e5);
    return m(e5.property_blacklist) && (w(e5.property_denylist) ? n3.property_denylist = e5.property_blacklist : m(e5.property_denylist) ? n3.property_denylist = [].concat(U(e5.property_blacklist), U(e5.property_denylist)) : T.error("Invalid value for property_denylist config: " + e5.property_denylist)), n3;
  };
  var cs = function() {
    function e5() {
      L(this, e5), q(this, "__forceAllowLocalhost", false);
    }
    return N(e5, [{ key: "_forceAllowLocalhost", get: function() {
      return this.__forceAllowLocalhost;
    }, set: function(e6) {
      T.error("WebPerformanceObserver is deprecated and has no impact on network capture. Use `_forceAllowLocalhostNetworkCapture` on `posthog.sessionRecording`"), this.__forceAllowLocalhost = e6;
    } }]), e5;
  }();
  var ds = function() {
    function t2() {
      var e5 = this;
      L(this, t2), q(this, "webPerformance", new cs()), q(this, "version", f.LIB_VERSION), q(this, "_internalEventEmitter", new Pr()), this.config = us(), this.decideEndpointWasHit = false, this.SentryIntegration = kr, this.sentryIntegration = function(t3) {
        return function(e6, t4) {
          var n3 = br(e6, t4);
          return { name: yr, processEvent: function(e7) {
            return n3(e7);
          } };
        }(e5, t3);
      }, this.__request_queue = [], this.__loaded = false, this.analyticsDefaultEndpoint = "/e/", this._initialPageviewCaptured = false, this.featureFlags = new Ve(this), this.toolbar = new sr(this), this.scrollManager = new Ur(this), this.pageViewManager = new Ir(this), this.surveys = new Or(this), this.experiments = new ts(this), this.exceptions = new is(this), this.rateLimiter = new Mr(this), this.requestRouter = new mr(this), this.consent = new Qr(this), this.people = { set: function(t3, n3, i2) {
        var r2 = S(t3) ? q({}, t3, n3) : t3;
        e5.setPersonProperties(r2), null == i2 || i2({});
      }, set_once: function(t3, n3, i2) {
        var r2 = S(t3) ? q({}, t3, n3) : t3;
        e5.setPersonProperties(void 0, r2), null == i2 || i2({});
      } }, this.on("eventCaptured", function(e6) {
        return T.info("send", e6);
      });
    }
    return N(t2, [{ key: "init", value: function(e5, n3, i2) {
      if (i2 && i2 !== os) {
        var r2, s3 = null !== (r2 = rs[i2]) && void 0 !== r2 ? r2 : new t2();
        return s3._init(e5, n3, i2), rs[i2] = s3, rs[os][i2] = s3, s3;
      }
      return this._init(e5, n3, i2);
    } }, { key: "_init", value: function(t3) {
      var n3, i2, r2 = this, s3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, o2 = arguments.length > 2 ? arguments[2] : void 0;
      if (w(t3) || E(t3))
        return T.critical("PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()"), this;
      if (this.__loaded)
        return T.warn("You have already initialized PostHog! Re-initializing is a no-op"), this;
      this.__loaded = true, this.config = {}, this._triggered_notifs = [], this.set_config(Y({}, us(), ls(s3), { name: o2, token: t3 })), this.config.on_xhr_error && T.error("[posthog] on_xhr_error is deprecated. Use on_request_error instead"), this.compression = s3.disable_compression ? void 0 : re.GZipJS, this.persistence = new kn(this.config), this.sessionPersistence = "sessionStorage" === this.config.persistence ? this.persistence : new kn(M(M({}, this.config), {}, { persistence: "sessionStorage" }));
      var a2 = M({}, this.persistence.props), u2 = M({}, this.sessionPersistence.props);
      if (this._requestQueue = new or(function(e5) {
        return r2._send_retriable_request(e5);
      }), this._retryQueue = new vr(this), this.__request_queue = [], this.sessionManager = new gr(this.config, this.persistence), this.sessionPropsManager = new Lr(this.sessionManager, this.persistence), new Gr(this).startIfEnabledOrStop(), this.sessionRecording = new tr(this), this.sessionRecording.startIfEnabledOrStop(), this.config.disable_scroll_properties || this.scrollManager.startMeasuringScrollPosition(), this.autocapture = new Vr(this), this.autocapture.startIfEnabled(), this.surveys.loadIfEnabled(), this.heatmaps = new Hr(this), this.heatmaps.startIfEnabled(), this.webVitalsAutocapture = new Zr(this), this.exceptionObserver = new Yr(this), this.exceptionObserver.startIfEnabled(), f.DEBUG = f.DEBUG || this.config.debug, f.DEBUG && T.info("Starting in debug mode", { this: this, config: s3, thisC: M({}, this.config), p: a2, s: u2 }), this._sync_opt_out_with_persistence(), void 0 !== (null === (n3 = s3.bootstrap) || void 0 === n3 ? void 0 : n3.distinctID)) {
        var l3, c2, d2 = this.config.get_device_id(Ze()), h2 = null !== (l3 = s3.bootstrap) && void 0 !== l3 && l3.isIdentifiedID ? d2 : s3.bootstrap.distinctID;
        this.persistence.set_property(Oe, null !== (c2 = s3.bootstrap) && void 0 !== c2 && c2.isIdentifiedID ? "identified" : "anonymous"), this.register({ distinct_id: s3.bootstrap.distinctID, $device_id: h2 });
      }
      if (this._hasBootstrappedFeatureFlags()) {
        var v2, p2, g2 = Object.keys((null === (v2 = s3.bootstrap) || void 0 === v2 ? void 0 : v2.featureFlags) || {}).filter(function(e5) {
          var t4, n4;
          return !(null === (t4 = s3.bootstrap) || void 0 === t4 || null === (n4 = t4.featureFlags) || void 0 === n4 || !n4[e5]);
        }).reduce(function(e5, t4) {
          var n4, i3;
          return e5[t4] = (null === (n4 = s3.bootstrap) || void 0 === n4 || null === (i3 = n4.featureFlags) || void 0 === i3 ? void 0 : i3[t4]) || false, e5;
        }, {}), _2 = Object.keys((null === (p2 = s3.bootstrap) || void 0 === p2 ? void 0 : p2.featureFlagPayloads) || {}).filter(function(e5) {
          return g2[e5];
        }).reduce(function(e5, t4) {
          var n4, i3, r3, o3;
          null !== (n4 = s3.bootstrap) && void 0 !== n4 && null !== (i3 = n4.featureFlagPayloads) && void 0 !== i3 && i3[t4] && (e5[t4] = null === (r3 = s3.bootstrap) || void 0 === r3 || null === (o3 = r3.featureFlagPayloads) || void 0 === o3 ? void 0 : o3[t4]);
          return e5;
        }, {});
        this.featureFlags.receivedFeatureFlags({ featureFlags: g2, featureFlagPayloads: _2 });
      }
      if (!this.get_distinct_id()) {
        var m2 = this.config.get_device_id(Ze());
        this.register_once({ distinct_id: m2, $device_id: m2 }, ""), this.persistence.set_property(Oe, "anonymous");
      }
      return null == e || null === (i2 = e.addEventListener) || void 0 === i2 || i2.call(e, "onpagehide" in self ? "pagehide" : "unload", this._handle_unload.bind(this)), this.toolbar.maybeLoadToolbar(), s3.segment ? wr(this, function() {
        return r2._loaded();
      }) : this._loaded(), y(this.config._onCapture) && this.on("eventCaptured", function(e5) {
        return r2.config._onCapture(e5.event, e5);
      }), this;
    } }, { key: "_afterDecideResponse", value: function(e5) {
      var t3, n3, i2, r2, s3, o2, a2, u2, l3;
      this.compression = void 0, e5.supportedCompression && !this.config.disable_compression && (this.compression = X(e5.supportedCompression, re.GZipJS) ? re.GZipJS : X(e5.supportedCompression, re.Base64) ? re.Base64 : void 0), null !== (t3 = e5.analytics) && void 0 !== t3 && t3.endpoint && (this.analyticsDefaultEndpoint = e5.analytics.endpoint), null === (n3 = this.sessionRecording) || void 0 === n3 || n3.afterDecideResponse(e5), null === (i2 = this.autocapture) || void 0 === i2 || i2.afterDecideResponse(e5), null === (r2 = this.heatmaps) || void 0 === r2 || r2.afterDecideResponse(e5), null === (s3 = this.experiments) || void 0 === s3 || s3.afterDecideResponse(e5), null === (o2 = this.surveys) || void 0 === o2 || o2.afterDecideResponse(e5), null === (a2 = this.webVitalsAutocapture) || void 0 === a2 || a2.afterDecideResponse(e5), null === (u2 = this.exceptions) || void 0 === u2 || u2.afterDecideResponse(e5), null === (l3 = this.exceptionObserver) || void 0 === l3 || l3.afterDecideResponse(e5);
    } }, { key: "_loaded", value: function() {
      var e5 = this, t3 = this.config.advanced_disable_decide;
      t3 || this.featureFlags.setReloadingPaused(true);
      try {
        this.config.loaded(this);
      } catch (e6) {
        T.critical("`loaded` function failed", e6);
      }
      this._start_queue_if_opted_in(), this.config.capture_pageview && setTimeout(function() {
        e5.consent.isOptedIn() && e5._captureInitialPageview();
      }, 1), t3 || (new nr(this).call(), this.featureFlags.resetRequestQueue());
    } }, { key: "_start_queue_if_opted_in", value: function() {
      var e5;
      this.has_opted_out_capturing() || this.config.request_batching && (null === (e5 = this._requestQueue) || void 0 === e5 || e5.enable());
    } }, { key: "_dom_loaded", value: function() {
      var e5 = this;
      this.has_opted_out_capturing() || Q(this.__request_queue, function(t3) {
        return e5._send_retriable_request(t3);
      }), this.__request_queue = [], this._start_queue_if_opted_in();
    } }, { key: "_handle_unload", value: function() {
      var e5, t3;
      this.config.request_batching ? (this._shouldCapturePageleave() && this.capture("$pageleave"), null === (e5 = this._requestQueue) || void 0 === e5 || e5.unload(), null === (t3 = this._retryQueue) || void 0 === t3 || t3.unload()) : this._shouldCapturePageleave() && this.capture("$pageleave", null, { transport: "sendBeacon" });
    } }, { key: "_send_request", value: function(e5) {
      var t3 = this;
      this.__loaded && (as ? this.__request_queue.push(e5) : this.rateLimiter.isServerRateLimited(e5.batchKey) || (e5.transport = e5.transport || this.config.api_transport, e5.url = lr(e5.url, { ip: this.config.ip ? 1 : 0 }), e5.headers = M({}, this.config.request_headers), e5.compression = "best-available" === e5.compression ? this.compression : e5.compression, function(e6) {
        var t4, n3, i2, r2 = M({}, e6);
        r2.timeout = r2.timeout || 6e4, r2.url = lr(r2.url, { _: new Date().getTime().toString(), ver: f.LIB_VERSION, compression: r2.compression });
        var s3 = null !== (t4 = r2.transport) && void 0 !== t4 ? t4 : "XHR", o2 = null !== (n3 = null === (i2 = ae(dr, function(e7) {
          return e7.transport === s3;
        })) || void 0 === i2 ? void 0 : i2.method) && void 0 !== n3 ? n3 : dr[0].method;
        if (!o2)
          throw new Error("No available transport method");
        o2(r2);
      }(M(M({}, e5), {}, { callback: function(n3) {
        var i2, r2, s3;
        (t3.rateLimiter.checkForLimiting(n3), n3.statusCode >= 400) && (null === (r2 = (s3 = t3.config).on_request_error) || void 0 === r2 || r2.call(s3, n3));
        null === (i2 = e5.callback) || void 0 === i2 || i2.call(e5, n3);
      } }))));
    } }, { key: "_send_retriable_request", value: function(e5) {
      this._retryQueue ? this._retryQueue.retriableRequest(e5) : this._send_request(e5);
    } }, { key: "_execute_array", value: function(e5) {
      var t3, n3 = this, i2 = [], r2 = [], s3 = [];
      Q(e5, function(e6) {
        e6 && (t3 = e6[0], m(t3) ? s3.push(e6) : y(e6) ? e6.call(n3) : m(e6) && "alias" === t3 ? i2.push(e6) : m(e6) && -1 !== t3.indexOf("capture") && y(n3[t3]) ? s3.push(e6) : r2.push(e6));
      });
      var o2 = function(e6, t4) {
        Q(e6, function(e7) {
          if (m(e7[0])) {
            var n4 = t4;
            J(e7, function(e8) {
              n4 = n4[e8[0]].apply(n4, e8.slice(1));
            });
          } else
            this[e7[0]].apply(this, e7.slice(1));
        }, t4);
      };
      o2(i2, this), o2(r2, this), o2(s3, this);
    } }, { key: "_hasBootstrappedFeatureFlags", value: function() {
      var e5, t3;
      return (null === (e5 = this.config.bootstrap) || void 0 === e5 ? void 0 : e5.featureFlags) && Object.keys(null === (t3 = this.config.bootstrap) || void 0 === t3 ? void 0 : t3.featureFlags).length > 0 || false;
    } }, { key: "push", value: function(e5) {
      this._execute_array([e5]);
    } }, { key: "capture", value: function(e5, t3, n3) {
      var i2;
      if (this.__loaded && this.persistence && this.sessionPersistence && this._requestQueue) {
        if (!this.consent.isOptedOut())
          if (!w(e5) && S(e5)) {
            if (this.config.opt_out_useragent_filter || !this._is_bot()) {
              var r2 = null != n3 && n3.skip_client_rate_limiting ? void 0 : this.rateLimiter.clientRateLimitContext();
              if (null == r2 || !r2.isRateLimited) {
                this.sessionPersistence.update_search_keyword(), this.config.store_google && this.sessionPersistence.update_campaign_params(), this.config.save_referrer && this.sessionPersistence.update_referrer_info(), (this.config.store_google || this.config.save_referrer) && this.persistence.set_initial_person_info();
                var s3 = new Date(), o2 = (null == n3 ? void 0 : n3.timestamp) || s3, a2 = { uuid: Ze(), event: e5, properties: this._calculate_event_properties(e5, t3 || {}, o2) };
                r2 && (a2.properties.$lib_rate_limit_remaining_tokens = r2.remainingTokens), (null == n3 ? void 0 : n3.$set) && (a2.$set = null == n3 ? void 0 : n3.$set);
                var u2 = this._calculate_set_once_properties(null == n3 ? void 0 : n3.$set_once);
                u2 && (a2.$set_once = u2), (a2 = ie(a2, null != n3 && n3._noTruncate ? null : this.config.properties_string_max_length)).timestamp = o2, w(null == n3 ? void 0 : n3.timestamp) || (a2.properties.$event_time_override_provided = true, a2.properties.$event_time_override_system_time = s3);
                var l3 = M(M({}, a2.properties.$set), a2.$set);
                k(l3) || this.setPersonPropertiesForFlags(l3), this._internalEventEmitter.emit("eventCaptured", a2);
                var c2 = { method: "POST", url: null !== (i2 = null == n3 ? void 0 : n3._url) && void 0 !== i2 ? i2 : this.requestRouter.endpointFor("api", this.analyticsDefaultEndpoint), data: a2, compression: "best-available", batchKey: null == n3 ? void 0 : n3._batchKey };
                return !this.config.request_batching || n3 && (null == n3 || !n3._batchKey) || null != n3 && n3.send_instantly ? this._send_retriable_request(c2) : this._requestQueue.enqueue(c2), a2;
              }
              T.critical("This capture call is ignored due to client rate limiting.");
            }
          } else
            T.error("No event name provided to posthog.capture");
      } else
        T.uninitializedWarning("posthog.capture");
    } }, { key: "_addCaptureHook", value: function(e5) {
      return this.on("eventCaptured", function(t3) {
        return e5(t3.event, t3);
      });
    } }, { key: "_calculate_event_properties", value: function(e5, t3, n3) {
      if (n3 = n3 || new Date(), !this.persistence || !this.sessionPersistence)
        return t3;
      var i2 = this.persistence.remove_event_timer(e5), r2 = M({}, t3);
      if (r2.token = this.config.token, "$snapshot" === e5) {
        var s3 = M(M({}, this.persistence.properties()), this.sessionPersistence.properties());
        return r2.distinct_id = s3.distinct_id, (!S(r2.distinct_id) && !F(r2.distinct_id) || E(r2.distinct_id)) && T.error("Invalid distinct_id for replay event. This indicates a bug in your implementation"), r2;
      }
      var a2 = yn.properties();
      if (this.sessionManager) {
        var u2 = this.sessionManager.checkAndGetSessionAndWindowId(), l3 = u2.sessionId, c2 = u2.windowId;
        r2.$session_id = l3, r2.$window_id = c2;
      }
      if (this.requestRouter.region === fr.CUSTOM && (r2.$lib_custom_api_host = this.config.api_host), this.sessionPropsManager && this.config.__preview_send_client_session_params && ("$pageview" === e5 || "$pageleave" === e5 || "$autocapture" === e5)) {
        var h2 = this.sessionPropsManager.getSessionProps();
        r2 = Y(r2, h2);
      }
      if (!this.config.disable_scroll_properties) {
        var f2 = {};
        "$pageview" === e5 ? f2 = this.pageViewManager.doPageView(n3) : "$pageleave" === e5 && (f2 = this.pageViewManager.doPageLeave(n3)), r2 = Y(r2, f2);
      }
      if ("$pageview" === e5 && o && (r2.title = o.title), !w(i2)) {
        var v2 = n3.getTime() - i2;
        r2.$duration = parseFloat((v2 / 1e3).toFixed(3));
      }
      d && this.config.opt_out_useragent_filter && (r2.$browser_type = this._is_bot() ? "bot" : "browser"), (r2 = Y({}, a2, this.persistence.properties(), this.sessionPersistence.properties(), r2)).$is_identified = this._isIdentified(), m(this.config.property_denylist) ? J(this.config.property_denylist, function(e6) {
        delete r2[e6];
      }) : T.error("Invalid value for property_denylist config: " + this.config.property_denylist + " or property_blacklist config: " + this.config.property_blacklist);
      var p2 = this.config.sanitize_properties;
      return p2 && (r2 = p2(r2, e5)), r2.$process_person_profile = this._hasPersonProcessing(), r2;
    } }, { key: "_calculate_set_once_properties", value: function(e5) {
      if (!this.persistence || !this._hasPersonProcessing())
        return e5;
      var t3 = Y({}, this.persistence.get_initial_props(), e5 || {});
      return k(t3) ? void 0 : t3;
    } }, { key: "register", value: function(e5, t3) {
      var n3;
      null === (n3 = this.persistence) || void 0 === n3 || n3.register(e5, t3);
    } }, { key: "register_once", value: function(e5, t3, n3) {
      var i2;
      null === (i2 = this.persistence) || void 0 === i2 || i2.register_once(e5, t3, n3);
    } }, { key: "register_for_session", value: function(e5) {
      var t3;
      null === (t3 = this.sessionPersistence) || void 0 === t3 || t3.register(e5);
    } }, { key: "unregister", value: function(e5) {
      var t3;
      null === (t3 = this.persistence) || void 0 === t3 || t3.unregister(e5);
    } }, { key: "unregister_for_session", value: function(e5) {
      var t3;
      null === (t3 = this.sessionPersistence) || void 0 === t3 || t3.unregister(e5);
    } }, { key: "_register_single", value: function(e5, t3) {
      this.register(q({}, e5, t3));
    } }, { key: "getFeatureFlag", value: function(e5, t3) {
      return this.featureFlags.getFeatureFlag(e5, t3);
    } }, { key: "getFeatureFlagPayload", value: function(e5) {
      var t3 = this.featureFlags.getFeatureFlagPayload(e5);
      try {
        return JSON.parse(t3);
      } catch (e6) {
        return t3;
      }
    } }, { key: "isFeatureEnabled", value: function(e5, t3) {
      return this.featureFlags.isFeatureEnabled(e5, t3);
    } }, { key: "reloadFeatureFlags", value: function() {
      this.featureFlags.reloadFeatureFlags();
    } }, { key: "updateEarlyAccessFeatureEnrollment", value: function(e5, t3) {
      this.featureFlags.updateEarlyAccessFeatureEnrollment(e5, t3);
    } }, { key: "getEarlyAccessFeatures", value: function(e5) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      return this.featureFlags.getEarlyAccessFeatures(e5, t3);
    } }, { key: "on", value: function(e5, t3) {
      return this._internalEventEmitter.on(e5, t3);
    } }, { key: "onFeatureFlags", value: function(e5) {
      return this.featureFlags.onFeatureFlags(e5);
    } }, { key: "onSessionId", value: function(e5) {
      var t3, n3;
      return null !== (t3 = null === (n3 = this.sessionManager) || void 0 === n3 ? void 0 : n3.onSessionId(e5)) && void 0 !== t3 ? t3 : function() {
      };
    } }, { key: "getSurveys", value: function(e5) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      this.surveys.getSurveys(e5, t3);
    } }, { key: "getActiveMatchingSurveys", value: function(e5) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      this.surveys.getActiveMatchingSurveys(e5, t3);
    } }, { key: "renderSurvey", value: function(e5, t3) {
      this.surveys.renderSurvey(e5, t3);
    } }, { key: "canRenderSurvey", value: function(e5) {
      this.surveys.canRenderSurvey(e5);
    } }, { key: "getNextSurveyStep", value: function(e5, t3, n3) {
      return this.surveys.getNextSurveyStep(e5, t3, n3);
    } }, { key: "identify", value: function(e5, t3, n3) {
      if (!this.__loaded || !this.persistence)
        return T.uninitializedWarning("posthog.identify");
      if (F(e5) && (e5 = e5.toString(), T.warn("The first argument to posthog.identify was a number, but it should be a string. It has been converted to a string.")), e5) {
        if (["distinct_id", "distinctid"].includes(e5.toLowerCase()))
          T.critical('The string "'.concat(e5, '" was set in posthog.identify which indicates an error. This ID should be unique to the user and not a hardcoded string.'));
        else if (this._requirePersonProcessing("posthog.identify")) {
          var i2 = this.get_distinct_id();
          if (this.register({ $user_id: e5 }), !this.get_property("$device_id")) {
            var r2 = i2;
            this.register_once({ $had_persisted_distinct_id: true, $device_id: r2 }, "");
          }
          e5 !== i2 && e5 !== this.get_property(ce) && (this.unregister(ce), this.register({ distinct_id: e5 }));
          var s3 = "anonymous" === (this.persistence.get_property(Oe) || "anonymous");
          e5 !== i2 && s3 ? (this.persistence.set_property(Oe, "identified"), this.setPersonPropertiesForFlags(t3 || {}, false), this.capture("$identify", { distinct_id: e5, $anon_distinct_id: i2 }, { $set: t3 || {}, $set_once: n3 || {} }), this.featureFlags.setAnonymousDistinctId(i2)) : (t3 || n3) && this.setPersonProperties(t3, n3), e5 !== i2 && (this.reloadFeatureFlags(), this.unregister($e));
        }
      } else
        T.error("Unique user id has not been set in posthog.identify");
    } }, { key: "setPersonProperties", value: function(e5, t3) {
      (e5 || t3) && this._requirePersonProcessing("posthog.setPersonProperties") && (this.setPersonPropertiesForFlags(e5 || {}), this.capture("$set", { $set: e5 || {}, $set_once: t3 || {} }));
    } }, { key: "group", value: function(e5, t3, n3) {
      if (e5 && t3) {
        if (this._requirePersonProcessing("posthog.group")) {
          var i2 = this.getGroups();
          i2[e5] !== t3 && this.resetGroupPropertiesForFlags(e5), this.register({ $groups: M(M({}, i2), {}, q({}, e5, t3)) }), n3 && (this.capture("$groupidentify", { $group_type: e5, $group_key: t3, $group_set: n3 }), this.setGroupPropertiesForFlags(q({}, e5, n3))), i2[e5] === t3 || n3 || this.reloadFeatureFlags();
        }
      } else
        T.error("posthog.group requires a group type and group key");
    } }, { key: "resetGroups", value: function() {
      this.register({ $groups: {} }), this.resetGroupPropertiesForFlags(), this.reloadFeatureFlags();
    } }, { key: "setPersonPropertiesForFlags", value: function(e5) {
      var t3 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      this._requirePersonProcessing("posthog.setPersonPropertiesForFlags") && this.featureFlags.setPersonPropertiesForFlags(e5, t3);
    } }, { key: "resetPersonPropertiesForFlags", value: function() {
      this.featureFlags.resetPersonPropertiesForFlags();
    } }, { key: "setGroupPropertiesForFlags", value: function(e5) {
      var t3 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      this._requirePersonProcessing("posthog.setGroupPropertiesForFlags") && this.featureFlags.setGroupPropertiesForFlags(e5, t3);
    } }, { key: "resetGroupPropertiesForFlags", value: function(e5) {
      this.featureFlags.resetGroupPropertiesForFlags(e5);
    } }, { key: "reset", value: function(e5) {
      var t3, n3, i2, r2;
      if (T.info("reset"), !this.__loaded)
        return T.uninitializedWarning("posthog.reset");
      var s3 = this.get_property("$device_id");
      this.consent.reset(), null === (t3 = this.persistence) || void 0 === t3 || t3.clear(), null === (n3 = this.sessionPersistence) || void 0 === n3 || n3.clear(), null === (i2 = this.persistence) || void 0 === i2 || i2.set_property(Oe, "anonymous"), null === (r2 = this.sessionManager) || void 0 === r2 || r2.resetSessionId();
      var o2 = this.config.get_device_id(Ze());
      this.register_once({ distinct_id: o2, $device_id: e5 ? o2 : s3 }, "");
    } }, { key: "get_distinct_id", value: function() {
      return this.get_property("distinct_id");
    } }, { key: "getGroups", value: function() {
      return this.get_property("$groups") || {};
    } }, { key: "get_session_id", value: function() {
      var e5, t3;
      return null !== (e5 = null === (t3 = this.sessionManager) || void 0 === t3 ? void 0 : t3.checkAndGetSessionAndWindowId(true).sessionId) && void 0 !== e5 ? e5 : "";
    } }, { key: "get_session_replay_url", value: function(e5) {
      if (!this.sessionManager)
        return "";
      var t3 = this.sessionManager.checkAndGetSessionAndWindowId(true), n3 = t3.sessionId, i2 = t3.sessionStartTimestamp, r2 = this.requestRouter.endpointFor("ui", "/project/".concat(this.config.token, "/replay/").concat(n3));
      if (null != e5 && e5.withTimestamp && i2) {
        var s3, o2 = null !== (s3 = e5.timestampLookBack) && void 0 !== s3 ? s3 : 10;
        if (!i2)
          return r2;
        var a2 = Math.max(Math.floor((new Date().getTime() - i2) / 1e3) - o2, 0);
        r2 += "?t=".concat(a2);
      }
      return r2;
    } }, { key: "alias", value: function(e5, t3) {
      return e5 === this.get_property(le) ? (T.critical("Attempting to create alias for existing People user - aborting."), -2) : this._requirePersonProcessing("posthog.alias") ? (w(t3) && (t3 = this.get_distinct_id()), e5 !== t3 ? (this._register_single(ce, e5), this.capture("$create_alias", { alias: e5, distinct_id: t3 })) : (T.warn("alias matches current distinct_id - skipping api call."), this.identify(e5), -1)) : void 0;
    } }, { key: "set_config", value: function(e5) {
      var t3, n3, i2, r2, s3 = M({}, this.config);
      b(e5) && (Y(this.config, ls(e5)), null === (t3 = this.persistence) || void 0 === t3 || t3.update_config(this.config, s3), this.sessionPersistence = "sessionStorage" === this.config.persistence ? this.persistence : new kn(M(M({}, this.config), {}, { persistence: "sessionStorage" })), ut.is_supported() && "true" === ut.get("ph_debug") && (this.config.debug = true), this.config.debug && (f.DEBUG = true, T.info("set_config", { config: e5, oldConfig: s3, newConfig: M({}, this.config) })), null === (n3 = this.sessionRecording) || void 0 === n3 || n3.startIfEnabledOrStop(), null === (i2 = this.autocapture) || void 0 === i2 || i2.startIfEnabled(), null === (r2 = this.heatmaps) || void 0 === r2 || r2.startIfEnabled(), this.surveys.loadIfEnabled(), this._sync_opt_out_with_persistence());
    } }, { key: "startSessionRecording", value: function(e5) {
      var t3, n3 = P(e5) && e5;
      if (n3 || null != e5 && e5.sampling) {
        var i2, r2, s3 = null === (i2 = this.sessionManager) || void 0 === i2 ? void 0 : i2.checkAndGetSessionAndWindowId();
        null === (r2 = this.persistence) || void 0 === r2 || r2.register(q({}, xe, true)), T.info("Session recording started with sampling override for session: ", null == s3 ? void 0 : s3.sessionId);
      }
      (n3 || null != e5 && e5.linked_flag) && (null === (t3 = this.sessionRecording) || void 0 === t3 || t3.overrideLinkedFlag(), T.info("Session recording started with linked_flags override"));
      this.set_config({ disable_session_recording: false });
    } }, { key: "stopSessionRecording", value: function() {
      this.set_config({ disable_session_recording: true });
    } }, { key: "sessionRecordingStarted", value: function() {
      var e5;
      return !(null === (e5 = this.sessionRecording) || void 0 === e5 || !e5.started);
    } }, { key: "captureException", value: function(e5, t3) {
      var n3, i2 = y(null === (n3 = h.__PosthogExtensions__) || void 0 === n3 ? void 0 : n3.parseErrorAsProperties) ? h.__PosthogExtensions__.parseErrorAsProperties([e5.message, void 0, void 0, void 0, e5]) : M({ $exception_type: e5.name, $exception_message: e5.message, $exception_level: "error" }, t3);
      this.exceptions.sendExceptionEvent(i2);
    } }, { key: "loadToolbar", value: function(e5) {
      return this.toolbar.loadToolbar(e5);
    } }, { key: "get_property", value: function(e5) {
      var t3;
      return null === (t3 = this.persistence) || void 0 === t3 ? void 0 : t3.props[e5];
    } }, { key: "getSessionProperty", value: function(e5) {
      var t3;
      return null === (t3 = this.sessionPersistence) || void 0 === t3 ? void 0 : t3.props[e5];
    } }, { key: "toString", value: function() {
      var e5, t3 = null !== (e5 = this.config.name) && void 0 !== e5 ? e5 : os;
      return t3 !== os && (t3 = os + "." + t3), t3;
    } }, { key: "_isIdentified", value: function() {
      var e5, t3;
      return "identified" === (null === (e5 = this.persistence) || void 0 === e5 ? void 0 : e5.get_property(Oe)) || "identified" === (null === (t3 = this.sessionPersistence) || void 0 === t3 ? void 0 : t3.get_property(Oe));
    } }, { key: "_hasPersonProcessing", value: function() {
      var e5, t3, n3, i2;
      return !("never" === this.config.person_profiles || "identified_only" === this.config.person_profiles && !this._isIdentified() && k(this.getGroups()) && (null === (e5 = this.persistence) || void 0 === e5 || null === (t3 = e5.props) || void 0 === t3 || !t3[ce]) && (null === (n3 = this.persistence) || void 0 === n3 || null === (i2 = n3.props) || void 0 === i2 || !i2[qe]));
    } }, { key: "_shouldCapturePageleave", value: function() {
      return true === this.config.capture_pageleave || "if_capture_pageview" === this.config.capture_pageleave && this.config.capture_pageview;
    } }, { key: "createPersonProfile", value: function() {
      this._hasPersonProcessing() || this._requirePersonProcessing("posthog.createPersonProfile") && this.setPersonProperties({}, {});
    } }, { key: "_requirePersonProcessing", value: function(e5) {
      return "never" === this.config.person_profiles ? (T.error(e5 + ' was called, but process_person is set to "never". This call will be ignored.'), false) : (this._register_single(qe, true), true);
    } }, { key: "_sync_opt_out_with_persistence", value: function() {
      var e5, t3, n3, i2, r2 = this.consent.isOptedOut(), s3 = this.config.opt_out_persistence_by_default, o2 = this.config.disable_persistence || r2 && !!s3;
      (null === (e5 = this.persistence) || void 0 === e5 ? void 0 : e5.disabled) !== o2 && (null === (n3 = this.persistence) || void 0 === n3 || n3.set_disabled(o2));
      (null === (t3 = this.sessionPersistence) || void 0 === t3 ? void 0 : t3.disabled) !== o2 && (null === (i2 = this.sessionPersistence) || void 0 === i2 || i2.set_disabled(o2));
    } }, { key: "opt_in_capturing", value: function(e5) {
      var t3;
      (this.consent.optInOut(true), this._sync_opt_out_with_persistence(), w(null == e5 ? void 0 : e5.captureEventName) || null != e5 && e5.captureEventName) && this.capture(null !== (t3 = null == e5 ? void 0 : e5.captureEventName) && void 0 !== t3 ? t3 : "$opt_in", null == e5 ? void 0 : e5.captureProperties, { send_instantly: true });
      this.config.capture_pageview && this._captureInitialPageview();
    } }, { key: "opt_out_capturing", value: function() {
      this.consent.optInOut(false), this._sync_opt_out_with_persistence();
    } }, { key: "has_opted_in_capturing", value: function() {
      return this.consent.isOptedIn();
    } }, { key: "has_opted_out_capturing", value: function() {
      return this.consent.isOptedOut();
    } }, { key: "clear_opt_in_out_capturing", value: function() {
      this.consent.reset(), this._sync_opt_out_with_persistence();
    } }, { key: "_is_bot", value: function() {
      return s2 ? function(e5, t3) {
        if (!e5)
          return false;
        var n3 = e5.userAgent;
        if (n3 && Nr(n3, t3))
          return true;
        try {
          var i2 = null == e5 ? void 0 : e5.userAgentData;
          if (null != i2 && i2.brands && i2.brands.some(function(e6) {
            return Nr(null == e6 ? void 0 : e6.brand, t3);
          }))
            return true;
        } catch (e6) {
        }
        return !!e5.webdriver;
      }(s2, this.config.custom_blocked_useragents) : void 0;
    } }, { key: "_captureInitialPageview", value: function() {
      o && !this._initialPageviewCaptured && (this._initialPageviewCaptured = true, this.capture("$pageview", { title: o.title }, { send_instantly: true }));
    } }, { key: "debug", value: function(t3) {
      false === t3 ? (null == e || e.console.log("You've disabled debug mode."), localStorage && localStorage.removeItem("ph_debug"), this.set_config({ debug: false })) : (null == e || e.console.log("You're now in debug mode. All calls to PostHog will be logged in your console.\nYou can disable this with `posthog.debug(false)`."), localStorage && localStorage.setItem("ph_debug", "true"), this.set_config({ debug: true }));
    } }]), t2;
  }();
  !function(e5, t2) {
    for (var n3 = 0; n3 < t2.length; n3++)
      e5.prototype[t2[n3]] = ee(e5.prototype[t2[n3]]);
  }(ds, ["identify"]);
  var hs;
  var fs = (hs = rs[os] = new ds(), function() {
    function t2() {
      t2.done || (t2.done = true, as = false, J(rs, function(e5) {
        e5._dom_loaded();
      }));
    }
    null != o && o.addEventListener && ("complete" === o.readyState ? t2() : o.addEventListener("DOMContentLoaded", t2, false)), e && oe(e, "load", t2, true);
  }(), hs);

  // src/site.ts
  var Site = class {
    constructor() {
    }
    setup() {
      Page.loadEngineCSS("site.css");
      fs.init("phc_XNXwsF5o7snDKAZVngbWLupKigbqv16MBNOC8UoWKE", { api_host: "https://us.i.posthog.com", person_profiles: "identified_only" });
    }
    exec() {
      this.monitorPosthogClickEvents();
    }
    monitorPosthogClickEvents() {
      const elements = document.querySelectorAll("[ph-event]");
      elements.forEach((element) => {
        const eventName = element.getAttribute("ph-event");
        if (eventName) {
          element.addEventListener("click", () => {
            fs.capture(eventName, {});
            console.log(`PostHog event '${eventName}' fired!`);
          });
        }
      });
    }
  };

  // src/page/services.ts
  var ServicesPage = class {
    constructor() {
    }
    setup() {
      Page.loadEngineCSS("services.css");
    }
    exec() {
      console.log("services page");
      this.installVideoPopup();
    }
    installVideoPopup() {
      console.log("install video");
      const { videoPopup, videoElement, closeButton } = this.createVideoPopupElements();
      document.querySelectorAll('a[href$=".mp4"]').forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          fs.capture("media-popup", {
            media: "3d4d"
          });
          const videoUrl = link.href;
          videoElement.src = videoUrl;
          videoPopup.style.display = "flex";
          videoElement.play();
        });
      });
      closeButton.addEventListener("click", () => {
        videoPopup.style.display = "none";
        videoElement.pause();
        videoElement.src = "";
      });
      videoPopup.addEventListener("click", (event) => {
        if (event.target === videoPopup) {
          videoPopup.style.display = "none";
          videoElement.pause();
          videoElement.src = "";
        }
      });
    }
    createVideoPopupElements() {
      console.log("creating elements");
      const videoPopup = document.createElement("div");
      videoPopup.id = "videoPopup";
      videoPopup.className = "popup-overlay";
      const popupContent = document.createElement("div");
      popupContent.className = "popup-content";
      const closeButton = document.createElement("span");
      closeButton.id = "closePopup";
      closeButton.className = "close-button";
      closeButton.innerHTML = "&times;";
      const videoElement = document.createElement("video");
      videoElement.id = "popupVideo";
      videoElement.style.width = "100%";
      videoElement.controls = true;
      popupContent.appendChild(closeButton);
      popupContent.appendChild(videoElement);
      videoPopup.appendChild(popupContent);
      document.body.appendChild(videoPopup);
      return {
        videoPopup,
        videoElement,
        closeButton
      };
    }
  };

  // src/popup.ts
  var Popup = class {
    constructor(url, config = {}) {
      var _a, _b, _c, _d, _e2;
      this.url = url;
      this.config = {
        width: (_a = config.width) != null ? _a : 800,
        height: (_b = config.height) != null ? _b : 600,
        resizable: (_c = config.resizable) != null ? _c : "no",
        scrollbars: (_d = config.scrollbars) != null ? _d : "yes",
        status: (_e2 = config.status) != null ? _e2 : "yes"
      };
    }
    show() {
      const windowFeatures = `width=${this.config.width},height=${this.config.height},resizable=${this.config.resizable},scrollbars=${this.config.scrollbars},status=${this.config.status}`;
      const popup = window.open(this.url, "_blank", windowFeatures);
      if (!popup || popup.closed || typeof popup.closed == "undefined") {
        alert("Pop-up blocked! Please allow pop-ups for this website to proceed.");
      }
    }
  };

  // src/page/poac.ts
  var PoacPage = class {
    constructor() {
    }
    setup() {
    }
    exec() {
      var SimplybookWidget;
      console.log("exec");
      (function(w2, d2, s3, i2) {
        const script = d2.createElement(s3);
        script.async = true;
        script.src = "//widget.simplybook.me/v2/widget/widget.js";
        script.onload = function() {
          const widgetConstructor = w2.SimplybookWidget;
          if (typeof widgetConstructor !== "function") {
            console.error("SimplybookWidget is not defined as a function. The script may not have loaded properly.");
            return;
          }
          const widget = new widgetConstructor({
            "widget_type": "button",
            "url": "https://luxradiology.simplybook.me",
            "theme": "air",
            "theme_settings": {
              "timeline_modern_display": "as_slots",
              "timeline_hide_unavailable": "1",
              "hide_past_days": "0",
              "timeline_show_end_time": "0",
              "sb_base_color": "#d75481",
              "display_item_mode": "list",
              "booking_nav_bg_color": "#58b9db",
              "body_bg_color": "#f2f2f2",
              "sb_review_image": "",
              "dark_font_color": "#333333",
              "light_font_color": "#ffffff",
              "btn_color_1": "#d75481",
              "sb_company_label_color": "#ffffff",
              "hide_img_mode": "1",
              "show_sidebar": "1",
              "sb_busy": "#b3b3b3",
              "sb_available": "#ffdee8"
            },
            "timeline": "modern",
            "datepicker": "top_calendar",
            "is_rtl": false,
            "app_config": {
              "clear_session": 1,
              "allow_switch_to_ada": 0,
              "predefined": {}
            },
            "button_title": "Book now",
            "button_background_color": "#d75481",
            "button_text_color": "#ffffff",
            "button_position": "right",
            "button_position_offset": "55%",
            "container_id": i2
          });
          d2.querySelectorAll('[book="sbm"]').forEach((element) => {
            element.addEventListener("click", () => {
              widget.options.app_config.predefined.service = element.getAttribute("book-serviceid");
              console.log(widget);
              widget.showPopupFrame("book");
            });
          });
        };
        d2.head.appendChild(script);
      })(window, document, "script", "sbw_0kr3c2");
      document.querySelectorAll('[book="cp"]').forEach((element) => {
        element.addEventListener("click", (event) => {
          event.preventDefault();
          const url = element.href;
          const popup = new Popup(url, { width: 1e3 });
          popup.show();
        });
      });
      api.set("poac", "true");
    }
  };

  // src/page/success.ts
  var SuccessPage = class {
    constructor() {
    }
    setup() {
    }
    exec() {
      if (api.get("poac")) {
        document.querySelectorAll('[conditional="poac"]').forEach((element) => {
          element.style.setProperty("display", "block", "important");
        });
      }
    }
  };

  // src/routes.ts
  var routeDispatcher = () => {
    var routeDispatcher2 = new RouteDispatcher(Site);
    routeDispatcher2.routes = {
      "/": HomePage,
      "/scan": MaternityScanCalcPage,
      "/poac": PoacPage,
      "/book/success": SuccessPage,
      "/services/*": ServicesPage,
      "/test/wfu-if": TestWfuIfPage
    };
    return routeDispatcher2;
  };

  // src/index.ts
  var SITE_NAME = "Site";
  initSSE();
  var setup = () => {
    console.log(`${SITE_NAME} package init v${VERSION}`);
    routeDispatcher().setupRoute();
  };
  var exec = () => {
    routeDispatcher().execRoute();
  };
  setup();
  if (document.readyState !== "loading") {
    exec();
  } else {
    document.addEventListener("DOMContentLoaded", exec);
  }
})();
/*! js-cookie v3.0.5 | MIT */
//# sourceMappingURL=index.js.map
