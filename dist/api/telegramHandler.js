"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = telegramHandler;
const dateFormat_1 = require("../assets/dateFormat");
const checkUser_1 = require("../telegram/utils/checkUser");
const telegram_1 = require("../telegram");
// : Promise<VercelResponse>
async function telegramHandler(req, res) {
    console.log('🔥 Webhook вызван в', (0, dateFormat_1.getTimeInUkraine)());
    try {
        const body = req.body;
        const userId = body?.message?.from?.id || body?.callback_query?.from?.id;
        const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id;
        const userName = body?.message?.from?.username ||
            body?.message?.from?.first_name ||
            body?.callback_query?.from?.username ||
            body?.callback_query?.from?.first_name;
        if (!(await (0, checkUser_1.isAuthorizedUser)(userId, chatId, userName))) {
            res.status(200).send('🚫 Доступ запрещён');
            return;
        }
        if (body.message?.text === '/start') {
            await (0, telegram_1.handleStartCommand)(chatId, userName);
        }
        if (body.message?.text === '/check') {
            await (0, telegram_1.handleCheckCommand)(userName);
        }
        console.log(body.message?.text);
        res.status(200).send('ok');
    }
    catch (error) {
        console.error('❌ Ошибка основного webhook:', error.message);
        res.status(500).send('Ошибка сервера');
    }
}
