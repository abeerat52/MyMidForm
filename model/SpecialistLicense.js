const { Schema, model } = require("mongoose");
const mongoose= require('mongoose');

const SpecialistLicense = new mongoose.Schema({
    description: String,
    image: String,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
})

const SpecialistLicenses = mongoose.model(" SpecialistLicenses", SpecialistLicense)

module.exports.SpecialistLicense =SpecialistLicense
module.exports=  SpecialistLicenses