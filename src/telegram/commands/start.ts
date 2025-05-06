import { sendTelegramMessage } from '../index'

export async function handleStartCommand(chatId: number, user: string) {
  try {
    await sendTelegramMessage(
      chatId,
      `👋 Привет, **${user}**! Ты в списке разрешённых!`,
    )
  } catch (error) {
    console.error('❌ Ошибка в команде /start:', error.message)
  }
}
