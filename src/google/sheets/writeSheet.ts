import { getSheetDataByWrite, readSheet } from '../index'
import { google } from 'googleapis'
import { DataMessage } from '../../types'
import { JWT } from 'google-auth-library'

let GOOGLE_CREDENTIALS: Record<string, any>
let GOOGLE_SHEET_ID: string

if (process.env.VERCEL) {
  GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}')
  GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID
} else {
  const dotenv = require('dotenv')
  dotenv.config()
  GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}')
  GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID
}

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export async function writeSheet(dataMessage: DataMessage) {
  try {
    const sheetData = await readSheet()
    const requests = getSheetDataByWrite(sheetData, dataMessage)
    if (!requests) {
      // await sendTelegramMessage(chatId, 'Проблема чтения таблицы. Ничего не записано')
      throw new Error('Проблема чтения таблицы. Ничего не записано')
    } else {
      const client = (await auth.getClient()) as JWT
      const sheets = google.sheets({ version: 'v4', auth: client })

      return await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: requests,
        },
      })
    }
  } catch (error) {
    console.error('❌ Ошибка writeSheet:', error.message)
    throw new Error(error.message)
  }
}
