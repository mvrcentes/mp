// src/tests/indicios.controller.test.ts
import { jest } from "@jest/globals"
import {
  agregarIndicio,
  actualizarIndicio,
  eliminarIndicio,
} from "../controllers/indicios.controller.ts"
import { prisma } from "../database"
import type { Request, Response } from "express"

jest.mock("../database.ts", () => {
  return {
    prisma: {
      indicio: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      expediente: {
        update: jest.fn(),
      },
    },
  }
})

const mockResponse = (): Response =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response)

beforeEach(() => {
  jest.clearAllMocks()
})

test("agregarIndicio - éxito", async () => {
  const req = {
    params: { idExpediente: "1" },
    body: {
      descripcion: "Objeto metálico",
      color: "gris",
      tamano: "pequeño",
      peso: 0.5,
      ubicacion: "caja fuerte",
    },
  } as unknown as Request
  const res = mockResponse()

  (prisma.indicio.create as jest.Mock).mockResolvedValue({
    id: 1,
  })
  (prisma.expediente.update as jest.Mock).mockResolvedValue({})

  await agregarIndicio(req, res)

  expect(prisma.indicio.create).toHaveBeenCalled()
  expect(prisma.expediente.update).toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(201)
  expect(res.json).toHaveBeenCalled()
})

test("actualizarIndicio - éxito", async () => {
  const req = {
    params: { idExpediente: "1", idIndicio: "2" },
    body: {
      descripcion: "Actualizado",
      color: "Azul",
      tamano: "Mediano",
      peso: 1.2,
      ubicacion: "Sala B",
    },
  } as unknown as Request
  const res = mockResponse()

  (prisma.indicio.update as jest.Mock).mockResolvedValue({
    id: 2,
  })

  await actualizarIndicio(req, res)

  expect(prisma.indicio.update).toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.json).toHaveBeenCalled()
})

test("eliminarIndicio - éxito", async () => {
  const req = {
    params: { idExpediente: "1", idIndicio: "3" },
  } as unknown as Request
  const res = mockResponse()

  (prisma.indicio.delete as jest.Mock).mockResolvedValue({
    id: 3,
  })
  (prisma.expediente.update as jest.Mock).mockResolvedValue({})

  await eliminarIndicio(req, res)

  expect(prisma.indicio.delete).toHaveBeenCalled()
  expect(prisma.expediente.update).toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.json).toHaveBeenCalled()
})
