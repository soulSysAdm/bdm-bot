import axios from 'axios'
import {
  sendInstructionTelegramMessage,
  sendTelegramMessage,
} from '../index.js'
import { AdminUser, DataMessage } from '../../types'
import { writeSheet } from '../../google'
import { getTimeInUkraine } from '../../assets/dateFormat'
import { CHECK_BY_GMAIL } from '../../constants'
import { aw } from '@upstash/redis/zmscore-BdNsMd17'

let TELEGRAM_TOKEN: string | undefined
let ADMIN_USERS: AdminUser[] | undefined

if (process.env.VERCEL) {
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
  ADMIN_USERS = JSON.parse(process.env.ADMIN_USERS || '[]')
} else {
  const dotenv = require('dotenv')
  dotenv.config()
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
  ADMIN_USERS = JSON.parse(process.env.ADMIN_USERS || '[]')
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
  const findGmailIndex = lines.findIndex((value) =>
    value.toLowerCase().includes(CHECK_BY_GMAIL),
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

const sendSuccessMessageAdmin = async (nickname: string) => {
  const adminChatIds = ADMIN_USERS.map((item) => item.id)
  for (const chatId of adminChatIds) {
    await sendTelegramMessage(
      chatId,
      `▶️ Отправил новые доступы в таблицу. Никнейм: ${nickname}`,
    )
  }
}

export async function handleCallbackQuery(
  userName: string,
  text: string,
  chatId: number,
  messageId: number,
) {
  try {
    const dataMessage = parseMessage(text, userName)
    await deleteMessage(chatId, messageId)
    if (!dataMessage) {
      await sendTelegramMessage(
        chatId,
        `❌ Сообщение отправлено не по иструкции. Отсутвует одно из обязательных полей`,
      )
      await sendInstructionTelegramMessage(chatId)
    } else {
      await writeSheet(dataMessage)
      await sendTelegramMessage(chatId, `✅ Доступы успешно записаны.`)
      await sendSuccessMessageAdmin(dataMessage.nickname)
    }
  } catch (error) {
    console.error('❌ Ошибка обработки callbackQuery:', error.message)
    await sendErrorMassage(chatId, error.message)
  }
}
