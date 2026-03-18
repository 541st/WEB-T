import express from 'express'
import { db } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import profileRoutes from './routes/profileRoutes.js'
import computersRoutes from './routes/computersRoutes.js'

const app = express()
app.use(cors())

app.use(express.json())
// рега
app.use('/api/auth', authRoutes)
// кабинет
app.use('/api/profile', profileRoutes)
// инфа о компах
app.use('/api/computers', computersRoutes)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
