import { User } from './user'

export interface Group {
    name: string
    id: string
    description: string
    users: User[]
}
