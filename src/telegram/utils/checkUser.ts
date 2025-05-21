import { sendTelegramMessage } from '../index'
import type { AllowedUser } from '../../types'

let ALLOWED_USERS: AllowedUser[]

if (process.env.VERCEL) {
  ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]')
} else {
  const dotenv = require('dotenv')
  dotenv.config()
  ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]')
}

export async function isAuthorizedUser(
  userId: number,
  chatId: number,
  userName: string,
): Promise<boolean> {
  const findIndexUser = ALLOWED_USERS.findIndex((user) => user.id === userId)
  const authorized = findIndexUser !== -1
  if (!authorized && chatId) {
    await sendTelegramMessage(
      chatId,
      `🚫 ${userName || 'Пользователь'} не имеет доступа к этому боту.`,
    )
    console.log('🚫 Неавторизованный пользователь:', userId, userName)
  }
  return authorized
}
