import sql from "mssql"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

const config = {
  user: "sa",
  password: "MPtest-2025",
  server: "sqlserver",
  port: 1433,
  database: "master",
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
}

export async function ensureDatabaseExists() {
  const maxRetries = 15
  let attempt = 1

  while (attempt <= maxRetries) {
    try {
      console.log(
        `🔁 Intentando conexión a SQL Server (intento ${attempt}/${maxRetries})...`
      )
      const pool = await sql.connect(config)
      await pool
        .request()
        .query("IF DB_ID('dicri') IS NULL CREATE DATABASE dicri;")
      await pool.close()
      console.log("✅ Base de datos 'dicri' creada o ya existía.")

      const { stdout } = await execAsync("npx prisma db push")
      console.log("✅ Prisma db push ejecutado:\n", stdout)
      return
    } catch (err) {
      console.warn(`⚠️ SQL Server aún no está listo. Esperando 2s...`)
      await new Promise((res) => setTimeout(res, 2000))
      attempt++
    }
  }

  console.error(
    "❌ No se pudo conectar a SQL Server después de varios intentos."
  )
  process.exit(1)
}
