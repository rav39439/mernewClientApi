const router = require("express").Router();
const Product = require("../model/Product");
const verify = require("../verifytoken");

router.post('/',verify,async(req,res)=>{

  const newproduct = new Product({
    productname:req.body.productname,
    price:req.body.price,
     image:req.body.filename,
    company:req.body.company,
    category:req.body.category,
    sizes:req.body.sizes,
    productdetails:req.body.productdetails,
    shopcode:req.body.shopcode,
    shoplocation:req.body.shoplocation
  });
    try{
const savedproduct=await newproduct.save()
res.status(200).json(savedproduct)
    }
    catch(err){
       // res.status(400).json("product cannot be posted")
       console.log(err)
    }
})



router.get("/",verify,async(req,res)=>{
    //if(req.user.isAdmin){

   // console.log(req.query.company)
  let products
  
  try{
  if((req.query.price)&&(req.query.company)&&(req.query.category)){
 
  
    
       products=await Product.aggregate([
         { $match:{company:req.query.company,category:req.query.category,price:{$lt:parseInt(req.query.price)}}},
               {$sample:{size:10}},
      ])
     
 
  }
  else if((req.query.company)&&(req.query.category)){
   

   
     products=await Product.aggregate([
       {$match:{company:req.query.company,category:req.query.category}},
         { $sample:{size:1}},
  
      ])
 
  }
  
  
  else if((req.query.category)&&(req.query.price)){
 
       products=await Product.aggregate([
         {$match:{category:req.query.category,price:{$lt:parseInt(req.query.price)}}},
          {$sample:{size:5}}
      ])
    
  
  }
  else if((req.query.company)&&(req.query.price)){
 
       products=await Product.aggregate([
         {$match:{company:req.query.company,price:{$lt:parseInt(req.query.price)}}},
          {$sample:{size:5}}
      ])
    
  
  }
  else if(req.query.category){
  
       products=await Product.aggregate([
         {$match:{category:req.query.category}},
          {$sample:{size:5}}
      ])
    
  }
  else if(req.query.price){
    myvalue=parseInt(req.query.price)
       products=await Product.aggregate([
         {$match:{price:{$lt:myvalue}}},
          {$sample:{size:5}}
      ])
    
  }
  else if(req.query.company){
  
       products=await Product.aggregate(
         [
           {$match:{company:req.query.company}},
          {$sample:{size:5}},
      
    ])
    
  }
  
  
  
  else {
       products=await Product.aggregate([
     
         {$sample:{size:10}}
      ])
      console.log("api hit")
    
  }
  res.status(200).json(products)

  }  
  
  catch(err){
    console.log(err)
    res.status(400).json(err)
  }
  })




  
  router.put("/",verify, async (req, res) => {
    //if (req.user.isAdmin) {

    console.log("the update id is"+req.body.id)
      try {
        const updatedproduct = await Product.findByIdAndUpdate(
          req.body.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedproduct);
      } catch (err) {
        res.status(500).json(err);
      }
    
  });  
  
  


  router.delete('/:id',verify, async(req,res)=>{
    
      if (req.params.id) {
        try {
          await Product.findByIdAndDelete(req.params.id);
          res.status(200).json("Product has been deleted");
        } catch (err) {
          return res.status(500).json(err);
        }
      } else {
        return res.status(403).json("You can delete only your account!");
      }
    });



    
 

  module.exports = router;

  