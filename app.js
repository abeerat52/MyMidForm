const express = require('express');
const app = express()
const mongoose = require('mongoose');
// var cors = require('cors');

//import the routes
const posts = require("./routes/posts")
const users = require("./routes/users")
const drugs = require("./routes/drug")
const conversation = require("./routes/conversation")

//connecting the DB
mongoose.connect('mongodb://localhost:27017/MyMediForm')
.then(() => console.log("connection"))
.catch(err => console.log("fail connection" + err))


app.use(express.json());
// app.use(cors())
app.use("/MyMediForm/auth", users)
app.use("/MyMediForm/posts", posts)
app.use("/MyMediForm/conversation", conversation)
app.use("/MyMediForm/drug", drugs)


//server
const port = 5000
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})


/*const admin =require('./model/admin');
const comment=require('./model/comment');
const Conversation=require('./model/conversation');
const drug =require('./model/drugs');
const likes=require('./model/like-dislike');
const post =require('./model/post');
const rate=require('./model/rate');
const SpecialistLicense=require('./model/SpecialistLicense');
const user =require('./model/user');
*/

