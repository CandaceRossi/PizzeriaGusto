const db = require("../data/dbConfig");

function getAllBeverages() {
  return db("beverages");
}

function findBeverages(filter) {
  return db("beverages").where(filter);
}

function findBeveragesById(beverages_id) {
  return db("beverages")
    .where("beverages_id", beverages_id)
    .first();
}

function addBeverages(beveragesInfo) {
  console.log(beveragesInfo);
  return db("beverages").insert(beveragesInfo);
}

function removeBeverages(beverages_id) {
  return db("beverages")
    .where({ beverages_id: beverages_id })
    .del();
}

function updateBeverages(beverages_id, changes) {
  console.log("beverages-model updateBeverages reached beverages_id, changes:", beverages_id, changes);
  return db("beverages")
    .update(changes)
    .where({ beverages_id });

}

function usersBeverages(users_id) {
  return db("beverages as b")
    .join("users as u", "u.users_id", "b.users_id")
    .select(
      "u.first_name",
      "u.last_name",
    //   "u.executive",
    //   "u.primary_admin",
    //   "u.sec_admin",
      "b.*"
    )
    .where("u.users_id", "=", users_id);
}
module.exports = {
  getAllBeverages,
  findBeverages,
  findBeveragesById,
  addBeverages,
  removeBeverages,
  updateBeverages,
  usersBeverages
};