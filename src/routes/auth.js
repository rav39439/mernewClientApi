const router = require("express").Router();
const User = require("../model/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("../verifytoken");

//REGISTER
router.post("/", verify,async (req, res) => {

  console.log("apifdgd is running")
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    image:"../../../api/images/"+req.body.filename
  });
  try {
    const user = await newUser.save();
    const {password,...doc}=user
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login",verify, async (req, res) => {

  console.log(req.body.password)
  console.log(req.body.email)
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong password or username!");

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
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
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;