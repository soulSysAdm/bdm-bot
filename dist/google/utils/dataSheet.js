"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheetDataByWrite = void 0;
const validateData_1 = require("../../assets/validateData");
const constants_1 = require("../../constants");
const globals_1 = require("../../globals");
const getNextRow = (sheetData) => {
    const lastRow = sheetData?.[sheetData.length - 1]?.id;
    if (typeof lastRow !== 'number')
        return null;
    return lastRow + 1;
};
const getSheetDataByWrite = (sheetData, dataMessage) => {
    const nextRow = getNextRow(sheetData);
    if (nextRow === null)
        return null;
    return [
        {
            [constants_1.RANGE_KEY]: globals_1.colsKeys[0] + nextRow,
            [constants_1.VALUES_KEY]: [[(0, validateData_1.getTrimValue)(dataMessage.name)]],
        },
        {
            [constants_1.RANGE_KEY]: globals_1.colsKeys[1] + nextRow,
            [constants_1.VALUES_KEY]: [[(0, validateData_1.getTrimValue)(dataMessage.link)]],
        },
        {
            [constants_1.RANGE_KEY]: globals_1.colsKeys[2] + nextRow,
            [constants_1.VALUES_KEY]: [[(0, validateData_1.getTrimValue)(dataMessage.login)]],
        },
        {
            [constants_1.RANGE_KEY]: globals_1.colsKeys[3] + nextRow,
            [constants_1.VALUES_KEY]: [[(0, validateData_1.getTrimValue)(dataMessage.password)]],
        },
        {
            [constants_1.RANGE_KEY]: globals_1.colsKeys[4] + nextRow,
            [constants_1.VALUES_KEY]: [[(0, validateData_1.getTrimValue)(dataMessage.nickname)]],
        },
    ];
};
exports.getSheetDataByWrite = getSheetDataByWrite;
