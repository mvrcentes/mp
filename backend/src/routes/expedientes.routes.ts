import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { authorizeRole } from "../middleware/authorizeRole"
import {
  crearExpediente,
  obtenerExpedientesPendientes,
  aprobarExpediente,
  rechazarExpediente,
  obtenerExpedientes,
  generarReporteExpedientes,
  obtenerExpedientePorId,
} from "../controllers/expedientes.controller"

const router = Router()

router.post("/", requireAuth, authorizeRole("TECNICO"), crearExpediente)

/**
 * @route GET /api/expedientes/pendientes
 * @description Obtiene todos los expedientes en estado PENDIENTE.
 * @access Privado (COORDINADOR)
 * @returns {200} Lista de expedientes pendientes.
 * @returns {500} Error interno al obtener expedientes.
 */
router.get(
  "/pendientes",
  requireAuth,
  authorizeRole("COORDINADOR"),
  obtenerExpedientesPendientes
)

/**
 * @route PATCH /api/expedientes/:id/aprobar
 * @description Cambia el estado del expediente a APROBADO.
 * @access Privado (COORDINADOR)
 * @param {number} id - ID del expediente a aprobar.
 * @returns {200} Objeto del expediente aprobado.
 * @returns {500} Error interno al aprobar expediente.
 */
router.patch(
  "/:id/aprobar",
  requireAuth,
  authorizeRole("COORDINADOR"),
  aprobarExpediente
)

/**
 * @route PATCH /api/expedientes/:id/rechazar
 * @description Cambia el estado del expediente a RECHAZADO y guarda justificación.
 * @access Privado (COORDINADOR)
 * @param {number} id - ID del expediente a rechazar.
 * @param {string} justificacion - Motivo del rechazo.
 * @returns {200} Objeto del expediente rechazado.
 * @returns {400} Si falta la justificación.
 * @returns {500} Error interno al rechazar expediente.
 */
router.patch(
  "/:id/rechazar",
  requireAuth,
  authorizeRole("COORDINADOR"),
  rechazarExpediente
)

/**
 * @route GET /api/expedientes
 * @description Lista todos los expedientes visibles según el rol del usuario.
 * @access Privado (TECNICO o COORDINADOR)
 * @returns {200} Lista de expedientes.
 * @returns {500} Error interno al obtener expedientes.
 */
router.get("/", requireAuth, obtenerExpedientes)

/**
 * @route GET /api/expedientes/reportes
 * @description Genera reportes filtrados por estado y/o rango de fechas.
 * @access Privado (autenticado)
 * @param {string} [estado] - Estado del expediente a filtrar (opcional).
 * @param {string} [fechaInicio] - Fecha mínima en formato ISO (opcional).
 * @param {string} [fechaFin] - Fecha máxima en formato ISO (opcional).
 * @returns {200} Lista filtrada de expedientes.
 * @returns {500} Error interno al generar reporte.
 */
router.get("/reportes", requireAuth, generarReporteExpedientes)

router.get("/:id", requireAuth, obtenerExpedientePorId)

export default router
