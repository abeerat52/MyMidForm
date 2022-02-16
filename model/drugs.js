const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');
const Joi = require("joi")

const drugSchema = new mongoose.Schema({
    Name: String,
    description: String,
    termOfUse: String,
    image: String,
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "comment"
    }],
    rate:[{
        type: mongoose.Types.ObjectId,
        ref:"rate" 
    }],
})

const drugJoi = Joi.object({
    Name: Joi.string().max(80),
    description: Joi.string().max(1000).required(),
    image: Joi.string().uri().allow("")
})
const editJoi = Joi.object({
    Name: Joi.string().max(80),
    description: Joi.string().max(1000),
    image: Joi.string().uri().allow("")
})

const drug = mongoose.model("drug", drugSchema)

module.exports.drug = drug
module.exports= drug
module.exports.drugJoi = drugJoi
module.exports.editJoi = editJoi