"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStartCommand = handleStartCommand;
const index_1 = require("../index");
async function handleStartCommand(chatId, user) {
    try {
        await (0, index_1.sendTelegramMessage)(chatId, `👋 Привет, **${user}**! Ты в списке разрешённых!`);
    }
    catch (error) {
        console.error('❌ Ошибка в команде /start:', error.message);
    }
}
