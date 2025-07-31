"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import CrearExpediente from "./forms/CrearExpediente"
import IndiciosCard from "./components/IndiciosCard"
import { FormProvider } from "react-hook-form"

const indicioSchema = z.object({
  id: z.number().int(),
  descripcion: z.string().min(1, "Requerido"),
  color: z.string().min(1, "Requerido"),
  tamano: z.string().min(1, "Requerido"),
  peso: z.number().min(0, "Debe ser número"),
  ubicacion: z.string().min(1, "Requerido"),
})

const formSchema = z.object({
  indicios: z.array(indicioSchema).min(1, "Debes agregar al menos un indicio"),
})

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = await apiFetch("/expedientes", {
        method: "POST",
        body: JSON.stringify(values),
      })

      toast.success("Expediente creado correctamente")
      form.reset({ indicios: [] })
    } catch (err: any) {
      console.error(err)
      toast.error(`Error al crear expediente: ${err.message}`)
    }
  }

  return (
    <div className="p-6 ">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">
          <CrearExpediente form={form} />
          {(form.watch("indicios") ?? []).length > 0 && (
            <div className="w-1/2 space-y-4 overflow-y-auto max-h-[80vh] pr-2">
              {(form.watch("indicios") ?? []).map((indicio, index) => (
                <IndiciosCard
                  key={index}
                  index={index}
                  indicio={{ ...indicio, id: index }}
                  onSave={(updated) => {
                    const actuales = form.getValues("indicios")
                    const nuevos = [...actuales]
                    nuevos[index] = updated
                    form.setValue("indicios", nuevos)
                  }}
                  onDelete={() => {
                    const actuales = form.getValues("indicios")
                    form.setValue(
                      "indicios",
                      actuales.filter((_, i) => i !== index)
                    )
                  }}
                />
              ))}
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}
