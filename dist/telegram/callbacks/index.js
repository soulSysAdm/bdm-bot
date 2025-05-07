"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCallbackQuery = handleCallbackQuery;
const axios_1 = __importDefault(require("axios"));
const index_js_1 = require("../index.js");
let TELEGRAM_TOKEN;
if (process.env.VERCEL) {
    TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
}
else {
    const dotenv = require('dotenv');
    dotenv.config();
    TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
}
const sendErrorMassage = async (chatId, message) => {
    const messageTelegram = `Ошибка ${message}"`;
    await (0, index_js_1.sendTelegramMessage)(chatId, messageTelegram);
};
const deleteMessage = async (chatId, messageId) => {
    await axios_1.default.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage`, {
        chat_id: chatId,
        message_id: messageId,
    });
};
function parseMessage(message, userName) {
    const lines = message
        .trim()
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
    const [name, link, login, password, nickname] = lines;
    if (!name || !link || !login || !password)
        return null;
    return {
        name: name,
        link: link,
        login: login,
        password: password,
        nickname: nickname || userName || null,
    };
}
async function handleCallbackQuery(userName, text, chatId, messageId) {
    try {
        // console.log('callbackQuery ', callbackQuery)
        // const user = callbackQuery.from.username || callbackQuery.from.first_name
        // const messageId = callbackQuery.message.message_id
        const dataMessage = parseMessage(text, userName);
        console.log('dataMessage ', dataMessage);
        await deleteMessage(chatId, messageId);
        if (!dataMessage) {
            await (0, index_js_1.sendTelegramMessage)(chatId, `Сообщение отправлено не по иструкции. Отсутвует Название сервиса или Ссылка или Логин или почта или Пароль`);
        }
        else {
            await (0, index_js_1.sendTelegramMessage)(chatId, `
        Доступы успешно записаны. 
        user: ${userName}, 
        name: ${dataMessage.name}, 
        link: ${dataMessage.link}, 
        password: ${dataMessage.password}, 
        nickname: ${dataMessage.nickname},`);
        }
        // if (action === PAY_PART_KEY) {
        //   await handlePayClick(callbackQuery, id, messageId, user)
        // } else if (action === CANCEL_PAY_PART_KEY) {
        //   await handleCancelPayClick(callbackQuery, id, messageId, user)
        // } else if (action === PAID_PART_KEY) {
        //   await handlePaidClick(callbackQuery, id, messageId, user)
        // } else if (action === CANCEL_PAID_PART_KEY) {
        //   await handleCancelPaidClick(callbackQuery, id, messageId, user)
        // }
    }
    catch (error) {
        console.error('❌ Ошибка обработки callbackQuery:', error.message);
        await sendErrorMassage(chatId, error.message);
    }
}
