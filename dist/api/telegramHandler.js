"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = telegramHandler;
const dateFormat_1 = require("../assets/dateFormat");
const telegram_1 = require("../telegram");
const telegram_2 = require("../telegram");
// : Promise<VercelResponse>
async function telegramHandler(req, res) {
    console.log('🔥 Webhook вызван в', (0, dateFormat_1.getTimeInUkraine)());
    try {
        const body = req.body;
        //Защита от группы
        if (!(0, telegram_2.isPrivateChat)(body)) {
            //Выход с группы
            await (0, telegram_2.leaveChatIfNotPrivate)(body);
            res.status(200).send('⛔️ Бот работает только в личных чатах');
            return;
        }
        const userId = body?.message?.from?.id || body?.callback_query?.from?.id;
        const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id;
        const userName = body?.message?.from?.username ||
            body?.message?.from?.first_name ||
            body?.callback_query?.from?.username ||
            body?.callback_query?.from?.first_name;
        const text = typeof body.message?.text === 'string' ? body.message.text : '';
        const messageId = body?.message?.message_id;
        if (!(await (0, telegram_1.isAuthorizedUser)(userId, chatId, userName))) {
            res.status(200).send('🚫 Доступ запрещён');
            return;
        }
        if (text === '/start') {
            await (0, telegram_1.handleStartCommand)(chatId, userName);
            await (0, telegram_1.sendInstructionTelegramMessage)(chatId);
        }
        else if (text === '/help') {
            await (0, telegram_1.sendInstructionTelegramMessage)(chatId);
        }
        else {
            await (0, telegram_2.handleCallbackQuery)(userName, text, chatId, messageId);
        }
        res.status(200).send('ok');
    }
    catch (error) {
        console.error('❌ Ошибка основного webhook:', error.message);
        res.status(500).send('Ошибка сервера');
    }
}
