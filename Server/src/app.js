import express from 'express'
import { db } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import profileRoutes from './routes/profileRoutes.js'
import pcTypesRoutes from './routes/pcTypesRoutes.js'
import dotenv from 'dotenv'

const app = express()
app.use(cors())
dotenv.config({ path: './.env' })

app.use(express.json())
// рега
app.use('/api/auth', authRoutes)
// кабинет
app.use('/api/profile', profileRoutes)
// инфа о компах
app.use('/api/computers', pcTypesRoutes)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
