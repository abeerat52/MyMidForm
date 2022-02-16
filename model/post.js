const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');
const Joi = require("joi");
const { User } = require("./user");

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    owner: {
        type: mongoose.Types.ObjectId,
     //   ref: User.role["company"],
    },
      Date : {
        type : Date , 
        default : Date.now
    }
})
//add post
const postJoi = Joi.object({
    title: Joi.string().max(80),
    description: Joi.string().max(1000).required(),
    image: Joi.string().uri().allow(""),
})

const Post = mongoose.model("Post", postSchema)

module.exports.Post = Post
module.exports= Post
module.exports.postJoi = postJoi