"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeatSheet = repeatSheet;
const index_1 = require("../index");
const telegram_1 = require("../../telegram");
const globals_1 = require("../../globals");
async function repeatSheet() {
    try {
        const sheetData = await (0, index_1.readSheet)();
        const { validMessages, unValidMessages } = (0, index_1.getTelegramMessages)(sheetData);
        for (const chatId of globals_1.allowedUsers) {
            for (const message of unValidMessages) {
                await (0, telegram_1.sendTelegramMessage)(chatId, message);
            }
            for (const message of validMessages) {
                await (0, telegram_1.sendTelegramMessage)(chatId, message);
            }
        }
    }
    catch (error) {
        console.error('❌ Ошибка repeatSheet:', error.message);
    }
}
