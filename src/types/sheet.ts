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

export type SheetRow = (string | number | boolean | null)[]
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
