
const express = require("express")
const jwt = require("jsonwebtoken")

const { commentJoi } = require("../model/comment")
const { drug, drugJoi } = require("../model/drugs")
const { User } = require("../model/user")
const { Comment } = require("../model/comment")
const router = express.Router()


router.get("/drugs/Public", async (req, res) => {
    try {
        const drugs = await drugs.find({ type: "Public" }).sort("-Date").populate("likes").populate("owner").populate({
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

        const result = drugJoi.validate(req.body)
        if (result.error) return res.status(404).json(result.error.details[0].message)

        const drug = new drug({

            description,
            image,
            owner: req.userId,
            type,
        })


        await User.findByIdAndUpdate(req.userId, { $push: { drugs: drug._id } })


        await drugs.save()
        res.json(drugs)

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
        const drugs = await drugs.findByIdAndUpdate
            (req.params.id,
                { $set: { title, description, image, type } },
                { new: true })

        if (!drugs) return res.status(404).json("drugs not found")
        if (drugs.owner != req.userId) return res.status(403).json("Unauthorized action")
        res.json(drugs)
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

        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(404).json("user not found")
        req.userId = userId


        //check id
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid")

        await Comment.deleteMany({ drugsId: req.params.id })
        const drugs = await drugs.findByIdAndRemove(req.params.id)
        if (!drugs) return res.status(404).json("drugs not found")
        if (drugs.owner != req.userId) return res.status(403).json("Unauthorized action")

        await User.findByIdAndUpdate(req.userId, { $pull: { drugs: drug._id } })

        res.json(drugs)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})

//Likes
router.get("/:drugsId/likes", async (req, res) => {
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
        const id = req.params.drugsId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("The path is not valid object id")


        let drugs = await drugs.findById(req.params.drugsId)
        if (!drugs) return res.status(404).json("drugs not found")

        const userFound = drugs.likes.find(like => like == req.userId)
        if (userFound) {
            await drugs.findByIdAndUpdate(req.params.drugsId, { $pull: { likes: req.userId } })
            await User.findByIdAndUpdate(req.userId, { $pull: { like: req.params.drugId } })
            res.json("remove like")
        } else {
            await drugs.findByIdAndUpdate(req.params.drugsId, { $push: { likes: req.userId } })
            await User.findByIdAndUpdate(req.userId, { $push: { like: req.params.drugId } })
            res.json("liked drugs")
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
//comment
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
router.post("/:drugId/comments", async (req, res) => {
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
        const newComment = new Comment({ comment, owner: req.userId, druger: req.params.drugId })
        await drug.findByIdAndUpdate(req.params.drugId, { $push: { comments: newComment._id } })

        await User.findByIdAndUpdate(req.userId, { $push: { comments: newComment._id } })



        await newComment.save()
        res.json(newComment)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
router.put("/:drugId/comments/commentId", async (req, res) => {
    try {
        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decryptToken.id

        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(404).json("user not found")

        let drug = await drug.findById(req.params._id)
        if (drug) return res.status(404).json("drug not found")

        //check(validate) id
        const drugId = req.params.drugId
        if (!mongoose.Types.ObjectId.isValid(drugId))
            return res.status(400).send("The path is not valid object id")

        //check(validate) id
        const commentId = req.params.commentId
        if (!mongoose.Types.ObjectId.isValid(commentId))
            return res.status(400).send("The path is not valid object id")

        //validate
        const result = commentJoi.validate(req.body)
        if (result.error) return res.status(404).json(result.error.details[0].message)



        const { comment } = req.body
        const commentFound = await Comment.findById(req.params._id)
        if (!commentFound) return res.status(404).json("comment not found")
        if (commentFound.owner != req.userId) return res.status(403).json("Unauthorized action")

        const updateComment = await Comment.findByIdAndUpdate(req.params.commentId, { $set: { comment } }, { new: true })
        await updateComment.save()
        res.json(updateComment)


    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
router.delete("/:drugId/comments/:commentId", async (req, res) => {
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


        if (commentFound.owner != req.userId) return res.status(403).json("unauthorized action")
        await drug.findByIdAndUpdate(req.params.drugId, { $pull: { comments: commentFound._id } })
        await Comment.findByIdAndRemove(req.params.commentId)
        res.json("comment deleted")
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
module.exports = router