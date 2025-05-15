import axios from 'axios'
import { sendTelegramMessage } from '../index.js'
import { DataMessage } from '../../types'
import { writeSheet } from '../../google'
import { getTimeInUkraine } from '../../assets/dateFormat'
import { CHECK_BY_GMAIL } from '../../constants'

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

interface AdditionalData {
  name: string
  link: string
  login: string
  password: string
  other: string
}

const getNameLinkLoginPasswordOther = (array: string[]): AdditionalData => {
  const isLogin = array.length > 3
  if (isLogin) {
    const [name, link, login, password, ...otherStr] = array
    const other = otherStr.join(' ')
    return {
      name,
      link,
      login,
      password,
      other,
    }
  } else {
    const [name, link, password, ...otherStr] = array
    const other = otherStr.join(' ')
    return {
      name,
      link,
      login: '',
      password,
      other,
    }
  }
}

function parseMessage(message: string, userName: string): DataMessage {
  const lines = message
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const result = {
    name: '',
    link: '',
    email: '',
    login: '',
    password: '',
    nickname: userName,
    other: '',
    time: getTimeInUkraine(),
  }
  const findGmailIndex = lines.findIndex(
    (value) => value.toLowerCase() === CHECK_BY_GMAIL,
  )

  if (findGmailIndex !== -1) {
    result.email = lines[findGmailIndex]
    lines.splice(findGmailIndex, 1)
    const additionalData = getNameLinkLoginPasswordOther(lines)
    for (const key in additionalData) {
      result[key] = additionalData[key]
    }
  } else {
    result.email = lines[2]
    lines.splice(2, 1)
    const additionalData = getNameLinkLoginPasswordOther(lines)
    for (const key in additionalData) {
      result[key] = additionalData[key]
    }
  }

  if (!result.name || !result.link || !result.email || !result.password)
    return null

  return {
    ...result,
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
    
        name: ${dataMessage.name}, 
        link: ${dataMessage.link}, 
        email: ${dataMessage.email}, 
        login: ${dataMessage.login}, 
        password: ${dataMessage.password}, 
        nickname: ${dataMessage.nickname},
        time: ${dataMessage.time},
        other: ${dataMessage.other},
        user: ${userName}, 
        
        `,
      )
    }
  } catch (error) {
    console.error('❌ Ошибка обработки callbackQuery:', error.message)
    await sendErrorMassage(chatId, error.message)
  }
}
