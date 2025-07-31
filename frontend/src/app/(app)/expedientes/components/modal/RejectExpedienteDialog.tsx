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
import { Textarea } from "@/components/ui/textarea"

export function RejectExpedienteDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false)
  const [justificacion, setJustificacion] = useState("")

  const handleReject = async () => {
    try {
      await apiFetch(`/expedientes/${id}/rechazar`, {
        method: "PATCH",
        body: JSON.stringify({ justificacion }),
      })
      toast.success("Expediente rechazado correctamente")
      setJustificacion("")
      setOpen(false)
    } catch (err) {
      toast.error("Hubo un error al rechazar el expediente")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Rechazar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rechazar expediente</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Escribe la justificación del rechazo..."
          value={justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
          className="min-h-[120px]"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!justificacion.trim()}>
            Confirmar rechazo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
