import type { Request, Response } from "express"
import { prisma } from "../database"

/**
 * Actualiza un indicio existente y cambia el estado del expediente a "PENDIENTE".
 * 
 * @param req - Objeto de solicitud que contiene los parámetros del expediente e indicio, y los nuevos datos del indicio.
 * @param res - Objeto de respuesta para enviar el resultado de la operación.
 */
export const actualizarIndicio = async (req: Request, res: Response) => {
  const idExpediente = parseInt(req.params.idExpediente)
  const idIndicio = parseInt(req.params.idIndicio)
  const { descripcion, color, tamano, peso, ubicacion } = req.body

  try {
    const indicio = await prisma.indicio.update({
      where: { id: idIndicio },
      data: {
        descripcion,
        color,
        tamano,
        peso,
        ubicacion,
        expediente: {
          update: {
            estado: "PENDIENTE",
          },
        },
      },
    })

    res.status(200).json({ message: "Indicio actualizado", indicio })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al actualizar el indicio" })
  }
}

/**
 * Elimina un indicio asociado a un expediente y cambia el estado del expediente a "PENDIENTE".
 * 
 * @param req - Objeto de solicitud que contiene los parámetros del expediente e indicio.
 * @param res - Objeto de respuesta para enviar el resultado de la operación.
 */
export const eliminarIndicio = async (req: Request, res: Response) => {
  const expedienteId = parseInt(req.params.idExpediente)
  const indicioId = parseInt(req.params.idIndicio)

  try {
    const indicio = await prisma.indicio.delete({
      where: { id: indicioId },
    })

    await prisma.expediente.update({
      where: { id: expedienteId },
      data: {
        estado: "PENDIENTE",
      },
    })

    res.status(200).json({ message: "Indicio eliminado", indicio })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al eliminar indicio" })
  }
}

/**
 * Agrega un nuevo indicio a un expediente y cambia el estado del expediente a "PENDIENTE".
 * 
 * @param req - Objeto de solicitud que contiene el parámetro del expediente y los datos del nuevo indicio.
 * @param res - Objeto de respuesta para enviar el resultado de la operación.
 */
export const agregarIndicio = async (req: Request, res: Response) => {
  const expedienteId = parseInt(req.params.idExpediente)
  const { descripcion, color, tamano, peso, ubicacion } = req.body

  if (
    !descripcion ||
    !color ||
    !tamano ||
    typeof peso !== "number" ||
    !ubicacion
  ) {
    return res.status(400).json({ error: "Todos los campos son requeridos" })
  }

  try {
    const nuevoIndicio = await prisma.indicio.create({
      data: {
        descripcion,
        color,
        tamano,
        peso,
        ubicacion,
        expediente: {
          connect: { id: expedienteId },
        },
      },
    })

    await prisma.expediente.update({
      where: { id: expedienteId },
      data: { estado: "PENDIENTE" },
    })

    res.status(201).json({ message: "Indicio agregado", indicio: nuevoIndicio })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al agregar el indicio" })
  }
}
