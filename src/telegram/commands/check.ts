import { getTimeInUkraine } from '../../assets/dateFormat'
import { repeatSheet } from '../../google'
import { allowedUsers } from '../../globals'
import { sendTelegramMessage } from '../index'

export async function handleCheckCommand(userName: string) {
  console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
  try {
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(
        chatId,
        `**${userName}** Использовал команду "/check" для запроса данных с таблицы`,
      )
    }
    await repeatSheet()
  } catch (err) {
    console.error('❌ Ошибка обработки Google запроса:', err)
  }
}
