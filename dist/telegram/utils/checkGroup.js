"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrivateChat = isPrivateChat;
exports.leaveChatIfNotPrivate = leaveChatIfNotPrivate;
let TELEGRAM_TOKEN;
if (process.env.VERCEL) {
    TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
}
else {
    const dotenv = require('dotenv');
    dotenv.config();
    TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
}
function isPrivateChat(body) {
    const type = body?.message?.chat?.type || body?.callback_query?.message?.chat?.type;
    return type === 'private';
}
async function leaveChatIfNotPrivate(body) {
    const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id;
    const type = body?.message?.chat?.type || body?.callback_query?.message?.chat?.type;
    if (chatId && type && type !== 'private') {
        console.log(`🚫 Бот добавлен в ${type}, выходим из ${chatId}`);
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/leaveChat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId }),
        });
    }
}
