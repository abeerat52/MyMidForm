const express = require("express")

const jwt = require("jsonwebtoken")

const { Post, postJoi, editJoi } = require("../model/post")
const { User } = require("../model/user")

const router = express.Router()



router.get("/posts/Public", async (req, res) => {
    try {


        const posts = await Post.find({ type: "Public" }).sort("-Date").populate("likes").populate("owner").populate({
      
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

router.post("/", async (req, res) => {
    try {
        const { description, image, type } = req.body

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

        const post = new Post({

            description,
            image,
            owner: req.userId,
            type,
        })


        await User.findByIdAndUpdate(req.userId, { $push: { posts: post._id } })


        await post.save()
        res.json(post)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { title, description, image, type } = req.body

        //check id
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid")
        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decryptToken.id


        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(404).json("user not found")
        req.userId = userId


        //validate
        const result = editJoi.validate(req.body)
        if (result.error) return res.status(404).json(result.error.details[0].message)

        //edit
        const post = await Post.findByIdAndUpdate
            (req.params.id,
                { $set: { title, description, image, type } },
                { new: true })

        if (!post) return res.status(404).json("post not found")
        if (post.owner != req.userId) return res.status(403).json("Unauthorized action")
        res.json(post)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})

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

//Likes
router.get("/:postId/likes", async (req, res) => {
    try {
        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decryptToken.id

        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(404).json("user not found")
        req.userId = userId

        //check(validate) id
        const id = req.params.postId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid object id")


        let post = await Post.findById(req.params.postId)
        if (!post) return res.status(404).json("post not found")

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
router.get("/:postId/comments", async (req, res) => {
    try {
        //check(validate) id
        const id = req.params.postId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid object id")

        const post = await Post.findById(req.params.postId)
        if (!post) return res.status(404).json("post not found")


    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
router.post("/:postId/comments", async (req, res) => {
    try {
        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decryptToken.id
        req.userId = userId


        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(404).json("user not found")


        //check id
        const id = req.params.postId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid object id")

        let post = await Post.findById(req.params._id)
        if (post) return res.status(404).json("post not found")

    
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})

module.exports = router