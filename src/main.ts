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

// dataSheetFunc().catch((err) => console.log(err))


function parseMessage(message: string) {
  const lines = message.trim().split('\n').map(l => l.trim()).filter(Boolean)

  const [name, link, login, password, nickname] = lines

  return {
    name: name || null,
    link: link || null,
    login: login || null,
    password: password || null,
    nickname: nickname || null
  }
}

const text = `
NameService
track.asdartners.io
loginName
pass1234124
serhii_bdm
`

const data = parseMessage(text)

console.log(text)
console.log(data)
