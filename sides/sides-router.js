const router = require("express").Router();
const Sides = require("../sides/sides-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", (req, res) => {
  Sides.getAllSides()
    .then(allSides => {
      res.status(200).json(allSides);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Something went wrong with your request. " });
    });
});

router.get("/:id", (req, res) => {
  const sides_id = req.params.id;
  Sides.findSidesById(sides_id)
    .then(sides => {
      res.status(200).json({ sides });
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Somthing went wrong with your request",
        sqlErr: err.toString()
      });
    });
});

router.get("/users/:id", (req, res) => {
  const users_id = req.params.id;
  Sides.usersSides(users_id)
    .then(sides => {
      if (sides) {
        res.status(200).json(sides);
      } else {
        res
          .status(404)
          .json({ message: "there are no sides associated with this user" });
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Something went wrong with your request",
        sqlErr: err.toString()
      });
    });
});

router.post("/", restricted, (req, res) => {
  const sidesInfo = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Sides.addSides(sidesInfo)
      .then(newSides => {
        console.log(newSides);
        res.status(201).json({
          message: "you have successfully added a side to the order"
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: "Failed to create new order",
          sqlErr: err.toString()
        });
      });
  } else {
    res.status(401).json({ message: "You do not have rights to add to an order" });
  }
});

router.put("/:id", restricted, (req, res) => {
  const sides_id = req.params.id;
  const changes = req.body;
  console.log("FindSidesById sides_id", sides_id, "req.body", req.body);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Sides.findSidesById(sides_id)
      .then(sides => {
        if (sides) {
          Sides.updateSides(sides_id, changes).then(updatedSides => {
            res.json({ updatedSides, sides_id });
          });
        } else {
          res
            .status(404)
            .json({ message: "Could not find order with given id" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Failed to update order" });
      });
  } else {
    res
      .status(401)
      .json({ message: "You do not have rights to edit orders" });
  }
});

router.delete("/:id", restricted, (req, res) => {
  const sides_id = req.params.id;
  console.log("sides_id", sides_id);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    console.log("you have reached it");
    Sides.removeSides(sides_id)
      .then(deleted => {
        if (deleted) {
          res.json({ removed: deleted });
        } else {
          res
            .status(404)
            .json({ message: "Could not find order with given id" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Failed to delete order" });
      });
  } else {
    res
      .status(401)
      .json({ message: "You do not have rights to delete a side" });
  }
});

module.exports = router;
