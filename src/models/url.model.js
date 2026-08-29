const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        shortCode: {
            type: String,
            required: [true, "shortURL is required"],
            unique: true,
            index: true,
            trim: true
        },

        originalURL: {
            type: String,
            required: [true, "originalURL is required"],
            unique: true,
            trim: true
        },

        clicks: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const urlModel = mongoose.model("URL", urlSchema);

module.exports = urlModel;