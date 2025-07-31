import { useState } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "../forms/CrearExpediente"

type IndicioCardProps = {
  index: number
  indicio: {
    id: number
    descripcion: string
    color: string
    tamano: string
    peso: number
    ubicacion: string
  }
  onSave: (updated: IndicioCardProps["indicio"]) => void
  onDelete: () => void
}

const IndiciosCard = ({
  index,
  indicio,
  onSave,
  onDelete,
}: IndicioCardProps) => {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(indicio)

  const handleSave = () => {
    onSave(values)
    setOpen(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{indicio.descripcion}</CardTitle>
          <CardDescription>{indicio.ubicacion}</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Indicio</DialogTitle>
              <DialogDescription>
                Modifica los valores del indicio seleccionado.
              </DialogDescription>
            </DialogHeader>

            {/* No usamos form aquí para evitar conflictos con FormProvider */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={values.descripcion}
                  onChange={(e) =>
                    setValues({ ...values, descripcion: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={values.color}
                  onChange={(e) =>
                    setValues({ ...values, color: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tamano">Tamaño</Label>
                <Input
                  id="tamano"
                  value={values.tamano}
                  onChange={(e) =>
                    setValues({ ...values, tamano: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="peso">Peso</Label>
                <Input
                  id="peso"
                  type="number"
                  value={values.peso}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      peso: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  value={values.ubicacion}
                  onChange={(e) =>
                    setValues({ ...values, ubicacion: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="destructive" type="button" onClick={onDelete}>
                Eliminar
              </Button>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>
                  Guardar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="grid gap-1 text-sm">
        <div>
          <strong>Color:</strong> {indicio.color}
        </div>
        <div>
          <strong>Tamaño:</strong> {indicio.tamano}
        </div>
        <div>
          <strong>Peso:</strong> {indicio.peso} kg
        </div>
      </CardContent>

      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Ubicación: {indicio.ubicacion}
        </div>
      </CardFooter>
    </Card>
  )
}

export default IndiciosCard
