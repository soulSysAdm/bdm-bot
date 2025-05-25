export type TelegramMessages = string[]

export interface AllTelegramMessages {
  validMessages: TelegramMessages
  unValidMessages: TelegramMessages
}

export interface AllowedUser {
  nickname: string
  id: number
}

export interface AdminUser {
  nickname: string
  id: number
}
