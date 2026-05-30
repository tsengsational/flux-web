var ALL_WEEKDAYS = [
  "MO",
  "TU",
  "WE",
  "TH",
  "FR",
  "SA",
  "SU"
];
var Weekday = (
  /** @class */
  (function() {
    function Weekday2(weekday, n) {
      if (n === 0)
        throw new Error("Can't create weekday with n == 0");
      this.weekday = weekday;
      this.n = n;
    }
    Weekday2.fromStr = function(str) {
      return new Weekday2(ALL_WEEKDAYS.indexOf(str));
    };
    Weekday2.prototype.nth = function(n) {
      return this.n === n ? this : new Weekday2(this.weekday, n);
    };
    Weekday2.prototype.equals = function(other) {
      return this.weekday === other.weekday && this.n === other.n;
    };
    Weekday2.prototype.toString = function() {
      var s = ALL_WEEKDAYS[this.weekday];
      if (this.n)
        s = (this.n > 0 ? "+" : "") + String(this.n) + s;
      return s;
    };
    Weekday2.prototype.getJsWeekday = function() {
      return this.weekday === 6 ? 0 : this.weekday + 1;
    };
    return Weekday2;
  })()
);
var isPresent = function(value) {
  return value !== null && value !== void 0;
};
var isNumber = function(value) {
  return typeof value === "number";
};
var isWeekdayStr = function(value) {
  return typeof value === "string" && ALL_WEEKDAYS.includes(value);
};
var isArray = Array.isArray;
var range = function(start, end) {
  if (end === void 0) {
    end = start;
  }
  if (arguments.length === 1) {
    end = start;
    start = 0;
  }
  var rang = [];
  for (var i = start; i < end; i++)
    rang.push(i);
  return rang;
};
var repeat = function(value, times) {
  var i = 0;
  var array = [];
  if (isArray(value)) {
    for (; i < times; i++)
      array[i] = [].concat(value);
  } else {
    for (; i < times; i++)
      array[i] = value;
  }
  return array;
};
var toArray = function(item) {
  if (isArray(item)) {
    return item;
  }
  return [item];
};
function padStart(item, targetLength, padString) {
  if (padString === void 0) {
    padString = " ";
  }
  var str = String(item);
  targetLength = targetLength >> 0;
  if (str.length > targetLength) {
    return String(str);
  }
  targetLength = targetLength - str.length;
  if (targetLength > padString.length) {
    padString += repeat(padString, targetLength / padString.length);
  }
  return padString.slice(0, targetLength) + String(str);
}
var split = function(str, sep, num) {
  var splits = str.split(sep);
  return num ? splits.slice(0, num).concat([splits.slice(num).join(sep)]) : splits;
};
var pymod = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};
var divmod = function(a, b) {
  return { div: Math.floor(a / b), mod: pymod(a, b) };
};
var empty = function(obj) {
  return !isPresent(obj) || obj.length === 0;
};
var notEmpty = function(obj) {
  return !empty(obj);
};
var includes = function(arr, val) {
  return notEmpty(arr) && arr.indexOf(val) !== -1;
};
var datetime = function(y, m, d, h, i, s) {
  if (h === void 0) {
    h = 0;
  }
  if (i === void 0) {
    i = 0;
  }
  if (s === void 0) {
    s = 0;
  }
  return new Date(Date.UTC(y, m - 1, d, h, i, s));
};
var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var ONE_DAY = 1e3 * 60 * 60 * 24;
var MAXYEAR = 9999;
var ORDINAL_BASE = datetime(1970, 1, 1);
var PY_WEEKDAYS = [6, 0, 1, 2, 3, 4, 5];
var isLeapYear = function(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
};
var isDate = function(value) {
  return value instanceof Date;
};
var isValidDate = function(value) {
  return isDate(value) && !isNaN(value.getTime());
};
var daysBetween = function(date1, date2) {
  var date1ms = date1.getTime();
  var date2ms = date2.getTime();
  var differencems = date1ms - date2ms;
  return Math.round(differencems / ONE_DAY);
};
var toOrdinal = function(date) {
  return daysBetween(date, ORDINAL_BASE);
};
var fromOrdinal = function(ordinal) {
  return new Date(ORDINAL_BASE.getTime() + ordinal * ONE_DAY);
};
var getMonthDays = function(date) {
  var month = date.getUTCMonth();
  return month === 1 && isLeapYear(date.getUTCFullYear()) ? 29 : MONTH_DAYS[month];
};
var getWeekday = function(date) {
  return PY_WEEKDAYS[date.getUTCDay()];
};
var monthRange = function(year, month) {
  var date = datetime(year, month + 1, 1);
  return [getWeekday(date), getMonthDays(date)];
};
var combine = function(date, time) {
  time = time || date;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()));
};
var clone = function(date) {
  var dolly = new Date(date.getTime());
  return dolly;
};
var cloneDates = function(dates) {
  var clones = [];
  for (var i = 0; i < dates.length; i++) {
    clones.push(clone(dates[i]));
  }
  return clones;
};
var sort = function(dates) {
  dates.sort(function(a, b) {
    return a.getTime() - b.getTime();
  });
};
var timeToUntilString = function(time, utc) {
  if (utc === void 0) {
    utc = true;
  }
  var date = new Date(time);
  return [
    padStart(date.getUTCFullYear().toString(), 4, "0"),
    padStart(date.getUTCMonth() + 1, 2, "0"),
    padStart(date.getUTCDate(), 2, "0"),
    "T",
    padStart(date.getUTCHours(), 2, "0"),
    padStart(date.getUTCMinutes(), 2, "0"),
    padStart(date.getUTCSeconds(), 2, "0"),
    utc ? "Z" : ""
  ].join("");
};
var untilStringToDate = function(until) {
  var re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
  var bits = re.exec(until);
  if (!bits)
    throw new Error("Invalid UNTIL value: ".concat(until));
  return new Date(Date.UTC(parseInt(bits[1], 10), parseInt(bits[2], 10) - 1, parseInt(bits[3], 10), parseInt(bits[5], 10) || 0, parseInt(bits[6], 10) || 0, parseInt(bits[7], 10) || 0));
};
var dateTZtoISO8601 = function(date, timeZone) {
  var dateStr = date.toLocaleString("sv-SE", { timeZone });
  return dateStr.replace(" ", "T") + "Z";
};
var dateInTimeZone = function(date, timeZone) {
  var localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var dateInLocalTZ = new Date(dateTZtoISO8601(date, localTimeZone));
  var dateInTargetTZ = new Date(dateTZtoISO8601(date, timeZone !== null && timeZone !== void 0 ? timeZone : "UTC"));
  var tzOffset = dateInTargetTZ.getTime() - dateInLocalTZ.getTime();
  return new Date(date.getTime() - tzOffset);
};
var IterResult = (
  /** @class */
  (function() {
    function IterResult2(method, args) {
      this.minDate = null;
      this.maxDate = null;
      this._result = [];
      this.total = 0;
      this.method = method;
      this.args = args;
      if (method === "between") {
        this.maxDate = args.inc ? args.before : new Date(args.before.getTime() - 1);
        this.minDate = args.inc ? args.after : new Date(args.after.getTime() + 1);
      } else if (method === "before") {
        this.maxDate = args.inc ? args.dt : new Date(args.dt.getTime() - 1);
      } else if (method === "after") {
        this.minDate = args.inc ? args.dt : new Date(args.dt.getTime() + 1);
      }
    }
    IterResult2.prototype.accept = function(date) {
      ++this.total;
      var tooEarly = this.minDate && date < this.minDate;
      var tooLate = this.maxDate && date > this.maxDate;
      if (this.method === "between") {
        if (tooEarly)
          return true;
        if (tooLate)
          return false;
      } else if (this.method === "before") {
        if (tooLate)
          return false;
      } else if (this.method === "after") {
        if (tooEarly)
          return true;
        this.add(date);
        return false;
      }
      return this.add(date);
    };
    IterResult2.prototype.add = function(date) {
      this._result.push(date);
      return true;
    };
    IterResult2.prototype.getValue = function() {
      var res = this._result;
      switch (this.method) {
        case "all":
        case "between":
          return res;
        case "before":
        case "after":
        default:
          return res.length ? res[res.length - 1] : null;
      }
    };
    IterResult2.prototype.clone = function() {
      return new IterResult2(this.method, this.args);
    };
    return IterResult2;
  })()
);
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var tslib$1 = { exports: {} };
var hasRequiredTslib;
function requireTslib() {
  if (hasRequiredTslib) return tslib$1.exports;
  hasRequiredTslib = 1;
  (function(module) {
    var __extends2;
    var __assign2;
    var __rest2;
    var __decorate2;
    var __param2;
    var __esDecorate2;
    var __runInitializers2;
    var __propKey2;
    var __setFunctionName2;
    var __metadata2;
    var __awaiter2;
    var __generator2;
    var __exportStar2;
    var __values2;
    var __read2;
    var __spread2;
    var __spreadArrays2;
    var __spreadArray2;
    var __await2;
    var __asyncGenerator2;
    var __asyncDelegator2;
    var __asyncValues2;
    var __makeTemplateObject2;
    var __importStar2;
    var __importDefault2;
    var __classPrivateFieldGet2;
    var __classPrivateFieldSet2;
    var __classPrivateFieldIn2;
    var __createBinding2;
    var __addDisposableResource2;
    var __disposeResources2;
    var __rewriteRelativeImportExtension2;
    (function(factory) {
      var root = typeof commonjsGlobal === "object" ? commonjsGlobal : typeof self === "object" ? self : typeof this === "object" ? this : {};
      {
        factory(createExporter(root, createExporter(module.exports)));
      }
      function createExporter(exports$1, previous) {
        if (exports$1 !== root) {
          if (typeof Object.create === "function") {
            Object.defineProperty(exports$1, "__esModule", { value: true });
          } else {
            exports$1.__esModule = true;
          }
        }
        return function(id, v) {
          return exports$1[id] = previous ? previous(id, v) : v;
        };
      }
    })(function(exporter) {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };
      __extends2 = function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      __assign2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      __rest2 = function(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
          }
        return t;
      };
      __decorate2 = function(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };
      __param2 = function(paramIndex, decorator) {
        return function(target, key) {
          decorator(target, key, paramIndex);
        };
      };
      __esDecorate2 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
        function accept(f) {
          if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
          return f;
        }
        var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
        var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
        var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
        var _, done = false;
        for (var i = decorators.length - 1; i >= 0; i--) {
          var context = {};
          for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
          for (var p in contextIn.access) context.access[p] = contextIn.access[p];
          context.addInitializer = function(f) {
            if (done) throw new TypeError("Cannot add initializers after decoration has completed");
            extraInitializers.push(accept(f || null));
          };
          var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
          if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
          } else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
          }
        }
        if (target) Object.defineProperty(target, contextIn.name, descriptor);
        done = true;
      };
      __runInitializers2 = function(thisArg, initializers, value) {
        var useValue = arguments.length > 2;
        for (var i = 0; i < initializers.length; i++) {
          value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
        }
        return useValue ? value : void 0;
      };
      __propKey2 = function(x) {
        return typeof x === "symbol" ? x : "".concat(x);
      };
      __setFunctionName2 = function(f, name, prefix) {
        if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
        return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
      };
      __metadata2 = function(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
      };
      __awaiter2 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      __generator2 = function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2]) _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      __exportStar2 = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding2(o, m, p);
      };
      __createBinding2 = Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      __values2 = function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
          next: function() {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
      };
      __read2 = function(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        } catch (error) {
          e = { error };
        } finally {
          try {
            if (r && !r.done && (m = i["return"])) m.call(i);
          } finally {
            if (e) throw e.error;
          }
        }
        return ar;
      };
      __spread2 = function() {
        for (var ar = [], i = 0; i < arguments.length; i++)
          ar = ar.concat(__read2(arguments[i]));
        return ar;
      };
      __spreadArrays2 = function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
        return r;
      };
      __spreadArray2 = function(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
      };
      __await2 = function(v) {
        return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
      };
      __asyncGenerator2 = function(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
          return this;
        }, i;
        function awaitReturn(f) {
          return function(v) {
            return Promise.resolve(v).then(f, reject);
          };
        }
        function verb(n, f) {
          if (g[n]) {
            i[n] = function(v) {
              return new Promise(function(a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
            if (f) i[n] = f(i[n]);
          }
        }
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e) {
            settle(q[0][3], e);
          }
        }
        function step(r) {
          r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
        }
        function fulfill(value) {
          resume("next", value);
        }
        function reject(value) {
          resume("throw", value);
        }
        function settle(f, v) {
          if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
        }
      };
      __asyncDelegator2 = function(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function(e) {
          throw e;
        }), verb("return"), i[Symbol.iterator] = function() {
          return this;
        }, i;
        function verb(n, f) {
          i[n] = o[n] ? function(v) {
            return (p = !p) ? { value: __await2(o[n](v)), done: false } : f ? f(v) : v;
          } : f;
        }
      };
      __asyncValues2 = function(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values2 === "function" ? __values2(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i);
        function verb(n) {
          i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
              v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
          };
        }
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
      };
      __makeTemplateObject2 = function(cooked, raw) {
        if (Object.defineProperty) {
          Object.defineProperty(cooked, "raw", { value: raw });
        } else {
          cooked.raw = raw;
        }
        return cooked;
      };
      var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }) : function(o, v) {
        o["default"] = v;
      };
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      __importStar2 = function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding2(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      __importDefault2 = function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      __classPrivateFieldGet2 = function(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
      };
      __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
      };
      __classPrivateFieldIn2 = function(state, receiver) {
        if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
      };
      __addDisposableResource2 = function(env, value, async) {
        if (value !== null && value !== void 0) {
          if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
          var dispose, inner;
          if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
          }
          if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
          }
          if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
          if (inner) dispose = function() {
            try {
              inner.call(this);
            } catch (e) {
              return Promise.reject(e);
            }
          };
          env.stack.push({ value, dispose, async });
        } else if (async) {
          env.stack.push({ async: true });
        }
        return value;
      };
      var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
      };
      __disposeResources2 = function(env) {
        function fail(e) {
          env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
          env.hasError = true;
        }
        var r, s = 0;
        function next() {
          while (r = env.stack.pop()) {
            try {
              if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
              if (r.dispose) {
                var result = r.dispose.call(r.value);
                if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
                  fail(e);
                  return next();
                });
              } else s |= 1;
            } catch (e) {
              fail(e);
            }
          }
          if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
          if (env.hasError) throw env.error;
        }
        return next();
      };
      __rewriteRelativeImportExtension2 = function(path, preserveJsx) {
        if (typeof path === "string" && /^\.\.?\//.test(path)) {
          return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
          });
        }
        return path;
      };
      exporter("__extends", __extends2);
      exporter("__assign", __assign2);
      exporter("__rest", __rest2);
      exporter("__decorate", __decorate2);
      exporter("__param", __param2);
      exporter("__esDecorate", __esDecorate2);
      exporter("__runInitializers", __runInitializers2);
      exporter("__propKey", __propKey2);
      exporter("__setFunctionName", __setFunctionName2);
      exporter("__metadata", __metadata2);
      exporter("__awaiter", __awaiter2);
      exporter("__generator", __generator2);
      exporter("__exportStar", __exportStar2);
      exporter("__createBinding", __createBinding2);
      exporter("__values", __values2);
      exporter("__read", __read2);
      exporter("__spread", __spread2);
      exporter("__spreadArrays", __spreadArrays2);
      exporter("__spreadArray", __spreadArray2);
      exporter("__await", __await2);
      exporter("__asyncGenerator", __asyncGenerator2);
      exporter("__asyncDelegator", __asyncDelegator2);
      exporter("__asyncValues", __asyncValues2);
      exporter("__makeTemplateObject", __makeTemplateObject2);
      exporter("__importStar", __importStar2);
      exporter("__importDefault", __importDefault2);
      exporter("__classPrivateFieldGet", __classPrivateFieldGet2);
      exporter("__classPrivateFieldSet", __classPrivateFieldSet2);
      exporter("__classPrivateFieldIn", __classPrivateFieldIn2);
      exporter("__addDisposableResource", __addDisposableResource2);
      exporter("__disposeResources", __disposeResources2);
      exporter("__rewriteRelativeImportExtension", __rewriteRelativeImportExtension2);
    });
  })(tslib$1);
  return tslib$1.exports;
}
var tslibExports = /* @__PURE__ */ requireTslib();
const tslib = /* @__PURE__ */ getDefaultExportFromCjs(tslibExports);
const {
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __exportStar,
  __createBinding,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension
} = tslib;
var CallbackIterResult = (
  /** @class */
  (function(_super) {
    __extends(CallbackIterResult2, _super);
    function CallbackIterResult2(method, args, iterator) {
      var _this = _super.call(this, method, args) || this;
      _this.iterator = iterator;
      return _this;
    }
    CallbackIterResult2.prototype.add = function(date) {
      if (this.iterator(date, this._result.length)) {
        this._result.push(date);
        return true;
      }
      return false;
    };
    return CallbackIterResult2;
  })(IterResult)
);
var ENGLISH = {
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  monthNames: [
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
  ],
  tokens: {
    SKIP: /^[ \r\n\t]+|^\.$/,
    number: /^[1-9][0-9]*/,
    numberAsText: /^(one|two|three)/i,
    every: /^every/i,
    "day(s)": /^days?/i,
    "weekday(s)": /^weekdays?/i,
    "week(s)": /^weeks?/i,
    "hour(s)": /^hours?/i,
    "minute(s)": /^minutes?/i,
    "month(s)": /^months?/i,
    "year(s)": /^years?/i,
    on: /^(on|in)/i,
    at: /^(at)/i,
    the: /^the/i,
    first: /^first/i,
    second: /^second/i,
    third: /^third/i,
    nth: /^([1-9][0-9]*)(\.|th|nd|rd|st)/i,
    last: /^last/i,
    for: /^for/i,
    "time(s)": /^times?/i,
    until: /^(un)?til/i,
    monday: /^mo(n(day)?)?/i,
    tuesday: /^tu(e(s(day)?)?)?/i,
    wednesday: /^we(d(n(esday)?)?)?/i,
    thursday: /^th(u(r(sday)?)?)?/i,
    friday: /^fr(i(day)?)?/i,
    saturday: /^sa(t(urday)?)?/i,
    sunday: /^su(n(day)?)?/i,
    january: /^jan(uary)?/i,
    february: /^feb(ruary)?/i,
    march: /^mar(ch)?/i,
    april: /^apr(il)?/i,
    may: /^may/i,
    june: /^june?/i,
    july: /^july?/i,
    august: /^aug(ust)?/i,
    september: /^sep(t(ember)?)?/i,
    october: /^oct(ober)?/i,
    november: /^nov(ember)?/i,
    december: /^dec(ember)?/i,
    comma: /^(,\s*|(and|or)\s*)+/i
  }
};
var contains = function(arr, val) {
  return arr.indexOf(val) !== -1;
};
var defaultGetText = function(id) {
  return id.toString();
};
var defaultDateFormatter = function(year, month, day) {
  return "".concat(month, " ").concat(day, ", ").concat(year);
};
var ToText = (
  /** @class */
  (function() {
    function ToText2(rrule, gettext, language, dateFormatter) {
      if (gettext === void 0) {
        gettext = defaultGetText;
      }
      if (language === void 0) {
        language = ENGLISH;
      }
      if (dateFormatter === void 0) {
        dateFormatter = defaultDateFormatter;
      }
      this.text = [];
      this.language = language || ENGLISH;
      this.gettext = gettext;
      this.dateFormatter = dateFormatter;
      this.rrule = rrule;
      this.options = rrule.options;
      this.origOptions = rrule.origOptions;
      if (this.origOptions.bymonthday) {
        var bymonthday = [].concat(this.options.bymonthday);
        var bynmonthday = [].concat(this.options.bynmonthday);
        bymonthday.sort(function(a, b) {
          return a - b;
        });
        bynmonthday.sort(function(a, b) {
          return b - a;
        });
        this.bymonthday = bymonthday.concat(bynmonthday);
        if (!this.bymonthday.length)
          this.bymonthday = null;
      }
      if (isPresent(this.origOptions.byweekday)) {
        var byweekday = !isArray(this.origOptions.byweekday) ? [this.origOptions.byweekday] : this.origOptions.byweekday;
        var days = String(byweekday);
        this.byweekday = {
          allWeeks: byweekday.filter(function(weekday) {
            return !weekday.n;
          }),
          someWeeks: byweekday.filter(function(weekday) {
            return Boolean(weekday.n);
          }),
          isWeekdays: days.indexOf("MO") !== -1 && days.indexOf("TU") !== -1 && days.indexOf("WE") !== -1 && days.indexOf("TH") !== -1 && days.indexOf("FR") !== -1 && days.indexOf("SA") === -1 && days.indexOf("SU") === -1,
          isEveryDay: days.indexOf("MO") !== -1 && days.indexOf("TU") !== -1 && days.indexOf("WE") !== -1 && days.indexOf("TH") !== -1 && days.indexOf("FR") !== -1 && days.indexOf("SA") !== -1 && days.indexOf("SU") !== -1
        };
        var sortWeekDays = function(a, b) {
          return a.weekday - b.weekday;
        };
        this.byweekday.allWeeks.sort(sortWeekDays);
        this.byweekday.someWeeks.sort(sortWeekDays);
        if (!this.byweekday.allWeeks.length)
          this.byweekday.allWeeks = null;
        if (!this.byweekday.someWeeks.length)
          this.byweekday.someWeeks = null;
      } else {
        this.byweekday = null;
      }
    }
    ToText2.isFullyConvertible = function(rrule) {
      var canConvert = true;
      if (!(rrule.options.freq in ToText2.IMPLEMENTED))
        return false;
      if (rrule.origOptions.until && rrule.origOptions.count)
        return false;
      for (var key in rrule.origOptions) {
        if (contains(["dtstart", "tzid", "wkst", "freq"], key))
          return true;
        if (!contains(ToText2.IMPLEMENTED[rrule.options.freq], key))
          return false;
      }
      return canConvert;
    };
    ToText2.prototype.isFullyConvertible = function() {
      return ToText2.isFullyConvertible(this.rrule);
    };
    ToText2.prototype.toString = function() {
      var gettext = this.gettext;
      if (!(this.options.freq in ToText2.IMPLEMENTED)) {
        return gettext("RRule error: Unable to fully convert this rrule to text");
      }
      this.text = [gettext("every")];
      this[RRule.FREQUENCIES[this.options.freq]]();
      if (this.options.until) {
        this.add(gettext("until"));
        var until = this.options.until;
        this.add(this.dateFormatter(until.getUTCFullYear(), this.language.monthNames[until.getUTCMonth()], until.getUTCDate()));
      } else if (this.options.count) {
        this.add(gettext("for")).add(this.options.count.toString()).add(this.plural(this.options.count) ? gettext("times") : gettext("time"));
      }
      if (!this.isFullyConvertible())
        this.add(gettext("(~ approximate)"));
      return this.text.join("");
    };
    ToText2.prototype.HOURLY = function() {
      var gettext = this.gettext;
      if (this.options.interval !== 1)
        this.add(this.options.interval.toString());
      this.add(this.plural(this.options.interval) ? gettext("hours") : gettext("hour"));
    };
    ToText2.prototype.MINUTELY = function() {
      var gettext = this.gettext;
      if (this.options.interval !== 1)
        this.add(this.options.interval.toString());
      this.add(this.plural(this.options.interval) ? gettext("minutes") : gettext("minute"));
    };
    ToText2.prototype.DAILY = function() {
      var gettext = this.gettext;
      if (this.options.interval !== 1)
        this.add(this.options.interval.toString());
      if (this.byweekday && this.byweekday.isWeekdays) {
        this.add(this.plural(this.options.interval) ? gettext("weekdays") : gettext("weekday"));
      } else {
        this.add(this.plural(this.options.interval) ? gettext("days") : gettext("day"));
      }
      if (this.origOptions.bymonth) {
        this.add(gettext("in"));
        this._bymonth();
      }
      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday) {
        this._byweekday();
      } else if (this.origOptions.byhour) {
        this._byhour();
      }
    };
    ToText2.prototype.WEEKLY = function() {
      var gettext = this.gettext;
      if (this.options.interval !== 1) {
        this.add(this.options.interval.toString()).add(this.plural(this.options.interval) ? gettext("weeks") : gettext("week"));
      }
      if (this.byweekday && this.byweekday.isWeekdays) {
        if (this.options.interval === 1) {
          this.add(this.plural(this.options.interval) ? gettext("weekdays") : gettext("weekday"));
        } else {
          this.add(gettext("on")).add(gettext("weekdays"));
        }
      } else if (this.byweekday && this.byweekday.isEveryDay) {
        this.add(this.plural(this.options.interval) ? gettext("days") : gettext("day"));
      } else {
        if (this.options.interval === 1)
          this.add(gettext("week"));
        if (this.origOptions.bymonth) {
          this.add(gettext("in"));
          this._bymonth();
        }
        if (this.bymonthday) {
          this._bymonthday();
        } else if (this.byweekday) {
          this._byweekday();
        }
        if (this.origOptions.byhour) {
          this._byhour();
        }
      }
    };
    ToText2.prototype.MONTHLY = function() {
      var gettext = this.gettext;
      if (this.origOptions.bymonth) {
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString()).add(gettext("months"));
          if (this.plural(this.options.interval))
            this.add(gettext("in"));
        }
        this._bymonth();
      } else {
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString());
        }
        this.add(this.plural(this.options.interval) ? gettext("months") : gettext("month"));
      }
      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday && this.byweekday.isWeekdays) {
        this.add(gettext("on")).add(gettext("weekdays"));
      } else if (this.byweekday) {
        this._byweekday();
      }
    };
    ToText2.prototype.YEARLY = function() {
      var gettext = this.gettext;
      if (this.origOptions.bymonth) {
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString());
          this.add(gettext("years"));
        }
        this._bymonth();
      } else {
        if (this.options.interval !== 1) {
          this.add(this.options.interval.toString());
        }
        this.add(this.plural(this.options.interval) ? gettext("years") : gettext("year"));
      }
      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday) {
        this._byweekday();
      }
      if (this.options.byyearday) {
        this.add(gettext("on the")).add(this.list(this.options.byyearday, this.nth, gettext("and"))).add(gettext("day"));
      }
      if (this.options.byweekno) {
        this.add(gettext("in")).add(this.plural(this.options.byweekno.length) ? gettext("weeks") : gettext("week")).add(this.list(this.options.byweekno, void 0, gettext("and")));
      }
    };
    ToText2.prototype._bymonthday = function() {
      var gettext = this.gettext;
      if (this.byweekday && this.byweekday.allWeeks) {
        this.add(gettext("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext, gettext("or"))).add(gettext("the")).add(this.list(this.bymonthday, this.nth, gettext("or")));
      } else {
        this.add(gettext("on the")).add(this.list(this.bymonthday, this.nth, gettext("and")));
      }
    };
    ToText2.prototype._byweekday = function() {
      var gettext = this.gettext;
      if (this.byweekday.allWeeks && !this.byweekday.isWeekdays) {
        this.add(gettext("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext));
      }
      if (this.byweekday.someWeeks) {
        if (this.byweekday.allWeeks)
          this.add(gettext("and"));
        this.add(gettext("on the")).add(this.list(this.byweekday.someWeeks, this.weekdaytext, gettext("and")));
      }
    };
    ToText2.prototype._byhour = function() {
      var gettext = this.gettext;
      this.add(gettext("at")).add(this.list(this.origOptions.byhour, void 0, gettext("and")));
    };
    ToText2.prototype._bymonth = function() {
      this.add(this.list(this.options.bymonth, this.monthtext, this.gettext("and")));
    };
    ToText2.prototype.nth = function(n) {
      n = parseInt(n.toString(), 10);
      var nth;
      var gettext = this.gettext;
      if (n === -1)
        return gettext("last");
      var npos = Math.abs(n);
      switch (npos) {
        case 1:
        case 21:
        case 31:
          nth = npos + gettext("st");
          break;
        case 2:
        case 22:
          nth = npos + gettext("nd");
          break;
        case 3:
        case 23:
          nth = npos + gettext("rd");
          break;
        default:
          nth = npos + gettext("th");
      }
      return n < 0 ? nth + " " + gettext("last") : nth;
    };
    ToText2.prototype.monthtext = function(m) {
      return this.language.monthNames[m - 1];
    };
    ToText2.prototype.weekdaytext = function(wday) {
      var weekday = isNumber(wday) ? (wday + 1) % 7 : wday.getJsWeekday();
      return (wday.n ? this.nth(wday.n) + " " : "") + this.language.dayNames[weekday];
    };
    ToText2.prototype.plural = function(n) {
      return n % 100 !== 1;
    };
    ToText2.prototype.add = function(s) {
      this.text.push(" ");
      this.text.push(s);
      return this;
    };
    ToText2.prototype.list = function(arr, callback, finalDelim, delim) {
      var _this = this;
      if (delim === void 0) {
        delim = ",";
      }
      if (!isArray(arr)) {
        arr = [arr];
      }
      var delimJoin = function(array, delimiter, finalDelimiter) {
        var list = "";
        for (var i = 0; i < array.length; i++) {
          if (i !== 0) {
            if (i === array.length - 1) {
              list += " " + finalDelimiter + " ";
            } else {
              list += delimiter + " ";
            }
          }
          list += array[i];
        }
        return list;
      };
      callback = callback || function(o) {
        return o.toString();
      };
      var realCallback = function(arg) {
        return callback && callback.call(_this, arg);
      };
      if (finalDelim) {
        return delimJoin(arr.map(realCallback), delim, finalDelim);
      } else {
        return arr.map(realCallback).join(delim + " ");
      }
    };
    return ToText2;
  })()
);
var Parser = (
  /** @class */
  (function() {
    function Parser2(rules) {
      this.done = true;
      this.rules = rules;
    }
    Parser2.prototype.start = function(text) {
      this.text = text;
      this.done = false;
      return this.nextSymbol();
    };
    Parser2.prototype.isDone = function() {
      return this.done && this.symbol === null;
    };
    Parser2.prototype.nextSymbol = function() {
      var best;
      var bestSymbol;
      this.symbol = null;
      this.value = null;
      do {
        if (this.done)
          return false;
        var rule = void 0;
        best = null;
        for (var name_1 in this.rules) {
          rule = this.rules[name_1];
          var match = rule.exec(this.text);
          if (match) {
            if (best === null || match[0].length > best[0].length) {
              best = match;
              bestSymbol = name_1;
            }
          }
        }
        if (best != null) {
          this.text = this.text.substr(best[0].length);
          if (this.text === "")
            this.done = true;
        }
        if (best == null) {
          this.done = true;
          this.symbol = null;
          this.value = null;
          return;
        }
      } while (bestSymbol === "SKIP");
      this.symbol = bestSymbol;
      this.value = best;
      return true;
    };
    Parser2.prototype.accept = function(name) {
      if (this.symbol === name) {
        if (this.value) {
          var v = this.value;
          this.nextSymbol();
          return v;
        }
        this.nextSymbol();
        return true;
      }
      return false;
    };
    Parser2.prototype.acceptNumber = function() {
      return this.accept("number");
    };
    Parser2.prototype.expect = function(name) {
      if (this.accept(name))
        return true;
      throw new Error("expected " + name + " but found " + this.symbol);
    };
    return Parser2;
  })()
);
function parseText(text, language) {
  if (language === void 0) {
    language = ENGLISH;
  }
  var options = {};
  var ttr = new Parser(language.tokens);
  if (!ttr.start(text))
    return null;
  S();
  return options;
  function S() {
    ttr.expect("every");
    var n = ttr.acceptNumber();
    if (n)
      options.interval = parseInt(n[0], 10);
    if (ttr.isDone())
      throw new Error("Unexpected end");
    switch (ttr.symbol) {
      case "day(s)":
        options.freq = RRule.DAILY;
        if (ttr.nextSymbol()) {
          AT();
          F();
        }
        break;
      // FIXME Note: every 2 weekdays != every two weeks on weekdays.
      // DAILY on weekdays is not a valid rule
      case "weekday(s)":
        options.freq = RRule.WEEKLY;
        options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
        ttr.nextSymbol();
        AT();
        F();
        break;
      case "week(s)":
        options.freq = RRule.WEEKLY;
        if (ttr.nextSymbol()) {
          ON();
          AT();
          F();
        }
        break;
      case "hour(s)":
        options.freq = RRule.HOURLY;
        if (ttr.nextSymbol()) {
          ON();
          F();
        }
        break;
      case "minute(s)":
        options.freq = RRule.MINUTELY;
        if (ttr.nextSymbol()) {
          ON();
          F();
        }
        break;
      case "month(s)":
        options.freq = RRule.MONTHLY;
        if (ttr.nextSymbol()) {
          ON();
          F();
        }
        break;
      case "year(s)":
        options.freq = RRule.YEARLY;
        if (ttr.nextSymbol()) {
          ON();
          F();
        }
        break;
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        options.freq = RRule.WEEKLY;
        var key = ttr.symbol.substr(0, 2).toUpperCase();
        options.byweekday = [RRule[key]];
        if (!ttr.nextSymbol())
          return;
        while (ttr.accept("comma")) {
          if (ttr.isDone())
            throw new Error("Unexpected end");
          var wkd = decodeWKD();
          if (!wkd) {
            throw new Error("Unexpected symbol " + ttr.symbol + ", expected weekday");
          }
          options.byweekday.push(RRule[wkd]);
          ttr.nextSymbol();
        }
        AT();
        MDAYs();
        F();
        break;
      case "january":
      case "february":
      case "march":
      case "april":
      case "may":
      case "june":
      case "july":
      case "august":
      case "september":
      case "october":
      case "november":
      case "december":
        options.freq = RRule.YEARLY;
        options.bymonth = [decodeM()];
        if (!ttr.nextSymbol())
          return;
        while (ttr.accept("comma")) {
          if (ttr.isDone())
            throw new Error("Unexpected end");
          var m = decodeM();
          if (!m) {
            throw new Error("Unexpected symbol " + ttr.symbol + ", expected month");
          }
          options.bymonth.push(m);
          ttr.nextSymbol();
        }
        ON();
        F();
        break;
      default:
        throw new Error("Unknown symbol");
    }
  }
  function ON() {
    var on = ttr.accept("on");
    var the = ttr.accept("the");
    if (!(on || the))
      return;
    do {
      var nth = decodeNTH();
      var wkd = decodeWKD();
      var m = decodeM();
      if (nth) {
        if (wkd) {
          ttr.nextSymbol();
          if (!options.byweekday)
            options.byweekday = [];
          options.byweekday.push(RRule[wkd].nth(nth));
        } else {
          if (!options.bymonthday)
            options.bymonthday = [];
          options.bymonthday.push(nth);
          ttr.accept("day(s)");
        }
      } else if (wkd) {
        ttr.nextSymbol();
        if (!options.byweekday)
          options.byweekday = [];
        options.byweekday.push(RRule[wkd]);
      } else if (ttr.symbol === "weekday(s)") {
        ttr.nextSymbol();
        if (!options.byweekday) {
          options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
        }
      } else if (ttr.symbol === "week(s)") {
        ttr.nextSymbol();
        var n = ttr.acceptNumber();
        if (!n) {
          throw new Error("Unexpected symbol " + ttr.symbol + ", expected week number");
        }
        options.byweekno = [parseInt(n[0], 10)];
        while (ttr.accept("comma")) {
          n = ttr.acceptNumber();
          if (!n) {
            throw new Error("Unexpected symbol " + ttr.symbol + "; expected monthday");
          }
          options.byweekno.push(parseInt(n[0], 10));
        }
      } else if (m) {
        ttr.nextSymbol();
        if (!options.bymonth)
          options.bymonth = [];
        options.bymonth.push(m);
      } else {
        return;
      }
    } while (ttr.accept("comma") || ttr.accept("the") || ttr.accept("on"));
  }
  function AT() {
    var at = ttr.accept("at");
    if (!at)
      return;
    do {
      var n = ttr.acceptNumber();
      if (!n) {
        throw new Error("Unexpected symbol " + ttr.symbol + ", expected hour");
      }
      options.byhour = [parseInt(n[0], 10)];
      while (ttr.accept("comma")) {
        n = ttr.acceptNumber();
        if (!n) {
          throw new Error("Unexpected symbol " + ttr.symbol + "; expected hour");
        }
        options.byhour.push(parseInt(n[0], 10));
      }
    } while (ttr.accept("comma") || ttr.accept("at"));
  }
  function decodeM() {
    switch (ttr.symbol) {
      case "january":
        return 1;
      case "february":
        return 2;
      case "march":
        return 3;
      case "april":
        return 4;
      case "may":
        return 5;
      case "june":
        return 6;
      case "july":
        return 7;
      case "august":
        return 8;
      case "september":
        return 9;
      case "october":
        return 10;
      case "november":
        return 11;
      case "december":
        return 12;
      default:
        return false;
    }
  }
  function decodeWKD() {
    switch (ttr.symbol) {
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        return ttr.symbol.substr(0, 2).toUpperCase();
      default:
        return false;
    }
  }
  function decodeNTH() {
    switch (ttr.symbol) {
      case "last":
        ttr.nextSymbol();
        return -1;
      case "first":
        ttr.nextSymbol();
        return 1;
      case "second":
        ttr.nextSymbol();
        return ttr.accept("last") ? -2 : 2;
      case "third":
        ttr.nextSymbol();
        return ttr.accept("last") ? -3 : 3;
      case "nth":
        var v = parseInt(ttr.value[1], 10);
        if (v < -366 || v > 366)
          throw new Error("Nth out of range: " + v);
        ttr.nextSymbol();
        return ttr.accept("last") ? -v : v;
      default:
        return false;
    }
  }
  function MDAYs() {
    ttr.accept("on");
    ttr.accept("the");
    var nth = decodeNTH();
    if (!nth)
      return;
    options.bymonthday = [nth];
    ttr.nextSymbol();
    while (ttr.accept("comma")) {
      nth = decodeNTH();
      if (!nth) {
        throw new Error("Unexpected symbol " + ttr.symbol + "; expected monthday");
      }
      options.bymonthday.push(nth);
      ttr.nextSymbol();
    }
  }
  function F() {
    if (ttr.symbol === "until") {
      var date = Date.parse(ttr.text);
      if (!date)
        throw new Error("Cannot parse until date:" + ttr.text);
      options.until = new Date(date);
    } else if (ttr.accept("for")) {
      options.count = parseInt(ttr.value[0], 10);
      ttr.expect("number");
    }
  }
}
var Frequency;
(function(Frequency2) {
  Frequency2[Frequency2["YEARLY"] = 0] = "YEARLY";
  Frequency2[Frequency2["MONTHLY"] = 1] = "MONTHLY";
  Frequency2[Frequency2["WEEKLY"] = 2] = "WEEKLY";
  Frequency2[Frequency2["DAILY"] = 3] = "DAILY";
  Frequency2[Frequency2["HOURLY"] = 4] = "HOURLY";
  Frequency2[Frequency2["MINUTELY"] = 5] = "MINUTELY";
  Frequency2[Frequency2["SECONDLY"] = 6] = "SECONDLY";
})(Frequency || (Frequency = {}));
function freqIsDailyOrGreater(freq) {
  return freq < Frequency.HOURLY;
}
var fromText = function(text, language) {
  if (language === void 0) {
    language = ENGLISH;
  }
  return new RRule(parseText(text, language) || void 0);
};
var common = [
  "count",
  "until",
  "interval",
  "byweekday",
  "bymonthday",
  "bymonth"
];
ToText.IMPLEMENTED = [];
ToText.IMPLEMENTED[Frequency.HOURLY] = common;
ToText.IMPLEMENTED[Frequency.MINUTELY] = common;
ToText.IMPLEMENTED[Frequency.DAILY] = ["byhour"].concat(common);
ToText.IMPLEMENTED[Frequency.WEEKLY] = common;
ToText.IMPLEMENTED[Frequency.MONTHLY] = common;
ToText.IMPLEMENTED[Frequency.YEARLY] = ["byweekno", "byyearday"].concat(common);
var toText = function(rrule, gettext, language, dateFormatter) {
  return new ToText(rrule, gettext, language, dateFormatter).toString();
};
var isFullyConvertible = ToText.isFullyConvertible;
var Time = (
  /** @class */
  (function() {
    function Time2(hour, minute, second, millisecond) {
      this.hour = hour;
      this.minute = minute;
      this.second = second;
      this.millisecond = millisecond || 0;
    }
    Time2.prototype.getHours = function() {
      return this.hour;
    };
    Time2.prototype.getMinutes = function() {
      return this.minute;
    };
    Time2.prototype.getSeconds = function() {
      return this.second;
    };
    Time2.prototype.getMilliseconds = function() {
      return this.millisecond;
    };
    Time2.prototype.getTime = function() {
      return (this.hour * 60 * 60 + this.minute * 60 + this.second) * 1e3 + this.millisecond;
    };
    return Time2;
  })()
);
var DateTime = (
  /** @class */
  (function(_super) {
    __extends(DateTime2, _super);
    function DateTime2(year, month, day, hour, minute, second, millisecond) {
      var _this = _super.call(this, hour, minute, second, millisecond) || this;
      _this.year = year;
      _this.month = month;
      _this.day = day;
      return _this;
    }
    DateTime2.fromDate = function(date) {
      return new this(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.valueOf() % 1e3);
    };
    DateTime2.prototype.getWeekday = function() {
      return getWeekday(new Date(this.getTime()));
    };
    DateTime2.prototype.getTime = function() {
      return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond)).getTime();
    };
    DateTime2.prototype.getDay = function() {
      return this.day;
    };
    DateTime2.prototype.getMonth = function() {
      return this.month;
    };
    DateTime2.prototype.getYear = function() {
      return this.year;
    };
    DateTime2.prototype.addYears = function(years) {
      this.year += years;
    };
    DateTime2.prototype.addMonths = function(months) {
      this.month += months;
      if (this.month > 12) {
        var yearDiv = Math.floor(this.month / 12);
        var monthMod = pymod(this.month, 12);
        this.month = monthMod;
        this.year += yearDiv;
        if (this.month === 0) {
          this.month = 12;
          --this.year;
        }
      }
    };
    DateTime2.prototype.addWeekly = function(days, wkst) {
      if (wkst > this.getWeekday()) {
        this.day += -(this.getWeekday() + 1 + (6 - wkst)) + days * 7;
      } else {
        this.day += -(this.getWeekday() - wkst) + days * 7;
      }
      this.fixDay();
    };
    DateTime2.prototype.addDaily = function(days) {
      this.day += days;
      this.fixDay();
    };
    DateTime2.prototype.addHours = function(hours, filtered, byhour) {
      if (filtered) {
        this.hour += Math.floor((23 - this.hour) / hours) * hours;
      }
      for (; ; ) {
        this.hour += hours;
        var _a = divmod(this.hour, 24), dayDiv = _a.div, hourMod = _a.mod;
        if (dayDiv) {
          this.hour = hourMod;
          this.addDaily(dayDiv);
        }
        if (empty(byhour) || includes(byhour, this.hour))
          break;
      }
    };
    DateTime2.prototype.addMinutes = function(minutes, filtered, byhour, byminute) {
      if (filtered) {
        this.minute += Math.floor((1439 - (this.hour * 60 + this.minute)) / minutes) * minutes;
      }
      for (; ; ) {
        this.minute += minutes;
        var _a = divmod(this.minute, 60), hourDiv = _a.div, minuteMod = _a.mod;
        if (hourDiv) {
          this.minute = minuteMod;
          this.addHours(hourDiv, false, byhour);
        }
        if ((empty(byhour) || includes(byhour, this.hour)) && (empty(byminute) || includes(byminute, this.minute))) {
          break;
        }
      }
    };
    DateTime2.prototype.addSeconds = function(seconds, filtered, byhour, byminute, bysecond) {
      if (filtered) {
        this.second += Math.floor((86399 - (this.hour * 3600 + this.minute * 60 + this.second)) / seconds) * seconds;
      }
      for (; ; ) {
        this.second += seconds;
        var _a = divmod(this.second, 60), minuteDiv = _a.div, secondMod = _a.mod;
        if (minuteDiv) {
          this.second = secondMod;
          this.addMinutes(minuteDiv, false, byhour, byminute);
        }
        if ((empty(byhour) || includes(byhour, this.hour)) && (empty(byminute) || includes(byminute, this.minute)) && (empty(bysecond) || includes(bysecond, this.second))) {
          break;
        }
      }
    };
    DateTime2.prototype.fixDay = function() {
      if (this.day <= 28) {
        return;
      }
      var daysinmonth = monthRange(this.year, this.month - 1)[1];
      if (this.day <= daysinmonth) {
        return;
      }
      while (this.day > daysinmonth) {
        this.day -= daysinmonth;
        ++this.month;
        if (this.month === 13) {
          this.month = 1;
          ++this.year;
          if (this.year > MAXYEAR) {
            return;
          }
        }
        daysinmonth = monthRange(this.year, this.month - 1)[1];
      }
    };
    DateTime2.prototype.add = function(options, filtered) {
      var freq = options.freq, interval = options.interval, wkst = options.wkst, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
      switch (freq) {
        case Frequency.YEARLY:
          return this.addYears(interval);
        case Frequency.MONTHLY:
          return this.addMonths(interval);
        case Frequency.WEEKLY:
          return this.addWeekly(interval, wkst);
        case Frequency.DAILY:
          return this.addDaily(interval);
        case Frequency.HOURLY:
          return this.addHours(interval, filtered, byhour);
        case Frequency.MINUTELY:
          return this.addMinutes(interval, filtered, byhour, byminute);
        case Frequency.SECONDLY:
          return this.addSeconds(interval, filtered, byhour, byminute, bysecond);
      }
    };
    return DateTime2;
  })(Time)
);
function initializeOptions$1(options) {
  var invalid = [];
  var keys = Object.keys(options);
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    if (!includes(defaultKeys, key))
      invalid.push(key);
    if (isDate(options[key]) && !isValidDate(options[key])) {
      invalid.push(key);
    }
  }
  if (invalid.length) {
    throw new Error("Invalid options: " + invalid.join(", "));
  }
  return __assign({}, options);
}
function parseOptions(options) {
  var opts = __assign(__assign({}, DEFAULT_OPTIONS$1), initializeOptions$1(options));
  if (isPresent(opts.byeaster))
    opts.freq = RRule.YEARLY;
  if (!(isPresent(opts.freq) && RRule.FREQUENCIES[opts.freq])) {
    throw new Error("Invalid frequency: ".concat(opts.freq, " ").concat(options.freq));
  }
  if (!opts.dtstart)
    opts.dtstart = new Date((/* @__PURE__ */ new Date()).setMilliseconds(0));
  if (!isPresent(opts.wkst)) {
    opts.wkst = RRule.MO.weekday;
  } else if (isNumber(opts.wkst)) ;
  else {
    opts.wkst = opts.wkst.weekday;
  }
  if (isPresent(opts.bysetpos)) {
    if (isNumber(opts.bysetpos))
      opts.bysetpos = [opts.bysetpos];
    for (var i = 0; i < opts.bysetpos.length; i++) {
      var v = opts.bysetpos[i];
      if (v === 0 || !(v >= -366 && v <= 366)) {
        throw new Error("bysetpos must be between 1 and 366, or between -366 and -1");
      }
    }
  }
  if (!(Boolean(opts.byweekno) || notEmpty(opts.byweekno) || notEmpty(opts.byyearday) || Boolean(opts.bymonthday) || notEmpty(opts.bymonthday) || isPresent(opts.byweekday) || isPresent(opts.byeaster))) {
    switch (opts.freq) {
      case RRule.YEARLY:
        if (!opts.bymonth)
          opts.bymonth = opts.dtstart.getUTCMonth() + 1;
        opts.bymonthday = opts.dtstart.getUTCDate();
        break;
      case RRule.MONTHLY:
        opts.bymonthday = opts.dtstart.getUTCDate();
        break;
      case RRule.WEEKLY:
        opts.byweekday = [getWeekday(opts.dtstart)];
        break;
    }
  }
  if (isPresent(opts.bymonth) && !isArray(opts.bymonth)) {
    opts.bymonth = [opts.bymonth];
  }
  if (isPresent(opts.byyearday) && !isArray(opts.byyearday) && isNumber(opts.byyearday)) {
    opts.byyearday = [opts.byyearday];
  }
  if (!isPresent(opts.bymonthday)) {
    opts.bymonthday = [];
    opts.bynmonthday = [];
  } else if (isArray(opts.bymonthday)) {
    var bymonthday = [];
    var bynmonthday = [];
    for (var i = 0; i < opts.bymonthday.length; i++) {
      var v = opts.bymonthday[i];
      if (v > 0) {
        bymonthday.push(v);
      } else if (v < 0) {
        bynmonthday.push(v);
      }
    }
    opts.bymonthday = bymonthday;
    opts.bynmonthday = bynmonthday;
  } else if (opts.bymonthday < 0) {
    opts.bynmonthday = [opts.bymonthday];
    opts.bymonthday = [];
  } else {
    opts.bynmonthday = [];
    opts.bymonthday = [opts.bymonthday];
  }
  if (isPresent(opts.byweekno) && !isArray(opts.byweekno)) {
    opts.byweekno = [opts.byweekno];
  }
  if (!isPresent(opts.byweekday)) {
    opts.bynweekday = null;
  } else if (isNumber(opts.byweekday)) {
    opts.byweekday = [opts.byweekday];
    opts.bynweekday = null;
  } else if (isWeekdayStr(opts.byweekday)) {
    opts.byweekday = [Weekday.fromStr(opts.byweekday).weekday];
    opts.bynweekday = null;
  } else if (opts.byweekday instanceof Weekday) {
    if (!opts.byweekday.n || opts.freq > RRule.MONTHLY) {
      opts.byweekday = [opts.byweekday.weekday];
      opts.bynweekday = null;
    } else {
      opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]];
      opts.byweekday = null;
    }
  } else {
    var byweekday = [];
    var bynweekday = [];
    for (var i = 0; i < opts.byweekday.length; i++) {
      var wday = opts.byweekday[i];
      if (isNumber(wday)) {
        byweekday.push(wday);
        continue;
      } else if (isWeekdayStr(wday)) {
        byweekday.push(Weekday.fromStr(wday).weekday);
        continue;
      }
      if (!wday.n || opts.freq > RRule.MONTHLY) {
        byweekday.push(wday.weekday);
      } else {
        bynweekday.push([wday.weekday, wday.n]);
      }
    }
    opts.byweekday = notEmpty(byweekday) ? byweekday : null;
    opts.bynweekday = notEmpty(bynweekday) ? bynweekday : null;
  }
  if (!isPresent(opts.byhour)) {
    opts.byhour = opts.freq < RRule.HOURLY ? [opts.dtstart.getUTCHours()] : null;
  } else if (isNumber(opts.byhour)) {
    opts.byhour = [opts.byhour];
  }
  if (!isPresent(opts.byminute)) {
    opts.byminute = opts.freq < RRule.MINUTELY ? [opts.dtstart.getUTCMinutes()] : null;
  } else if (isNumber(opts.byminute)) {
    opts.byminute = [opts.byminute];
  }
  if (!isPresent(opts.bysecond)) {
    opts.bysecond = opts.freq < RRule.SECONDLY ? [opts.dtstart.getUTCSeconds()] : null;
  } else if (isNumber(opts.bysecond)) {
    opts.bysecond = [opts.bysecond];
  }
  return { parsedOptions: opts };
}
function buildTimeset(opts) {
  var millisecondModulo = opts.dtstart.getTime() % 1e3;
  if (!freqIsDailyOrGreater(opts.freq)) {
    return [];
  }
  var timeset = [];
  opts.byhour.forEach(function(hour) {
    opts.byminute.forEach(function(minute) {
      opts.bysecond.forEach(function(second) {
        timeset.push(new Time(hour, minute, second, millisecondModulo));
      });
    });
  });
  return timeset;
}
function parseString(rfcString) {
  var options = rfcString.split("\n").map(parseLine).filter(function(x) {
    return x !== null;
  });
  return __assign(__assign({}, options[0]), options[1]);
}
function parseDtstart(line) {
  var options = {};
  var dtstartWithZone = /DTSTART(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(line);
  if (!dtstartWithZone) {
    return options;
  }
  var tzid = dtstartWithZone[1], dtstart = dtstartWithZone[2];
  if (tzid) {
    options.tzid = tzid;
  }
  options.dtstart = untilStringToDate(dtstart);
  return options;
}
function parseLine(rfcString) {
  rfcString = rfcString.replace(/^\s+|\s+$/, "");
  if (!rfcString.length)
    return null;
  var header = /^([A-Z]+?)[:;]/.exec(rfcString.toUpperCase());
  if (!header) {
    return parseRrule(rfcString);
  }
  var key = header[1];
  switch (key.toUpperCase()) {
    case "RRULE":
    case "EXRULE":
      return parseRrule(rfcString);
    case "DTSTART":
      return parseDtstart(rfcString);
    default:
      throw new Error("Unsupported RFC prop ".concat(key, " in ").concat(rfcString));
  }
}
function parseRrule(line) {
  var strippedLine = line.replace(/^RRULE:/i, "");
  var options = parseDtstart(strippedLine);
  var attrs = line.replace(/^(?:RRULE|EXRULE):/i, "").split(";");
  attrs.forEach(function(attr) {
    var _a = attr.split("="), key = _a[0], value = _a[1];
    switch (key.toUpperCase()) {
      case "FREQ":
        options.freq = Frequency[value.toUpperCase()];
        break;
      case "WKST":
        options.wkst = Days[value.toUpperCase()];
        break;
      case "COUNT":
      case "INTERVAL":
      case "BYSETPOS":
      case "BYMONTH":
      case "BYMONTHDAY":
      case "BYYEARDAY":
      case "BYWEEKNO":
      case "BYHOUR":
      case "BYMINUTE":
      case "BYSECOND":
        var num = parseNumber(value);
        var optionKey = key.toLowerCase();
        options[optionKey] = num;
        break;
      case "BYWEEKDAY":
      case "BYDAY":
        options.byweekday = parseWeekday(value);
        break;
      case "DTSTART":
      case "TZID":
        var dtstart = parseDtstart(line);
        options.tzid = dtstart.tzid;
        options.dtstart = dtstart.dtstart;
        break;
      case "UNTIL":
        options.until = untilStringToDate(value);
        break;
      case "BYEASTER":
        options.byeaster = Number(value);
        break;
      default:
        throw new Error("Unknown RRULE property '" + key + "'");
    }
  });
  return options;
}
function parseNumber(value) {
  if (value.indexOf(",") !== -1) {
    var values = value.split(",");
    return values.map(parseIndividualNumber);
  }
  return parseIndividualNumber(value);
}
function parseIndividualNumber(value) {
  if (/^[+-]?\d+$/.test(value)) {
    return Number(value);
  }
  return value;
}
function parseWeekday(value) {
  var days = value.split(",");
  return days.map(function(day) {
    if (day.length === 2) {
      return Days[day];
    }
    var parts = day.match(/^([+-]?\d{1,2})([A-Z]{2})$/);
    if (!parts || parts.length < 3) {
      throw new SyntaxError("Invalid weekday string: ".concat(day));
    }
    var n = Number(parts[1]);
    var wdaypart = parts[2];
    var wday = Days[wdaypart].weekday;
    return new Weekday(wday, n);
  });
}
var DateWithZone = (
  /** @class */
  (function() {
    function DateWithZone2(date, tzid) {
      if (isNaN(date.getTime())) {
        throw new RangeError("Invalid date passed to DateWithZone");
      }
      this.date = date;
      this.tzid = tzid;
    }
    Object.defineProperty(DateWithZone2.prototype, "isUTC", {
      get: function() {
        return !this.tzid || this.tzid.toUpperCase() === "UTC";
      },
      enumerable: false,
      configurable: true
    });
    DateWithZone2.prototype.toString = function() {
      var datestr = timeToUntilString(this.date.getTime(), this.isUTC);
      if (!this.isUTC) {
        return ";TZID=".concat(this.tzid, ":").concat(datestr);
      }
      return ":".concat(datestr);
    };
    DateWithZone2.prototype.getTime = function() {
      return this.date.getTime();
    };
    DateWithZone2.prototype.rezonedDate = function() {
      if (this.isUTC) {
        return this.date;
      }
      return dateInTimeZone(this.date, this.tzid);
    };
    return DateWithZone2;
  })()
);
function optionsToString(options) {
  var rrule = [];
  var dtstart = "";
  var keys = Object.keys(options);
  var defaultKeys2 = Object.keys(DEFAULT_OPTIONS$1);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] === "tzid")
      continue;
    if (!includes(defaultKeys2, keys[i]))
      continue;
    var key = keys[i].toUpperCase();
    var value = options[keys[i]];
    var outValue = "";
    if (!isPresent(value) || isArray(value) && !value.length)
      continue;
    switch (key) {
      case "FREQ":
        outValue = RRule.FREQUENCIES[options.freq];
        break;
      case "WKST":
        if (isNumber(value)) {
          outValue = new Weekday(value).toString();
        } else {
          outValue = value.toString();
        }
        break;
      case "BYWEEKDAY":
        key = "BYDAY";
        outValue = toArray(value).map(function(wday) {
          if (wday instanceof Weekday) {
            return wday;
          }
          if (isArray(wday)) {
            return new Weekday(wday[0], wday[1]);
          }
          return new Weekday(wday);
        }).toString();
        break;
      case "DTSTART":
        dtstart = buildDtstart(value, options.tzid);
        break;
      case "UNTIL":
        outValue = timeToUntilString(value, !options.tzid);
        break;
      default:
        if (isArray(value)) {
          var strValues = [];
          for (var j = 0; j < value.length; j++) {
            strValues[j] = String(value[j]);
          }
          outValue = strValues.toString();
        } else {
          outValue = String(value);
        }
    }
    if (outValue) {
      rrule.push([key, outValue]);
    }
  }
  var rules = rrule.map(function(_a) {
    var key2 = _a[0], value2 = _a[1];
    return "".concat(key2, "=").concat(value2.toString());
  }).join(";");
  var ruleString = "";
  if (rules !== "") {
    ruleString = "RRULE:".concat(rules);
  }
  return [dtstart, ruleString].filter(function(x) {
    return !!x;
  }).join("\n");
}
function buildDtstart(dtstart, tzid) {
  if (!dtstart) {
    return "";
  }
  return "DTSTART" + new DateWithZone(new Date(dtstart), tzid).toString();
}
function argsMatch(left, right) {
  if (Array.isArray(left)) {
    if (!Array.isArray(right))
      return false;
    if (left.length !== right.length)
      return false;
    return left.every(function(date, i) {
      return date.getTime() === right[i].getTime();
    });
  }
  if (left instanceof Date) {
    return right instanceof Date && left.getTime() === right.getTime();
  }
  return left === right;
}
var Cache = (
  /** @class */
  (function() {
    function Cache2() {
      this.all = false;
      this.before = [];
      this.after = [];
      this.between = [];
    }
    Cache2.prototype._cacheAdd = function(what, value, args) {
      if (value) {
        value = value instanceof Date ? clone(value) : cloneDates(value);
      }
      if (what === "all") {
        this.all = value;
      } else {
        args._value = value;
        this[what].push(args);
      }
    };
    Cache2.prototype._cacheGet = function(what, args) {
      var cached = false;
      var argsKeys = args ? Object.keys(args) : [];
      var findCacheDiff = function(item2) {
        for (var i2 = 0; i2 < argsKeys.length; i2++) {
          var key = argsKeys[i2];
          if (!argsMatch(args[key], item2[key])) {
            return true;
          }
        }
        return false;
      };
      var cachedObject = this[what];
      if (what === "all") {
        cached = this.all;
      } else if (isArray(cachedObject)) {
        for (var i = 0; i < cachedObject.length; i++) {
          var item = cachedObject[i];
          if (argsKeys.length && findCacheDiff(item))
            continue;
          cached = item._value;
          break;
        }
      }
      if (!cached && this.all) {
        var iterResult = new IterResult(what, args);
        for (var i = 0; i < this.all.length; i++) {
          if (!iterResult.accept(this.all[i]))
            break;
        }
        cached = iterResult.getValue();
        this._cacheAdd(what, cached, args);
      }
      return isArray(cached) ? cloneDates(cached) : cached instanceof Date ? clone(cached) : cached;
    };
    return Cache2;
  })()
);
var M365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], repeat(1, 31), true), repeat(2, 28), true), repeat(3, 31), true), repeat(4, 30), true), repeat(5, 31), true), repeat(6, 30), true), repeat(7, 31), true), repeat(8, 31), true), repeat(9, 30), true), repeat(10, 31), true), repeat(11, 30), true), repeat(12, 31), true), repeat(1, 7), true);
var M366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], repeat(1, 31), true), repeat(2, 29), true), repeat(3, 31), true), repeat(4, 30), true), repeat(5, 31), true), repeat(6, 30), true), repeat(7, 31), true), repeat(8, 31), true), repeat(9, 30), true), repeat(10, 31), true), repeat(11, 30), true), repeat(12, 31), true), repeat(1, 7), true);
var M28 = range(1, 29);
var M29 = range(1, 30);
var M30 = range(1, 31);
var M31 = range(1, 32);
var MDAY366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], M31, true), M29, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31.slice(0, 7), true);
var MDAY365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], M31, true), M28, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31.slice(0, 7), true);
var NM28 = range(-28, 0);
var NM29 = range(-29, 0);
var NM30 = range(-30, 0);
var NM31 = range(-31, 0);
var NMDAY366MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], NM31, true), NM29, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31.slice(0, 7), true);
var NMDAY365MASK = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], NM31, true), NM28, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31.slice(0, 7), true);
var M366RANGE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
var M365RANGE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
var WDAYMASK = (function() {
  var wdaymask = [];
  for (var i = 0; i < 55; i++)
    wdaymask = wdaymask.concat(range(7));
  return wdaymask;
})();
function rebuildYear(year, options) {
  var firstyday = datetime(year, 1, 1);
  var yearlen = isLeapYear(year) ? 366 : 365;
  var nextyearlen = isLeapYear(year + 1) ? 366 : 365;
  var yearordinal = toOrdinal(firstyday);
  var yearweekday = getWeekday(firstyday);
  var result = __assign(__assign({ yearlen, nextyearlen, yearordinal, yearweekday }, baseYearMasks(year)), { wnomask: null });
  if (empty(options.byweekno)) {
    return result;
  }
  result.wnomask = repeat(0, yearlen + 7);
  var firstwkst;
  var wyearlen;
  var no1wkst = firstwkst = pymod(7 - yearweekday + options.wkst, 7);
  if (no1wkst >= 4) {
    no1wkst = 0;
    wyearlen = result.yearlen + pymod(yearweekday - options.wkst, 7);
  } else {
    wyearlen = yearlen - no1wkst;
  }
  var div = Math.floor(wyearlen / 7);
  var mod = pymod(wyearlen, 7);
  var numweeks = Math.floor(div + mod / 4);
  for (var j = 0; j < options.byweekno.length; j++) {
    var n = options.byweekno[j];
    if (n < 0) {
      n += numweeks + 1;
    }
    if (!(n > 0 && n <= numweeks)) {
      continue;
    }
    var i = void 0;
    if (n > 1) {
      i = no1wkst + (n - 1) * 7;
      if (no1wkst !== firstwkst) {
        i -= 7 - firstwkst;
      }
    } else {
      i = no1wkst;
    }
    for (var k = 0; k < 7; k++) {
      result.wnomask[i] = 1;
      i++;
      if (result.wdaymask[i] === options.wkst)
        break;
    }
  }
  if (includes(options.byweekno, 1)) {
    var i = no1wkst + numweeks * 7;
    if (no1wkst !== firstwkst)
      i -= 7 - firstwkst;
    if (i < yearlen) {
      for (var j = 0; j < 7; j++) {
        result.wnomask[i] = 1;
        i += 1;
        if (result.wdaymask[i] === options.wkst)
          break;
      }
    }
  }
  if (no1wkst) {
    var lnumweeks = void 0;
    if (!includes(options.byweekno, -1)) {
      var lyearweekday = getWeekday(datetime(year - 1, 1, 1));
      var lno1wkst = pymod(7 - lyearweekday.valueOf() + options.wkst, 7);
      var lyearlen = isLeapYear(year - 1) ? 366 : 365;
      var weekst = void 0;
      if (lno1wkst >= 4) {
        lno1wkst = 0;
        weekst = lyearlen + pymod(lyearweekday - options.wkst, 7);
      } else {
        weekst = yearlen - no1wkst;
      }
      lnumweeks = Math.floor(52 + pymod(weekst, 7) / 4);
    } else {
      lnumweeks = -1;
    }
    if (includes(options.byweekno, lnumweeks)) {
      for (var i = 0; i < no1wkst; i++)
        result.wnomask[i] = 1;
    }
  }
  return result;
}
function baseYearMasks(year) {
  var yearlen = isLeapYear(year) ? 366 : 365;
  var firstyday = datetime(year, 1, 1);
  var wday = getWeekday(firstyday);
  if (yearlen === 365) {
    return {
      mmask: M365MASK,
      mdaymask: MDAY365MASK,
      nmdaymask: NMDAY365MASK,
      wdaymask: WDAYMASK.slice(wday),
      mrange: M365RANGE
    };
  }
  return {
    mmask: M366MASK,
    mdaymask: MDAY366MASK,
    nmdaymask: NMDAY366MASK,
    wdaymask: WDAYMASK.slice(wday),
    mrange: M366RANGE
  };
}
function rebuildMonth(year, month, yearlen, mrange, wdaymask, options) {
  var result = {
    lastyear: year,
    lastmonth: month,
    nwdaymask: []
  };
  var ranges = [];
  if (options.freq === RRule.YEARLY) {
    if (empty(options.bymonth)) {
      ranges = [[0, yearlen]];
    } else {
      for (var j = 0; j < options.bymonth.length; j++) {
        month = options.bymonth[j];
        ranges.push(mrange.slice(month - 1, month + 1));
      }
    }
  } else if (options.freq === RRule.MONTHLY) {
    ranges = [mrange.slice(month - 1, month + 1)];
  }
  if (empty(ranges)) {
    return result;
  }
  result.nwdaymask = repeat(0, yearlen);
  for (var j = 0; j < ranges.length; j++) {
    var rang = ranges[j];
    var first = rang[0];
    var last = rang[1] - 1;
    for (var k = 0; k < options.bynweekday.length; k++) {
      var i = void 0;
      var _a = options.bynweekday[k], wday = _a[0], n = _a[1];
      if (n < 0) {
        i = last + (n + 1) * 7;
        i -= pymod(wdaymask[i] - wday, 7);
      } else {
        i = first + (n - 1) * 7;
        i += pymod(7 - wdaymask[i] + wday, 7);
      }
      if (first <= i && i <= last)
        result.nwdaymask[i] = 1;
    }
  }
  return result;
}
function easter(y, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var a = y % 19;
  var b = Math.floor(y / 100);
  var c = y % 100;
  var d = Math.floor(b / 4);
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3);
  var h = Math.floor(19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = Math.floor(32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var month = Math.floor((h + l - 7 * m + 114) / 31);
  var day = (h + l - 7 * m + 114) % 31 + 1;
  var date = Date.UTC(y, month - 1, day + offset);
  var yearStart = Date.UTC(y, 0, 1);
  return [Math.ceil((date - yearStart) / (1e3 * 60 * 60 * 24))];
}
var Iterinfo = (
  /** @class */
  (function() {
    function Iterinfo2(options) {
      this.options = options;
    }
    Iterinfo2.prototype.rebuild = function(year, month) {
      var options = this.options;
      if (year !== this.lastyear) {
        this.yearinfo = rebuildYear(year, options);
      }
      if (notEmpty(options.bynweekday) && (month !== this.lastmonth || year !== this.lastyear)) {
        var _a = this.yearinfo, yearlen = _a.yearlen, mrange = _a.mrange, wdaymask = _a.wdaymask;
        this.monthinfo = rebuildMonth(year, month, yearlen, mrange, wdaymask, options);
      }
      if (isPresent(options.byeaster)) {
        this.eastermask = easter(year, options.byeaster);
      }
    };
    Object.defineProperty(Iterinfo2.prototype, "lastyear", {
      get: function() {
        return this.monthinfo ? this.monthinfo.lastyear : null;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "lastmonth", {
      get: function() {
        return this.monthinfo ? this.monthinfo.lastmonth : null;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "yearlen", {
      get: function() {
        return this.yearinfo.yearlen;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "yearordinal", {
      get: function() {
        return this.yearinfo.yearordinal;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "mrange", {
      get: function() {
        return this.yearinfo.mrange;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "wdaymask", {
      get: function() {
        return this.yearinfo.wdaymask;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "mmask", {
      get: function() {
        return this.yearinfo.mmask;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "wnomask", {
      get: function() {
        return this.yearinfo.wnomask;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "nwdaymask", {
      get: function() {
        return this.monthinfo ? this.monthinfo.nwdaymask : [];
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "nextyearlen", {
      get: function() {
        return this.yearinfo.nextyearlen;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "mdaymask", {
      get: function() {
        return this.yearinfo.mdaymask;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Iterinfo2.prototype, "nmdaymask", {
      get: function() {
        return this.yearinfo.nmdaymask;
      },
      enumerable: false,
      configurable: true
    });
    Iterinfo2.prototype.ydayset = function() {
      return [range(this.yearlen), 0, this.yearlen];
    };
    Iterinfo2.prototype.mdayset = function(_, month) {
      var start = this.mrange[month - 1];
      var end = this.mrange[month];
      var set = repeat(null, this.yearlen);
      for (var i = start; i < end; i++)
        set[i] = i;
      return [set, start, end];
    };
    Iterinfo2.prototype.wdayset = function(year, month, day) {
      var set = repeat(null, this.yearlen + 7);
      var i = toOrdinal(datetime(year, month, day)) - this.yearordinal;
      var start = i;
      for (var j = 0; j < 7; j++) {
        set[i] = i;
        ++i;
        if (this.wdaymask[i] === this.options.wkst)
          break;
      }
      return [set, start, i];
    };
    Iterinfo2.prototype.ddayset = function(year, month, day) {
      var set = repeat(null, this.yearlen);
      var i = toOrdinal(datetime(year, month, day)) - this.yearordinal;
      set[i] = i;
      return [set, i, i + 1];
    };
    Iterinfo2.prototype.htimeset = function(hour, _, second, millisecond) {
      var _this = this;
      var set = [];
      this.options.byminute.forEach(function(minute) {
        set = set.concat(_this.mtimeset(hour, minute, second, millisecond));
      });
      sort(set);
      return set;
    };
    Iterinfo2.prototype.mtimeset = function(hour, minute, _, millisecond) {
      var set = this.options.bysecond.map(function(second) {
        return new Time(hour, minute, second, millisecond);
      });
      sort(set);
      return set;
    };
    Iterinfo2.prototype.stimeset = function(hour, minute, second, millisecond) {
      return [new Time(hour, minute, second, millisecond)];
    };
    Iterinfo2.prototype.getdayset = function(freq) {
      switch (freq) {
        case Frequency.YEARLY:
          return this.ydayset.bind(this);
        case Frequency.MONTHLY:
          return this.mdayset.bind(this);
        case Frequency.WEEKLY:
          return this.wdayset.bind(this);
        case Frequency.DAILY:
          return this.ddayset.bind(this);
        default:
          return this.ddayset.bind(this);
      }
    };
    Iterinfo2.prototype.gettimeset = function(freq) {
      switch (freq) {
        case Frequency.HOURLY:
          return this.htimeset.bind(this);
        case Frequency.MINUTELY:
          return this.mtimeset.bind(this);
        case Frequency.SECONDLY:
          return this.stimeset.bind(this);
      }
    };
    return Iterinfo2;
  })()
);
function buildPoslist(bysetpos, timeset, start, end, ii, dayset) {
  var poslist = [];
  for (var j = 0; j < bysetpos.length; j++) {
    var daypos = void 0;
    var timepos = void 0;
    var pos = bysetpos[j];
    if (pos < 0) {
      daypos = Math.floor(pos / timeset.length);
      timepos = pymod(pos, timeset.length);
    } else {
      daypos = Math.floor((pos - 1) / timeset.length);
      timepos = pymod(pos - 1, timeset.length);
    }
    var tmp = [];
    for (var k = start; k < end; k++) {
      var val = dayset[k];
      if (!isPresent(val))
        continue;
      tmp.push(val);
    }
    var i = void 0;
    if (daypos < 0) {
      i = tmp.slice(daypos)[0];
    } else {
      i = tmp[daypos];
    }
    var time = timeset[timepos];
    var date = fromOrdinal(ii.yearordinal + i);
    var res = combine(date, time);
    if (!includes(poslist, res))
      poslist.push(res);
  }
  sort(poslist);
  return poslist;
}
function iter(iterResult, options) {
  var dtstart = options.dtstart, freq = options.freq, interval = options.interval, until = options.until, bysetpos = options.bysetpos;
  var count = options.count;
  if (count === 0 || interval === 0) {
    return emitResult(iterResult);
  }
  var counterDate = DateTime.fromDate(dtstart);
  var ii = new Iterinfo(options);
  ii.rebuild(counterDate.year, counterDate.month);
  var timeset = makeTimeset(ii, counterDate, options);
  for (; ; ) {
    var _a = ii.getdayset(freq)(counterDate.year, counterDate.month, counterDate.day), dayset = _a[0], start = _a[1], end = _a[2];
    var filtered = removeFilteredDays(dayset, start, end, ii, options);
    if (notEmpty(bysetpos)) {
      var poslist = buildPoslist(bysetpos, timeset, start, end, ii, dayset);
      for (var j = 0; j < poslist.length; j++) {
        var res = poslist[j];
        if (until && res > until) {
          return emitResult(iterResult);
        }
        if (res >= dtstart) {
          var rezonedDate = rezoneIfNeeded(res, options);
          if (!iterResult.accept(rezonedDate)) {
            return emitResult(iterResult);
          }
          if (count) {
            --count;
            if (!count) {
              return emitResult(iterResult);
            }
          }
        }
      }
    } else {
      for (var j = start; j < end; j++) {
        var currentDay = dayset[j];
        if (!isPresent(currentDay)) {
          continue;
        }
        var date = fromOrdinal(ii.yearordinal + currentDay);
        for (var k = 0; k < timeset.length; k++) {
          var time = timeset[k];
          var res = combine(date, time);
          if (until && res > until) {
            return emitResult(iterResult);
          }
          if (res >= dtstart) {
            var rezonedDate = rezoneIfNeeded(res, options);
            if (!iterResult.accept(rezonedDate)) {
              return emitResult(iterResult);
            }
            if (count) {
              --count;
              if (!count) {
                return emitResult(iterResult);
              }
            }
          }
        }
      }
    }
    if (options.interval === 0) {
      return emitResult(iterResult);
    }
    counterDate.add(options, filtered);
    if (counterDate.year > MAXYEAR) {
      return emitResult(iterResult);
    }
    if (!freqIsDailyOrGreater(freq)) {
      timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, 0);
    }
    ii.rebuild(counterDate.year, counterDate.month);
  }
}
function isFiltered(ii, currentDay, options) {
  var bymonth = options.bymonth, byweekno = options.byweekno, byweekday = options.byweekday, byeaster = options.byeaster, bymonthday = options.bymonthday, bynmonthday = options.bynmonthday, byyearday = options.byyearday;
  return notEmpty(bymonth) && !includes(bymonth, ii.mmask[currentDay]) || notEmpty(byweekno) && !ii.wnomask[currentDay] || notEmpty(byweekday) && !includes(byweekday, ii.wdaymask[currentDay]) || notEmpty(ii.nwdaymask) && !ii.nwdaymask[currentDay] || byeaster !== null && !includes(ii.eastermask, currentDay) || (notEmpty(bymonthday) || notEmpty(bynmonthday)) && !includes(bymonthday, ii.mdaymask[currentDay]) && !includes(bynmonthday, ii.nmdaymask[currentDay]) || notEmpty(byyearday) && (currentDay < ii.yearlen && !includes(byyearday, currentDay + 1) && !includes(byyearday, -ii.yearlen + currentDay) || currentDay >= ii.yearlen && !includes(byyearday, currentDay + 1 - ii.yearlen) && !includes(byyearday, -ii.nextyearlen + currentDay - ii.yearlen));
}
function rezoneIfNeeded(date, options) {
  return new DateWithZone(date, options.tzid).rezonedDate();
}
function emitResult(iterResult) {
  return iterResult.getValue();
}
function removeFilteredDays(dayset, start, end, ii, options) {
  var filtered = false;
  for (var dayCounter = start; dayCounter < end; dayCounter++) {
    var currentDay = dayset[dayCounter];
    filtered = isFiltered(ii, currentDay, options);
    if (filtered)
      dayset[currentDay] = null;
  }
  return filtered;
}
function makeTimeset(ii, counterDate, options) {
  var freq = options.freq, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
  if (freqIsDailyOrGreater(freq)) {
    return buildTimeset(options);
  }
  if (freq >= RRule.HOURLY && notEmpty(byhour) && !includes(byhour, counterDate.hour) || freq >= RRule.MINUTELY && notEmpty(byminute) && !includes(byminute, counterDate.minute) || freq >= RRule.SECONDLY && notEmpty(bysecond) && !includes(bysecond, counterDate.second)) {
    return [];
  }
  return ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, counterDate.millisecond);
}
var Days = {
  MO: new Weekday(0),
  TU: new Weekday(1),
  WE: new Weekday(2),
  TH: new Weekday(3),
  FR: new Weekday(4),
  SA: new Weekday(5),
  SU: new Weekday(6)
};
var DEFAULT_OPTIONS$1 = {
  freq: Frequency.YEARLY,
  dtstart: null,
  interval: 1,
  wkst: Days.MO,
  count: null,
  until: null,
  tzid: null,
  bysetpos: null,
  bymonth: null,
  bymonthday: null,
  bynmonthday: null,
  byyearday: null,
  byweekno: null,
  byweekday: null,
  bynweekday: null,
  byhour: null,
  byminute: null,
  bysecond: null,
  byeaster: null
};
var defaultKeys = Object.keys(DEFAULT_OPTIONS$1);
var RRule = (
  /** @class */
  (function() {
    function RRule2(options, noCache) {
      if (options === void 0) {
        options = {};
      }
      if (noCache === void 0) {
        noCache = false;
      }
      this._cache = noCache ? null : new Cache();
      this.origOptions = initializeOptions$1(options);
      var parsedOptions = parseOptions(options).parsedOptions;
      this.options = parsedOptions;
    }
    RRule2.parseText = function(text, language) {
      return parseText(text, language);
    };
    RRule2.fromText = function(text, language) {
      return fromText(text, language);
    };
    RRule2.fromString = function(str) {
      return new RRule2(RRule2.parseString(str) || void 0);
    };
    RRule2.prototype._iter = function(iterResult) {
      return iter(iterResult, this.options);
    };
    RRule2.prototype._cacheGet = function(what, args) {
      if (!this._cache)
        return false;
      return this._cache._cacheGet(what, args);
    };
    RRule2.prototype._cacheAdd = function(what, value, args) {
      if (!this._cache)
        return;
      return this._cache._cacheAdd(what, value, args);
    };
    RRule2.prototype.all = function(iterator) {
      if (iterator) {
        return this._iter(new CallbackIterResult("all", {}, iterator));
      }
      var result = this._cacheGet("all");
      if (result === false) {
        result = this._iter(new IterResult("all", {}));
        this._cacheAdd("all", result);
      }
      return result;
    };
    RRule2.prototype.between = function(after, before, inc, iterator) {
      if (inc === void 0) {
        inc = false;
      }
      if (!isValidDate(after) || !isValidDate(before)) {
        throw new Error("Invalid date passed in to RRule.between");
      }
      var args = {
        before,
        after,
        inc
      };
      if (iterator) {
        return this._iter(new CallbackIterResult("between", args, iterator));
      }
      var result = this._cacheGet("between", args);
      if (result === false) {
        result = this._iter(new IterResult("between", args));
        this._cacheAdd("between", result, args);
      }
      return result;
    };
    RRule2.prototype.before = function(dt, inc) {
      if (inc === void 0) {
        inc = false;
      }
      if (!isValidDate(dt)) {
        throw new Error("Invalid date passed in to RRule.before");
      }
      var args = { dt, inc };
      var result = this._cacheGet("before", args);
      if (result === false) {
        result = this._iter(new IterResult("before", args));
        this._cacheAdd("before", result, args);
      }
      return result;
    };
    RRule2.prototype.after = function(dt, inc) {
      if (inc === void 0) {
        inc = false;
      }
      if (!isValidDate(dt)) {
        throw new Error("Invalid date passed in to RRule.after");
      }
      var args = { dt, inc };
      var result = this._cacheGet("after", args);
      if (result === false) {
        result = this._iter(new IterResult("after", args));
        this._cacheAdd("after", result, args);
      }
      return result;
    };
    RRule2.prototype.count = function() {
      return this.all().length;
    };
    RRule2.prototype.toString = function() {
      return optionsToString(this.origOptions);
    };
    RRule2.prototype.toText = function(gettext, language, dateFormatter) {
      return toText(this, gettext, language, dateFormatter);
    };
    RRule2.prototype.isFullyConvertibleToText = function() {
      return isFullyConvertible(this);
    };
    RRule2.prototype.clone = function() {
      return new RRule2(this.origOptions);
    };
    RRule2.FREQUENCIES = [
      "YEARLY",
      "MONTHLY",
      "WEEKLY",
      "DAILY",
      "HOURLY",
      "MINUTELY",
      "SECONDLY"
    ];
    RRule2.YEARLY = Frequency.YEARLY;
    RRule2.MONTHLY = Frequency.MONTHLY;
    RRule2.WEEKLY = Frequency.WEEKLY;
    RRule2.DAILY = Frequency.DAILY;
    RRule2.HOURLY = Frequency.HOURLY;
    RRule2.MINUTELY = Frequency.MINUTELY;
    RRule2.SECONDLY = Frequency.SECONDLY;
    RRule2.MO = Days.MO;
    RRule2.TU = Days.TU;
    RRule2.WE = Days.WE;
    RRule2.TH = Days.TH;
    RRule2.FR = Days.FR;
    RRule2.SA = Days.SA;
    RRule2.SU = Days.SU;
    RRule2.parseString = parseString;
    RRule2.optionsToString = optionsToString;
    return RRule2;
  })()
);
function iterSet(iterResult, _rrule, _exrule, _rdate, _exdate, tzid) {
  var _exdateHash = {};
  var _accept = iterResult.accept;
  function evalExdate(after, before) {
    _exrule.forEach(function(rrule) {
      rrule.between(after, before, true).forEach(function(date) {
        _exdateHash[Number(date)] = true;
      });
    });
  }
  _exdate.forEach(function(date) {
    var zonedDate2 = new DateWithZone(date, tzid).rezonedDate();
    _exdateHash[Number(zonedDate2)] = true;
  });
  iterResult.accept = function(date) {
    var dt = Number(date);
    if (isNaN(dt))
      return _accept.call(this, date);
    if (!_exdateHash[dt]) {
      evalExdate(new Date(dt - 1), new Date(dt + 1));
      if (!_exdateHash[dt]) {
        _exdateHash[dt] = true;
        return _accept.call(this, date);
      }
    }
    return true;
  };
  if (iterResult.method === "between") {
    evalExdate(iterResult.args.after, iterResult.args.before);
    iterResult.accept = function(date) {
      var dt = Number(date);
      if (!_exdateHash[dt]) {
        _exdateHash[dt] = true;
        return _accept.call(this, date);
      }
      return true;
    };
  }
  for (var i = 0; i < _rdate.length; i++) {
    var zonedDate = new DateWithZone(_rdate[i], tzid).rezonedDate();
    if (!iterResult.accept(new Date(zonedDate.getTime())))
      break;
  }
  _rrule.forEach(function(rrule) {
    iter(iterResult, rrule.options);
  });
  var res = iterResult._result;
  sort(res);
  switch (iterResult.method) {
    case "all":
    case "between":
      return res;
    case "before":
      return res.length && res[res.length - 1] || null;
    case "after":
    default:
      return res.length && res[0] || null;
  }
}
var DEFAULT_OPTIONS = {
  dtstart: null,
  cache: false,
  unfold: false,
  forceset: false,
  compatible: false,
  tzid: null
};
function parseInput(s, options) {
  var rrulevals = [];
  var rdatevals = [];
  var exrulevals = [];
  var exdatevals = [];
  var parsedDtstart = parseDtstart(s);
  var dtstart = parsedDtstart.dtstart;
  var tzid = parsedDtstart.tzid;
  var lines = splitIntoLines(s, options.unfold);
  lines.forEach(function(line) {
    var _a;
    if (!line)
      return;
    var _b = breakDownLine(line), name = _b.name, parms = _b.parms, value = _b.value;
    switch (name.toUpperCase()) {
      case "RRULE":
        if (parms.length) {
          throw new Error("unsupported RRULE parm: ".concat(parms.join(",")));
        }
        rrulevals.push(parseString(line));
        break;
      case "RDATE":
        var _c = (_a = /RDATE(?:;TZID=([^:=]+))?/i.exec(line)) !== null && _a !== void 0 ? _a : [], rdateTzid = _c[1];
        if (rdateTzid && !tzid) {
          tzid = rdateTzid;
        }
        rdatevals = rdatevals.concat(parseRDate(value, parms));
        break;
      case "EXRULE":
        if (parms.length) {
          throw new Error("unsupported EXRULE parm: ".concat(parms.join(",")));
        }
        exrulevals.push(parseString(value));
        break;
      case "EXDATE":
        exdatevals = exdatevals.concat(parseRDate(value, parms));
        break;
      case "DTSTART":
        break;
      default:
        throw new Error("unsupported property: " + name);
    }
  });
  return {
    dtstart,
    tzid,
    rrulevals,
    rdatevals,
    exrulevals,
    exdatevals
  };
}
function buildRule(s, options) {
  var _a = parseInput(s, options), rrulevals = _a.rrulevals, rdatevals = _a.rdatevals, exrulevals = _a.exrulevals, exdatevals = _a.exdatevals, dtstart = _a.dtstart, tzid = _a.tzid;
  var noCache = options.cache === false;
  if (options.compatible) {
    options.forceset = true;
    options.unfold = true;
  }
  if (options.forceset || rrulevals.length > 1 || rdatevals.length || exrulevals.length || exdatevals.length) {
    var rset_1 = new RRuleSet(noCache);
    rset_1.dtstart(dtstart);
    rset_1.tzid(tzid || void 0);
    rrulevals.forEach(function(val2) {
      rset_1.rrule(new RRule(groomRruleOptions(val2, dtstart, tzid), noCache));
    });
    rdatevals.forEach(function(date) {
      rset_1.rdate(date);
    });
    exrulevals.forEach(function(val2) {
      rset_1.exrule(new RRule(groomRruleOptions(val2, dtstart, tzid), noCache));
    });
    exdatevals.forEach(function(date) {
      rset_1.exdate(date);
    });
    if (options.compatible && options.dtstart)
      rset_1.rdate(dtstart);
    return rset_1;
  }
  var val = rrulevals[0] || {};
  return new RRule(groomRruleOptions(val, val.dtstart || options.dtstart || dtstart, val.tzid || options.tzid || tzid), noCache);
}
function rrulestr(s, options) {
  if (options === void 0) {
    options = {};
  }
  return buildRule(s, initializeOptions(options));
}
function groomRruleOptions(val, dtstart, tzid) {
  return __assign(__assign({}, val), { dtstart, tzid });
}
function initializeOptions(options) {
  var invalid = [];
  var keys = Object.keys(options);
  var defaultKeys2 = Object.keys(DEFAULT_OPTIONS);
  keys.forEach(function(key) {
    if (!includes(defaultKeys2, key))
      invalid.push(key);
  });
  if (invalid.length) {
    throw new Error("Invalid options: " + invalid.join(", "));
  }
  return __assign(__assign({}, DEFAULT_OPTIONS), options);
}
function extractName(line) {
  if (line.indexOf(":") === -1) {
    return {
      name: "RRULE",
      value: line
    };
  }
  var _a = split(line, ":", 1), name = _a[0], value = _a[1];
  return {
    name,
    value
  };
}
function breakDownLine(line) {
  var _a = extractName(line), name = _a.name, value = _a.value;
  var parms = name.split(";");
  if (!parms)
    throw new Error("empty property name");
  return {
    name: parms[0].toUpperCase(),
    parms: parms.slice(1),
    value
  };
}
function splitIntoLines(s, unfold) {
  if (unfold === void 0) {
    unfold = false;
  }
  s = s && s.trim();
  if (!s)
    throw new Error("Invalid empty string");
  if (!unfold) {
    return s.split(/\s/);
  }
  var lines = s.split("\n");
  var i = 0;
  while (i < lines.length) {
    var line = lines[i] = lines[i].replace(/\s+$/g, "");
    if (!line) {
      lines.splice(i, 1);
    } else if (i > 0 && line[0] === " ") {
      lines[i - 1] += line.slice(1);
      lines.splice(i, 1);
    } else {
      i += 1;
    }
  }
  return lines;
}
function validateDateParm(parms) {
  parms.forEach(function(parm) {
    if (!/(VALUE=DATE(-TIME)?)|(TZID=)/.test(parm)) {
      throw new Error("unsupported RDATE/EXDATE parm: " + parm);
    }
  });
}
function parseRDate(rdateval, parms) {
  validateDateParm(parms);
  return rdateval.split(",").map(function(datestr) {
    return untilStringToDate(datestr);
  });
}
function createGetterSetter(fieldName) {
  var _this = this;
  return function(field) {
    if (field !== void 0) {
      _this["_".concat(fieldName)] = field;
    }
    if (_this["_".concat(fieldName)] !== void 0) {
      return _this["_".concat(fieldName)];
    }
    for (var i = 0; i < _this._rrule.length; i++) {
      var field_1 = _this._rrule[i].origOptions[fieldName];
      if (field_1) {
        return field_1;
      }
    }
  };
}
var RRuleSet = (
  /** @class */
  (function(_super) {
    __extends(RRuleSet2, _super);
    function RRuleSet2(noCache) {
      if (noCache === void 0) {
        noCache = false;
      }
      var _this = _super.call(this, {}, noCache) || this;
      _this.dtstart = createGetterSetter.apply(_this, ["dtstart"]);
      _this.tzid = createGetterSetter.apply(_this, ["tzid"]);
      _this._rrule = [];
      _this._rdate = [];
      _this._exrule = [];
      _this._exdate = [];
      return _this;
    }
    RRuleSet2.prototype._iter = function(iterResult) {
      return iterSet(iterResult, this._rrule, this._exrule, this._rdate, this._exdate, this.tzid());
    };
    RRuleSet2.prototype.rrule = function(rrule) {
      _addRule(rrule, this._rrule);
    };
    RRuleSet2.prototype.exrule = function(rrule) {
      _addRule(rrule, this._exrule);
    };
    RRuleSet2.prototype.rdate = function(date) {
      _addDate(date, this._rdate);
    };
    RRuleSet2.prototype.exdate = function(date) {
      _addDate(date, this._exdate);
    };
    RRuleSet2.prototype.rrules = function() {
      return this._rrule.map(function(e) {
        return rrulestr(e.toString());
      });
    };
    RRuleSet2.prototype.exrules = function() {
      return this._exrule.map(function(e) {
        return rrulestr(e.toString());
      });
    };
    RRuleSet2.prototype.rdates = function() {
      return this._rdate.map(function(e) {
        return new Date(e.getTime());
      });
    };
    RRuleSet2.prototype.exdates = function() {
      return this._exdate.map(function(e) {
        return new Date(e.getTime());
      });
    };
    RRuleSet2.prototype.valueOf = function() {
      var result = [];
      if (!this._rrule.length && this._dtstart) {
        result = result.concat(optionsToString({ dtstart: this._dtstart }));
      }
      this._rrule.forEach(function(rrule) {
        result = result.concat(rrule.toString().split("\n"));
      });
      this._exrule.forEach(function(exrule) {
        result = result.concat(exrule.toString().split("\n").map(function(line) {
          return line.replace(/^RRULE:/, "EXRULE:");
        }).filter(function(line) {
          return !/^DTSTART/.test(line);
        }));
      });
      if (this._rdate.length) {
        result.push(rdatesToString("RDATE", this._rdate, this.tzid()));
      }
      if (this._exdate.length) {
        result.push(rdatesToString("EXDATE", this._exdate, this.tzid()));
      }
      return result;
    };
    RRuleSet2.prototype.toString = function() {
      return this.valueOf().join("\n");
    };
    RRuleSet2.prototype.clone = function() {
      var rrs = new RRuleSet2(!!this._cache);
      this._rrule.forEach(function(rule) {
        return rrs.rrule(rule.clone());
      });
      this._exrule.forEach(function(rule) {
        return rrs.exrule(rule.clone());
      });
      this._rdate.forEach(function(date) {
        return rrs.rdate(new Date(date.getTime()));
      });
      this._exdate.forEach(function(date) {
        return rrs.exdate(new Date(date.getTime()));
      });
      return rrs;
    };
    return RRuleSet2;
  })(RRule)
);
function _addRule(rrule, collection) {
  if (!(rrule instanceof RRule)) {
    throw new TypeError(String(rrule) + " is not RRule instance");
  }
  if (!includes(collection.map(String), String(rrule))) {
    collection.push(rrule);
  }
}
function _addDate(date, collection) {
  if (!(date instanceof Date)) {
    throw new TypeError(String(date) + " is not Date instance");
  }
  if (!includes(collection.map(Number), Number(date))) {
    collection.push(date);
    sort(collection);
  }
}
function rdatesToString(param, rdates, tzid) {
  var isUTC = !tzid || tzid.toUpperCase() === "UTC";
  var header = isUTC ? "".concat(param, ":") : "".concat(param, ";TZID=").concat(tzid, ":");
  var dateString = rdates.map(function(rdate) {
    return timeToUntilString(rdate.valueOf(), isUTC);
  }).join(",");
  return "".concat(header).concat(dateString);
}

export { RRule as R };
//# sourceMappingURL=rruleset-C2NkTWEe.mjs.map
