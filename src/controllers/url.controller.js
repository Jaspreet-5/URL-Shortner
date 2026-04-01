const urlModel = require('../models/url.model')
const { nanoid } = require('nanoid')

//this function linked with uploadURL function
async function uploadUrlSession(originalURL) {

    const shortURL = nanoid(8);

    const url = await urlModel.create({
        shortCode: shortURL,
        originalURL: originalURL
    });
    return url;
}

function parseURL(url) {
    if (!url || typeof url !== 'string') return null;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    try {
        return new URL(url); // return object
    } catch {
        return null;
    }
}

async function uploadURL(req, res) {
    const parsed = parseURL(req.body.url.trim());

    if (!parsed) {
        return res.status(400).json({
            message: "Invalid URL"
        });
    }

    if (!parsed.hostname.includes(".")) {
        return res.status(400).json({
            message: "Invalid domain"
        });
    }

    const originalURL = parsed.href;

    const urlExists = await urlModel.findOne({ originalURL: originalURL });
    if (urlExists) {
        return res.status(200).json({ URL: urlExists.shortCode })
    }

    const response = await uploadUrlSession(originalURL);

    if (!response) {
        return res.status(500).json({
            message: "Some error occured! Please try again",
        })
    }

    return res.status(201).json({ Message: "URL shortened successfully", URL: response.shortCode })
}

async function getURL(req, res) {

    const url = await urlModel.findOneAndUpdate(
        { shortCode: req.params.url },
        { $inc: { clicks: 1 } },
        { returnDocument: 'after' }
    );

    if (!url) {
        return res.status(404).json({ message: 'URL is not present! Kindly create a new one' })
    }
    
    res.redirect(url.originalURL)
}

module.exports = { uploadURL, getURL };