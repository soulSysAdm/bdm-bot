"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colsKeys = exports.validKeys = exports.range = exports.allowedUsers = void 0;
const constants_1 = require("../constants");
exports.allowedUsers = [6602497931, 5937309404, 5622459508];
exports.range = 'Доступ под замену пароля';
exports.validKeys = [constants_1.VALID_YES_KEY, constants_1.VALID_YES_DEZ_KEY, constants_1.VALID_OTHER_KEY];
const columnToLetter = (col) => {
    let letter = '';
    while (col > 0) {
        let temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
    }
    return letter;
};
const getColsSheetData = () => {
    const result = [];
    for (let i = 0; i < 10; i++) {
        result.push(columnToLetter(i + 1));
    }
    return result;
};
exports.colsKeys = getColsSheetData();
