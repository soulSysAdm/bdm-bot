import { getTelegramMessages, readSheet } from '../index'
import { sendTelegramMessage } from '../../telegram'
import { allowedUsers } from '../../globals'

export async function repeatSheet() {
  try {
    const sheetData = await readSheet()
    const { validMessages, unValidMessages } = getTelegramMessages(sheetData)

    for (const chatId of allowedUsers) {
      for (const message of unValidMessages) {
        await sendTelegramMessage(chatId, message)
      }
      for (const message of validMessages) {
        await sendTelegramMessage(chatId, message)
      }
    }
  } catch (error) {
    console.error('❌ Ошибка repeatSheet:', error.message)
  }
}
