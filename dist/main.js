"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_1 = require("./google");
const sheet_js_1 = require("../mock/sheet.js");
// const getReadSheet = async (): Promise<SheetObject[]> => {
//   try {
//     return await readSheet()
//   } catch (error) {
//     console.error(error.message)
//   }
// }
const dataSheetFunc = async () => {
    // const dataSheet = await getReadSheet()
    const dataSheet = await (0, google_1.readSheet)();
    // console.log(dataSheet)
    (0, sheet_js_1.setSheetData)(dataSheet);
    console.log((0, sheet_js_1.getSheetData)());
};
// dataSheetFunc().catch((err) => console.log(err))
function parseMessage(message) {
    const lines = message
        .trim()
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
    const [name, link, login, password, nickname] = lines;
    return {
        name: name || null,
        link: link || null,
        login: login || null,
        password: password || null,
        nickname: nickname || null,
    };
}
const text = `
NameService
track.asdartners.io
loginName
pass1234124
serhii_bdm
`;
const data = parseMessage(text);
console.log(text);
console.log(data);
