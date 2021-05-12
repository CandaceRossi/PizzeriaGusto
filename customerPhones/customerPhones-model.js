const db = require("../data/dbConfig");

function getAllCustomerPhones() {
  return db("customerPhones");
}

function findCustomerPhones(filter) {
  return db("customerPhones").where(filter);
}

function findCustomerPhonesById(customerPhones_id) {
  return db("customerPhones")
    .where("customerPhones_id", customerPhones_id)
    .first();
}

function addCustomerPhones(customerPhonesInfo) {
  console.log(customerPhonesInfo);
  return db("customerPhones").insert(customerPhonesInfo);
}

function removeCustomerPhones(customerPhones_id) {
  return db("customerPhones")
    .where({ customerPhones_id: customerPhones_id })
    .del();
}

function updateCustomerPhones(customerPhones_id, changes) {
  console.log("customerPhones-model updateCustomerPhones reached customerPhones_id, changes:", customerPhones_id, changes);
  return db("customerPhones")
    .update(changes)
    .where({ customerPhones_id });

}

function usersCustomerPhones(users_id) {
  return db("customerPhones as c")
    .join("users as u", "u.users_id", "c.users_id")
    .select(
      "u.first_name",
      "u.last_name",
    //   "u.executive",
    //   "u.primary_admin",
    //   "u.sec_admin",
      "c.*"
    )
    .where("u.users_id", "=", users_id);
}
module.exports = {
  getAllCustomerPhones,
  findCustomerPhones,
  findCustomerPhonesById,
  addCustomerPhones,
  removeCustomerPhones,
  updateCustomerPhones,
  usersCustomerPhones
};