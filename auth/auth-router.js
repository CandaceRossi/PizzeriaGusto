require("dotenv").config();
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Users = require("../users/users-model");
const restricted = require("./restricted-middleware");

router.post("/register", (req, res) => {
  const userInfo = req.body;
  const hash = bcrypt.hashSync(userInfo.password, 10);
  userInfo.password = hash;

  Users.findBy({ username: userInfo.username })
    .then(users => {
      if (users[0]) {
        console.log(users[0]);
        res.status(409).json({ message: "That username already exists." })
      } else {
        Users.add(userInfo)
          .then(newUser => {
            console.log("New User", newUser);
            const token = generateToken(newUser);
            console.log("Token: ", token);
            res.status(201).json({ token, newUser });
          })
      }

    })
    .catch(error => {
      res
        .status(500)
        .json({ error: error, message: "This username already exists!" });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  console.log("username: ", username, "password: ", password);
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        console.log(token);
        res.status(200).json({
          message: `Welcome ${user.username}`,
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          executive: user.executive,
          primary_admin: user.primary_admin,
          sec_admin: user.sec_admin,
          username: user.username,

          token
        });
      } else {
        console.log("auth router, not loggin in");
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  // header payload and verify signature
  //payload -> username, id, department
  const payload = {
    sub: user.user_id,
    username: user.username,
    executive: user.executive,
    primary_admin: user.primary_admin,
    sec_admin: user.sec_admin
  };
  console.log("PAYLOAD: ", payload);
  const secret = process.env.JWT_SECRET || "no evn secret";

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;