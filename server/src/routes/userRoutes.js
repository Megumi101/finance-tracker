// src/routes/userRoutes.js
import { Router } from 'express'
import * as userController from '../controllers/userController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Profile routes
router.get('/profile', userController.getProfile)
router.put('/profile', userController.updateProfile)

// Settings routes
router.get('/settings', userController.getSettings)
router.put('/settings', userController.updateSettings)

export default router
