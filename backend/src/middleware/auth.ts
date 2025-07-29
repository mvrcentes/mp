// src/middleware/auth.ts
import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" })
  }

  try {
    const token = auth.split(" ")[1]
    const payload = jwt.verify(token, "secreto123")

    if (typeof payload !== "string") {
      req.user = payload as JwtPayload & { id: number; role: string }
      next()
    } else {
      res.status(401).json({ error: "Token inválido" })
    }
  } catch {
    res.status(401).json({ error: "Token inválido" })
  }
}
