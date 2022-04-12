const mongoose=require('mongoose')


const ProductSchema=new mongoose.Schema({
    productname:{type:String,required:true},
    price:{type:Number,required:true},
     image:{type:String},
    company:{type:String},
    category:{type:String},
    sizes:{type:Array},
    productdetails:{type:String},
    shopcode:{type:String},
    shoplocation:{type:String}
},{
    timestamps:true
})
module.exports=mongoose.model("Product",ProductSchema)