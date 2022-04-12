const router = require("express").Router();
const Post = require("../model/Post");
const verify = require("../verifyToken");

//CREATE

router.post("/",verify, async (req, res) => {
 
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  
});

//UPDATE

router.put("/:id", verify, async (req, res) => {
 
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json(err);
    }
 
});

//DELETE

router.delete("/:id", verify, async (req, res) => {
  
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("The Post has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  
});

//GET

router.get("/find/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET RANDOM

router.get("/random", verify, async (req, res) => {
  const username = req.query.user;
  let post;
  try {
    if (username) {
      post = await Post.aggregate([
        { $match: { username: username } },
        { $sample: { size: 1 } },
      ]);
    } else {
      post = await Post.aggregate([
       
        { $sample: { size: 2 } },
      ]);
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL

router.get("/", async (req, res) => {
 // if (req.user.isAdmin) {
    try {
      const posts = await Post.find();
      res.status(200).json(posts.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  
});

module.exports = router;