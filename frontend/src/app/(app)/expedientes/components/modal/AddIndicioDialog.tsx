"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api"

type AddIndicioDialogProps = {
  expedienteId: number
  onSuccess: () => void
}

export function AddIndicioDialog({
  expedienteId,
  onSuccess,
}: AddIndicioDialogProps) {
  const [formData, setFormData] = useState({
    descripcion: "",
    color: "",
    tamano: "",
    peso: 0,
    ubicacion: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "peso" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await apiFetch(`/indicios/agregar/${expedienteId}`, {
      method: "POST",
      body: JSON.stringify(formData),
    })
    setFormData({
      descripcion: "",
      color: "",
      tamano: "",
      peso: 0,
      ubicacion: "",
    })
    onSuccess()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Agregar Indicio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo Indicio</DialogTitle>
            <DialogDescription>
              Completa los campos para agregar un nuevo indicio al expediente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            {["descripcion", "color", "tamano", "ubicacion"].map((field) => (
              <div key={field} className="grid gap-1">
                <Label htmlFor={field}>
                  {field[0].toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="grid gap-1">
              <Label htmlFor="peso">Peso (lb)</Label>
              <Input
                type="number"
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
