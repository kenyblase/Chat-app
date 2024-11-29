import express from 'express'
import { checkAuth, Login, Logout, Signup, updateProfile } from '../controllers/authController.js'
import {protectRoute} from '../middleware/protectRoute.js'

const router = express.Router()

router.post('/signup', Signup)

router.post('/login', Login)

router.post('/logout', Logout)

router.put('/update-profile', protectRoute, updateProfile)

router.get('/check', protectRoute, checkAuth)

export default router