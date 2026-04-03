import { db } from '../config/db.js'

export const getPcTypes = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, specs, price_per_hour, image_url, created_at FROM pc_types ORDER BY id ASC'
    )

    res.json(rows)
  } catch (err) {
    console.error('Ошибка при получении типов ПК:', err)
    res.status(500).json({ message: 'Ошибка сервера при получении типов ПК' })
  }
}

export const getPcTypeById = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(
      'SELECT id, title, specs, price_per_hour, image_url, created_at FROM pc_types WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Тип ПК не найден' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error('Ошибка при получении типа ПК:', err)
    res.status(500).json({ message: 'Ошибка сервера при получении типа ПК' })
  }
}

export const getPcTypeWithPlaces = async (req, res) => {
  try {
    const { id } = req.params

    const [types] = await db.query(
      'SELECT id, title, specs, price_per_hour, image_url FROM pc_types WHERE id = ?',
      [id]
    )

    if (types.length === 0) {
      return res.status(404).json({ message: 'Тип ПК не найден' })
    }

    const pcType = types[0]

    const [places] = await db.query(
      'SELECT id, place_number, status FROM pcs WHERE pc_type_id = ? ORDER BY place_number ASC',
      [id]
    )

    res.json({
      ...pcType,
      places
    })

  } catch (err) {
    console.error('Ошибка при получении типа ПК:', err)
    res.status(500).json({ message: 'Ошибка сервера при получении типа ПК' })
  }
}
