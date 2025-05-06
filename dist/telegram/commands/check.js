"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCheckCommand = handleCheckCommand;
const dateFormat_1 = require("../../assets/dateFormat");
const google_1 = require("../../google");
const globals_1 = require("../../globals");
const index_1 = require("../index");
async function handleCheckCommand(userName) {
    console.log('📥 Запрос от Google Apps Script:', (0, dateFormat_1.getTimeInUkraine)());
    try {
        for (const chatId of globals_1.allowedUsers) {
            await (0, index_1.sendTelegramMessage)(chatId, `**${userName}** Использовал команду "/check" для запроса данных с таблицы`);
        }
        await (0, google_1.repeatSheet)();
    }
    catch (err) {
        console.error('❌ Ошибка обработки Google запроса:', err);
    }
}
