const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const token = req.headers.authorization;

  console.log("rest.mid-ware.js req.headers: ", req.headers)
  if (token) {
    const secret = process.env.JWT_SECRET || "no evn secret";
    // jwt library takes care of figuring out if the token has been tampered with
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.log("restricted-middleware: invalid credentials")
        res.status(401).json({ message: "Invalid Credentials" });
      } else {
        req.decodedJwt = decodedToken;
        console.log("res.mid-ware.js decodedToken: ", decodedToken)
        next();
      }
    })
  } else {
    res.status(400).json({ message: "No credentials provided" })
  }
}