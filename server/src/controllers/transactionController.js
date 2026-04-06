// src/controllers/transactionController.js
import * as transactionService from '../services/transactionService.js'

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions(req.userId)
    return res.status(200).json({
      message: 'Data transaksi berhasil diambil',
      data: transactions,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params
    const transaction = await transactionService.getTransaction(id, req.userId)
    return res.status(200).json({
      message: 'Data transaksi berhasil diambil',
      data: transaction,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const createTransaction = async (req, res) => {
  try {
    const { nama, jumlah, tipe, deskripsi, tanggal, kategori } = req.body

    if (!nama || !jumlah || !tipe) {
      return res.status(400).json({ message: 'Nama, jumlah, dan tipe wajib diisi' })
    }

    const transaction = await transactionService.createTransaction(req.userId, {
      nama,
      jumlah: parseFloat(jumlah),
      tipe,
      deskripsi,
      tanggal,
      kategori,
    })

    return res.status(201).json({
      message: 'Transaksi berhasil dibuat',
      data: transaction,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params
    const { nama, jumlah, tipe, deskripsi, tanggal, kategori } = req.body

    if (!nama || !jumlah || !tipe) {
      return res.status(400).json({ message: 'Nama, jumlah, dan tipe wajib diisi' })
    }

    const transaction = await transactionService.updateTransaction(req.userId, id, {
      nama,
      jumlah: parseFloat(jumlah),
      tipe,
      deskripsi,
      tanggal,
      kategori,
    })

    return res.status(200).json({
      message: 'Transaksi berhasil diupdate',
      data: transaction,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params
    await transactionService.deleteTransaction(req.userId, id)
    return res.status(200).json({ message: 'Transaksi berhasil dihapus' })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export const getTransactionStats = async (req, res) => {
  try {
    const stats = await transactionService.getTransactionStats(req.userId)
    return res.status(200).json({
      message: 'Statistik transaksi berhasil diambil',
      data: stats,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}
