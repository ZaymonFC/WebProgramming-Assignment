import { Group } from '../types/group'

export function getDummyGroups() {
    const groups: Group[] = [
        {
            name: 'The Boys',
            description: 'Yeah the boys',

        },
        {
            name: 'Longboarding',
            description: 'Dope boarding memes',

        },
        {
            name: 'Games',
            description: 'Group for some games and shit',

        },
    ]
    return groups
}
