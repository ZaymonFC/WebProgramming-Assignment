export function sanitiseUserObject(user) {
  if (!user.username && typeof(user.username) === String) {
    return null
  }
  return {
    username: user.username
  }
}

export function sanitiseGroupObject(group) {
  if (!group.name && typeof(user.username) === String) {
    return null
  }
  return {
    name: group.name
  }
}