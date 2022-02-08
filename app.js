const express = require('express');
const app = express()
const { handle } = require('express/lib/application');
const db= require('./db');
const admin =require('./model/admin');
const user =require('./model/user');
const post =require('./model/post');
const chat =require('./model/chat');
const drug =require('./model/drugs');
const likes=require('./model/like-dislike');
const comment=require('./model/comment');
const rate=require('./model/rate');
const Conversation=require('./model/conversation');

const SpecialistLicense=require('./model/SpecialistLicense');
app.use(express.json());

//const posts = require("./routes/posts")
//const conversation = require("./routes/conversation")



app.get('/all', function (req, res) {
  users.find({},(err, users)=>{
      if(err){
        console.log("EROOR",err)
      return handleError(err)
}else{
  console.log("================")
console.log("data",users)
    res.json(data);
}

})
})
app.post('/new',function(req,res){
  new user ({
    _id:req.body.email,
    fName:req.body.fName,
    age:req.body.age,
    password: req.body.pwd
  }).save(function(err,doc){
    if(err) res.json(err);
    else res.send('successful');
  })
});

app.listen(3000,()=>{
  console.log(" SERVER IS WORKING ")
});
















/* var path = require('path');
var mongoose =require('mongoose');
const express = require('express');
var app = express();

app.set('port',process.env.PORT||3000);
app.set('views',__dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname,'public')))

mongoose.connect('mongodb://localhost:27017/mymidform');

var users=new mongoose.Schema({
  _id :{type:String , require:true},
  fName:{type:String , require:true},
  age:{type:Number , require:true},
 password:{type:String , require:true},
});

const user= mongoose.model('user',users)
app.post('/new',function(req,res){
  new user ({
    _id:req.body.email,
    fName:req.body.fName,
    age:req.body.age,
    password: req.body.pwd
  }).save(function(err,doc){
    if(err) res.json(err);
    else res.send('successfull');
  })
});


var server = http.creatServer(app).listen(app.get('port'),function(){
  console.log("work"+app.get('port'));
})





















const express = require('express');
const { handle } = require('express/lib/application');
const app = express()
const db= require('./db');
const users =require('./model/DATA')
app.use(express.json())



app.get('/all', function (req, res) {
    users.find({},(err, users)=>{
        if(err){
          console.log("EROOR",err)
        return handleError(err)
  }else{
    console.log("================")
  console.log("data",users)
      res.json(data);
}
  
})
})
  console.log("================")
  console.log(users)
//////////////////////////////////////////////
///////////////////////////////////////////////



  app.post("/new",(req, res)=> {
users.create({},
(err, newData)=> {
   if(err){
   console.log("error",err)
  return handleError(err);
}else{
  res.status(201).json('data add successfully',newData)
  
  console.log('data', newData)}

})
//res.json(db_array)
})
app.listen(5000,()=>{
    console.log(" SERVER IS WORKING ")
})
*/
