// Reusable AuthForm component for login/register
"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { getUserFromToken } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
})

const registerSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Nombre requerido" }),
  role: z.enum(["TECNICO", "COORDINADOR"]),
})

type AuthFormProps = {
  mode: "login" | "register"
}

export function AuthForm({ mode }: AuthFormProps) {
  const auth = useAuth()
  if (!auth) throw new Error("AuthContext no está disponible")
  const { setUser } = auth

  const router = useRouter()

  const schema = mode === "register" ? registerSchema : loginSchema
  // Use any to bypass static inference issues for now
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  })

  async function onSubmit(values: any) {
    console.log("intentando login", values) // <-- agrega esto

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register"
      // Only include name and role if in register mode
      let payload: any = { email: values.email, password: values.password }
      if (mode === "register") {
        payload.name = values.name
        payload.role = values.role
      }
      const res = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (mode === "login") {
        if (res.token) {
          localStorage.setItem("token", res.token)
          const user = getUserFromToken()
          setUser(user)
          toast.success("Inicio de sesión exitoso")

          if (user.role === "TECNICO") {
            router.push("/expedientes")
          } else {
            router.push("/pendientes")
          }
        } else {
          toast.error("Inicio de sesión fallido")
        }
      } else {
        // Registro exitoso
        toast.success("Registro exitoso")
        router.push("/auth?login") // o lo que uses para volver a login
      }

      if (res.token) {
        localStorage.setItem("token", res.token)
        document.cookie = `token=${res.token}; path=/`
        const user = getUserFromToken()
        setUser(user)
        toast.success(
          mode === "login" ? "Inicio de sesión exitoso" : "Registro exitoso"
        )

        if (user.role === "TECNICO") {
          router.push("/expedientes")
        } else {
          router.push("/pendientes")
        }
      }
    } catch (err) {
      console.error("Error en autenticación", err)
      toast.error("Ocurrió un error. Verifica tus datos e intenta nuevamente.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === "register" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "register" && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="TECNICO">Técnico</SelectItem>
                      <SelectItem value="COORDINADOR">Coordinador</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          {mode === "login" ? "Iniciar sesión" : "Registrarse"}
        </Button>
      </form>
    </Form>
  )
}
