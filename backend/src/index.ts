import express from "express"
import cors from "cors"
import { prisma } from "./database"
import authRoutes from "./routes/auth.routes"
import expedienteRoutes from "./routes/expedientes.routes"
import indicioRoutes from "./routes/indicios.routes"
import { ensureDatabaseExists } from "./init-db"

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/expedientes", expedienteRoutes)
app.use("/api/indicios", indicioRoutes)

const PORT = Number(process.env.PORT) || 3000

async function bootstrap() {
  try {
    await ensureDatabaseExists()
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Servidor corriendo en el puerto ${PORT}`)
    })
  } catch (err) {
    console.error("❌ Error al iniciar el servidor:", err)
    process.exit(1)
  }
}

bootstrap()
