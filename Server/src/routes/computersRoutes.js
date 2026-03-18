import express from 'express'
import { getComputers } from '../controllers/computersController.js'
import { updateComputerStatus } from '../controllers/computersController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getComputers)
router.put('/:id/status', authMiddleware, updateComputerStatus)

export default router
