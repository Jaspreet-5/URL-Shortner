const express = require('express');
const rateLimiter = require('../middlewares/rate_lmt.middleware')
const {uploadURL , getURL} = require('../controllers/url.controller')
const router = express.Router();

//generating short url
router.post('/upload', rateLimiter({bucketSize : 25 , windowMS : 4000 , tokensToAdd : 1}) , uploadURL);

//fetching original url
router.get('/fetch/:url' , rateLimiter({bucketSize : 1 , windowMS : 4000 , tokensToAdd : 1}) , getURL)

module.exports = router;
