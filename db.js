const mongoose = require("mongoose")
require("dotenv").config()

const MongoURI = process.env.mongoURL

const mongoToConnect = () => {
    mongoose.connect(MongoURI)
    .then(console.log("Mongo Connected"))
    .catch()
}

module.exports = mongoToConnect