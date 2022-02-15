const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');

const rate = new mongoose.Schema({
   
   rate:Number,
   drug: {
        type: mongoose.Types.ObjectId,
        ref: "drug"
    },
      createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
})

const rates = mongoose.model("rate", rate)
module.exports= rate ;
module.exports.rate = rate
