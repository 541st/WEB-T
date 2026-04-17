import { db } from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Заполните все поля' })
    }

    // Ищем юзера
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Неверный email или пароль' })
    }

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' })
    }

    // Создаём токен
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, keyword, newPassword } = req.body

    if (!email || !keyword || !newPassword) {
      return res.status(400).json({ message: 'Заполните все поля' })
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const user = rows[0]

    const isKeywordMatch = await bcrypt.compare(keyword, user.keyword)

    if (!isKeywordMatch) {
      return res.status(401).json({ message: 'Неверное кодовое слово' })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    await db.query(
      'UPDATE users SET password_hash = ? WHERE id = ?', 
      [newPasswordHash, user.id]
    )

    res.json({ message: 'Пароль успешно изменен' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}