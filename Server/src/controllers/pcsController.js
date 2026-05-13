import { db } from '../config/db.js'

export const getAllPCs = async (req, res) => {
  try {
    await db.query(`
      UPDATE bookings 
      SET status = 'finished' 
      WHERE status = 'active' AND end_time <= NOW()
    `);

    await db.query(`
      UPDATE pcs 
      SET status = 'free' 
      WHERE status = 'busy' 
      AND id NOT IN (
        SELECT pc_id FROM bookings 
        WHERE status = 'active' AND NOW() BETWEEN start_time AND end_time
      )
    `);

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

  // Получаем отдельное соединение из пула для работы с транзакцией
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let now = new Date()
    let start = new Date(start_time)
    
    // Проверка на бронирование в прошлом
    if (start < new Date(now.getTime() - 2 * 60 * 1000)) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: 'Нельзя бронировать в прошлом' })
    }

    const [overlap] = await connection.query(
      `SELECT id FROM bookings 
       WHERE pc_id = ? 
       AND status = 'active'
       AND start_time < ? 
       AND end_time > ?
       FOR UPDATE`,
      [pc_id, end_time, start_time] 
    )

    if (overlap.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({ 
        message: 'Это время уже занято другой бронью. Пожалуйста, выберите другое время.' 
      })
    }

    await connection.query(
      `INSERT INTO bookings (user_id, pc_id, start_time, end_time, status, created_at)
       VALUES (?, ?, ?, ?, 'active', NOW())`,
      [userId, pc_id, start_time, end_time]
    )

    now = new Date();
    start = new Date(start_time);
    const end = new Date(end_time);

    if (now >= start && now <= end) {
      await connection.query('UPDATE pcs SET status = "busy" WHERE id = ?', [pc_id]);
    }

    await connection.commit();
    
    res.json({ message: 'Бронь успешна', booked: true })
  } catch (err) {
    await connection.rollback();
    console.error('Ошибка при транзакции бронирования:', err)
    res.status(500).json({ message: 'Ошибка сервера при бронировании' })
  } finally {
    connection.release();
  }
}