const db = require("../data/dbConfig");

function getAllOrders() {
  return db("orders");
}

function findOrders(filter) {
  return db("orders").where(filter);
}

function findOrdersById(orders_id) {
  return db("orders")
    .where("orders_id", orders_id)
    .first();
}

function addOrders(ordersInfo) {
  console.log(ordersInfo);
  return db("orders").insert(ordersInfo);
}

function removeOrders(orders_id) {
  return db("orders")
    .where({ orders_id: orders_id })
    .del();
}

function updateOrders(orders_id, changes) {
  console.log("orders-model updateOrders reached orders_id, changes:", orders_id, changes);
  return db("orders")
    .update(changes)
    .where({ orders_id });

}

function usersOrders(users_id) {
  return db("orders as o")
    .join("users as u", "u.users_id", "o.users_id")
    .select(
      "u.first_name",
      "u.last_name",
    //   "u.executive",
    //   "u.primary_admin",
    //   "u.sec_admin",
      "o.*"
    )
    .where("u.users_id", "=", users_id);
}
module.exports = {
  getAllOrders,
  findOrders,
  findOrdersById,
  addOrders,
  removeOrders,
  updateOrders,
  usersOrders
};