const express = require("express")
const jwt = require("jsonwebtoken")

const { Post, postJoi, editJoi } = require("../model/post")
const { User } = require("../model/user")

const router = express.Router()
//viwe posts
router.get("/posts", async (req, res) => {
    try {


        const posts = await Post.find().sort("-Date").populate("owner").populate({
            populate: {
                path: "owner",
            },
        })
        res.json(posts)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
router.get("/:id", async (req, res) => {
    try {
        //check id
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid")


        const post = await Post.findById(req.params.id).populate({
         
            populate: {
                path: "username"
            }
        })
        if (!post) return res.status(404).json("post is not found")

        res.json(post)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
//add post
router.post("/", async (req, res) => {
    try {
        const { title, description, image } = req.body

        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")
    
        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decryptToken.id

        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(404).json("user not found")
        req.userId = userId

        const result = postJoi.validate(req.body)
        if (result.error) return res.status(404).json(result.error.details[0].message)
        if(User.role==Company){
        const post = new Post({
            title,
            description,
            image,
            owner: req.userId,
        
        })}

        await User.findByIdAndUpdate(req.userId, { $push: { posts: post._id } })

        await post.save()
        res.json(post)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
//delet post
router.delete("/:id", async (req, res) => {
    try {

        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decryptToken.id
        const mongoose= require('mongoose');

        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(404).json("user not found")
        req.userId = userId


        //check id
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid")
        await User.findByIdAndUpdate(req.userId, { $pull: { posts: post._id } })
        res.json(post)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})

module.exports = router