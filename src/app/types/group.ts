import { User } from './user'
import { Channel } from './channel';
import { ChannelSummary } from './channel-summary';

export interface Group {
    name: string
    id: string
    description: string
    users: User[]
    channels: ChannelSummary[]
}
