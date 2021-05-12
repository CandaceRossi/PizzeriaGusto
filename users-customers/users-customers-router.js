const router = require("express").Router();
const Users = require("../users/users-model");
const Customers = require("../customers/customers-model");
const restricted = require("../auth/restricted-middleware");

// endpoint: api/users-customers/customers
router.get("/all", (req, res) => {
  Customers.customersAndUsers()
    .then(customer => {
      res.status(200).json(customer);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Something went wrong with your request." });
    });
});

// endpoint: api/users-customers/customers/:id
router.get("/customers/:id", (req, res) => {
  const customers_id = req.params.id;
  Customers.findCustomersById(customers_id)
    .then(customer => {
      if (customer) {
        Customers.aCustomerUser(customers_id).then(customer => {
          res.status(200).json(customer);
        });
      } else {
        res.status(404).json({
          errorMessage:
            "Sorry, there's either no customers by that id, or that customer is not connected to any users"
        });
      }
    })

    .catch(err => {
      res
        .status(500)
        .json({ message: "Something went wrong with your request." });
    });
});

// endpoint: api/users-customers/user/:id
router.get("/users/:id", (req, res) => {
  const users_id = req.params.id;
  Users.findById(users_id)
    .then(user => {
      if (user) {
        Customers.aUserCustomer(users_id).then(user => {
          res.status(200).json(user);
        });
      } else {
        res.status(404).json({
          errorMessage:
            "Sorry, there's either no user by that id, or that user is not connected to any schools"
        });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Something went wrong with your request" });
    });
});

// endpoint: api/users-schools/connect-user
router.post("/connect-user", restricted, (req, res) => {
  const { users_id, customers_id } = req.body;
  const board = req.decodedJwt.board;
  if (!board) {
    Users.findById(users_id).then(user => {
      if (!user) {
        res
          .status(404)
          .json({ errorMessage: "We don't have a user by that id" });
      } else {
        console.log(user);
        Customers.findCustomersById(customers_id)
          .then(customer => {
            if (!customer) {
              res
                .status(404)
                .json({ errorMessage: "We don't have a customer by that id" });
            } else {
              console.log(customer);
              Customers.connectUser(users_id, customers_id).then(info => {
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
        message: "You do not have rights to add user-customer relationship"
      });
  }
});

router.delete("/disconnect", restricted, (req, res) => {
  const { users_id, customers_id } = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    Users.findById(users_id).then(user => {
      if (!user) {
        res
          .status(401)
          .json({ errorMessage: "We don't have a user by that id" });
      } else {
        console.log(user);
        Customers.findCustomersById(customers_id)
          .then(customer => {
            if (!customer) {
              res
                .status(401)
                .json({ errorMessage: "We don't have a customer by that id" });
            } else {
              console.log(customer);
              Customers.removeUserFromCustomers(users_id, customers_id).then(info => {
                res.status(200).json({
                  info,
                  message:
                    "the user-customer relationship was successfully deleted"
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
        message: "You do not have rights to delete user-customer relationship"
      });
  }
});

module.exports = router;
