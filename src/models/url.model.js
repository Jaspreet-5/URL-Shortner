const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortCode :{
        type : String,
        index : true,
        required : [true , "shortURL is required"],
        unique : [true , "shortURL must be unique"]
    },

    originalURL : {
        type : String,
        required : [true,"orgURL is required"],
    },

    clicks : {
        type : Number,
        default : 0
    }
},{timestamps : true})

const urlModel = mongoose.model("URL" , urlSchema);

module.exports = urlModel;