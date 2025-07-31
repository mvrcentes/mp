"use client"

import { AuthForm } from "./form/AuthForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export default function AuthPage() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 mx-auto py-10">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardDescription>
                Accede a tu cuenta para continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm mode="login" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Registrarse</CardTitle>
              <CardDescription>
                Crea una cuenta nueva como técnico o coordinador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm mode="register" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
