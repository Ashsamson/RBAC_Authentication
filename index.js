const express = require("express")
const mongoose = require('mongoose');
const AuthsUser = require("./routes/routes");
require("dotenv").config();
const app = express();



const db = process.env.DB_URL;
// const PORT = process.envPORT;
PORT = 5000;
const VERSION =process.env.VERSION


mongoose.connect(db)
.then(()=> console.log("connected to database"));
app.use(express.json({}));
app.use(express.urlencoded({extended: true}));

app.use("/auths", AuthsUser);


app.get("/", (req,res)=>{
  res.status(200).json({msg: 'wecome home'})
})

app.listen(PORT, ()=>{
  console.log(`app is running on specified ${PORT}`)
});