import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' })

  try {
    const token = auth.split(' ')[1]
    const payload = jwt.verify(token, 'secreto123')
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}