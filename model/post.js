const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
      Date : {
        type : Date , 
        default : Date.now
    }
})

const Post = mongoose.model("Post", postSchema)

module.exports.Post = Post
module.exports= Post