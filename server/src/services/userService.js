// src/services/userService.js
import prisma from '../config/prisma.js'

// ─── Helper: Transform user data ────────────────────────────────────────────
const transformUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
})

const transformSettings = (settings) => ({
  notifTransaksi: settings?.notifTransaksi || false,
  notifLaporan: settings?.notifLaporan || false,
  notifBudget: settings?.notifBudget || false,
})

// ─── Profile operations ────────────────────────────────────────────────────
export const getProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })
    
    if (!user) {
      const error = new Error('User tidak ditemukan')
      error.statusCode = 404
      throw error
    }

    return transformUser(user)
  } catch (err) {
    if (!err.statusCode) {
      const error = new Error('Gagal mengambil profil: ' + err.message)
      error.statusCode = 500
      throw error
    }
    throw err
  }
}

export const updateProfile = async (userId, { name, email }) => {
  try {
    // Check if email is already in use by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: userId }
        }
      })
      
      if (existingUser) {
        const error = new Error('Email sudah digunakan')
        error.statusCode = 400
        throw error
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return transformUser(user)
  } catch (err) {
    if (!err.statusCode) {
      const error = new Error('Gagal memperbarui profil: ' + err.message)
      error.statusCode = 500
      throw error
    }
    throw err
  }
}

// ─── Settings operations ───────────────────────────────────────────────────
export const getSettings = async (userId) => {
  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    })

    if (!settings) {
      // Create default settings if doesn't exist
      const newSettings = await prisma.userSettings.create({
        data: {
          userId,
          notifTransaksi: false,
          notifLaporan: false,
          notifBudget: false,
        },
      })
      return transformSettings(newSettings)
    }

    return transformSettings(settings)
  } catch (err) {
    const error = new Error('Gagal mengambil pengaturan: ' + err.message)
    error.statusCode = 500
    throw error
  }
}

export const updateSettings = async (userId, data) => {
  try {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        notifTransaksi: data.notifTransaksi || false,
        notifLaporan: data.notifLaporan || false,
        notifBudget: data.notifBudget || false,
      },
      update: {
        notifTransaksi: data.notifTransaksi,
        notifLaporan: data.notifLaporan,
        notifBudget: data.notifBudget,
      },
    })

    return transformSettings(settings)
  } catch (err) {
    const error = new Error('Gagal memperbarui pengaturan: ' + err.message)
    error.statusCode = 500
    throw error
  }
}
