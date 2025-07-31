"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FolderOpen, FilePlus, FolderClock } from "lucide-react"
import Link from "next/link"
import { getUserFromToken } from "@/lib/auth"
import { useEffect, useState } from "react"

export function AppSidebar() {
  const [user, setUser] = useState<{ role: string } | null>(null)

  useEffect(() => {
    const currentUser = getUserFromToken()
    setUser(currentUser)
  }, [])

  const isTecnico = user?.role === "TECNICO"
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-lg font-bold px-4">DICRI</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuItem className="px-2">
          <SidebarMenuButton asChild>
            <Link href="/expedientes" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              <span>Expedientes</span>
            </Link>
          </SidebarMenuButton>

          {isTecnico && (
            <SidebarMenuButton asChild>
              <Link
                href="/crear-expediente"
                className="flex items-center gap-2">
                <FilePlus className="w-4 h-4" />
                <span>Crear expediente</span>
              </Link>
            </SidebarMenuButton>
          )}

          {!isTecnico && (
            <SidebarMenuButton asChild>
              <Link href="/pendientes" className="flex items-center gap-2">
                <FolderClock className="w-4 h-4" />
                <span>Pendientes</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
