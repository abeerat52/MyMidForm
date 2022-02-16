const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');
const Joi = require("joi")

const comment = new mongoose.Schema({
   Drug_Id:Number,
   comment: {
        type: mongoose.Types.ObjectId,
        ref: "comment"
    },
     owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
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
module.exports.comment = comments
module.exports.commentJoi  = commentJoi 
