import { db } from '../config/db.js'

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = 3; 
    const offset = (page - 1) * limit;
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

    const [userRows] = await db.query(
      'SELECT id, email, name FROM users WHERE id = ?',
      [userId]
    )

    const [bookingRows] = await db.query(
      `SELECT 
        b.id, 
        b.status, 
        p.place_number,
        pt.title as type_title,
        DATE_FORMAT(b.start_time, '%Y-%m-%dT%H:%i') as start_time,
        DATE_FORMAT(b.end_time, '%Y-%m-%dT%H:%i') as end_time
       FROM bookings b
       JOIN pcs p ON b.pc_id = p.id
       JOIN pc_types pt ON p.pc_type_id = pt.id
       WHERE b.user_id = ?
       ORDER BY b.start_time DESC
       LIMIT ? OFFSET ?`, 
      [userId, limit, offset], 
    )

    res.json({
      user: userRows[0],
      bookings: bookingRows,
      hasMore: bookingRows.length === limit
    })
  } catch (err) {
    console.error('Ошибка в getProfile:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}