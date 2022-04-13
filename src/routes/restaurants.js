
const { verify } = require('crypto');
const Restaurant=require('../model/Restaurant');
const { route } = require('./auth');
const router = require("express").Router();
const mongoose=require('mongoose')
const ObjectId=require('mongodb').ObjectId



router.post('/',verify,async(req,res)=>{

    const newRestaurant=new Restaurant({

name:req.body.name,
location:req.body.location,
image:req.body.filename,
city:req.body.city,
details:req.body.details,
rating:req.body.rating,
fooditems:req.body.fooditems,
restaurantcode:req.body.code,
categories:req.body.categories,
orders:req.body.orders,
postedby:req.body.postedby,


    });
    try{
const savedrestaurant=await newRestaurant.save()
res.status(200).json(savedrestaurant)
    }
    catch(err){
        res.status(400).json("Restaurant cannot be posted")
    }
})



router.get("/",verify,async(req,res)=>{
  
 
let restaurants

try{
if((req.query.city)&&(req.query.rating)){

  console.log(req.query.city)
  console.log(req.query.rating)
  
     restaurants=await Restaurant.aggregate([
       {$match:{city:req.query.city,rating:req.query.rating}},
              {$sample:{size:4}},
    ])

}


else if(req.query.rating){
  console.log(req.query.rating)
     restaurants=await Restaurant.aggregate([
      {$match:{rating:req.query.rating}},
        {$sample:{size:1}},

     ] )
}


else if(req.query.city){
  console.log(req.query.city)
     restaurants=await Restaurant.aggregate([
      {$match:{city:req.query.city}},
        {$sample:{size:1}},
    ])
   // console.log(req.query.city)
  
}


else {
     restaurants=await Restaurant.aggregate([
      {$sample:{size:5}}
    ])
  
}
res.status(200).json(restaurants)
//}
}  

catch(err){
  res.status(400).json(err)
}
})



    router.put("/update/:id", verify, async (req, res) => {
       // if (req.user.isAdmin) {
          try {
            const updatedrestaurant = await Restaurant.findByIdAndUpdate(
              req.params.id,
              {
                $set: req.body,
              },
              { new: true }
            );
            res.status(200).json(updatedrestaurant);
          } catch (err) {
            res.status(500).json(err);
          }
        
      });  
      

      router.put("/fooditem",verify, async (req, res) => {
        //if (req.user.isAdmin) {
    console.log("tkshishishishishish")
            var id = mongoose.Types.ObjectId();
          try {
            const updateditem = await Restaurant.findOneAndUpdate({
    
              "code":req.body.mycode
            },{
                $push:{
                  "fooditems":{
                    "_id":id,
                    "itemname":req.body.itemname,
                    "itemprice":req.body.itemprice,
                  
                  }
                }
    
            }
            
            );
            res.status(200).json(updateditem);
          } catch (err) {
            res.status(500).json(err);
          }
        
      });  




      


      router.delete('/:id',verify, async(req,res)=>{
       
          if (req.params.id) {
            try {
              await Restaurant.findByIdAndDelete(req.params.id);
              res.status(200).json("Restaurant has been deleted");
            } catch (err) {
              return res.status(500).json(err);
            }
          } else {
            return res.status(403).json("You can delete only your account!");
          }
        });
    


        router.get("/getbycode",async(req,res)=>{

console.log(req.query.restcode)
console.log(req.query.restname)
          try{
const restuarant=await Restaurant.findOne({
$and:[{
  'restaurantcode':req.query.restcode,

},{
  'name':req.query.restname

}]
 
 
})
res.status(200).json(restuarant)
          } catch(err){
res.status(400).json(err)
          }
        })
    




        router.put("/setorder", verify,async (req, res) => {
          //if (req.user.isAdmin) {
      console.log("dsafdafafafa")
              var id = mongoose.Types.ObjectId();
             //var restaurantid = mongoose.Types.ObjectId(req.body.restaurantid);
            try {
              const updatedrestaurant = await Restaurant.updateOne({
      
                "_id":ObjectId(req.body.restaurantid)
              },{
                  $push:{
                    "orders":{
                      "_id":id,
                      "price":req.body.price,
                      "productname":req.body.productname,
                      "quantity":req.body.quantity,
                      "name":req.body.name,
                      "address":req.body.address,
                      "phone":req.body.phone,
                      "email":req.body.email,
                      "restaurantid":req.body.restaurantid,
                      "userid":req.body.userid,
                      "status":req.body.status
        
                    }
                  }
      
              }
              
              );

              const uprestaurant = await Restaurant.findOne(
                
                {
      
                "_id":ObjectId(req.body.restaurantid)

                })
              res.status(200).json({
                "restaurant":uprestaurant,
                "id":id
              });
            } catch (err) {
              res.status(500).json(err);
            }
          
        });  
        
        router.put("/updateorder", verify, async (req, res) => {
          // if (req.user.isAdmin) {
            console.log("the new restaurantid is"+ req.body.myrestaurantid)
         //var restaurantid = mongoose.Types.ObjectId(req.query.restaurantid)
         ///var orderid = mongoose.Types.ObjectId(req.query.orderid)

             try {
               const updatedrestaurant = await Restaurant.findOneAndUpdate({
                "_id":ObjectId(req.body.myrestaurantid)
                }, {
                   $set: {
                     "orders.$[outer].status":"accepted"
                   },
                 },
                 { arrayFilters:[{"outer._id":ObjectId(req.body.myorderid)}] }
               );


               const updateddata = await Restaurant.findOne({
                "_id":ObjectId(req.body.myrestaurantid)


               })
               res.status(200).json(updateddata.orders);
               console.log(updateddata.orders)
             } catch (err) {
               console.log(err)
               res.status(500).json(err);
             }
           
         });  


         
         router.put("/aremovedata",verify, async (req, res) => {
          //if (req.user.isAdmin) {
           
            var newid = ObjectId(req.query.restaurantid);
            var order =ObjectId(req.query.orderid);
            console.log(newid)
            console.log(order)

          
             // var id = mongoose.Types.ObjectId();
             const result = await Restaurant.updateOne({
              $and: [{
                "_id":newid
                },{
                  //"products":{$in:[req.query.productname]}, 
      
                  "orders._id":order
                }]
            
               
              
              
             },{
              $pull: {
                "orders": { _id:order }
              }
          }, { new: true });
          
          if (result){
            const update = await Restaurant.findOne({
             // $and: [{
                "_id":newid
                       
                  
                
              })
              res.status(200).json(update)
            console.log(update)



          }


             
      
      
        })



      module.exports = router;