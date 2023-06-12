const express=require('express')
const { UserModel } = require('../model/user.model')
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const { blacklist } = require('../blacklist')
require("dotenv").config()

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password ,age,city,is_married }=req.body
    try {
       bcrypt.hash(password,5,async(err,hash)=>{
        if(hash){
            const user=new UserModel({name,email,gender,password:hash,age,city,is_married})
           await user.save()
           res.status(200).json({msg:"user has been registered"})
        }
       })
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
               const token= jwt.sign({userID:user._id,user:user.name},process.env.secret,{
                expiresIn: '7days'
               })
                    res.status(200).json({msg:"Login succesful",token:token})
                }else{
                    res.status(200).json({msg:"Invalid credential!"})
                }
            })
        }else{
            res.status(200).json({msg:"user not found"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

userRouter.get("/logout",(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    try {
        if(token){
            blacklist.push(token)
            res.status(200).json({msg:"user logged out"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

module.exports={userRouter}