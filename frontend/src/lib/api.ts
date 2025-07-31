import { getToken } from "./auth"

export async function apiFetch(endpoint: string, options = {}) {
  const token = getToken()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}
