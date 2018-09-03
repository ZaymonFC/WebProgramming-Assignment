import { User } from './user'

export interface Channel {
  id: string
  name: string
  users: User[]
  groupId: string
}
