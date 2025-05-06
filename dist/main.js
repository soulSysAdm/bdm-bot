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
dataSheetFunc().catch((err) => console.log(err));
