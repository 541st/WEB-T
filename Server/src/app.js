import express from 'express'
import { db } from './config/db.js'

const app = express()

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result')
    res.json({ ok: true, result: rows[0].result })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
