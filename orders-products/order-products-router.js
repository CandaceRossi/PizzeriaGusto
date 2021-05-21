const router = require("express").Router();
const Orders = require("../orders/orders-model");
const Products = require("../products/products-model");
const restricted = require("../auth/restricted-middleware");

// endpoint: api/orders-products/products
router.get("/all", (req, res) => {
  Products.productsAndUsers()
    .then(products => {
      res.status(200).json(products);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Something went wrong with your request." });
    });
});

// endpoint: api/orders-products/products/:id
router.get("/products/:id", (req, res) => {
  const products_id = req.params.id;
  Products.findProductsById(products_id)
    .then(product => {
      if (product) {
        Product.aProductOrders(products_id).then(product => {
          res.status(200).json(product);
        });
      } else {
        res.status(404).json({
          errorMessage:
            "Sorry, there's either no product by that id, or that product is not connected to any orders"
        });
      }
    })

    .catch(err => {
      res
        .status(500)
        .json({ message: "Something went wrong with your request." });
    });
});

// endpoint: api/orders-products/orders/:id
router.get("/orders/:id", (req, res) => {
  const orders_id = req.params.id;
  Orders.findById(orders_id)
    .then(order => {
      if (order) {
       Orders.aOrderProducts(orders_id).then(order => {
          res.status(200).json(order);
        });
      } else {
        res.status(404).json({
          errorMessage:
            "Sorry, there's either no order by that id, or that order is not connected to any products"
        });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Something went wrong with your request" });
    });
});

// endpoint: api/orders-products/connect-order
router.post("/connect-order", restricted, (req, res) => {
  const { orders_id, products_id } = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Orders.findById(orders_id).then(order => {
      if (!order) {
        res
          .status(404)
          .json({ errorMessage: "We don't have an order by that id" });
      } else {
        console.log(order);
        Products.findProductsById(products_id)
          .then(product => {
            if (!product) {
              res
                .status(404)
                .json({ errorMessage: "We don't have a product by that id" });
            } else {
              console.log(product);
              Products.connectOrder(orders_id, products_id).then(info => {
                res.status(200).json({ info });
              });
            }
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: err });
          });
      }
    });
  } else {
    res
      .status(401)
      .json({
        message: "You do not have rights to add order-product relationship"
      });
  }
});

router.delete("/disconnect", restricted, (req, res) => {
  const { orders_id, products_id } = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Orders.findById(orders_id).then(order => {
      if (!order) {
        res
          .status(401)
          .json({ errorMessage: "We don't have an order by that id" });
      } else {
        console.log(order);
        Products.findProductsById(products_id)
          .then(product => {
            if (!product) {
              res
                .status(401)
                .json({ errorMessage: "We don't have a product by that id" });
            } else {
              console.log(product);
              Products.removeOrdersFromProducts(orders_id, products_id).then(info => {
                res.status(200).json({
                  info,
                  message:
                    "the order-product relationship was successfully deleted"
                });
              });
            }
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ errorInfo: err });
          });
      }
    });
  } else {
    res
      .status(401)
      .json({
        message: "You do not have rights to delete order-product relationship"
      });
  }
});

module.exports = router;
