"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSheet = writeSheet;
const index_1 = require("../index");
const googleapis_1 = require("googleapis");
let GOOGLE_CREDENTIALS;
let GOOGLE_SHEET_ID;
if (process.env.VERCEL) {
    GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
    GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
}
else {
    const dotenv = require('dotenv');
    dotenv.config();
    GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
    GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
}
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: GOOGLE_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
async function writeSheet(dataMessage) {
    try {
        const sheetData = await (0, index_1.readSheet)();
        const requests = (0, index_1.getSheetDataByWrite)(sheetData, dataMessage);
        if (!requests) {
            // await sendTelegramMessage(chatId, 'Проблема чтения таблицы. Ничего не записано')
            throw new Error('Проблема чтения таблицы. Ничего не записано');
        }
        else {
            const client = (await auth.getClient());
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth: client });
            return await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: GOOGLE_SHEET_ID,
                requestBody: {
                    valueInputOption: 'USER_ENTERED',
                    data: requests,
                },
            });
        }
    }
    catch (error) {
        console.error('❌ Ошибка writeSheet:', error.message);
        throw new Error(error.message);
    }
}
