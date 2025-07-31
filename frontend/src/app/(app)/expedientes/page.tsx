"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import {
  columns,
  Expediente,
} from "@/components/reusable/table/ExpedientesColumns"
import { ExpedientesTable } from "@/components/reusable/table/ExpedientesTable"
import { Filters } from "@/components/reusable/table/filters/Filters"

export default function Page() {
  const [data, setData] = useState<Expediente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [estado, setEstado] = useState("")
  const [fechaInicio, setFechaInicio] = useState<Date>()
  const [fechaFin, setFechaFin] = useState<Date>()

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (estado) params.append("estado", estado)
      if (fechaInicio)
        params.append("fechaInicio", fechaInicio.toISOString().split("T")[0])
      if (fechaFin)
        params.append("fechaFin", fechaFin.toISOString().split("T")[0])

      const url = `/expedientes/reportes?${params.toString()}`
      const res = await apiFetch(url)
      setData(res.expedientes)
    } catch (err) {
      console.error(err)
      setError("Error al cargar expedientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div className="p-10">Cargando expedientes...</div>
  if (error) return <div className="p-10 text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Expedientes</h1>
      <Filters
        estado={estado}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        setEstado={setEstado}
        setFechaInicio={setFechaInicio}
        setFechaFin={setFechaFin}
        onBuscar={fetchData}
      />
      <ExpedientesTable columns={columns} data={data} />
    </div>
  )
}
