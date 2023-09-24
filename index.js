const express = require("express")
const cors = require("cors")
const db = require("./db")
const dotenv = require('dotenv')
dotenv.config()



const PORT = process.env.PORT
const app = express()
app.use(cors())
app.use(express.json())
db()

app.use("/", require("./routes/Auth"))
app.use("/", require("./routes/Task"))


app.get("/", (req, res) => {
    res.send("Manage Your Tasks")
})


app.listen(PORT, ()=>{
    console.log("Server is Running at PORT " + PORT);
})