"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSheet = void 0;
const googleapis_1 = require("googleapis");
const constants_1 = require("../../constants");
const validateData_js_1 = require("../../assets/validateData.js");
const globals_1 = require("../../globals");
let GOOGLE_CREDENTIALS;
if (process.env.VERCEL) {
    GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
}
else {
    // ✅ без top-level await, классика:
    const dotenv = require('dotenv');
    dotenv.config();
    GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
}
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: GOOGLE_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
/**
 * Преобразует данные Google Sheets в массив объектов
 */
const getSheetDataArray = (rows) => {
    const rowsArray = (0, validateData_js_1.getValidateArray)(rows);
    if (rowsArray.length < 2) {
        console.log('❌ Нет данных "rows"');
        return [];
    }
    const headers = rowsArray[0];
    return rowsArray.map((row, rowIndex) => {
        const obj = {};
        console.log('1 ', globals_1.colsKeys);
        globals_1.colsKeys.forEach((key, i) => {
            obj[key] = row[i] ?? null;
        });
        console.log('2 ', globals_1.colsKeys);
        obj[constants_1.ID_KEY] = rowIndex + 1;
        obj._sheetMeta = {
            row: rowIndex + 1,
            cols: globals_1.colsKeys.reduce((acc, key) => {
                acc[key] = key;
                return acc;
            }, {}),
        };
        return obj;
    });
};
/**
 * Чтение данных из Google Sheets и возврат их в виде массива объектов
 */
const readSheet = async () => {
    const client = (await auth.getClient());
    const sheets = googleapis_1.google.sheets({ version: 'v4', auth: client });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: globals_1.spreadsheetId,
        range: globals_1.range,
    });
    const rows = res.data.values;
    return getSheetDataArray(rows);
};
exports.readSheet = readSheet;
