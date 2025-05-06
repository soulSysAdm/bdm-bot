import { sendTelegramMessage } from '../index'
import { allowedUsers } from '../../globals'

export async function isAuthorizedUser(
  userId: number,
  chatId: number,
  userName: string,
): Promise<boolean> {
  const authorized = userId && allowedUsers.includes(userId)
  if (!authorized && chatId) {
    await sendTelegramMessage(
      chatId,
      `🚫 ${userName || 'Пользователь'} не имеет доступа к этому боту.`,
    )
    console.log('🚫 Неавторизованный пользователь:', userId, userName)
  }
  return authorized
}
