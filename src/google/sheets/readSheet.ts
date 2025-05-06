import { google } from 'googleapis'
import { JWT } from 'google-auth-library'
import { ID_KEY } from '../../constants'
import { getValidateArray } from '../../assets/validateData.js'
import { range, colsKeys } from '../../globals'
import type { SheetData, SheetObject } from '../../types'

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
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

/**
 * Преобразует данные Google Sheets в массив объектов
 */

const getSheetDataArray = (rows: unknown): SheetObject[] => {
  const rowsArray = getValidateArray(rows) as SheetData

  if (rowsArray.length < 2) {
    console.log('❌ Нет данных "rows"')
    return []
  }

  return rowsArray.map((row, rowIndex) => {
    const obj: Record<string, any> = {}

    colsKeys.forEach((key, i) => {
      obj[key as string] = row[i] ?? null
    })

    obj[ID_KEY] = rowIndex + 1
    obj._sheetMeta = {
      row: rowIndex + 1,
      cols: colsKeys.reduce(
        (acc, key) => {
          acc[key] = key
          return acc
        },
        {} as Record<string, string>,
      ),
    }

    return obj as SheetObject
  })
}

/**
 * Чтение данных из Google Sheets и возврат их в виде массива объектов
 */
export const readSheet = async (): Promise<SheetObject[]> => {
  const client = (await auth.getClient()) as JWT
  const sheets = google.sheets({ version: 'v4', auth: client })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEET_ID,
    range,
  })

  const rows = res.data.values
  return getSheetDataArray(rows)
}
