import bcryptjs from 'bcryptjs'
import { User } from '../models/user.model.js'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'


export const signup = async (req, res) => {
    try {
        const {email, fullName ,password} = req.body

        if(!email || !fullName || !password){
            return res.status(400).json({success: false, message: "Please provide all fields"})
        }

        const userExists = await User.findOne({ email })

        if(userExists){
            return res.status(400).json({success: false, message: "User Already Exists"})
        } 

        const hashedPassword = await bcryptjs.hash(password, 10)

        const user = await User.create({
            email,
            fullName,
            password: hashedPassword
        })

        await generateTokenAndSetCookie(res, user._id)

        res.status(201).json({success: true, message: "Account created successfully", user: {...user._doc, password: undefined}})
        
    } catch (err) {
        console.log("Error Signing up", err);
        res.status(500).json({ success:false, message:"Server Error"})
    }
}


export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({success: false, message: "Please provide all fields"})
        }

        const user = await User.findOne({ email })
        
        if(!user){
            return res.status(400).json({success: false, message: "Invalid credentials"})
        }

        const isCorrectPassword = await bcryptjs.compare(password, user.password)

        if(!isCorrectPassword){
            return res.status(400).json({success: false, message: "Incorrect Password"})
        }

        await generateTokenAndSetCookie(res, user._id)

        res.status(200).json({success: true, message: "Logged in successfully", user: {...user._doc, password: undefined}})

    } catch (err) {
        console.log("Error Logging in", err);
        res.status(500).json({ success:false, message:"Server Error"})
    }
}


export const logout = async (req, res) => {
    try {

        res.cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(0)
        })

        res.json({success:true, message:"logged out successfully"})

        
    } catch (err) {
        console.log("Error logout", err);
        res.status(500).json({ success:false, message:"Server Error"})
    }
}

export const checkAuth = async (req, res) => {
    try {
        const {userId} = req

        const user = await User.findById(userId).select("-password")

        res.status(200).json({success: true, user})
        
    } catch (err) {
        console.log("Error checking auth", err);
        res.status(500).json({ success:false, message:"Server Error"})
    }
}