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
  return db('users').select('user_id', 'username', 'first_name', 'last_name', 'city', 'email', 'state', 'password', 'executive', 'primary_admin', 'sec_admin')
}

function findBy(filter) {
  return db('users').where(filter);
}

async function add(user) {
  const [user_id] = await db('users').insert(user, 'user_id');

  return await findById(user_id);
}

function findById(user_id) {
  return db('users')
    .where({ user_id })
    .first();
}

function update(user_id, changes) {
  return db('users')
    .where({ user_id })
    .update(changes);
}

function remove(user_id) {
  return db('users')
    .where('user_id', user_id)
    .del();
}
