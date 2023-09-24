const express = require("express");
const router = express.Router();
const task = require("../models/task")
const jwt = require("jsonwebtoken");
const fetchUser = require("../Middleware/fetchuser");
const user = require("../models/user");
require("dotenv").config()
const jwt_secret = process.env.jwt_secret

router.post("/createTask", fetchUser, async(req, res) => {
    const { title, description, deadline } = req.body
    try {
    if(title, description){
        const createdTask = await task.create({
            title, description,
            author : req.user.userName,
            startDate : Date.now(),
            deadline : deadline
        })

        const User = await user.findByIdAndUpdate(req.user.id, {$push: {tasks : createdTask}}, {new: true})

        await User.save()
        await createdTask.save()
        res.json({success : true, message : "Task Created", createdTask})
    }else {
        res.json({success : false, message : "Fill all the required fields"})
    }
    } catch (error) {
        res.json({success: false, message: error.message})
    }
})

router.get("/getTasks", fetchUser, async(req, res) => {
    try {
        if (req.user) {
            
            const foundTasks = await task.find({author : req.user.userName})
            
            res.json({success : true, foundTasks, message : "Tasks Found"})
        }
    } catch (error) {
        res.json({success: false, message: error.message})
    }
})

router.delete("/deleteTask/:id", fetchUser, async(req, res) => {
    try {

        const deletedTask = await task.findByIdAndDelete(req.params.id)
        const User = await user.findById(req.user.id)
        const i = User.tasks.indexOf(req.params.id)
        const splice = User.tasks.splice(i, 1)
        const updatedUser = await user.findByIdAndUpdate(req.user.id, {$set: {tasks : User.tasks}}, {new: true})
        await updatedUser.save()
        res.json({success : true, updatedTasks : updatedUser.tasks})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
})

router.put("/updateTask/:id", fetchUser, async(req, res) => {
    try {
        const { updatedTask } = req.body
        const Task = await task.findByIdAndUpdate(req.params.id, updatedTask)
        const User = await user.findById(req.user.id).populate("tasks")
        await Task.save()
        res.json({success : true, User})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
})


module.exports = router