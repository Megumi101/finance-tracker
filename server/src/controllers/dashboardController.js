// src/controllers/dashboardController.js
import * as transactionService from '../services/transactionService.js'
import * as categoryService from '../services/categoryService.js'

export const getDashboardSummary = async (req, res) => {
  try {
    const transactionStats = await transactionService.getTransactionStats(req.userId)
    const categoryStats = await categoryService.getCategoryStats(req.userId)

    return res.status(200).json({
      message: 'Dashboard summary berhasil diambil',
      data: {
        summaryMetrics: {
          totalSaldo: transactionStats.saldo,
          totalPemasukan: transactionStats.totalPemasukan,
          totalPengeluaran: transactionStats.totalPengeluaran,
          totalTabungan: 0, // calculated if needed
        },
        categories: categoryStats,
      },
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
}
