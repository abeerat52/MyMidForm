const express = require("express")
const jwt = require("jsonwebtoken")
const { comment,commentJoi } = require("../model/comment")
const { drug, drugJoi } = require("../model/drugs")
const { rate } = require("../model/rate")
const { User } = require("../model/user")
const router = express.Router()

//viwe drug
router.get("/drugs", async (req, res) => {
    try {
        const drugs = await drugs.find().sort("-Date").populate({
            path: "comments",
            populate: {
                path: "owner",
            },
        })
        res.json(drugs)
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


        const drugs = await drugs.findById(req.params.id).populate({
            path: "likes",
            populate: {
                path: "username"
            }
        }).populate("owner").populate("comments").populate({
            path: "comments",
            populate: {
                path: "owner",
            },
        })
        if (!drugs) return res.status(404).json("drugs is not found")
        res.json(drugs)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
// add drug
router.post("/", async (req, res) => {
    try {
        const { description, image, type } = req.body

        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const UserId = decryptToken.id

        const User = await User.findById(UserId).select("-password")
        if (!User) return res.status(404).json("User not found")
        req.UserId = UserId

        const result = drugJoi.validate(req.body)
        if (result.error) return res.status(404).json(result.error.details[0].message)

        const drugs = new drugs({

            description,
            image,
            owner: req.UserId,
            type,
        })


        await User.findByIdAndUpdate(req.UserId, { $push: { drugs: drug._id } })


        await drugs.save()
        res.json(drugs)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
//edit drug 
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
        const UserId = decryptToken.id


        const User = await User.findById(UserId).select("-password")
        if (!User) return res.status(404).json("User not found")
        req.UserId = UserId


        //validate
        const result = editJoi.validate(req.body)
        if (result.error) return res.status(404).json(result.error.details[0].message)

        //edit
        const drugs = await drugs.findByIdAndUpdate
            (req.params.id,
                { $set: { title, description, image, type } },
                { new: true })

        if (!drugs) return res.status(404).json("drugs not found")
        if (drugs.owner != req.UserId) return res.status(403).json("Unauthorized action")
        res.json(drugs)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
// delet drug
router.delete("/:id", async (req, res) => {
    try {

        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const UserId = decryptToken.id

        const User = await User.findById(UserId).select("-password")
        if (!User) return res.status(404).json("User not found")
        req.UserId = UserId


        //check id
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid")

        await Comment.deleteMany({ drugsId: req.params.id })
        const drugs = await drugs.findByIdAndRemove(req.params.id)
        if (!drugs) return res.status(404).json("drugs not found")
        if (drugs.owner != req.UserId) return res.status(403).json("Unauthorized action")

        await User.findByIdAndUpdate(req.UserId, { $pull: { drugs: drug._id } })

        res.json(drugs)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})



////////////////////////////////////////////////////////////////////////////////////



//viwe comments
router.get("/:drugsId/comments", async (req, res) => {
    try {
        //check(validate) id
        const id = req.params.drugId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid object id")

        const drug = await drug.findById(req.params.drugId)
        if (!drug) return res.status(404).json("drug not found")

        const comments = await Comment.find({ drugId: req.params.drugId }).populate("owner")
        res.json(comments)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
 // add comment
router.post("/:drugId/comments", async (req, res) => {
    try {
        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const UserId = decryptToken.id
        req.UserId = UserId


        const User = await User.findById(UserId).select("-password")
        if (!User) return res.status(404).json("User not found")


        //check id
        const id = req.params.drugId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid object id")

        let drug = await drug.findById(req.params._id)
        if (drug) return res.status(404).json("drug not found")

        //validate
        const result = commentJoi.validate(req.body)
        if (result.error) return res.status(404).json(result.error.details[0].message)

        //requset body comment
        const { comment } = req.body

        //create comment 
        const newComment = new Comment({ comment, owner: req.UserId, druger: req.params.drugId })
        await drug.findByIdAndUpdate(req.params.drugId, { $push: { comments: newComment._id } })

        await User.findByIdAndUpdate(req.UserId, { $push: { comments: newComment._id } })



        await newComment.save()
        res.json(newComment)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
//delet comment 
router.delete("/:drugId/comments/:commentId", async (req, res) => {
    try {
        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const UserId = decryptToken.id
        req.UserId = UserId

        const User = await User.findById(UserId).select("-password")
        if (!User) return res.status(404).json("User not found")

        //check id
        const drugId = req.params.drugId
        if (!mongoose.Types.ObjectId.isValid(drugId))
            return res.status(400).send("The path is not valid object id")

        //check id
        const commentId = req.params.commentId
        if (!mongoose.Types.ObjectId.isValid(commentId))
            return res.status(400).send("The path is not valid object id")

        let drug = await drug.findById(req.params._id)
        if (drug) return res.status(404).json("drug not found")




        const commentFound = await Comment.findById(req.params.commentId)
        if (!commentFound) return res.status(404).json("comment not found")


        if (commentFound.owner != req.UserId) return res.status(403).json("unauthorized action")
        await drug.findByIdAndUpdate(req.params.drugId, { $pull: { comments: commentFound._id } })
        await Comment.findByIdAndRemove(req.params.commentId)
        res.json("comment deleted")
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
//Likes
router.get("/:commentId/dislikes", async (req, res) => {
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
        const id = req.params.commentId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid object id")


        let comment = await comment.findById(req.params.commentId)
        if (!comment) return res.status(404).json("comment not found")

        const userFound = comment.dislikes.find(dislike => dislike == req.userId)
        if (userFound) {
            await comment.findByIdAndUpdate(req.params.commentId, { $pull: { dislikes: req.userId } })
            await User.findByIdAndUpdate(req.userId, { $pull: { dislike: req.params.commentId } })
            res.json("remove dislike")
        } else {
            await comment.findByIdAndUpdate(req.params.commentId, { $push: { dislikes: req.userId } })
            await User.findByIdAndUpdate(req.userId, { $push: { dislike: req.params.commentId } })
            res.json("disliked comment")
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})

router.get("/:commentId/dislikes", async (req, res) => {
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
        const id = req.params.commentId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid object id")


        let comment = await comment.findById(req.params.commentId)
        if (!comment) return res.status(404).json("comment not found")

        const userFound = comment.disliks.find(dislik => dislik == req.userId)
        if (userFound) {
            await comment.findByIdAndUpdate(req.params.commentId, { $pull: { disliks: req.userId } })
            await User.findByIdAndUpdate(req.userId, { $pull: { dislik: req.params.commentId } })
            res.json("remove dislik")
        } else {
            await comment.findByIdAndUpdate(req.params.commentId, { $push: { disliks: req.userId } })
            await User.findByIdAndUpdate(req.userId, { $push: { dislik: req.params.commentId } })
            res.json("dislikd comment")
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
module.exports = router