const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');

const messageSchema = new mongoose.Schema({
    MId:Number,
    sender_id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    message: String,
    receive_id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})

const messageJoi = (input) => Joi.object({
    message: Joi.string().min(1).max(1000).required(),
}).validate(input)

const Message = mongoose.model("Message", messageSchema)
module.exports= Message ;
module.exports.Message = Message
module.exports.messageJoi = messageJoi