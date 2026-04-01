require("dotenv").config();
const app = require('./src/app');
const connectDB = require('./src/services/db');

connectDB(); //connecting to database

app.listen(3000 , ()=>{
    console.log("App listening on port 3000");
})