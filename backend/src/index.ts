import express from 'express'
import { prisma } from './database'
import authRoutes from './routes/auth.routes'
import expedienteRoutes from './routes/expedientes.routes'


const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/expedientes', expedienteRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})