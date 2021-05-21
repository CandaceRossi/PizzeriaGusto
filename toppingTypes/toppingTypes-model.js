const db = require("../data/dbConfig");

function getAllToppingTypes() {
  return db("toppingTypes");
}

function findToppingTypes(filter) {
  return db("toppingTypes").where(filter);
}

function findToppingTypesById(toppingTypes_id) {
  return db("toppingTypes")
    .where("toppingTypes_id", toppingTypes_id)
    .first();
}

function addToppingTypes(toppingTypesInfo) {
  console.log(toppingTypesInfo);
  return db("toppingTypes").insert(toppingTypesInfo);
}

function removeToppingTypes(toppingTypes_id) {
  return db("toppingTypes")
    .where({ toppingTypes_id: toppingTypes_id })
    .del();
}

function updateToppingTypes(toppingTypes_id, changes) {
  console.log("toppingTypes-model updateToppingTypes reached toppingTypes_id, changes:", toppingTypes_id, changes);
  return db("toppingTypes")
    .update(changes)
    .where({ toppingTypes_id });

}

function usersToppingTypes(users_id) {
  return db("toppingTypes as t")
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
  getAllToppingTypes,
  findToppingTypes,
  findToppingTypesById,
  addToppingTypes,
  removeToppingTypes,
  updateToppingTypes,
  usersToppingTypes
};