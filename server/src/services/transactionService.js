// src/services/transactionService.js
import * as transactionRepository from '../repositories/transactionRepository.js'
import * as categoryRepository from '../repositories/categoryRepository.js'
import prisma from '../config/prisma.js'

// ─── Helper: Transform DB data to Frontend format ────────────────────────────
const transformTransaction = (t) => ({
  id: t.id,
  nama: t.description || 'Transaksi',
  jumlah: t.amount,
  tipe: t.type === 'INCOME' ? 'masuk' : 'keluar',
  kategori: t.category?.name || 'Tanpa Kategori',
  tanggal: t.date?.toISOString?.() || new Date(t.date).toISOString(),
  catatan: '',
  status: 'berhasil',
  createdAt: t.createdAt,
})

export const getAllTransactions = async (userId) => {
  const transactions = await transactionRepository.findAllTransactions(userId)
  return transactions.map(transformTransaction)
}

export const getTransaction = async (id, userId) => {
  const transaction = await transactionRepository.findTransactionById(id, userId)
  if (!transaction) {
    const error = new Error('Transaksi tidak ditemukan')
    error.statusCode = 404
    throw error
  }
  return transformTransaction(transaction)
}

export const createTransaction = async (userId, { nama, jumlah, tipe, deskripsi, tanggal, kategori }) => {
  try {
    // Validasi categoryId jika ada - cari kategori dengan userId 
    let categoryId = null
    if (kategori) {
      const category = await prisma.category.findFirst({
        where: { 
          id: kategori,
          userId: userId // Pastikan kategori milik user ini
        },
      })
      
      if (category) {
        categoryId = kategori
      }
      // Jika kategori tidak ditemukan, categoryId tetap null (transaksi tetap bisa dibuat tanpa kategori)
    }

    const transaction = await transactionRepository.createTransaction(userId, {
      amount: jumlah,
      type: tipe === 'masuk' ? 'INCOME' : 'EXPENSE',
      description: deskripsi,
      date: tanggal,
      categoryId: categoryId,
    })

    return transformTransaction(transaction)
  } catch (err) {
    const error = new Error('Gagal membuat transaksi: ' + err.message)
    error.statusCode = err.statusCode || 400
    throw error
  }
}

export const updateTransaction = async (userId, id, { nama, jumlah, tipe, deskripsi, tanggal, kategori }) => {
  try {
    // Validasi categoryId jika ada - cari kategori dengan userId 
    let categoryId = null
    if (kategori) {
      const category = await prisma.category.findFirst({
        where: { 
          id: kategori,
          userId: userId // Pastikan kategori milik user ini
        },
      })
      
      if (category) {
        categoryId = kategori
      }
      // Jika kategori tidak ditemukan, categoryId tetap null
    }

    const transaction = await transactionRepository.updateTransaction(id, userId, {
      amount: jumlah,
      type: tipe === 'masuk' ? 'INCOME' : 'EXPENSE',
      description: deskripsi,
      date: tanggal,
      categoryId: categoryId,
    })

    return transformTransaction(transaction)
  } catch (err) {
    const error = new Error('Gagal mengupdate transaksi: ' + err.message)
    error.statusCode = err.statusCode || 400
    throw error
  }
}

export const deleteTransaction = async (userId, id) => {
  try {
    await transactionRepository.deleteTransaction(id, userId)
  } catch (err) {
    const error = new Error('Gagal menghapus transaksi: ' + err.message)
    error.statusCode = err.statusCode || 400
    throw error
  }
}

export const getTransactionStats = async (userId) => {
  const transactions = await transactionRepository.findAllTransactions(userId)

  const stats = {
    totalPemasukan: 0,
    totalPengeluaran: 0,
    countPemasukan: 0,
    countPengeluaran: 0,
  }

  transactions.forEach(t => {
    if (t.type === 'INCOME') {
      stats.totalPemasukan += t.amount
      stats.countPemasukan++
    } else {
      stats.totalPengeluaran += t.amount
      stats.countPengeluaran++
    }
  })

  stats.saldo = stats.totalPemasukan - stats.totalPengeluaran

  return stats
}
