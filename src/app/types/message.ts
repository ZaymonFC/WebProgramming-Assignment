export interface Message {
  userId: string
  channelId: string
  type: string
  text: string | null
  photoId: string | null
  timeStamp: number
}
