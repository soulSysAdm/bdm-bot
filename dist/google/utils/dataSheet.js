"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTelegramMessages = void 0;
const validateData_1 = require("../../assets/validateData");
const constants_1 = require("../../constants");
const dateFormat_1 = require("../../assets/dateFormat");
const globals_1 = require("../../globals");
/**
 * Тип строки, которая содержит оба ключа
 */
/**
 * Проверка, что объект имеет нужные поля
 */
function isFilteredRow(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        constants_1.PHONE_NUMBER_KEY in obj &&
        constants_1.BEST_BEFORE_DATE_KEY in obj &&
        typeof obj[constants_1.PHONE_NUMBER_KEY] === 'string' &&
        typeof obj[constants_1.BEST_BEFORE_DATE_KEY] === 'string');
}
/**
 * Фильтрует массив, оставляя только валидные строки
 */
const getSheetByNumber = (data) => {
    return data
        .filter((item) => (0, validateData_1.getValidateNumber)(item[constants_1.PHONE_NUMBER_KEY]))
        .map((item) => ({
        [constants_1.PHONE_NUMBER_KEY]: (0, validateData_1.getValidateNumber)(item[constants_1.PHONE_NUMBER_KEY]) + '',
        [constants_1.BEST_BEFORE_DATE_KEY]: (0, validateData_1.getValidateString)(item[constants_1.BEST_BEFORE_DATE_KEY]).trim(),
        [constants_1.NUMBER_VALID_KEY]: (0, validateData_1.getValidateString)(item[constants_1.NUMBER_VALID_KEY]).trim(),
    }));
};
const isEmptyItemValid = (value) => {
    const lowerValue = (0, validateData_1.getLowerCase)(value);
    for (const key of globals_1.validKeys) {
        if (lowerValue === (0, validateData_1.getLowerCase)(key))
            return false;
    }
    return true;
};
const isEmptyItemDate = (value) => {
    const lowerValue = (0, validateData_1.getLowerCase)(value);
    return lowerValue.length < 10;
};
const getSheetByEmptyBeforeDateOrNumberValid = (data) => {
    return data.filter((item) => isEmptyItemDate(item[constants_1.BEST_BEFORE_DATE_KEY]) ||
        isEmptyItemValid(item[constants_1.NUMBER_VALID_KEY]) ||
        (0, dateFormat_1.isInvalidOrTodayOrPast)(item[constants_1.BEST_BEFORE_DATE_KEY]));
};
const getSheetByAllDataWithDate = (data) => {
    return data
        .filter((item) => !isEmptyItemDate(item[constants_1.BEST_BEFORE_DATE_KEY]) &&
        !isEmptyItemValid(item[constants_1.NUMBER_VALID_KEY]) &&
        !(0, dateFormat_1.isInvalidOrTodayOrPast)(item[constants_1.BEST_BEFORE_DATE_KEY]))
        .map((item) => {
        return {
            ...item,
            [constants_1.DATE_KEY]: (0, dateFormat_1.getDateByUnknownFormat)(item[constants_1.BEST_BEFORE_DATE_KEY]),
        };
    });
};
const getSheetByAllData = (data) => {
    return data.filter((item) => !isEmptyItemDate(item[constants_1.BEST_BEFORE_DATE_KEY]) &&
        !isEmptyItemValid(item[constants_1.NUMBER_VALID_KEY]));
};
const getSheetByNextThreeMonth = (data) => {
    const currentMonth = {
        title: `⛰️ ${(0, dateFormat_1.getMonthYearLabel)(0)} (Текущий месяц)\n\n`,
        data: (0, dateFormat_1.getDataByMonth)(data, 0),
    };
    const nextMonth = {
        title: `🚣️ ${(0, dateFormat_1.getMonthYearLabel)(1)} (Через 1 месяц)\n\n`,
        data: (0, dateFormat_1.getDataByMonth)(data, 1),
    };
    const inTwoMonths = {
        title: `🚵🏻‍♀️ ${(0, dateFormat_1.getMonthYearLabel)(2)} (Через 2 месяца)\n\n`,
        data: (0, dateFormat_1.getDataByMonth)(data, 2),
    };
    const inThreeMonths = {
        title: `🏄🏻‍ ${(0, dateFormat_1.getMonthYearLabel)(3)} (Через 3 месяца)\n\n`,
        data: (0, dateFormat_1.getDataByMonth)(data, 3),
    };
    return [currentMonth, nextMonth, inTwoMonths, inThreeMonths];
};
const getMessageByType = (data) => {
    let message = '';
    globals_1.validKeys.forEach((key) => {
        const filteredData = data.filter((item) => (0, validateData_1.getLowerCase)(item[constants_1.NUMBER_VALID_KEY]) === (0, validateData_1.getLowerCase)(key));
        if (filteredData.length) {
            message += `🦕 "${key}" тип:\n\n`;
            filteredData.forEach((dataNumber) => {
                message += dataNumber[constants_1.PHONE_NUMBER_KEY] + '\n';
            });
        }
    });
    return message;
};
const getValidateMessages = (data) => {
    const result = [];
    data.forEach((item) => {
        let message = '';
        message += item.title;
        if (!item.data.length) {
            message += constants_1.NO_NUMBERS_BY_MONTH;
        }
        else {
            message += getMessageByType(item.data);
        }
        result.push(message);
    });
    return result;
};
const getUnValidateMessages = (data) => {
    const result = [];
    let message = `⚠️ Проблемные номера: \n\n`;
    if (data.length) {
        data.forEach((item) => {
            message += `${constants_1.PHONE_NUMBER_KEY}: ${item[constants_1.PHONE_NUMBER_KEY]} | ${constants_1.BEST_BEFORE_DATE_KEY}: ${item[constants_1.BEST_BEFORE_DATE_KEY] || '-'} |${constants_1.NUMBER_VALID_KEY}: ${item[constants_1.NUMBER_VALID_KEY] || '-'} \n`;
        });
        result.push(message);
    }
    else {
        message += constants_1.NO_NUMBERS_BY_MONTH;
    }
    return result;
};
const getTelegramMessages = (dataSheet) => {
    const dataSheetNumber = getSheetByNumber(dataSheet);
    const dataByEmptyBeforeDateNumberValid = getSheetByEmptyBeforeDateOrNumberValid(dataSheetNumber);
    const dataByValid = getSheetByAllData(dataSheetNumber);
    const dataByValidDataWithDate = getSheetByAllDataWithDate(dataByValid);
    const dataByMonths = getSheetByNextThreeMonth(dataByValidDataWithDate);
    return {
        validMessages: getValidateMessages(dataByMonths),
        unValidMessages: getUnValidateMessages(dataByEmptyBeforeDateNumberValid),
    };
};
exports.getTelegramMessages = getTelegramMessages;
