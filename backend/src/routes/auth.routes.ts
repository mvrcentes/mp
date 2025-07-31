// src/routes/auth.routes.ts
import type { Request, Response, NextFunction } from "express"
import { Router } from "express"
import { prisma } from "../database"
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator"

const router = Router()

/**
 * @route POST /api/auth/register
 * @description Registra un nuevo usuario con rol (TECNICO o COORDINADOR).
 * @access Público
 *
 * @param {Request} req - Objeto de solicitud de Express, debe contener en body: email (string, formato válido), name (string), password (string, mínimo 6 caracteres), role ('TECNICO' o 'COORDINADOR').
 * @param {Response} res - Objeto de respuesta de Express.
 * @returns {201} Usuario creado exitosamente, retorna objeto con mensaje y datos del usuario.
 * @returns {400} Error de validación (campos inválidos o faltantes) o conflicto al registrar.
 * @throws Retorna error 400 si la validación falla o ocurre un error al registrar el usuario.
 */
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("role").isIn(["TECNICO", "COORDINADOR"]).withMessage("Rol inválido"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, name, password, role } = req.body

    try {
      const hash = await argon2.hash(password)
      const user = await prisma.user.create({
        data: { email, name, password: hash, role },
      })

      res.status(201).json({ message: "Usuario registrado", user })
    } catch (err) {
      console.error("ERROR REGISTRO:", err)
      res
        .status(400)
        .json({ error: "Error al registrar usuario", detalle: err })
    }
  }
)

/**
 * @route POST /api/auth/login
 * @description Inicia sesión y devuelve un token JWT si las credenciales son válidas.
 * @access Público
 *
 * @param {Request} req - Objeto de solicitud de Express, debe contener en body: email (string), password (string).
 * @param {Response} res - Objeto de respuesta de Express.
 * @returns {200} Token JWT válido si las credenciales son correctas.
 * @returns {400} Error de validación (faltan campos o formato incorrecto).
 * @returns {401} Credenciales inválidas.
 * @throws Retorna error 400 si la validación falla, o 401 si las credenciales no son válidas.
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" })

    const valid = await argon2.verify(user.password, password)
    if (!valid) return res.status(401).json({ error: "Credenciales inválidas" })

    const token = jwt.sign({ id: user.id, role: user.role }, "secreto123", {
      expiresIn: "1h",
    })

    res.json({ token })
  }
)

export default router
