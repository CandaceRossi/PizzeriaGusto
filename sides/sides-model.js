const db = require("../data/dbConfig");

function getAllSides() {
  return db("sides");
}

function findSides(filter) {
  return db("sides").where(filter);
}

function findSidesById(sides_id) {
  return db("sides")
    .where("sides_id", sides_id)
    .first();
}

function addSides(sidesInfo) {
  console.log(sidesInfo);
  return db("sides").insert(sidesInfo);
}

function removeSides(sides_id) {
  return db("sides")
    .where({ sides_id: sides_id })
    .del();
}

function updateSides(sides_id, changes) {
  console.log("sides-model updateSides reached sides_id, changes:", sides_id, changes);
  return db("sides")
    .update(changes)
    .where({ sides_id });

}

function usersSides(users_id) {
  return db("sides as s")
    .join("users as u", "u.users_id", "s.users_id")
    .select(
      "u.first_name",
      "u.last_name",
    //   "u.executive",
    //   "u.primary_admin",
    //   "u.sec_admin",
      "s.*"
    )
    .where("u.users_id", "=", users_id);
}
module.exports = {
  getAllSides,
  findSides,
  findSidesById,
  addSides,
  removeSides,
  updateSides,
  usersSides
};