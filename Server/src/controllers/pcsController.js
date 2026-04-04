import { db } from '../config/db.js'

export const getAllPCs = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         pcs.id,
         pcs.pc_type_id,
         pcs.place_number,
         pcs.status,
         pc_types.title AS type_title
       FROM pcs
       JOIN pc_types ON pcs.pc_type_id = pc_types.id
       ORDER BY pcs.place_number ASC`
    )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера при получении ПК' })
  }
}

export const bookPC = async (req, res) => {
  const userId = req.user.id
  const { pc_id, start_time, end_time } = req.body

  if (!pc_id || !start_time || !end_time) {
    return res.status(400).json({ message: 'Не хватает данных' })
  }

  try {
    // Проверяем, свободен ли ПК
    const [pcRows] = await db.query(
      'SELECT status FROM pcs WHERE id = ?',
      [pc_id]
    )

    if (pcRows.length === 0) {
      return res.status(404).json({ message: 'ПК не найден' })
    }

    if (pcRows[0].status === 'busy') {
      return res.status(400).json({ message: 'ПК уже занят' })
    }

    await db.query(
      'UPDATE pcs SET status = "busy" WHERE id = ?',
      [pc_id]
    )

    await db.query(
      `INSERT INTO bookings (user_id, pc_id, start_time, end_time, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, pc_id, start_time, end_time]
    )

    res.json({ message: 'Бронь успешна', booked: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера при бронировании' })
  }
}

