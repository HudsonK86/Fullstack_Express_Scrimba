import express from 'express'
import { register, login, getProfile } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

export const authRouter = express.Router()

// Public routes (no authentication required)
authRouter.post('/register', register)
authRouter.post('/login', login)

// Protected route (requires authentication)
// authenticateToken middleware runs before getProfile
authRouter.get('/profile', authenticateToken, getProfile)
