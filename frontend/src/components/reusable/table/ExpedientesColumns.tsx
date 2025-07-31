"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IndiciosSheet } from "../../../app/(app)/expedientes/components/modal/IndiciosSheet"
import { Button } from "../../ui/button"
import { ArrowUpDown } from "lucide-react"

export type Indicio = {
  id: number
  descripcion: string
  color: string
  tamano: string
  peso: number
  ubicacion: string
}

export type Expediente = {
  id: number
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO"
  fecha: string // o Date si lo conviertes
  justificacion?: string
  tecnico: {
    name: string
    email: string
  }
  indicios: Indicio[]
}

export const columns: ColumnDef<Expediente>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Estado
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "fecha",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const raw = row.getValue("fecha")
      const date = new Date(raw as string | number | Date)
      return date.toLocaleDateString("es-GT", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    },
  },
  {
    accessorKey: "tecnico.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Técnico
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.tecnico.name,
  },
  {
    accessorKey: "tecnico.email",
    header: "Email Técnico",
    enableSorting: true,
    cell: ({ row }) => row.original.tecnico.email,
  },
  {
    accessorKey: "indicios",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Indicios
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      rowA.original.indicios.length - rowB.original.indicios.length,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.indicios.length}
        <IndiciosSheet expediente={row.original} />
      </div>
    ),
  },
]
