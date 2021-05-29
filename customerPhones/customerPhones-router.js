const router = require("express").Router();
const customerPhones = require("../customerPhones/customerPhones-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", (req, res) => {
  CustomerPhones.getAllCustomerPhones()
    .then(allCustomerPhones => {
      res.status(200).json(allCustomerPhones);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Something went wrong with your request. " });
    });
});

router.get("/:id", (req, res) => {
  const customerPhones_id = req.params.id;
  CustomerPhones.findBeveragesById(customerPhones_id)
    .then(customerPhones => {
      res.status(200).json({ customerPhones });
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Somthing went wrong with your request",
        sqlErr: err.toString()
      });
    });
});

router.get("/customerPhones/:id", (req, res) => {
  const customers_id = req.params.id;
  CustomerPhones.customersCustomerPhones(customers_id)
    .then(customers => {
      if (customers) {
        res.status(200).json(customers);
      } else {
        res
          .status(404)
          .json({ message: "there are no customers associated with this user" });
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
  const customersInfo = req.body;
  const executive = req.decodedJwt.executive;
  if (!executive) {
    CustomerPhones.addCustomerPhones(customerPhonesInfo)
      .then(newCustomerPhone => {
        console.log(newCustomerPhone);
        res.status(201).json({
          message: "you have successfully added a customer phone number to the database"
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: "Failed to create new customer phone number",
          sqlErr: err.toString()
        });
      });
  } else {
    res.status(401).json({ message: "You do not have rights to add a customer phone number" });
  }
});

router.put("/:id", restricted, (req, res) => {
  const customerPhones_id = req.params.id;
  const changes = req.body;
  console.log("FindCustomerPhonesById customerPhones_id", customerPhones_id, "req.body", req.body);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    CustomerPhones.findCustomerPhonesyId(customerPhones_id)
      .then(customerPhone => {
        if (customerPhone) {
          CustomerPhones.updateCustomerPhones(customerPhones_id, changes).then(updatedCustomerPhone => {
            res.json({ updatedCustomerPhone, customerPhones_id });
          });
        } else {
          res
            .status(404)
            .json({ message: "Could not find customer phone number with given id" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Failed to update customer phone number" });
      });
  } else {
    res
      .status(401)
      .json({ message: "You do not have rights to edit customer phone numbers" });
  }
});

router.delete("/:id", restricted, (req, res) => {
  const customerPhones_id = req.params.id;
  console.log("customerPhones_id", customerPhones_id);
  const executive = req.decodedJwt.executive;
  if (!executive) {
    console.log("you have reached it");
    CustomerPhones.removeCustomerPhones(customerPhones_id)
      .then(deleted => {
        if (deleted) {
          res.json({ removed: deleted });
        } else {
          res
            .status(404)
            .json({ message: "Could not find customer phone number with given id" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Failed to delete customer phone number" });
      });
  } else {
    res
      .status(401)
      .json({ message: "You do not have rights to delete a customer's phone number" });
  }
});

module.exports = router;
