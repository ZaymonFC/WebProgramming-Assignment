export function sanitiseUserObject(user) {
  if (!user.username && typeof(user.username) === String) {
    return null
  }
  return {
    username: user.username
  }
}
