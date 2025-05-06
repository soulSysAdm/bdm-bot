import moment from 'moment-timezone'
import { getValidateNumber } from './validateData'
import { NumberRowWithDate } from '../types'

export const getDisplayDateWithDay = (date?: string | Date | null): string => {
  if (!date) return ''
  return moment(date).tz('Europe/Kyiv').format('DD-MM-YYYY, dddd')
}

export const getDisplayDate = (date?: string | Date | null): string => {
  if (!date) return ''
  return moment(date).tz('Europe/Kyiv').format('DD-MM-YYYY')
}

export const getTimeInUkraine = (): string => {
  return moment().tz('Europe/Kyiv').format('DD.MM.YYYY, HH:mm:ss')
}

export const delaySeconds = (second?: number): Promise<void> => {
  return new Promise((resolve) =>
    setTimeout(resolve, getValidateNumber(second) * 1000),
  )
}

export const getDaysFromToday = (dateStr: string | Date): number => {
  const target = moment(dateStr).tz('Europe/Kyiv').startOf('day')
  const today = moment().tz('Europe/Kyiv').startOf('day')
  return target.diff(today, 'days')
}

export const getDateByUnknownFormat = (
  date: string | null | undefined,
): string | null => {
  if (!date) return null

  const formats = [
    'DD-MM-YYYY',
    'DD.MM.YYYY',
    'DD-MM-YY',
    'DD.MM.YY',
    'YYYY-MM-DD',
    'YYYY.MM.DD',
    'D-M-YYYY',
    'D.M.YYYY',
    'D-M-YY',
    'D.M.YY',
    'DD/MM/YYYY',
    'DD/MM/YY',
    'YYYY/MM/DD',
  ]

  const parsed = moment.tz(date, formats, true, 'Europe/Kyiv')

  return parsed.isValid() ? parsed.format() : null
}

export const isInvalidOrTodayOrPast = (dateStr: string): boolean => {
  const dateFormat = getDateByUnknownFormat(dateStr)
  if (!dateFormat) return true

  const today = moment().tz('Europe/Kyiv').startOf('day')
  const target = moment(dateFormat).tz('Europe/Kyiv').startOf('day')

  return target.isSameOrBefore(today)
}

export const getDataByMonth = (
  data: NumberRowWithDate[],
  monthOffset: number = 0,
): NumberRowWithDate[] => {
  const targetMonth = moment()
    .tz('Europe/Kyiv')
    .add(monthOffset, 'months')
    .month()
  const targetYear = moment()
    .tz('Europe/Kyiv')
    .add(monthOffset, 'months')
    .year()

  return data.filter((item) => {
    const itemDate = moment(item.date).tz('Europe/Kyiv')
    return (
      itemDate.isValid() &&
      itemDate.month() === targetMonth &&
      itemDate.year() === targetYear
    )
  })
}

export const getMonthYearLabel = (monthOffset: number = 0): string => {
  return moment().add(monthOffset, 'months').format('MMMM MM-YYYY')
}
