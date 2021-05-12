const db = require("../data/dbConfig");

function getAllToppings() {
  return db("toppings");
}

function findToppings(filter) {
  return db("toppings").where(filter);
}

function findToppingsById(toppings_id) {
  return db("toppings")
    .where("toppings_id", toppings_id)
    .first();
}

function addToppings(toppingsInfo) {
  console.log(toppingsInfo);
  return db("toppings").insert(toppingsInfo);
}

function removeToppings(toppings_id) {
  return db("toppings")
    .where({ toppings_id: toppings_id })
    .del();
}

function updateToppings(toppings_id, changes) {
  console.log("toppings-model updateToppings reached toppings_id, changes:", toppings_id, changes);
  return db("toppings")
    .update(changes)
    .where({ toppings_id });

}

function usersToppings(users_id) {
  return db("toppings as t")
    .join("users as u", "u.users_id", "t.users_id")
    .select(
      "u.first_name",
      "u.last_name",
    //   "u.executive",
    //   "u.primary_admin",
    //   "u.sec_admin",
      "t.*"
    )
    .where("u.users_id", "=", users_id);
}
module.exports = {
  getAllToppings,
  findToppings,
  findToppingsById,
  addToppings,
  removeToppings,
  updateToppings,
  usersToppings
};