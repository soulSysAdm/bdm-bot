// import type { VercelRequest, VercelResponse } from '@vercel/node'
// import { getTimeInUkraine } from '../assets/dateFormat'
// import { writeSheet } from '../google'
//
// export default async function googleHandler(
//   req: VercelRequest,
//   res: VercelResponse,
// ): Promise<void> {
//   console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
//   try {
//     await writeSheet()
//     res.status(200).json({ message: '✅ Google trigger received!' })
//   } catch (err) {
//     console.error('❌ Ошибка обработки Google запроса:', err)
//     res.status(500).json({ error: 'Ошибка сервера' })
//   }
// }
