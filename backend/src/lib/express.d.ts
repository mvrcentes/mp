// src/lib/express.d.ts
import { JwtPayload } from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: number
        role: string
      }
    }
  }
}

export {}