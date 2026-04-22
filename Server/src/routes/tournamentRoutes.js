import express from 'express'
import { getTournaments } from '../controllers/tournamentController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getTournaments)

export default router
