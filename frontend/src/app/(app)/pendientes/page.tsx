"use client"

import { useEffect, useState } from "react"
import { ExpedientesTable } from "@/components/reusable/table/ExpedientesTable"
import { columns, Expediente } from "@/components/reusable/table/ExpedientesColumns"
import { apiFetch } from "@/lib/api"

export default function PendientesPage() {
  const [data, setData] = useState<Expediente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch("/expedientes/pendientes")
      .then((res) => {
        setData(res.expedientes)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al cargar expedientes pendientes", err)
        setError("Error al cargar expedientes pendientes")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-10">Cargando expedientes pendientes...</div>
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Expedientes Pendientes</h1>
      <ExpedientesTable columns={columns} data={data} />
    </div>
  )
}
