const mongoose=require('mongoose')


const PostSchema=new mongoose.Schema({
    username:{type:String,required:true},
    content:{type:String,required:true},
    postimage:{type:String},
    likes:{type:Number},
    comments:{type:Array}
},{
    timestamps:true
})
module.exports=mongoose.model("Post",PostSchema)