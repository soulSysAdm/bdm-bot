import axios from 'axios'
import {
  sendTelegramMessage,
} from '../index.js'

let TELEGRAM_TOKEN: string | undefined

if (process.env.VERCEL) {
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
} else {
  const dotenv = require('dotenv')
  dotenv.config()
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
}

const sendErrorMassage = async (chatId:number, message:string) => {
    const messageTelegram = `Ошибка ${message}"`
    await sendTelegramMessage(chatId, messageTelegram)
}

const deleteMessage = async (chatId: number, messageId: number) => {
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage`,
    {
      chat_id: chatId,
      message_id: messageId,
    }
  )
}


function parseMessage(message: string) {
  const lines = message.trim().split('\n').map(l => l.trim()).filter(Boolean)

  const [name, link, login, password, nickname] = lines

  return {
    name: name || null,
    link: link || null,
    login: login || null,
    password: password || null,
    nickname: nickname || null
  }
}

export async function handleCallbackQuery(callbackQuery, message:string, chatId:number) {
  try {
    const data = callbackQuery.data
    const [action, id] = data.split('_')
    const user = callbackQuery.from.username || callbackQuery.from.first_name
    const messageId = callbackQuery.message.message_id

    const dataMessage = parseMessage(message)
    console.log('dataMessage ', dataMessage)
    await deleteMessage(chatId, messageId)
    await sendTelegramMessage(  chatId, `
    user: ${user}, 
    name: ${dataMessage.name}, 
    link: ${dataMessage.link}, 
    password: ${dataMessage.password}, 
    nickname: ${dataMessage.nickname},`)
    // if (action === PAY_PART_KEY) {
    //   await handlePayClick(callbackQuery, id, messageId, user)
    // } else if (action === CANCEL_PAY_PART_KEY) {
    //   await handleCancelPayClick(callbackQuery, id, messageId, user)
    // } else if (action === PAID_PART_KEY) {
    //   await handlePaidClick(callbackQuery, id, messageId, user)
    // } else if (action === CANCEL_PAID_PART_KEY) {
    //   await handleCancelPaidClick(callbackQuery, id, messageId, user)
    // }
  } catch (error) {
    console.error('❌ Ошибка обработки callbackQuery:', error.message)
    await sendErrorMassage(chatId, error.message)
  }
}
