import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { authorizeRole } from "../middleware/authorizeRole"
import {
  actualizarIndicio,
  agregarIndicio,
  eliminarIndicio,
} from "../controllers/indicios.controller"

const router = Router()

router.patch(
  "/editar/:idExpediente/indicio/:idIndicio",
  requireAuth,
  authorizeRole("TECNICO"),
  actualizarIndicio
)

router.delete(
  "/editar/:idExpediente/indicio/:idIndicio",
  requireAuth,
  authorizeRole("TECNICO"),
  eliminarIndicio
)

router.post(
  "/agregar/:idExpediente",
  requireAuth,
  authorizeRole("TECNICO"),
  agregarIndicio
)

export default router
