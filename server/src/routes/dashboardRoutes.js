// src/routes/dashboardRoutes.js
import { Router } from 'express'
import * as dashboardController from '../controllers/dashboardController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get dashboard summary
router.get('/summary', dashboardController.getDashboardSummary)

export default router
