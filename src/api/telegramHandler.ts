import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getTimeInUkraine } from '../assets/dateFormat'
import { isAuthorizedUser } from '../telegram/utils/checkUser'
import { handleStartCommand, handleCheckCommand } from '../telegram'

// : Promise<VercelResponse>
export default async function telegramHandler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  console.log('🔥 Webhook вызван в', getTimeInUkraine())
  try {
    const body = req.body
    const userId = body?.message?.from?.id || body?.callback_query?.from?.id
    const chatId =
      body?.message?.chat?.id || body?.callback_query?.message?.chat?.id
    const userName =
      body?.message?.from?.username ||
      body?.message?.from?.first_name ||
      body?.callback_query?.from?.username ||
      body?.callback_query?.from?.first_name

    if (!(await isAuthorizedUser(userId, chatId, userName))) {
      res.status(200).send('🚫 Доступ запрещён')
      return
    }

    if (body.message?.text === '/start') {
      await handleStartCommand(chatId, userName)
    }

    if (body.message?.text === '/check') {
      await handleCheckCommand(userName)
    }

    res.status(200).send('ok')
  } catch (error) {
    console.error('❌ Ошибка основного webhook:', error.message)
    res.status(500).send('Ошибка сервера')
  }
}
