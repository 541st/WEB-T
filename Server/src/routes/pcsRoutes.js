import express from 'express'
import { getAllPCs } from '../controllers/pcsController.js'
import { bookPC } from '../controllers/pcsController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getAllPCs)
router.post('/book', authMiddleware, bookPC)

export default router
