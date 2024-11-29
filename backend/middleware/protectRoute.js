import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const protectRoute = async(req, res, next)=>{
    try {
        const token = req.cookies['chat-app']

        if(!token) return res.status(403).json({message: 'No Token Provided'})

        const decoded =  jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) return res.status(403).json({message: 'Invalid or Expired Token'})

        const user = await User.findById(decoded.userId).select('-password')

        if(!user) return res.status(400).json({message: 'User Not Found'})

        req.user = user

        next()
    } catch (error) {
        console.log('Error In Protect Route Controller:', error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}