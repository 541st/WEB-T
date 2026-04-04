import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { addLike, removeLike, checkLike, getMyLikes } from '../controllers/likesController.js'

const router = express.Router()

router.post('/', authMiddleware, addLike)
router.delete('/', authMiddleware, removeLike)
router.get('/my', authMiddleware, getMyLikes)
router.get('/:pc_id', authMiddleware, checkLike)

export default router