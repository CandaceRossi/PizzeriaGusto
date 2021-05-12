const db = require('../data/dbConfig');

module.exports = {
  add,
  find,
  findBy,
  findById,
  remove,
  update
};

function find() {
  return db('customers').select('customers_id', 'first_name', 'last_name', 'address', 'city', 'state','email', 'password',)
}

function findBy(filter) {
  return db('customers').where(filter);
}

async function add(customer) {
  const [customers_id] = await db('customers').insert(customer, 'customers_id');

  return await findById(customers_id);
}

function findById(customers_id) {
  return db('customers')
    .where({ customers_id })
    .first();
}

function update(customers_id, changes) {
  return db('customers')
    .where({ customers_id })
    .update(changes);
}

function remove(customers_id) {
  return db('customers')
    .where('customers_id', customers_id)
    .del();
}
