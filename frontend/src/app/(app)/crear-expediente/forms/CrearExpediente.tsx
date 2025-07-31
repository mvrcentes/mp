import { useState } from "react"
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { Indicio } from "@/components/reusable/table/ExpedientesColumns"

export type FormValues = {
  indicios: Indicio[]
}

type CrearExpedienteProps = {
  form: UseFormReturn<FormValues>
}

export default function CrearExpediente({ form }: CrearExpedienteProps) {
  const [nuevoIndicio, setNuevoIndicio] = useState<Indicio>({
    id: Date.now(),
    descripcion: "",
    color: "",
    tamano: "",
    peso: 0,
    ubicacion: "",
  })

  const handleAgregarIndicio = () => {
    const valoresActuales = form.getValues("indicios") ?? []
    form.setValue("indicios", [...valoresActuales, nuevoIndicio])
    setNuevoIndicio({
      id: Date.now(),
      descripcion: "",
      color: "",
      tamano: "",
      peso: 0,
      ubicacion: "",
    })
  }

  return (
    <div className="w-1/2 space-y-6">
      <div className="border p-4 rounded-md space-y-4">
        <div className="flex flex-col gap-4">
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea
                className="min-h-[100px]"
                placeholder="Descripción"
                value={nuevoIndicio.descripcion}
                onChange={(e) =>
                  setNuevoIndicio({
                    ...nuevoIndicio,
                    descripcion: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <Input
                placeholder="Color"
                value={nuevoIndicio.color}
                onChange={(e) =>
                  setNuevoIndicio({ ...nuevoIndicio, color: e.target.value })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Tamaño</FormLabel>
            <FormControl>
              <Input
                placeholder="Tamaño"
                value={nuevoIndicio.tamano}
                onChange={(e) =>
                  setNuevoIndicio({ ...nuevoIndicio, tamano: e.target.value })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Peso (lb)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="Peso"
                value={nuevoIndicio.peso}
                onChange={(e) =>
                  setNuevoIndicio({
                    ...nuevoIndicio,
                    peso: Number(e.target.value),
                  })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Ubicación</FormLabel>
            <FormControl>
              <Input
                placeholder="Ubicación"
                value={nuevoIndicio.ubicacion}
                onChange={(e) =>
                  setNuevoIndicio({
                    ...nuevoIndicio,
                    ubicacion: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <Button type="button" className="w-full" onClick={handleAgregarIndicio}>
          Agregar Indicio
        </Button>

        <div className="flex items-center my-4">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="mx-4 text-gray-500 whitespace-nowrap text-sm">
            o
          </span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <Button type="submit" className="w-full">
          Crear Expediente
        </Button>
      </div>
    </div>
  )
}
