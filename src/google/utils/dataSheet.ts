import { getTrimValue } from '../../assets/validateData'
import { RANGE_KEY, VALUES_KEY } from '../../constants'
import { DataMessage, SheetData, SheetUpdate } from '../../types'
import { colsKeys } from '../../globals'

const getNextRow = (sheetData: SheetData) => {
  const lastRow = sheetData?.[sheetData.length - 1]?.id
  if (typeof lastRow !== 'number') return null
  return lastRow + 1
}

export const getSheetDataByWrite = (
  sheetData: SheetData,
  dataMessage: DataMessage,
): SheetUpdate[] | null => {
  const nextRow = getNextRow(sheetData)
  if (nextRow === null) return null

  return [
    {
      [RANGE_KEY]: colsKeys[0] + nextRow,
      [VALUES_KEY]: [[getTrimValue(dataMessage.name)]],
    },
    {
      [RANGE_KEY]: colsKeys[1] + nextRow,
      [VALUES_KEY]: [[getTrimValue(dataMessage.link)]],
    },
    {
      [RANGE_KEY]: colsKeys[2] + nextRow,
      [VALUES_KEY]: [[getTrimValue(dataMessage.login)]],
    },
    {
      [RANGE_KEY]: colsKeys[3] + nextRow,
      [VALUES_KEY]: [[getTrimValue(dataMessage.password)]],
    },
    {
      [RANGE_KEY]: colsKeys[4] + nextRow,
      [VALUES_KEY]: [[getTrimValue(dataMessage.nickname)]],
    },
  ]
}
