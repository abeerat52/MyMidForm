const mongoose= require("mongoose");
const dbURI='mongodb://localhost:27017/mymidform';

mongoose.connect(dbURI);
const db = mongoose.connection;

db.on("connected",(err)=>{
    console.log("the datebease is working...")
})
db.on("error",(err)=>{
    console.log(" error in database")
})