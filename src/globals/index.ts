import { VALID_OTHER_KEY, VALID_YES_DEZ_KEY, VALID_YES_KEY } from '../constants'

export const allowedUsers = [6602497931, 5937309404, 5622459508]
export const range = 'Доступ под замену пароля'

export const validKeys = [VALID_YES_KEY, VALID_YES_DEZ_KEY, VALID_OTHER_KEY]

const columnToLetter = (col: number): string => {
  let letter = ''
  while (col > 0) {
    let temp = (col - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    col = (col - temp - 1) / 26
  }
  return letter
}

const getColsSheetData = (): string[] => {
  const result: string[] = []
  for (let i = 0; i < 10; i++) {
    result.push(columnToLetter(i + 1))
  }
  return result
}

export const colsKeys = getColsSheetData()
