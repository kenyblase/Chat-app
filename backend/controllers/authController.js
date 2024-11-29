import genTokenAndSetCookie from '../lib/genTokenAndSetCookie.js'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'

export const Signup = async(req, res) => {
  const {fullName, email, password} = req.body

  try {
    if(!fullName || !email || !password) return res.status(400).json({message: 'Please Fill In All Fields'})

    if(password.length < 6) return res.status(400).json({message: 'Password Must Be At Least 6 Characters'})

    const user = await User.findOne({email})

    if(user) return res.status(400).json({message: 'Email Already Exists'})

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    })

    genTokenAndSetCookie(newUser._id, res)

    await newUser.save()

    res.status(201).json({
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic
    })
  } catch (error) {
    console.log('Error In Signup Controller:', error.message)
    res.status(500).json({message: 'Internal Server Error'})
  }
}

export const Login = async(req, res) => {
    const {email, password} = req.body
    
    try {
        if(!email || !password) return res.status(400).json({message: 'Please Fill In All Fields'})
    
        const user = await User.findOne({email})

        if(!user) return res.status(400).json({message: 'Invalid Credentials'})
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) return res.status(400).json({message: 'Invalid Credentials'})
            
        genTokenAndSetCookie(user._id, res)
    
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
     console.log('Error In Logout Controller:', error)
     res.status(500).json({message: 'Internal Server Error'})
    }
}

export const Logout = async(req, res) => {
    try {
        res.clearCookie('chat-app')
        res.status(200).json({message:'Logged Out Sucessfully'})
    } catch (error) {
        console.log('Error In Logout Controller:', error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}

export const updateProfile = async(req, res)=>{
    try {
        const {profilePic} = req.body
        const userId = req.user._id
    
        if(!profilePic) return res.status(400).json({message: 'Profile Picture Is Required'})
    
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true})
    
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log('Error In updateProfile Controller:', error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const checkAuth = (req, res)=>{
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        console.log('Error In checkAuth Controller:', error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
}