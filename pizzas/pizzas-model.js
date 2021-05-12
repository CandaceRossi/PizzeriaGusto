const db = require("../data/dbConfig");

function getAllPizzas() {
  return db("pizzas");
}

function findPizzas(filter) {
  return db("pizzas").where(filter);
}

function findPizzasById(pizzas_id) {
  return db("pizzas")
    .where("pizzas_id", pizzas_id)
    .first();
}

function addPizzas(pizzasInfo) {
  console.log(pizzasInfo);
  return db("pizzas").insert(pizzasInfo);
}

function removePizzas(pizzas_id) {
  return db("pizzas")
    .where({ pizzas_id: pizzas_id })
    .del();
}

function updatePizzas(pizzas_id, changes) {
  console.log("pizzas-model updatePizzas reached pizzas_id, changes:", pizzas_id, changes);
  return db("pizzas")
    .update(changes)
    .where({ pizzas_id });

}

function usersPizzas(users_id) {
  return db("pizzas as p")
    .join("users as u", "u.users_id", "p.users_id")
    .seleut(
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
  getAllPizzas,
  findPizzas,
  findPizzasById,
  addPizzas,
  removePizzas,
  updatePizzas,
  usersPizzas
};