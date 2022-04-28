const router = require("express").Router();
const User = require("../model/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("../verifytoken");

//REGISTER
router.post("/",async (req, res) => {

  console.log("apifdgd is running")
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      'this is my secret',
    ).toString(),
    image:req.body.filename
  });
  try {
    const user = await newUser.save();
    const {password,...doc}=user
    res.status(201).json(doc);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);

  }
});

//LOGIN
router.post("/login", async (req, res) => {

  
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong password or username!");

    const bytes = CryptoJS.AES.decrypt(user.password, 'this is my secret');
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Wrong password or username!");

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      'this is my secret',
      { expiresIn: "5d" }
    );

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
    console.log(info)
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});

module.exports = router;