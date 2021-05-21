const router = require("express").Router();
const ToppingTypes = require("../toppingTypes/toppingTypes-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", (req, res) => {
  ToppingTypes.getAllToppingTypes()
    .then(allToppingTypes => {
      res.status(200).json(allToppingTypes);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Something went wrong with your request. " });
    });
});

router.get("/:id", (req, res) => {
  const toppingTypes_id = req.params.id;
  ToppingTypes.findToppingTypesById(toppingTypes_id)
    .then(toppingTypes => {
      res.status(200).json({ toppingTypes });
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
  ToppingTypes.usersToppingTypes(users_id)
    .then(toppingTypes => {
      if (toppingTypes) {
        res.status(200).json(toppingTypes);
      } else {
        res
          .status(404)
          .json({ message: "there are no topping types associated with this user" });
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
  const toppingTypesInfo = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    ToppingTypes.addToppingTypes(toppingTypesInfo)
      .then(newToppingType => {
        console.log(newToppingType);
        res.status(201).json({
          message: "you have successfully added a topping type to the order"
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
  const toppingTypes_id = req.params.id;
  const changes = req.body;
  console.log("FindToppingTypesById toppingTypes_id", toppingTypes_id, "req.body", req.body);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    ToppingTypes.findToppingTypesById(toppingTypes_id)
      .then(toppingTypes => {
        if (toppingTypes) {
          ToppingTypes.updateToppingTypes(toppingTypes_id, changes).then(updatedToppingTypes => {
            res.json({ updatedToppingTypes, toppingTypes_id });
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
  const toppingTypes_id = req.params.id;
  console.log("toppingTypes_id", toppingTypes_id);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    console.log("you have reached it");
    ToppingTypes.removeToppingTypes(toppingTypes_id)
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
      .json({ message: "You do not have rights to delete a pizza" });
  }
});

module.exports = router;
