const router = require("express").Router();
const Beverages = require("../beverages/beverages-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", (req, res) => {
  Beverages.getAllBeverages()
    .then(allBeverages => {
      res.status(200).json(allBeverages);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Something went wrong with your request. " });
    });
});

router.get("/:id", (req, res) => {
  const beverages_id = req.params.id;
  Beverages.findBeveragesById(beverages_id)
    .then(beverages => {
      res.status(200).json({ beverages });
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
  Beverages.usersBeverages(users_id)
    .then(beverages => {
      if (beverages) {
        res.status(200).json(beverages);
      } else {
        res
          .status(404)
          .json({ message: "there are no beverages associated with this user" });
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
  const beveragesInfo = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Beverages.addBeverages(beveragesInfo)
      .then(newBeverage => {
        console.log(newBeverage);
        res.status(201).json({
          message: "you have successfully added an beverage to the database"
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: "Failed to create new order",
          sqlErr: err.toString()
        });
      });
  } else {
    res.status(401).json({ message: "You do not have rights to add a beverage" });
  }
});

router.put("/:id", restricted, (req, res) => {
  const beverages_id = req.params.id;
  const changes = req.body;
  console.log("FindBeveragesById beverages_id", beverages_id, "req.body", req.body);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Beverages.findBeveragessById(beverages_id)
      .then(beverage => {
        if (beverage) {
          Beverages.updateBeverages(beverages_id, changes).then(updatedBeverage => {
            res.json({ updatedBeverage, beverages_id });
          });
        } else {
          res
            .status(404)
            .json({ message: "Could not find beverage with given id" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Failed to update beverage" });
      });
  } else {
    res
      .status(401)
      .json({ message: "You do not have rights to edit beverages" });
  }
});

router.delete("/:id", restricted, (req, res) => {
  const beverages_id = req.params.id;
  console.log("beverages_id", beverages_id);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    console.log("you have reached it");
    Beverages.removeBeverages(beverages_id)
      .then(deleted => {
        if (deleted) {
          res.json({ removed: deleted });
        } else {
          res
            .status(404)
            .json({ message: "Could not find beverage with given id" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Failed to delete beverage" });
      });
  } else {
    res
      .status(401)
      .json({ message: "You do not have rights to delete a beverage" });
  }
});

module.exports = router;
