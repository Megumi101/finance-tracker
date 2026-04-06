// src/controllers/auth.controller.js
import * as authService from '../services/authService.js'

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' })
    }

    const result = await authService.register({ name, email, password })

    return res.status(201).json({
      message: 'Registrasi berhasil',
      data: result,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' })
    }

    const result = await authService.login({ email, password })

    return res.status(200).json({
      message: 'Login berhasil',
      data: result,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.userId)
    return res.status(200).json({ data: user })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}