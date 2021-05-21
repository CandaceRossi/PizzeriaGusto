const router = require("express").Router();
const Pizzas = require("../pizzas/pizzas-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", (req, res) => {
  Pizzas.getAllPizzas()
    .then(allPizzas => {
      res.status(200).json(allPizzas);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Something went wrong with your request. " });
    });
});

router.get("/:id", (req, res) => {
  const pizzas_id = req.params.id;
  Pizzas.findPizzasById(pizzas_id)
    .then(pizzas => {
      res.status(200).json({ pizzas });
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
  Pizzas.usersPizzas(users_id)
    .then(pizzas => {
      if (pizzas) {
        res.status(200).json(pizzas);
      } else {
        res
          .status(404)
          .json({ message: "there are no pizzas associated with this user" });
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
  const pizzasInfo = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Pizzas.addPizzas(pizzasInfo)
      .then(newPizza => {
        console.log(newPizza);
        res.status(201).json({
          message: "you have successfully added a pizza to the order"
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
  const pizzas_id = req.params.id;
  const changes = req.body;
  console.log("FindPizzasById pizzas_id", pizzas_id, "req.body", req.body);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Pizzas.findPizzasById(pizzas_id)
      .then(pizza => {
        if (pizza) {
          Pizzas.updatePizzas(pizzas_id, changes).then(updatedPizzas => {
            res.json({ updatedPizzas, pizzas_id });
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
  const pizzas_id = req.params.id;
  console.log("pizzas_id", pizzas_id);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    console.log("you have reached it");
    Pizzas.removePizzas(pizzas_id)
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
