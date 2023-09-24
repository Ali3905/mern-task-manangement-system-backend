const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userName : String,
    uid : String,
    email : String,
    password : String,
    tasks :   [{type : mongoose.Types.ObjectId, ref : "task"}],      // {typeof: Array, ref : "tasks"},
    teams :  Array // {typeof : Array, ref : "teams"}
}, {timestamps: true} )

const user = mongoose.model('user', userSchema);
module.exports = user;