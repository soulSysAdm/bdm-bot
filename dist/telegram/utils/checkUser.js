"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizedUser = isAuthorizedUser;
const index_1 = require("../index");
let ALLOWED_USERS;
if (process.env.VERCEL) {
    ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]');
}
else {
    const dotenv = require('dotenv');
    dotenv.config();
    ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]');
}
async function isAuthorizedUser(userId, chatId, userName) {
    const findIndexUser = ALLOWED_USERS.findIndex((user) => user.id === userId);
    const authorized = findIndexUser !== -1;
    if (!authorized && chatId) {
        await (0, index_1.sendTelegramMessage)(chatId, `🚫 ${userName || 'Пользователь'} не имеет доступа к этому боту.`);
        console.log('🚫 Неавторизованный пользователь:', userId, userName);
    }
    return authorized;
}
