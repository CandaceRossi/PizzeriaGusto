const router = require("express").Router();
const Products = require("../products/products-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", (req, res) => {
  Products.getAllProducts()
    .then(allProducts => {
      res.status(200).json(allProducts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Something went wrong with your request. " });
    });
});

router.get("/:id", (req, res) => {
  const products_id = req.params.id;
  Products.findProductsById(products_id)
    .then(products => {
      res.status(200).json({ products });
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
  Products.usersProducts(users_id)
    .then(products => {
      if (products) {
        res.status(200).json(products);
      } else {
        res
          .status(404)
          .json({ message: "there are no products associated with this user" });
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
  const productsInfo = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Products.addProducts(productsInfo)
      .then(newProduct => {
        console.log(newProduct);
        res.status(201).json({
          message: "you have successfully added a product to the order"
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
  const products_id = req.params.id;
  const changes = req.body;
  console.log("FindProductsById products_id", products_id, "req.body", req.body);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Products.findProductsById(products_id)
      .then(product => {
        if (product) {
          Products.updateProducts(products_id, changes).then(updatedProducts => {
            res.json({ updatedProducts, products_id });
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
  const products_id = req.params.id;
  console.log("products_id", products_id);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    console.log("you have reached it");
    Products.removeProducts(products_id)
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
