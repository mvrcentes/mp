"use client"

import { useState } from "react"
import { getUserFromToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PanelLeftOpen } from "lucide-react"
import {
  Expediente,
  Indicio,
} from "@/components/reusable/table/ExpedientesColumns"
import IndiciosCard from "@/app/(app)/crear-expediente/components/IndiciosCard"
import { apiFetch } from "@/lib/api"
import { AddIndicioDialog } from "./AddIndicioDialog"
import { ApproveExpedienteDialog } from "./ApproveExpedienteDialog"
import { RejectExpedienteDialog } from "./RejectExpedienteDialog"

type IndiciosSheetProps = {
  expediente: Expediente
}

export function IndiciosSheet({ expediente }: IndiciosSheetProps) {
  const [open, setOpen] = useState(false)

  const [indicios, setIndicios] = useState<Indicio[]>(expediente.indicios)

  const user = getUserFromToken()
  const isTecnico = user?.role === "TECNICO"

  const handleSave = async (updatedIndicio: Indicio, index: number) => {
    await apiFetch(
      `/indicios/editar/${expediente.id}/indicio/${updatedIndicio.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updatedIndicio),
      }
    )

    const nuevos = [...indicios]
    nuevos[index] = updatedIndicio
    setIndicios(nuevos)
  }

  const handleDelete = async (id: number) => {
    await apiFetch(`/indicios/editar/${expediente.id}/indicio/${id}`, {
      method: "DELETE",
    })
    setIndicios(indicios.filter((i) => i.id !== id))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Ver indicios">
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Indicios del expediente #{expediente.id}</SheetTitle>

          {expediente.justificacion && (
            <p className="text-sm text-muted-foreground italic">
              Justificación: {expediente.justificacion}
            </p>
          )}

          <SheetDescription>
            Total: {expediente.indicios.length}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col  gap-4 p-4 overflow-y-auto">
          {indicios.map((indicio, index) => (
            <IndiciosCard
              key={indicio.id}
              index={index}
              indicio={indicio}
              onSave={(updated) => handleSave(updated, index)}
              onDelete={() => handleDelete(indicio.id)}
            />
          ))}
        </div>

        <SheetFooter className="flex justify-between">
          {isTecnico && (
            <AddIndicioDialog
              expedienteId={expediente.id}
              onSuccess={async () => {
                const data = await apiFetch(`/expedientes/${expediente.id}`)
                setIndicios(data.expediente.indicios)
              }}
            />
          )}

          {!isTecnico && (
            <div>
              <ApproveExpedienteDialog id={expediente.id} />
              <RejectExpedienteDialog id={expediente.id} />
            </div>
          )}
          <SheetClose asChild>
            <Button variant="outline">Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
