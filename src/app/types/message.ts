export interface Message {
  userId: string
  channelId: string
  type: string
  text: string | null
  image: string | null
  timeStamp: number
}
