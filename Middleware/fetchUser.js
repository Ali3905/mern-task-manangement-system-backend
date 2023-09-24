require("dotenv").config();
const jwt_secret = process.env.jwt_secret
const jwt = require("jsonwebtoken")


const fetchUser = (req, res, next) => {
    const authToken = req.header('authToken');

    try {
        if (!authToken) {
            res.json({success: false, message : "Authenticate using correct creds" })
        } else {
            const data = jwt.verify(authToken, jwt_secret)
            req.user = data.user
        }
        next()
    } catch (error) {
        res.json({success: false, message: error.message})
    }

}

module.exports = fetchUser