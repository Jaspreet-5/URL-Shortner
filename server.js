require("dotenv").config();
const app = require('./src/app');
const connectDB = require('./src/services/db');

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing!");
  process.exit(1);
}
connectDB(); //connecting to database

app.listen(10000 , ()=>{
    console.log("App listening on port 3000");
})