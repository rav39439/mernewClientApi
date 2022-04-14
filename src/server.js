const express = require("express");
const app = express();
const server = require('http').createServer(app);



const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts")
const productRoute = require("./routes/product")
const restaurantRoute = require("./routes/restaurants");
const shopRoute = require("./routes/shop");
const multer = require("multer");
dotenv.config();
const cors=require('cors')
const io = require('socket.io')(server, {cors: {origin: "*",
allowedHeaders: ["my-custom-header"],
credentials: true
}});

// var io=require("socket.io")(server, {
//   cors: {
//     origin: "https://ecommercewebshop.netlify.app",
//     credentials: true
//   }
// })


const path = require("path");
app.get("/", express.static(path.join(__dirname, "./images")));



//app.get('/public', express.static('public'));


const DATABASE=process.env.DATABASE
console.log(DATABASE)

mongoose.connect('mongodb+srv://Ravkkrrttyy:xDKSBRRDI8nkn13w@cluster1.2pfid.mongodb.net/reactproject=true&w=majority',{useNewUrlParser:true , useUnifiedTopology:true}).then( ()=>
    console.log("connection successful")
).catch((err)=>console.log(err))

app.use(cors(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin","http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/images/:id", (req, res) => {
  res.sendFile(path.join(__dirname, `./images/${req.params.id}`));
});




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
  console.log("file uploaded")
});




app.use(express.json());

app.use(express.static(__dirname + '/images'));



app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/restaurants", restaurantRoute);
app.use("/api/product", productRoute);
app.use("/api/post",postRoute);
app.use("/api/shop",shopRoute);




let sockets=[]
let allmessage={}
let myusers=[]
let pmessage={}
let allps=[]
let mymessages=[]
io.on('connection', (socket) => { 

socket.on("online",function(data){
//if(!sockets.includes(user)){
  socket.name = data.username;
  sockets[data.username] = socket.id;
//socket.id=user.username
//}
  //sockets.push(user.username)
  console.log(sockets)

 socket.broadcast.emit("newuser",sockets)
 
})

socket.on('message',({name,message,person})=>{

 // if(person!=""){
    // pmessage={
    //   name:username,
    //   message:message
    // }
    // allps.push(pmessage)
    console.log(message)
    console.log(name)
    console.log(person)
    console.log(sockets[person])
// for(let i=0;i<sockets.length;i++){
//if(myusers[i]==name){
  //console.log(sockets[i])


if(person){

  io.to(sockets[person]).emit("personal message",name,message,person)

}
  
else{
//}

//  }
  //}else{
   

    // allmessage={
    //   name:username,
    //   message:message
    // }
    // mymessages.push(allmessage)
    
    console.log(message)
    console.log(name)
    io.emit("public message",{name,message})
 // }



}
})


//-------------------------------------------------------------------------------------------------





socket.on('orderpassed',function(data,shopper,orderid){
  console.log(data)
  console.log(shopper)
  //console.log(sockets[shopper])
  console.log(orderid)
  socket.to(sockets[shopper]).emit('neworder',data,orderid)
})

socket.on('ordergiven',function(data,shopowner,shoporderid,shopid){
  console.log(data)
  console.log(shopowner)
  console.log(sockets[shopowner])
  console.log(shoporderid)
  //console.log(myusers)
  socket.to(sockets[shopowner]).emit('newshoporder',data,shoporderid,shopid)
})

socket.on("refresh",function(event,data){
console.log( "the data for pagerefresh is"+data)
  socket.to(sockets[data]).emit("newrefresh",event)
})

socket.on("newnotification",function(data,user){
  console.log("the curernt user"+user)
  console.log("the data to be send"+data)
  socket.broadcast.emit("notificationdata",data)
})



});






server.listen(process.env.PORT||8800,function(){
  console.log("connected")

})