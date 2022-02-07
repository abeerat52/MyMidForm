const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');

const rate = new mongoose.Schema({
    Id:Number,
   rate:Number,
   drug_id: {
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
