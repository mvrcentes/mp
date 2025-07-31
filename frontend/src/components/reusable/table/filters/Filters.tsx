"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Filters({
  estado,
  fechaInicio,
  fechaFin,
  setEstado,
  setFechaInicio,
  setFechaFin,
  onBuscar,
}: {
  estado: string
  fechaInicio?: Date
  fechaFin?: Date
  setEstado: (value: string) => void
  setFechaInicio: (date?: Date) => void
  setFechaFin: (date?: Date) => void
  onBuscar: () => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 items-end">
      <div>
        <Label className="mb-2 block">Fecha de inicio</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {fechaInicio ? fechaInicio.toLocaleDateString() : "Seleccionar"}
              <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fechaInicio}
              onSelect={setFechaInicio}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label className="mb-2 block">Fecha de fin</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {fechaFin ? fechaFin.toLocaleDateString() : "Seleccionar"}
              <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fechaFin}
              onSelect={setFechaFin}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-row items-center gap-4">
        <div>
          <Label className="mb-2 block">Estado</Label>
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="APROBADO">Aprobado</SelectItem>
                <SelectItem value="RECHAZADO">Rechazado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button className="mt-4" onClick={onBuscar}>
          Buscar
        </Button>
      </div>
    </div>
  )
}
