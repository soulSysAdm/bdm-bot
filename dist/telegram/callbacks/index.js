"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCallbackQuery = handleCallbackQuery;
const axios_1 = __importDefault(require("axios"));
const index_js_1 = require("../index.js");
const google_1 = require("../../google");
const dateFormat_1 = require("../../assets/dateFormat");
const constants_1 = require("../../constants");
let TELEGRAM_TOKEN;
let ADMIN_USERS;
if (process.env.VERCEL) {
    TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
    ADMIN_USERS = JSON.parse(process.env.ADMIN_USERS || '[]');
}
else {
    const dotenv = require('dotenv');
    dotenv.config();
    TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
    ADMIN_USERS = JSON.parse(process.env.ADMIN_USERS || '[]');
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
const getNameLinkLoginPasswordOther = (array) => {
    const isLogin = array.length > 3;
    if (isLogin) {
        const [name, link, login, password, ...otherStr] = array;
        const other = otherStr.join(' ');
        return {
            name,
            link,
            login,
            password,
            other,
        };
    }
    else {
        const [name, link, password, ...otherStr] = array;
        const other = otherStr.join(' ');
        return {
            name,
            link,
            login: '',
            password,
            other,
        };
    }
};
function parseMessage(message, userName) {
    const lines = message
        .trim()
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
    const result = {
        name: '',
        link: '',
        email: '',
        login: '',
        password: '',
        nickname: userName,
        other: '',
        time: (0, dateFormat_1.getTimeInUkraine)(),
    };
    const findGmailIndex = lines.findIndex((value) => value.toLowerCase().includes(constants_1.CHECK_BY_GMAIL));
    if (findGmailIndex !== -1) {
        result.email = lines[findGmailIndex];
        lines.splice(findGmailIndex, 1);
        const additionalData = getNameLinkLoginPasswordOther(lines);
        for (const key in additionalData) {
            result[key] = additionalData[key];
        }
    }
    else {
        result.email = lines[2];
        lines.splice(2, 1);
        const additionalData = getNameLinkLoginPasswordOther(lines);
        for (const key in additionalData) {
            result[key] = additionalData[key];
        }
    }
    if (!result.name || !result.link || !result.email || !result.password)
        return null;
    return {
        ...result,
    };
}
const sendSuccessMessageAdmin = async (nickname, currentChatId) => {
    const adminChatIds = ADMIN_USERS.map((item) => item.id);
    for (const chatId of adminChatIds) {
        console.log('Admin chatId, ', chatId);
        console.log('currentChatId, ', currentChatId);
        if (chatId !== currentChatId) {
            await (0, index_js_1.sendTelegramMessage)(chatId, `▶️ Отправил новые доступы в таблицу. Никнейм: ${nickname}`);
        }
    }
};
async function handleCallbackQuery(userName, text, chatId, messageId) {
    try {
        const dataMessage = parseMessage(text, userName);
        await deleteMessage(chatId, messageId);
        if (!dataMessage) {
            await (0, index_js_1.sendTelegramMessage)(chatId, `❌ Сообщение отправлено не по иструкции. Отсутвует одно из обязательных полей`);
            await (0, index_js_1.sendInstructionTelegramMessage)(chatId);
        }
        else {
            await (0, google_1.writeSheet)(dataMessage);
            await (0, index_js_1.sendTelegramMessage)(chatId, `✅ Доступы успешно записаны.`);
            await sendSuccessMessageAdmin(dataMessage.nickname, chatId);
        }
    }
    catch (error) {
        console.error('❌ Ошибка обработки callbackQuery:', error.message);
        await sendErrorMassage(chatId, error.message);
    }
}
