import axios from 'axios'

let TELEGRAM_TOKEN: string | undefined

if (process.env.VERCEL) {
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
} else {
  const dotenv = require('dotenv')
  dotenv.config()
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
}

const INSTRUCTION_TEXT = `📝 Инструкция по вводу данных:

1. Название сервиса  
2. Ссылка  
3. Логин или почта  
4. Пароль  
5. Никнейм (можно опустить)

⚠️ Каждое значение — на новой строке.
Пример:

Cloudflare  
https://cloudflare.com/login  
user@gmail.com  
password123  
nickname_optional
`

export async function sendTelegramMessage(chatId: number, text: string) {
  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      },
    )
    return res.data.result?.message_id
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error.message)
  }
}

export async function sendInstructionTelegramMessage(chatId: number) {
  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: INSTRUCTION_TEXT,
        // parse_mode: 'Markdown',
        disable_web_page_preview: true,
      },
    )
    return res.data.result?.message_id
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error.message)
  }
}
