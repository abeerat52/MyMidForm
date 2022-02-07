const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');

const drugSchema = new mongoose.Schema({
    drugId:Number,
    Name: String,
    description: String,
    termOfUse: String,
    image: String,
    
})

const drug = mongoose.model("drug", drugSchema)

module.exports.drug = drug
module.exports= drug