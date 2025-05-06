import { readSheet, repeatSheet } from './google'
import { setSheetData, getSheetData } from '../mock/sheet.js'

// const getReadSheet = async (): Promise<SheetObject[]> => {
//   try {
//     return await readSheet()
//   } catch (error) {
//     console.error(error.message)
//   }
// }

const dataSheetFunc = async (): Promise<void> => {
  // const dataSheet = await getReadSheet()
  const dataSheet = await readSheet()
  // console.log(dataSheet)

  setSheetData(dataSheet)
  console.log(getSheetData())
}

dataSheetFunc().catch((err) => console.log(err))
