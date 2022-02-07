const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');

const comment = new mongoose.Schema({
    Id:Number,
   Drug_id:Number,
   comment_id: {
        type: mongoose.Types.ObjectId,
        ref: "comment"
    },
     owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
     Date : {
        type : Date , 
        default : Date.now
    }
})

const commentJoi = (input) => Joi.object({
    comment: Joi.string().min(1).max(200).required(),
}).validate(input)


const comments = mongoose.model("comment", comment)
module.exports= comment ;
module.exports.comment = comment
module.exports.commentJoi  = commentJoi 
