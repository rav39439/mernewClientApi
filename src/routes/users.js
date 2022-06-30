const User = require("../model/User");
const router = require("express").Router();

const verify=require('../verifytoken');

const mongoose=require('mongoose');
const { application } = require("express");

const ObjectId=require('mongodb').ObjectId




router.get("/",async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.delete("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  });

  router.put("/updateuser:id",  async (req, res) => {
  
      try {
        const updateduser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updateduser);
      } catch (err) {
        res.status(500).json(err);
      }
   
  });   







router.put("/orders",async(req,res)=>{
  console.log("thergesfgtgr"+req.body.userid)
  var newid = mongoose.Types.ObjectId();
  
  try{

const updatedorders=await User.updateOne({

  "_id":ObjectId(req.body.userid)
  
}, {
  
    $push:{
      "orderplaced":{
        "_id":newid,
        "address":req.body.address,
        "quantity":req.body.quantity,
        "username":req.body.username,
        "email":req.body.email,
        "phone":req.body.phone,
        "productname":req.body.productname,
        "price":req.body.price,
        "userid":req.body.userid,
        "shoporderid":req.body.shoporderid,
        "shopid":req.body.shopid,

      }
}

  })
  const updatedorder=await User.findOne({

    "_id":ObjectId(req.body.userid)
    
  })


res.status(200).json(updatedorder)
  } catch(err){
res.status(400).json(err)
  }
})  
  

router.put("/notification",async(req,res)=>{

 console.log(req.query.userid)
 console.log(req.query.quantity)
 console.log(req.query.price)
 console.log(req.query.orderid)
 console.log(req.query.productname)

      var id = mongoose.Types.ObjectId();
    try {
      const updateduser = await User.updateOne({

          "_id":ObjectId(req.query.userid)
      },{
          $push:{
            "notification":{
              "_id":id,
              "orderid":req.query.orderid,
              "quantity":req.query.quantity,
              "price":req.query.price,
              "userid":req.query.userid,
              "productname":req.query.productname,
             "message":"You order has been accepted",
             "read":"unread"

            }
          }

      }
      
      );

    //   const updateduse = User.updateOne({

    //     "_id":ObjectId(req.query.userid)
    // })

      res.status(200).json(updateduser);
      //console.log(updateduser)
    } catch (err) {
      res.status(500).json(err);
    }
  
  })

router.put("/ordermessage",async(req,res)=>{
  
console.log("order reviecd")
  var id = mongoose.Types.ObjectId();
  try {
    const updated = await User.updateOne({

        "_id":req.body.userid
    },{
        $push:{
          "notification":{
            "_id":id,
            "name":req.body.username,
            "productname":req.body.productname,
            "quantity":req.body.quantity,
          "email":req.body.email,
           "message":req.body.message,
           "userid":req.body.userid,
           "read":'unread'

          }
        }

    }
    
    );
    res.status(200).json(updated);
    console.log("done")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }





})

router.put("/removenot",async (req, res) => {
  //if (req.user.isAdmin) {
   console.log("sdafggggggggggggggggggggggggggggggg")
    var newid = ObjectId(req.body.userid);
    var notiid =ObjectId(req.body.notid);
    console.log(newid)
    console.log(notiid)
     // var id = mongoose.Types.ObjectId();
     const result = await User.updateOne({
  //   $and: [{
        "_id":newid 
      //  },{
          //"products":{$in:[req.query.productname]}, 

         // "notification._id":notiid
     //   }]
    
       
      
      
     }, {
      $pull: {
        "notification": { _id:notiid }
      }
  }, { new: true });
  
  if (result){

    const newresult = await User.findOne({
     // $and: [{
         "_id":newid 
      //   },{
           //"products":{$in:[req.query.productname]}, 
 
           
       //  }]
        })
        res.status(200).json(newresult)


  }
     



})

router.post("/getuser",verify,async (req, res) => {
  const userId = req.body.userid;
  const username = req.body.username;
  console.log(userId)
 console.log(username)
  try {
    const myuser=await User.findOne({
$and:[{
  "_id":ObjectId(req.body.userid),

},{
  "username":req.body.username
}]
     
    })
    res.status(200).json(myuser);
    //console.log(myuser)
  } catch (err) {
    res.status(500).json(err);
  }
});



router.put("/read",verify,async(req,res)=>{
  console.log("the myuserid"+req.body.myuserid)
  console.log("the notificatiionid"+req.body.notificationid)



  try{

const newupdate=await User.findOneAndUpdate({

  "_id":ObjectId(req.body.myuserid)
},{
  $set: {
    "notification.$[outer].read":"read"
  },
},
{ arrayFilters:[{"outer._id":ObjectId(req.body.notificationid)}] }


)
console.log("hakdhfafshlkfahlafs")
const newupdat=await User.findOne({

  "_id":ObjectId(req.body.myuserid)
})
console.log(newupdat)
res.status(200).json(newupdat)



  } catch(err){

    res.status(400).json("error")

  }



})



router.post("/cleardata",verify, async (req, res) => {
  //if (req.user.isAdmin) {
   
    var newid = ObjectId(req.body.myuserid);
    var notiid =ObjectId(req.body.ordid);
    console.log("the cleardata "+newid)
    console.log(notiid)
     // var id = mongoose.Types.ObjectId();
     const result = await User.updateOne({
  //   $and: [{
        "_id":newid 
      //  },{
          //"products":{$in:[req.query.productname]}, 

         // "notification._id":notiid
     //   }]
     
     }, {
      $pull: {
        "orderplaced": { _id:notiid }
      }
  }, { new: true });
  
  if (result){

    const newresult = await User.findOne({
         "_id":newid 
        })
        res.status(200).json(newresult)
  }
     
})





  module.exports = router;

  

