const router = require("express").Router();
const Users = require("./users-model");
const restricted = require("../auth/restricted-middleware");

// !! don't forget to replace restricted middleware restricted, ^^ note: const user_id = req.decodedJWt.user_id
router.get("/", (req, res) => {
  console.log("users-router.js decodedToken", req.decodedJwt);
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Sorry, internal server error." });
    });
});

router.get("/:id", (req, res) => {
  const user_id = req.params.id;
  Users.findById(user_id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(400)
          .json({ errorMessage: "Sorry, we couldn't find a user by that id" });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Sorry, internal server error." });
    });
});
// will add auth/validation middleware here
router.delete("/:id", restricted, (req, res) => {
  const sec_admin = req.decodedJwt.sec_admin;
  if (sec_admin) {
    res
      .status(401)
      .json({ message: "You don't have user privileges to delete users" });
  } else {
    Users.remove(req.params.id)
      .then(info => {
        if (info) {
          res
            .sendStatus(204)
            .json({ message: "You successfully deleted user" });
        } else {
          res.status(404).json({ message: "That user id does not exist" });
        }
      })
      .catch(err =>
        res.status(500).json({ message: "Internal server error." })
      );
  }
});

// will add auth/validation middleware here
router.put("/:id", restricted, (req, res) => {
  const primary_admin = req.decodedJwt.primary_admin;
  if (primary_admin) {
    Users.update(req.params.id, req.body).then(updatedUser => {
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res
          .status(400)
          .json({ errorMessage: "Sorry, we don't have a user by that id" });
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "You do not have rights to update an existing user" });
  }
});

module.exports = router;
