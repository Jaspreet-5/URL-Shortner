const express = require("express");
const router = require('./routes/url.route')
const app = express();
const logger = require('./middlewares/logs.middleware')

app.set("trust proxy" , true)
app.use(express.json());
app.use('/api/url' ,logger , router)

module.exports = app;