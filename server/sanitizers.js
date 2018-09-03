export function sanitiseUserObject(user) {
  if(!(user.username && user.email)) {
    return null
  }

  const rank = user.rank ? user.rank : 'user'
  return {
    username: user.username,
    rank: rank,
    email: user.email,
  }
}

export function sanitiseGroupObject(group) {
  if (!group.name || !group.description) {
    return null
  }

  return {
    name: group.name,
    description: group.description,
    users: [],
    channels: [],
  }
}

export function sanitiseChannelObject(channel) {
  if (!channel.name || !channel.groupId) {
    return null
  }
  return {
    name: channel.name,
    groupId: channel.groupId,
    users: []
  }
}