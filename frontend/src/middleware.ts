import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const PUBLIC_ROUTES = ["/auth", "/api/auth/login", "/api/auth/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("Middleware ejecutándose en:", pathname)

  // Permitir rutas públicas
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode("secreto123"))
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
}
