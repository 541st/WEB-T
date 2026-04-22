import { db } from '../config/db.js'

export const getTournaments = async (req, res) => {
  try {
    const { discipline, format, sort } = req.query;
    let sql = 'SELECT * FROM tournaments WHERE 1=1';
    const params = [];

    if (discipline) {
      sql += ' AND discipline = ?';
      params.push(discipline);
    }
    if (format) {
      sql += ' AND format = ?';
      params.push(format);
    }

    if (sort === 'new') sql += ' ORDER BY id DESC';
    else if (sort === 'prize_desc') sql += ' ORDER BY CAST(prize_pool AS UNSIGNED) DESC';
    
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};