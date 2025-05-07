"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrimValue = exports.getValidateObject = exports.getValidateArray = exports.getValidateBoolean = exports.getLowerCase = exports.getValidateString = exports.getValidateNumber = void 0;
const getValidateNumber = (value) => {
    if (typeof value !== 'number' && typeof value !== 'string')
        return 0;
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    const formattedValue = parseFloat(value);
    return Number.isFinite(formattedValue) ? formattedValue : 0;
};
exports.getValidateNumber = getValidateNumber;
const getValidateString = (value) => {
    if (typeof value !== 'string')
        return '';
    return value;
};
exports.getValidateString = getValidateString;
const getLowerCase = (value) => {
    return value.trim().toLowerCase();
};
exports.getLowerCase = getLowerCase;
const getValidateBoolean = (value) => {
    if (typeof value !== 'boolean')
        return false;
    return value;
};
exports.getValidateBoolean = getValidateBoolean;
const getValidateArray = (data) => {
    if (!Array.isArray(data))
        return [];
    return data;
};
exports.getValidateArray = getValidateArray;
const getValidateObject = (data) => {
    if (!data ||
        typeof data !== 'object' ||
        Array.isArray(data) ||
        Object.prototype.toString.call(data) !== '[object Object]') {
        return {};
    }
    return data;
};
exports.getValidateObject = getValidateObject;
const getTrimValue = (value) => {
    return (0, exports.getValidateString)(value).trim();
};
exports.getTrimValue = getTrimValue;
