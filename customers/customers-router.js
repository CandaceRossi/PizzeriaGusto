const router = require("express").Router();
const Customers = require("./customers-model");
const restricted = require("../auth/restricted-middleware");

// !! don't forget to replace restricted middleware restricted, ^^ note: const user_id = req.decodedJWt.user_id
router.get("/", (req, res) => {
  console.log("customers-router.js decodedToken", req.decodedJwt);
  Customers.find()
    .then(customers => {
      res.status(200).json(customers);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Sorry, internal server error." });
    });
});

router.get("/:id", (req, res) => {
  const customers_id = req.params.id;
  Customers.findById(customers_id)
    .then(customer => {
      if (customer) {
        res.status(200).json(customer);
      } else {
        res
          .status(400)
          .json({ errorMessage: "Sorry, we couldn't find a customer by that id" });
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
      .json({ message: "You don't have user privileges to delete customers" });
  } else {
    Customers.remove(req.params.id)
      .then(info => {
        if (info) {
          res
            .sendStatus(204)
            .json({ message: "You successfully deleted this customer" });
        } else {
          res.status(404).json({ message: "That customer id does not exist" });
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
    Customers.update(req.params.id, req.body).then(updatedCustomer => {
      if (updatedCustomer) {
        res.status(200).json(updatedCustomer);
      } else {
        res
          .status(400)
          .json({ errorMessage: "Sorry, we don't have a customer by that id" });
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "You do not have rights to update an existing customer" });
  }
});

module.exports = router;
