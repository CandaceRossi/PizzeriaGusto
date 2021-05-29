const router = require("express").Router();
const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/users-router");
const customersRouter = require("../customers/customers-router");
const usersCustomersRouter = require("../users-customers/users-customers-router");
const customerPhonesRouter = require("../customerPhones/customerPhones-router");
const ordersRouter = require("../orders/orders-router");
const ordersProductsRouter = require("../orders-products/orders-products-router");
const productsRouter = require("../products/products-router");
const pizzasRouter = require("../pizzas/pizzas-router");
const beveragesRouter = require("../beverages/beverages-router");
const sidesRouter = require("../sides/sides-router");
const toppingsRouter = require("../toppings/toppings-router");
const toppingTypesRouter = require("../toppingTypes/toppingTypes-router");


router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/customers", customersRouter);
router.use("/users-customers", usersCustomersRouter);
router.use("/customerPhones", customerPhonesRouter);
router.use("/orders", ordersRouter);
router.use("/orders-products", ordersProductsRouter);
router.use("/products", productsRouter);
router.use("/pizzas", pizzasRouter);
router.use("/beverages", beveragesRouter);
router.use("/sides", sidesRouter);
router.use("/toppings", toppingsRouter);
router.use("/toppingTypes", toppingTypesRouter);


router.get("/", (req, res) => {
  res.json({
    api: "THIS IS YOUR BASE API ROUTER. OTHERS: /api/auth  /api/users "
  });
});

module.exports = router;
