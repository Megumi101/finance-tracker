// src/controllers/categoryController.js
import * as categoryService from '../services/categoryService.js'

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories(req.userId)
    return res.status(200).json({
      message: 'Data kategori berhasil diambil',
      data: categories,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params
    const category = await categoryService.getCategory(id, req.userId)
    return res.status(200).json({
      message: 'Data kategori berhasil diambil',
      data: category,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { nama, warna, emoji } = req.body

    if (!nama) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi' })
    }

    const category = await categoryService.createCategory(req.userId, {
      nama,
      warna,
      emoji,
    })

    return res.status(201).json({
      message: 'Kategori berhasil dibuat',
      data: category,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { nama, warna, emoji } = req.body

    if (!nama) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi' })
    }

    const category = await categoryService.updateCategory(req.userId, id, {
      nama,
      warna,
      emoji,
    })

    return res.status(200).json({
      message: 'Kategori berhasil diupdate',
      data: category,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    await categoryService.deleteCategory(req.userId, id)
    return res.status(200).json({ message: 'Kategori berhasil dihapus' })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const getCategoryStats = async (req, res) => {
  try {
    const stats = await categoryService.getCategoryStats(req.userId)
    return res.status(200).json({
      message: 'Statistik kategori berhasil diambil',
      data: stats,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}
