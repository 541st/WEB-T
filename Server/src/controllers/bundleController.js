import { db } from '../config/db.js'

export const getAllBundles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bundles ORDER BY duration_hours ASC')
    res.json(rows)
  } catch (err) {
    console.error('Ошибка при получении бандлов:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}