const db = require("../data/dbConfig");

function getAllProducts() {
  return db("products");
}

function findProducts(filter) {
  return db("products").where(filter);
}

function findProductsById(products_id) {
  return db("products")
    .where("products_id", products_id)
    .first();
}

function addProducts(productsInfo) {
  console.log(productsInfo);
  return db("products").insert(productsInfo);
}

function removeProducts(products_id) {
  return db("products")
    .where({ products_id: products_id })
    .del();
}

function updateProducts(products_id, changes) {
  console.log("products-model updateProducts reached products_id, changes:", products_id, changes);
  return db("products")
    .update(changes)
    .where({ products_id });

}

function usersProducts(users_id) {
  return db("products as p")
    .join("users as u", "u.users_id", "p.users_id")
    .select(
      "u.first_name",
      "u.last_name",
    //   "u.executive",
    //   "u.primary_admin",
    //   "u.sec_admin",
      "p.*"
    )
    .where("u.users_id", "=", users_id);
}
module.exports = {
  getAllProducts,
  findProducts,
  findProductsById,
  addProducts,
  removeProducts,
  updateProducts,
  usersProducts
};