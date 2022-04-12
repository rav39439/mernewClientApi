const mongoose=require('mongoose')



const UserSchema=new mongoose.Schema({

    username:{ type:String,required:true,unique:true},
    password:{ type:String,required:true},
    email:{type:String,required:true},
    cart:{type:Array},
    orderplaced:{type:Array},
    image:{type:String},
    notification:{type:Array},
    isAdmin:{type:Boolean,default:false},



},{
    timestamp:true
})


module.exports=mongoose.model("User",UserSchema)