const router = require("express").Router();
const Toppings = require("../toppings/toppings-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", (req, res) => {
  Toppings.getAllToppings()
    .then(allToppings => {
      res.status(200).json(allToppings);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Something went wrong with your request. " });
    });
});

router.get("/:id", (req, res) => {
  const toppings_id = req.params.id;
  Toppings.findToppingsById(toppings_id)
    .then(toppings => {
      res.status(200).json({ toppings });
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Something went wrong with your request",
        sqlErr: err.toString()
      });
    });
});

router.get("/users/:id", (req, res) => {
  const users_id = req.params.id;
  Toppings.usersToppings(users_id)
    .then(topping => {
      if (topping) {
        res.status(200).json(topping);
      } else {
        res
          .status(404)
          .json({ message: "there are no toppings associated with this user" });
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
  const toppingsInfo = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Toppings.addToppings(toppingsInfo)
      .then(newTopping => {
        console.log(newTopping);
        res.status(201).json({
          message: "you have successfully added a topping to the order"
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
  const toppings_id = req.params.id;
  const changes = req.body;
  console.log("FindToppingsById toppings_id", toppings_id, "req.body", req.body);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Toppings.findToppingsById(toppings_id)
      .then(topping => {
        if (topping) {
          Toppings.updateToppings(toppings_id, changes).then(updatedToppings => {
            res.json({ updatedToppings, toppings_id });
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
  const toppings_id = req.params.id;
  console.log("toppings_id", toppings_id);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    console.log("you have reached it");
    Toppings.removeToppings(toppings_id)
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
      .json({ message: "You do not have rights to delete a topping" });
  }
});

module.exports = router;
