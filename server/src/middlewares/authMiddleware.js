// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fintrack_secret_key'

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token tidak ditemukan, silakan login' })
    }

    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    req.userId = decoded.userId
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, silakan login kembali' })
    }
    return res.status(401).json({ message: 'Token tidak valid' })
  }
}