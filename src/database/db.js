const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function dbConnection(){
    try {
       await mongoose.connect(`${process.env.MONGO_URI}`)
       console.log("mongoDB connected")
    } catch (error) {
        console.error("failed to connect database", error)
    }
}

module.exports = dbConnection;