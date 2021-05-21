const router = require("express").Router();
const Orders = require("../orders/orders-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", (req, res) => {
  Orders.getAllOrders()
    .then(allOrders => {
      res.status(200).json(allOrders);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Something went wrong with your request. " });
    });
});

router.get("/:id", (req, res) => {
  const orders_id = req.params.id;
  Orders.findOrdersById(orders_id)
    .then(orders => {
      res.status(200).json({ orders });
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
  Orders.usersOrders(users_id)
    .then(orders => {
      if (orders) {
        res.status(200).json(orders);
      } else {
        res
          .status(404)
          .json({ message: "there are no orders associated with this user" });
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
  const ordersInfo = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Orders.addOrders(ordersInfo)
      .then(newOrder => {
        console.log(newOrder);
        res.status(201).json({
          message: "you have successfully added an order to the database"
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: "Failed to create new order",
          sqlErr: err.toString()
        });
      });
  } else {
    res.status(401).json({ message: "You do not have rights to add an order" });
  }
});

router.put("/:id", restricted, (req, res) => {
  const orders_id = req.params.id;
  const changes = req.body;
  console.log("FindOrdersById orders_id", orders_id, "req.body", req.body);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Orders.findOrdersById(orders_id)
      .then(orders => {
        if (orders) {
          Orders.updateOrders(orders_id, changes).then(updatedOrders => {
            res.json({ updatedOrders, orders_id });
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
  const orders_id = req.params.id;
  console.log("orders_id", orders_id);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    console.log("you have reached it");
    Orders.removeOrders(orders_id)
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
      .json({ message: "You do not have rights to delete a order" });
  }
});

module.exports = router;
