// src/routes/transactionRoutes.js
import { Router } from 'express'
import * as transactionController from '../controllers/transactionController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get all transactions
router.get('/', transactionController.getAllTransactions)

// Get transaction stats
router.get('/stats/summary', transactionController.getTransactionStats)

// Get single transaction
router.get('/:id', transactionController.getTransaction)

// Create transaction
router.post('/', transactionController.createTransaction)

// Update transaction
router.put('/:id', transactionController.updateTransaction)

// Delete transaction
router.delete('/:id', transactionController.deleteTransaction)

export default router
