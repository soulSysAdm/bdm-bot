"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = googleHandler;
const dateFormat_1 = require("../assets/dateFormat");
const google_1 = require("../google");
async function googleHandler(req, res) {
    console.log('📥 Запрос от Google Apps Script:', (0, dateFormat_1.getTimeInUkraine)());
    try {
        await (0, google_1.repeatSheet)();
        res.status(200).json({ message: '✅ Google trigger received!' });
    }
    catch (err) {
        console.error('❌ Ошибка обработки Google запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}
