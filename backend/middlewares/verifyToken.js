import jwt from 'jsonwebtoken'



export const verifyToken = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if(!token) return res.status(401).json({success:false, message:"Unauthorized"})
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if(!decodedToken) return res.status(401).json({success:false, message:"Unauthorized - invalid token"})

        req.userId = decodedToken.userId

        next()
        
    } catch (err) {
        console.log("Error in verify token:", err);
        return res.status(500).json({ success:false, message: "Server error"})
    }
} 