import { db } from '../config/db.js'
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
  try {
    const { email, password, name, keyword } = req.body

    if (!email || !password || !name || !keyword) {
      return res.status(400).json({ message: 'Заполните все поля' })
    }

    // есть ли юзер
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Пользователь уже существует' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const keywordHash = await bcrypt.hash(keyword, 10)

    // + в таблицу
    await db.query(
      `INSERT INTO users (email, password_hash, keyword, name, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [email, passwordHash, keywordHash, name]
    )

    res.status(201).json({ message: 'Регистрация успешна' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
