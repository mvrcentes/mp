import type { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

export function authorizeRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Acceso denegado" })
    }
    next()
  }
}
