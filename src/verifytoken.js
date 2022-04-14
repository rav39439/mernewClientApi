const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeader = req.headers.token;
  //console.log(authHeader)
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, 'this is my secret', (err, user) => {
      if (err) {
       // res.status(403).json("Token is not valid!");
        console.log(err)
      }
      //console.log("the user "+us)
      req.user = user;
      next();
    });
  } else {
   
    return res.status(401).json("You are not authenticated!");
  }
}

module.exports = verify;