const express = require("express")
const router = express.Router()
const user = require("../models/user")
const fetchUser = require("../Middleware/fetchuser");
const jwt = require("jsonwebtoken")
const bcypt = require("bcryptjs")
require("dotenv").config()

const jwt_secret = process.env.jwt_secret

function generateRandom11DigitNumber() {
    const min = 10000000000; // Minimum 11-digit number (inclusive)
    const max = 99999999999; // Maximum 11-digit number (inclusive)
    
    // Generate a random number within the specified range
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const randomNumberString = randomNumber.toString()
    
    return randomNumberString;
  }
  

router.post("/register", async (req, res) => {

    try {
        const { userName, email, password } = req.body

    if(userName, email, password){
        const alreadyUser = await user.findOne({email})
        if (alreadyUser) {
            res.json({success: false, message: "This email is already in use"})
        }else {
            // const uid = generateRandom11DigitNumber();
            let uid = 8

            var alreadyUserWithUid = null
            do {
                uid = generateRandom11DigitNumber()
                console.log(uid);
                alreadyUserWithUid = await user.findOne({uid})
              } while (alreadyUserWithUid !== null);

            const salt = await bcypt.genSalt(5);
            const hashedPassword = await bcypt.hash(password, salt)

            // console.log(hashedPassword);

            const createdUser = await user.create({
                userName, email,
                password : hashedPassword,
                uid: uid,
                tasks: [],
                teams: []
            })

            const data = {
                user : {
                    id: createdUser.id,
                    userName: createdUser.userName,
                    uid: createdUser.uid
                }
            }
            const authToken = jwt.sign(data, jwt_secret)

            createdUser.save()
            res.json({success: true, createdUser, authToken})
        }
    }else{
        res.json({success: false, message: "Please Enter all info"})
    }
    } catch (error) {
        res.json({success: false, message: error.message})
    }
    
})

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body

    if(email, password){
        const foundUser = await user.findOne({email})
        if (!foundUser) {
            res.json({success: false, message: "Login with correct creds"})
        }else {

            const comPassword = await bcypt.compare( password, foundUser.password)
            console.log(comPassword);
            if (comPassword) {
                const data = {
                    user : {
                        id: foundUser.id,
                        userName: foundUser.userName,
                        uid: foundUser.uid
                    }
                }
                const authToken = jwt.sign(data, jwt_secret)

                res.json({success: true, foundUser, authToken})
            }else{
            res.json({success: false, message: "Login with correct creds"})
            }
        }
    }else{
        res.json({success: false, message: "Please Enter all info"})
    }
    } catch (error) {
        res.json({success: false, message: error.message})
    }
    
})

router.get("/getUser", fetchUser, async(req, res)=>{
    try {
        if (req.user) {
            const User = req.user
            res.json({success : true, User})   
        }else{
            res.json({ success : false, message : "Login with correct creds"})
        }
        
    }catch (error) {
        res.json({success: false, message: error.message})
    }
    

})


module.exports = router