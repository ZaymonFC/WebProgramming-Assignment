import { User } from './user'

export interface Channel {
  _id: string
  name: string
  users: User[]
  groupId: string
}
