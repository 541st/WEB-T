import { db } from '../config/db.js'

export const getComputers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, specs, price_per_hour, status, place_number, image_url FROM computers ORDER BY place_number ASC'
    )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера при получении списка ПК' })
  }
}

export const updateComputerStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['free', 'busy'].includes(status)) {
      return res.status(400).json({ message: 'Некорректный статус' })
    }

    await db.query(
      'UPDATE computers SET status = ? WHERE id = ?',
      [status, id]
    )

    res.json({ message: 'Статус обновлён', id, status })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера при обновлении статуса' })
  }
}

