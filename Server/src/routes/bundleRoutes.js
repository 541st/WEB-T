import express from 'express'
import { getAllBundles } from '../controllers/bundleController.js'

const router = express.Router()

router.get('/', getAllBundles)

export default router