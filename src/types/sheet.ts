import {
  BEST_BEFORE_DATE_KEY,
  DATE_KEY,
  ID_KEY,
  NUMBER_VALID_KEY,
  PHONE_NUMBER_KEY,
  VALID_OTHER_KEY,
  VALID_YES_DEZ_KEY,
  VALID_YES_KEY,
} from '../constants'

export type SheetRow1 = (string | number | boolean | null)[]
export type SheetData1 = SheetRow1[]

export type ColumnKey =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'

export type SheetRow = {
  [key in ColumnKey]?: string | null
} & {
  id: number
  _sheetMeta: {
    row: number
    cols: Record<ColumnKey, string>
  }
}

export type SheetData = SheetRow[]

export type SheetObject = Record<string, any> & {
  [ID_KEY]: number
  _sheetMeta: {
    row: number
    cols: Record<string, string>
  }
}

export interface SheetNumberRow {
  [key: string]: unknown
}

export interface FilteredNumberRow extends SheetNumberRow {
  [PHONE_NUMBER_KEY]: string
  [BEST_BEFORE_DATE_KEY]: string
  [NUMBER_VALID_KEY]: string
}

export interface NumberRowWithDate extends SheetNumberRow {
  [PHONE_NUMBER_KEY]: string
  [BEST_BEFORE_DATE_KEY]: string
  [NUMBER_VALID_KEY]: string
  [DATE_KEY]: string
}

export interface DataByMonth {
  title: string
  data: NumberRowWithDate[]
}

export interface DataMessage {
  name: string
  link: string
  email: string
  login: string
  password: string
  nickname: string
  other: string
  time: string
}

export interface SheetUpdate {
  range: string
  values: string[][]
}
