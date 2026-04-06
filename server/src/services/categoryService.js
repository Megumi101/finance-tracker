// src/services/categoryService.js
import * as categoryRepository from '../repositories/categoryRepository.js'

// ─── Helper: Transform DB data to Frontend format ────────────────────────────
const transformCategory = (cat) => ({
  id: cat.id,
  nama: cat.name,
  emoji: cat.icon,
  warna: cat.color,
  deskripsi: `Kategori ${cat.name}`,
  totalTransaksi: cat.transactions?.length || 0,
  totalAmount: cat.transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
  bulan: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
  status: 'aktif',
})

export const getAllCategories = async (userId) => {
  const categories = await categoryRepository.findAllCategories(userId)
  return categories.map(transformCategory)
}

export const getCategory = async (id, userId) => {
  const category = await categoryRepository.findCategoryById(id, userId)
  if (!category) {
    const error = new Error('Kategori tidak ditemukan')
    error.statusCode = 404
    throw error
  }
  return transformCategory(category)
}

export const createCategory = async (userId, { nama, warna, emoji }) => {
  try {
    const category = await categoryRepository.createCategory(userId, {
      name: nama,
      color: warna,
      icon: emoji,
    })

    return transformCategory(category)
  } catch (err) {
    const error = new Error('Gagal membuat kategori: ' + err.message)
    error.statusCode = err.statusCode || 400
    throw error
  }
}

export const updateCategory = async (userId, id, { nama, warna, emoji }) => {
  try {
    const category = await categoryRepository.updateCategory(id, userId, {
      name: nama,
      color: warna,
      icon: emoji,
    })

    return transformCategory(category)
  } catch (err) {
    const error = new Error('Gagal mengupdate kategori: ' + err.message)
    error.statusCode = err.statusCode || 400
    throw error
  }
}

export const deleteCategory = async (userId, id) => {
  try {
    await categoryRepository.deleteCategory(id, userId)
  } catch (err) {
    const error = new Error('Gagal menghapus kategori: ' + err.message)
    error.statusCode = err.statusCode || 400
    throw error
  }
}

export const getCategoryStats = async (userId) => {
  const stats = await categoryRepository.getCategoryStats(userId)
  return stats.map(transformCategory)
}
