const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');

const like = new mongoose.Schema({
    Id:Number,
   likeOrDisLike_id:Number,
   comment_id: {
        type: mongoose.Types.ObjectId,
        ref: "comment"
    }
})

const likes = mongoose.model("like", like)
module.exports= likes ;
module.exports.likes = like
