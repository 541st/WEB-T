import { db } from '../config/db.js'

export const addLike = async (req, res) => {
  const userId = req.user.id
  const { pc_id } = req.body

  try {
    await db.query(
      'INSERT INTO likes (user_id, pc_id) VALUES (?, ?)',
      [userId, pc_id]
    )
    res.json({ liked: true })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.json({ liked: true }) // уже лайкнуто
    }
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}

export const removeLike = async (req, res) => {
  const userId = req.user.id
  const { pc_id } = req.body

  try {
    await db.query(
      'DELETE FROM likes WHERE user_id = ? AND pc_id = ?',
      [userId, pc_id]
    )
    res.json({ liked: false })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}

export const checkLike = async (req, res) => {
  const userId = req.user.id
  const { pc_id } = req.params

  const [rows] = await db.query(
    'SELECT id FROM likes WHERE user_id = ? AND pc_id = ?',
    [userId, pc_id]
  )

  res.json({ liked: rows.length > 0 })
}

export const getMyLikes = async (req, res) => {
  const userId = req.user.id

  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 3; 
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT 
         likes.pc_id,
         pcs.place_number,
         pcs.pc_type_id,
         pc_types.title AS type_title
       FROM likes
       JOIN pcs ON likes.pc_id = pcs.id
       JOIN pc_types ON pcs.pc_type_id = pc_types.id
       WHERE likes.user_id = ?
       LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    )

    res.json({
      likes: rows,
      hasMore: rows.length === limit
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера при получении лайков' })
  } 
  console.log('getMyLikes called, user:', req.user)
}

