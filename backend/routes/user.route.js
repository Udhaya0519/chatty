import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { getMessages, getUsersForSidebar, sendMessage, updateProfilePic } from '../controllers/user.controller.js'
import upload from '../config/multer.js'


const userRoutes = express.Router()

userRoutes.put('/update-profile',upload.single('profilePic') , verifyToken, updateProfilePic)
userRoutes.get('/users', verifyToken, getUsersForSidebar)
userRoutes.get('/:id', verifyToken, getMessages)
userRoutes.post('/send/:id',  upload.single("image"), verifyToken, sendMessage)


export default userRoutes