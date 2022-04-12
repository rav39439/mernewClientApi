const router = require("express").Router();
const Shop = require("../model/Shop");
const verify = require("../verifyToken");
const mongoose=require('mongoose')
const ObjectId=require('mongodb').ObjectId


router.post('/',async(req,res)=>{

  const newShop = new Shop({
    Name:req.body.Name,
    image:req.body.image,
   products:req.body.products,
  shoppercode:req.body.code,
   Orderrec:req.body.orderrec,
   creator:req.body.creator,
   city:req.body.city
  });
    try{
const savedShop=await newShop.save()
res.status(200).json(savedShop)
    }
    catch(err){
       // res.status(400).json("Shop cannot be posted")
       console.log(err)
    }
})



// router.get("/",verify,async(req,res)=>{
//     //if(req.user.isAdmin){

//     console.log(req.query.company)
//   let Shops
  
//   try{
//   if((req.query.price)&&(req.query.company)&&(req.query.category)){
 
  
    
//        Shops=await Shop.aggregate([
//          { $match:{company:req.query.company,category:req.query.category,price:req.query.price}},
//                {$sample:{size:10}},
//       ])
 
//   }
//   else if((req.query.company)&&(req.query.category)){
   
//      Shops=await Shop.aggregate([
//        {$match:{company:req.query.company,category:req.query.category}},
//          { $sample:{size:1}},
  
//       ])
  
//   }
  
  
//   else if((req.query.category)&&(req.query.price)){
 
//        Shops=await Shop.aggregate([
//          {$match:{category:req.query.category,price:{$lt:req.query.price}}},
//           {$sample:{size:2}}
//       ])
    
  
//   }
//   else if(req.query.category){
  
//        Shops=await Shop.aggregate([
//          {$match:{category:req.query.category}},
//           {$sample:{size:1}}
//       ])
    
//   }
//   else if(req.query.price){
  
//        Shops=await Shop.aggregate([
//          {$match:{price:{$lt:req.query.price}}},
//           {$sample:{size:1}}
//       ])
    
//   }
//   else if(req.query.company){
  
//        Shops=await Shop.aggregate(
//          [
//            {$match:{company:req.query.company}},
//           {$sample:{size:1}},
      
//     ])
    
//   }
  
  
  
//   else {
//        Shops=await Shop.aggregate([
//          {$sample:{size:5}}
//       ])
    
//   }
//   res.status(200).json(Shops)

//   }  
  
//   catch(err){
//     console.log(err)
//     res.status(400).json(err)
//   }
//   })


  router.put("/", async (req, res) => {
    //if (req.user.isAdmin) {
console.log("api request for order")
console.log("the shopcode "+ req.query.shopcode)
        var id = mongoose.Types.ObjectId();
      try {
        const updatedShop = await Shop.updateMany({

           // products:{"$in":[req.query.productname]}
          // "products.itemname":req.query.productname
          'shoppercode':req.query.shopcode
          
        },{
            $push:{
              "Orderrec":{
                "_id":id,
                "username":req.query.username,
                "quantity":req.query.quantity,
                "Address":req.query.address,
                "productname":req.query.productname,
                "phone":req.query.phone,
                "email":req.query.email,
                "userid":req.query.userid
  
              }
            }

        }
        
        );

let updatedres;
         updatedres = await Shop.findOne({

          // products:{"$in":[req.query.productname]}
          'shoppercode':req.query.shopcode
         
        })




        res.status(200).json(updatedres);
      } catch (err) {
        res.status(500).json(err);
      }
    
  });  
  


  router.put("/accept", async (req, res) => {
    //if (req.user.isAdmin) {
     
      var newid = ObjectId(req.query.shopid);
      var orderid =ObjectId(req.query.orderid);
      console.log(newid)
      console.log(orderid)
       // var id = mongoose.Types.ObjectId();
       const result = await Shop.updateMany({
        $and: [{
          "_id":{$ne:newid} 
          },{
            //"products":{$in:[req.query.productname]}, 

            "products.itemname":req.query.productname
          }]
      
         
        
        
       }, {
        $pull: {
          "Orderrec": { _id:orderid }
        }
    }, { new: true });
    
    if (result)
        console.log(result)


  })

 
  router.delete('/:id',verify, async(req,res)=>{
    
      if (req.params.id) {
        try {
          await Shop.findByIdAndDelete(req.params.id);
          res.status(200).json("Shop has been deleted");
        } catch (err) {
          return res.status(500).json(err);
        }
      } else {
        return res.status(403).json("You can delete only your account!");
      }
    });
 


    router.get("/getbyname",async(req,res)=>{

      console.log(req.query.code)
      console.log(req.query.name)
                try{
      const shop=await Shop.findOne({
      $and:[{
        'shoppercode':req.query.code,
      
      },{
        'Name':req.query.name
      
      }]
       
       
      })
      res.status(200).json(shop)
                } catch(err){
      res.status(400).json(err)
                }
              })
          
      
              router.put("/additem", async (req, res) => {
                //if (req.user.isAdmin) {
            console.log("tkshih")
                    var id = mongoose.Types.ObjectId();
                  try {
                    const updateditem = await Shop.findOneAndUpdate({
            
                      "shoppercode":req.body.mycode
                    },{
                        $push:{
                          "products":{
                            "_id":id,
                            "itemname":req.body.itemname,
                            "itemprice":req.body.itemprice,
                            "model":req.body.mymodel,
                          
                          }
                        }
            
                    }
                    
                    );
                    res.status(200).json(updateditem);
                  } catch (err) {
                    res.status(500).json(err);
                  }
                
              });  


              router.put("/removedata", async (req, res) => {
                //if (req.user.isAdmin) {
                 
                  var newid = ObjectId(req.query.shopid);
                  var order =ObjectId(req.query.orderid);
                  console.log(newid)
                  console.log(order)

                
                   // var id = mongoose.Types.ObjectId();
                   const result = await Shop.updateOne({
                    $and: [{
                      "_id":newid
                      },{
                        //"products":{$in:[req.query.productname]}, 
            
                        "Orderrec._id":order
                      }]
                  
                     
                    
                    
                   },{
                    $pull: {
                      "Orderrec": { _id:order }
                    }
                }, { new: true });
                
                if (result){
                  const updatedshop = await Shop.findOne({
                   // $and: [{
                      "_id":newid
                             
                        
                      
                    })
                    res.status(200).json(updatedshop)
                  console.log(updatedshop)



                }


                   
            
            
              })



  module.exports = router;

  

 