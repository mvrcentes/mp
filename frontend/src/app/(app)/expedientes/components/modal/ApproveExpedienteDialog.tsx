"use client"

import { useState } from "react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export function ApproveExpedienteDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false)

  const handleApprove = async () => {
    try {
      await apiFetch(`/expedientes/${id}/aprobar`, {
        method: "PATCH",
      })
      toast.success("Expediente aprobado correctamente")
      setOpen(false)
    } catch (err) {
      toast.error("Hubo un error al aprobar el expediente")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Aprobar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            ¿Estás seguro que deseas aprobar este expediente?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleApprove}>Confirmar aprobación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
