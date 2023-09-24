const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    title : String,
    description : String,
    author : String,
    // author : {type: mongoose.Types.ObjectId, ref: "users"},
    startDate : Date,
    deadline : Date,

}, {timestamps : true})

const task = mongoose.model('task', taskSchema);
module.exports = task;