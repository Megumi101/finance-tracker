// src/services/auth.service.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as authRepository from '../repositories/authRepository.js'

// ─── Helper: Validate email ───────────────────────────────────────────────────
const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

// ─── Helper: Hash password ────────────────────────────────────────────────────
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// ─── Helper: Compare passwords ────────────────────────────────────────────────
const comparePasswords = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// ─── Helper: Generate JWT token ───────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'fintrack_secret_key'

const generateToken = (userId) => {
  const token = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  return token
}

// ─── REGISTER: Create new user ────────────────────────────────────────────────
export const register = async ({ name, email, password }) => {
  // Validasi input
  if (!name || !email || !password) {
    const error = new Error('Nama, email, dan password wajib diisi')
    error.statusCode = 400
    throw error
  }

  if (name.trim().length < 3) {
    const error = new Error('Nama minimal 3 karakter')
    error.statusCode = 400
    throw error
  }

  if (!validateEmail(email)) {
    const error = new Error('Format email tidak valid')
    error.statusCode = 400
    throw error
  }

  if (password.length < 6) {
    const error = new Error('Password minimal 6 karakter')
    error.statusCode = 400
    throw error
  }

  // Cek email sudah terdaftar
  const existingUser = await authRepository.findUserByEmail(email)
  if (existingUser) {
    const error = new Error('Email sudah terdaftar')
    error.statusCode = 409
    throw error
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Buat user baru
  const user = await authRepository.createUser({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  })

  // Generate token
  const token = generateToken(user.id)

  return {
    token,
    user,
  }
}

// ─── LOGIN: Authenticate user ─────────────────────────────────────────────────
export const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email dan password wajib diisi')
    error.statusCode = 400
    throw error
  }

  // Cari user berdasarkan email
  const user = await authRepository.findUserByEmail(email.toLowerCase().trim())
  if (!user) {
    const error = new Error('Email atau password salah')
    error.statusCode = 401
    throw error
  }

  // Bandingkan password
  const isValidPassword = await comparePasswords(password, user.password)
  if (!isValidPassword) {
    const error = new Error('Email atau password salah')
    error.statusCode = 401
    throw error
  }

  // Generate token
  const token = generateToken(user.id)

  // Return tanpa password
  const { password: _, ...userWithoutPassword } = user

  return {
    token,
    user: userWithoutPassword,
  }
}

// ─── GET ME: Get current user data ────────────────────────────────────────────
export const getMe = async (userId) => {
  if (!userId) {
    const error = new Error('User ID tidak valid')
    error.statusCode = 400
    throw error
  }

  const user = await authRepository.findUserById(userId)
  if (!user) {
    const error = new Error('User tidak ditemukan')
    error.statusCode = 404
    throw error
  }

  return user
}
