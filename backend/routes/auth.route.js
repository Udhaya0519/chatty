import express from 'express'
import { checkAuth, login, logout, signup } from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'



const authRoutes = express.Router()


authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.get('/check-auth', verifyToken, checkAuth)



export default authRoutes
