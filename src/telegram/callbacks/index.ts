import axios from 'axios'
import { sendTelegramMessage } from '../index.js'
import { DataMessage } from '../../types'
import { writeSheet } from '../../google'

let TELEGRAM_TOKEN: string | undefined

if (process.env.VERCEL) {
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
} else {
  const dotenv = require('dotenv')
  dotenv.config()
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
}

const sendErrorMassage = async (chatId: number, message: string) => {
  const messageTelegram = `Ошибка ${message}"`
  await sendTelegramMessage(chatId, messageTelegram)
}

const deleteMessage = async (chatId: number, messageId: number) => {
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage`,
    {
      chat_id: chatId,
      message_id: messageId,
    },
  )
}

function parseMessage(message: string, userName: string): DataMessage {
  const lines = message
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const [name, link, login, password, nickname] = lines

  if (!name || !link || !login || !password) return null

  return {
    name: name,
    link: link,
    login: login,
    password: password,
    nickname: nickname || userName || null,
  }
}

export async function handleCallbackQuery(
  userName: string,
  text: string,
  chatId: number,
  messageId: number,
) {
  try {
    // console.log('callbackQuery ', callbackQuery)
    // const user = callbackQuery.from.username || callbackQuery.from.first_name
    // const messageId = callbackQuery.message.message_id

    const dataMessage = parseMessage(text, userName)

    console.log('dataMessage ', dataMessage)
    await deleteMessage(chatId, messageId)
    if (!dataMessage) {
      await sendTelegramMessage(
        chatId,
        `❌ Сообщение отправлено не по иструкции. Отсутвует одно из обязательных полей`,
      )
    } else {
      await writeSheet(dataMessage)
      await sendTelegramMessage(
        chatId,
        `
        ✅ Доступы успешно записаны. 
        user: ${userName}, 
        name: ${dataMessage.name}, 
        link: ${dataMessage.link}, 
        password: ${dataMessage.password}, 
        nickname: ${dataMessage.nickname},`,
      )
    }
  } catch (error) {
    console.error('❌ Ошибка обработки callbackQuery:', error.message)
    await sendErrorMassage(chatId, error.message)
  }
}
