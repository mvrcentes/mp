// src/routes/auth.routes.ts
import { Router } from 'express'
import { prisma } from '../database'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, name, password, role } = req.body

  try {
    const hash = await argon2.hash(password)
    const user = await prisma.user.create({
      data: { email, name, password: hash, role }
    })

    res.json({ message: 'Usuario registrado', user })
  } catch (err) {
    res.status(400).json({ error: 'Error al registrar usuario' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

  const valid = await argon2.verify(user.password, password)
  if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' })

  const token = jwt.sign({ id: user.id, role: user.role }, 'secreto123', { expiresIn: '1h' })

  res.json({ token })
})

export default router