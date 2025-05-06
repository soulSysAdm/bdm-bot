"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTelegramMessage = sendTelegramMessage;
const axios_1 = __importDefault(require("axios"));
let TELEGRAM_TOKEN;
if (process.env.VERCEL) {
    TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
}
else {
    const dotenv = require('dotenv');
    dotenv.config();
    TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
}
async function sendTelegramMessage(chatId, text) {
    try {
        const res = await axios_1.default.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text,
        });
        return res.data.result?.message_id;
    }
    catch (error) {
        console.error('❌ Ошибка отправки сообщения:', error.message);
    }
}
