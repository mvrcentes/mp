import type { Request, Response } from "express"
import { prisma } from "../database"

/**
 * Crea un nuevo expediente con una lista de indicios.
 * Valida que los indicios sean válidos antes de la inserción.
 * @param {Request} req - La solicitud HTTP, debe contener los indicios en el cuerpo.
 * @param {Response} res - La respuesta HTTP con el expediente creado o un error.
 */
export const crearExpediente = async (req: Request, res: Response) => {
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
}

/**
 * Obtiene todos los expedientes con estado "PENDIENTE".
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP con la lista de expedientes pendientes.
 */
export const obtenerExpedientesPendientes = async (
  req: Request,
  res: Response
) => {
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

/**
 * Cambia el estado de un expediente a "APROBADO".
 * @param {Request} req - La solicitud HTTP con el ID del expediente en los parámetros.
 * @param {Response} res - La respuesta HTTP con el expediente actualizado.
 */
export const aprobarExpediente = async (req: Request, res: Response) => {
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

/**
 * Cambia el estado de un expediente a "RECHAZADO" con justificación.
 * @param {Request} req - La solicitud HTTP con el ID del expediente en los parámetros y justificación en el cuerpo.
 * @param {Response} res - La respuesta HTTP con el expediente actualizado o un error.
 */
export const rechazarExpediente = async (req: Request, res: Response) => {
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

/**
 * Obtiene todos los expedientes, filtrando por técnico si es necesario.
 * @param {Request} req - La solicitud HTTP que puede contener información de usuario autenticado.
 * @param {Response} res - La respuesta HTTP con la lista de expedientes.
 */
export const obtenerExpedientes = async (req: Request, res: Response) => {
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
}

/**
 * Genera un reporte de expedientes basado en filtros de estado y fechas.
 * @param {Request} req - La solicitud HTTP con los filtros en query params (estado, fechaInicio, fechaFin).
 * @param {Response} res - La respuesta HTTP con la lista de expedientes que cumplen los filtros.
 */
export const generarReporteExpedientes = async (
  req: Request,
  res: Response
) => {
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
    const finDate = new Date(fechaFin)
    finDate.setDate(finDate.getDate() + 1)

    filtros.fecha = {
      gte: new Date(fechaInicio),
      lt: finDate,
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
}

/**
 * Obtiene un expediente por su ID, incluyendo sus indicios y técnico asociado.
 * @param {Request} req - La solicitud HTTP con el ID del expediente en los parámetros.
 * @param {Response} res - La respuesta HTTP con los datos del expediente o un error si no existe.
 */
export const obtenerExpedientePorId = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)

  try {
    const expediente = await prisma.expediente.findUnique({
      where: { id },
      include: {
        indicios: true,
        tecnico: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!expediente) {
      return res.status(404).json({ error: "Expediente no encontrado" })
    }

    res.status(200).json({ expediente })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al obtener expediente" })
  }
}
