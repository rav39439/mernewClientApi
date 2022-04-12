const mongoose=require('mongoose')


const ShopSchema=new mongoose.Schema({
  
    Name:{type:String},
     image:{type:String},
    products:{type:Array},
    shoppercode:{type:String},
   creator:{type:String},
    Orderrec:{type:Array},
    city:{type:String},
   
},{
    timestamps:true
})
module.exports=mongoose.model("Shop",ShopSchema)