// src/controllers/userController.js
import * as userService from '../services/userService.js'

export const getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.userId)
    return res.status(200).json({
      message: 'Profil berhasil diambil',
      data: profile,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Nama dan email wajib diisi' })
    }

    const profile = await userService.updateProfile(req.userId, { name, email })
    return res.status(200).json({
      message: 'Profil berhasil diperbarui',
      data: profile,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const getSettings = async (req, res) => {
  try {
    const settings = await userService.getSettings(req.userId)
    return res.status(200).json({
      message: 'Pengaturan berhasil diambil',
      data: settings,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const updateSettings = async (req, res) => {
  try {
    const settings = await userService.updateSettings(req.userId, req.body)
    return res.status(200).json({
      message: 'Pengaturan berhasil diperbarui',
      data: settings,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}
