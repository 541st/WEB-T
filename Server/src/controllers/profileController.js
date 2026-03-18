import { db } from '../config/db.js'

export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, email, name FROM users WHERE id = ?',
      [req.user.id]
    )

    res.json({ // категории внутри
      user: rows[0],
      bookings: [] 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}