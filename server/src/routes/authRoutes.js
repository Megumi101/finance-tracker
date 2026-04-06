// src/routes/auth.routes.js
import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

// Public
router.post('/register', authController.register)
router.post('/login',    authController.login)

// Protected
router.get('/me', authenticate, authController.getMe)

export default router