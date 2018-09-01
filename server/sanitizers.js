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
  if (!group.name && typeof(user.username) === String) {
    return null
  }

  return {
    name: group.name,
    description: group.description,
  }
}
