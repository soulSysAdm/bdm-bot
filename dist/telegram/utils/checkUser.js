"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizedUser = isAuthorizedUser;
const index_1 = require("../index");
const globals_1 = require("../../globals");
async function isAuthorizedUser(userId, chatId, userName) {
    const authorized = userId && globals_1.allowedUsers.includes(userId);
    if (!authorized && chatId) {
        await (0, index_1.sendTelegramMessage)(chatId, `🚫 ${userName || 'Пользователь'} не имеет доступа к этому боту.`);
        console.log('🚫 Неавторизованный пользователь:', userId, userName);
    }
    return authorized;
}
