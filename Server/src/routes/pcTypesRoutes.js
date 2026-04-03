import express from 'express'
import { getPcTypes, getPcTypeById, getPcTypeWithPlaces } from '../controllers/pcTypesController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getPcTypes)
router.get('/:id', getPcTypeWithPlaces)

export default router
