const urlModel = require("../models/url.model");
const { nanoid } = require("nanoid");

async function uploadUrlSession(originalURL) {
    const shortURL = nanoid(8);

    const url = await urlModel.create({
        shortCode: shortURL,
        originalURL: originalURL
    });

    return url;
}

function parseURL(url) {
    if (!url || typeof url !== "string") {
        return null;
    }

    url = url.trim();

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    try {
        return new URL(url);
    } catch {
        return null;
    }
}

async function uploadURL(req, res) {
    try {
        const parsed = parseURL(req.body.url);

        if (!parsed) {
            return res.status(400).json({
                message: "Invalid URL"
            });
        }

        if (!["http:", "https:"].includes(parsed.protocol)) {
            return res.status(400).json({
                message: "Only HTTP and HTTPS URLs are allowed"
            });
        }

        if (!parsed.hostname.includes(".")) {
            return res.status(400).json({
                message: "Invalid domain"
            });
        }

        const originalURL = parsed.href;

        const urlExists = await urlModel.findOne({
            originalURL
        });

        if (urlExists) {
            return res.status(200).json({
                message: "URL already exists",
                URL: urlExists.shortCode
            });
        }

        const response = await uploadUrlSession(originalURL);

        return res.status(201).json({
            message: "URL shortened successfully",
            URL: response.shortCode
        });

    } catch (error) {
        // Duplicate originalURL created by a concurrent request
        if (error.code === 11000) {
            const existingURL = await urlModel.findOne({
                originalURL: req.body.url
            });

            if (existingURL) {
                return res.status(200).json({
                    message: "URL already exists",
                    URL: existingURL.shortCode
                });
            }
        }

        console.error(error);

        return res.status(500).json({
            message: "Something went wrong! Please try again"
        });
    }
}

async function getURL(req, res) {
    try {
        const url = await urlModel.findOneAndUpdate(
            {
                shortCode: req.params.url
            },
            {
                $inc: {
                    clicks: 1
                }
            },
            {
                new: true
            }
        );

        if (!url) {
            return res.status(404).json({
                message: "URL is not present! Kindly create a new one"
            });
        }

        return res.redirect(url.originalURL);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong! Please try again"
        });
    }
}

module.exports = {
    uploadURL,
    getURL
};