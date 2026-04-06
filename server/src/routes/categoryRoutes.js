// src/routes/categoryRoutes.js
import { Router } from 'express'
import * as categoryController from '../controllers/categoryController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get all categories
router.get('/', categoryController.getAllCategories)

// Get category stats
router.get('/stats/summary', categoryController.getCategoryStats)

// Get single category
router.get('/:id', categoryController.getCategory)

// Create category
router.post('/', categoryController.createCategory)

// Update category
router.put('/:id', categoryController.updateCategory)

// Delete category
router.delete('/:id', categoryController.deleteCategory)

export default router
