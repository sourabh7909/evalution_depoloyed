
const { PostModel } = require("../model/post.model")
const { Auth } = require("../middleware/Auth")

const express=require("express")

const postRouter=express.Router()

 postRouter.use(Auth)
postRouter.post("/add",async(req,res)=>{
    const {title,body,device,no_of_comments }=req.body
    try {
        const post=new PostModel(req.body)
        await post.save()
        res.status(200).json({msg:"new post has been created",post:req.body})
    } catch (error) {
        res.status(400),json({error:error.message})
    }
})

postRouter.get("/",async(req,res)=>{
    const query=req.query
    try {
        const post=await PostModel.find({userID:req.body.userID})
        res.status(200).json({msg:"all users potes",All_post:post})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.patch("/update/:postID",async(req,res)=>{
    const userIdInUserDoc=req.body.userID
    const {postID}=req.params
    try {
        const post=await PostModel.findOne({_id:postID})
        const postIdInPostDoc=post.userID
        if(userIdInUserDoc===postIdInPostDoc){
            await PostModel.findByIdAndUpdate({_id:postID},req.body)
            res.status(200).json({msg:`${post.title} has been updated`})
        }else{
            res.status(400).json({msg:`Not Authorized`})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.delete("/delete/:postID",async(req,res)=>{
    const userIdInUserDoc=req.body.userID
    const {postID}=req.params
    try {
        const post=await PostModel.findOne({_id:postID})
        const postIdInPostDoc=post.userID
        if(userIdInUserDoc===postIdInPostDoc){
            await PostModel.findByIdAndDelete({_id:postID})
            res.status(200).json({msg:`${post.title} has been Deleted`})
        }else{
            res.status(400).json({msg:`Not Authorized`})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})


module.exports={postRouter}