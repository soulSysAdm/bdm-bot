"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthYearLabel = exports.getDataByMonth = exports.isInvalidOrTodayOrPast = exports.getDateByUnknownFormat = exports.getDaysFromToday = exports.delaySeconds = exports.getTimeInUkraine = exports.getDisplayDate = exports.getDisplayDateWithDay = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const validateData_1 = require("./validateData");
const getDisplayDateWithDay = (date) => {
    if (!date)
        return '';
    return (0, moment_timezone_1.default)(date).tz('Europe/Kyiv').format('DD-MM-YYYY, dddd');
};
exports.getDisplayDateWithDay = getDisplayDateWithDay;
const getDisplayDate = (date) => {
    if (!date)
        return '';
    return (0, moment_timezone_1.default)(date).tz('Europe/Kyiv').format('DD-MM-YYYY');
};
exports.getDisplayDate = getDisplayDate;
const getTimeInUkraine = () => {
    return (0, moment_timezone_1.default)().tz('Europe/Kyiv').format('DD.MM.YYYY, HH:mm:ss');
};
exports.getTimeInUkraine = getTimeInUkraine;
const delaySeconds = (second) => {
    return new Promise((resolve) => setTimeout(resolve, (0, validateData_1.getValidateNumber)(second) * 1000));
};
exports.delaySeconds = delaySeconds;
const getDaysFromToday = (dateStr) => {
    const target = (0, moment_timezone_1.default)(dateStr).tz('Europe/Kyiv').startOf('day');
    const today = (0, moment_timezone_1.default)().tz('Europe/Kyiv').startOf('day');
    return target.diff(today, 'days');
};
exports.getDaysFromToday = getDaysFromToday;
const getDateByUnknownFormat = (date) => {
    if (!date)
        return null;
    const formats = [
        'DD-MM-YYYY',
        'DD.MM.YYYY',
        'DD-MM-YY',
        'DD.MM.YY',
        'YYYY-MM-DD',
        'YYYY.MM.DD',
        'D-M-YYYY',
        'D.M.YYYY',
        'D-M-YY',
        'D.M.YY',
        'DD/MM/YYYY',
        'DD/MM/YY',
        'YYYY/MM/DD',
    ];
    const parsed = moment_timezone_1.default.tz(date, formats, true, 'Europe/Kyiv');
    return parsed.isValid() ? parsed.format() : null;
};
exports.getDateByUnknownFormat = getDateByUnknownFormat;
const isInvalidOrTodayOrPast = (dateStr) => {
    const dateFormat = (0, exports.getDateByUnknownFormat)(dateStr);
    if (!dateFormat)
        return true;
    const today = (0, moment_timezone_1.default)().tz('Europe/Kyiv').startOf('day');
    const target = (0, moment_timezone_1.default)(dateFormat).tz('Europe/Kyiv').startOf('day');
    return target.isSameOrBefore(today);
};
exports.isInvalidOrTodayOrPast = isInvalidOrTodayOrPast;
const getDataByMonth = (data, monthOffset = 0) => {
    const targetMonth = (0, moment_timezone_1.default)()
        .tz('Europe/Kyiv')
        .add(monthOffset, 'months')
        .month();
    const targetYear = (0, moment_timezone_1.default)()
        .tz('Europe/Kyiv')
        .add(monthOffset, 'months')
        .year();
    return data.filter((item) => {
        const itemDate = (0, moment_timezone_1.default)(item.date).tz('Europe/Kyiv');
        return (itemDate.isValid() &&
            itemDate.month() === targetMonth &&
            itemDate.year() === targetYear);
    });
};
exports.getDataByMonth = getDataByMonth;
const getMonthYearLabel = (monthOffset = 0) => {
    return (0, moment_timezone_1.default)().add(monthOffset, 'months').format('MMMM MM-YYYY');
};
exports.getMonthYearLabel = getMonthYearLabel;
