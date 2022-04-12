
const mongoose=require('mongoose')

const RestuarantSchema=new mongoose.Schema({

    name:{type:String,required:true,unique:true},
   
    location:{type:String,required:true,unique:true},
    image:{type:String},
    restaurantcode:{type:String},
    categories:{type:Array},
    details:{type:String},
    city:{type:String,required:true},
    rating:{type:String},
    fooditems:{type:Array},
    orders:{type:Array},
    code:{type:String},
    postedby:{type:String}

},{
    timestamp:true
})
module.exports=mongoose.model("Restaurant",RestuarantSchema)