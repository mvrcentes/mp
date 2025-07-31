export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null
}

export function getUserFromToken() {
  const token = getToken()
  if (!token) return null
  const payload = JSON.parse(atob(token.split(".")[1]))
  return payload
}
