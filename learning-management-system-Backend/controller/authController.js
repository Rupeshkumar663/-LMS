import User from "../model/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"

export const signUp=async(req,res)=>{
    try{
        const{name,email,password,role}=req.body
        let existUser=await User.findOneAndDelete({email})
        if(existUser){
          return res.status(400).json({message:"User is already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter valid email"})
        }
        if(password.length<8){
            return res.status(400).json({message:"Enter Strong password"})
        }
        let hashpassword=await bcrypt.hash(password,10)
        const user=await user.create({
            name,
            email,
            password:hashpassword,
            role
        })
        let token=await genToken(user._id)
          res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:7 * 24 * 60 * 60 * 1000
          })
        return res.status(201).json(user)
    }catch(error){
        return res.status(500).json({message:`signUp error ${error}`})
     }
}

export const login=async(req,res)=>{
  try{
      const{email,password}=req.body
      let user=await User.findOne({email})
      if(!user){
      return res.status(404).json({message:"user not found"})
      }
    let isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
      return  res.status(400).json({message:"incorrect password"})
      }
           let token=await genToken(user._id)
           res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:7 * 24 * 60 * 60 * 1000
          })
        return res.status(200).json(user)
    }
      catch(error){
        return res.status(500).json({message:`Login error ${error}`})
     }
  
}

export const logOut=async(req,res)=>{
  try{
   await res.clearcookie("token")
    return res.status(200).json({message:"LogOut Successfully"})
  }catch{
      return res.status(500).json({message:`LogOut error ${error}`})
  }
}