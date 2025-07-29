import { Router } from "express"
import { prisma } from "../database"
import { requireAuth } from "../middleware/auth"
import { authorizeRole } from "../middleware/authorizeRole"

const router = Router()

/**
 * @route POST /api/expedientes
 * @description Crea un nuevo expediente junto con sus indicios.
 * @access Privado (TECNICO)
 * @param {Array} indicios - Lista de objetos con los campos: descripcion, color, tamano, peso, ubicacion.
 * @returns {201} Objeto del expediente creado con los indicios.
 * @returns {400} Si los indicios no son válidos.
 * @returns {500} Error interno del servidor.
 */
router.post("/", requireAuth, authorizeRole("TECNICO"), async (req, res) => {
  const { indicios } = req.body

  if (!Array.isArray(indicios) || indicios.length === 0) {
    return res.status(400).json({ error: "Debes enviar al menos un indicio" })
  }

  const indiciosValidos = indicios.every(
    (indicio) =>
      indicio.descripcion &&
      indicio.color &&
      indicio.tamano &&
      typeof indicio.peso === "number" &&
      indicio.ubicacion
  )

  if (!indiciosValidos) {
    return res
      .status(400)
      .json({ error: "Todos los indicios deben tener los campos requeridos" })
  }

  try {
    const expediente = await prisma.expediente.create({
      data: {
        tecnicoId: req.user!.id,
        fecha: new Date(),
        indicios: {
          create: indicios.map((indicio) => ({
            descripcion: indicio.descripcion,
            color: indicio.color,
            tamano: indicio.tamano,
            peso: indicio.peso,
            ubicacion: indicio.ubicacion,
          })),
        },
      },
      include: {
        indicios: true,
      },
    })

    res
      .status(201)
      .json({ message: "Expediente creado con indicios", expediente })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al crear expediente con indicios" })
  }
})

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
  async (req, res) => {
    try {
      const expedientes = await prisma.expediente.findMany({
        where: {
          estado: "PENDIENTE",
        },
        include: {
          tecnico: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          indicios: true,
        },
        orderBy: {
          fecha: "desc",
        },
      })
      res.status(200).json({ expedientes })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Error al obtener expedientes pendientes" })
    }
  }
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
  async (req, res) => {
    const expedienteId = parseInt(req.params.id)

    try {
      const expediente = await prisma.expediente.update({
        where: { id: expedienteId },
        data: { estado: "APROBADO" },
      })

      res.status(200).json({ message: "Expediente aprobado", expediente })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Error al aprobar expediente" })
    }
  }
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
  async (req, res) => {
    const expedienteId = parseInt(req.params.id)
    const { justificacion } = req.body

    if (!justificacion) {
      return res.status(400).json({
        error: "La justificación es requerida para rechazar un expediente",
      })
    }

    try {
      const expediente = await prisma.expediente.update({
        where: { id: expedienteId },
        data: {
          estado: "RECHAZADO",
          justificacion,
        },
      })

      res
        .status(200)
        .json({ message: "Expediente rechazado con justificación", expediente })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Error al rechazar expediente" })
    }
  }
)

/**
 * @route GET /api/expedientes
 * @description Lista todos los expedientes visibles según el rol del usuario.
 * @access Privado (TECNICO o COORDINADOR)
 * @returns {200} Lista de expedientes.
 * @returns {500} Error interno al obtener expedientes.
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const filtros =
      req.user!.role === "TECNICO" ? { tecnicoId: req.user!.id } : {}

    const expedientes = await prisma.expediente.findMany({
      where: filtros,
      include: {
        tecnico: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        indicios: true,
      },
      orderBy: {
        fecha: "desc",
      },
    })

    res.status(200).json({ expedientes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al obtener expedientes" })
  }
})

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
router.get("/reportes", requireAuth, async (req, res) => {
  const { estado, fechaInicio, fechaFin } = req.query

  const filtros: any = {}

  if (estado && typeof estado === "string") {
    filtros.estado = estado
  }

  if (
    fechaInicio &&
    fechaFin &&
    typeof fechaInicio === "string" &&
    typeof fechaFin === "string"
  ) {
    filtros.fecha = {
      gte: new Date(fechaInicio),
      lte: new Date(fechaFin),
    }
  }

  try {
    const expedientes = await prisma.expediente.findMany({
      where: filtros,
      include: {
        tecnico: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        indicios: true,
      },
      orderBy: {
        fecha: "desc",
      },
    })

    res.status(200).json({ expedientes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al generar el reporte" })
  }
})

export default router
