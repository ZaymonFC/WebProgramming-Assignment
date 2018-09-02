import { User } from './user'
import { Channel } from './channel';

export interface Group {
    name: string
    id: string
    description: string
    users: User[]
    channels: Channel[]
}
