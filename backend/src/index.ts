import express from 'express'
import { prisma } from './database'
import authRoutes from './routes/auth.routes'

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})