
exports.up = function (knex) {
  return knex.schema.createTable('users', col => {
    col.increments('user_id');

    col.varchar('username', 255)
      .notNullable()
      .unique();
    col.varchar('password', 255)
      .notNullable()
    col.varchar("first_name", 255)
      .notNullable()
    col.varchar("last_name", 255)
      .notNullable()
    col.varchar("email", 255)
      .notNullable()
    col.varchar('city', 255)
      .notNullable()
    col.varchar('state', 255)
      .notNullable()
    col.boolean('executive').defaultTo(false);
    col.boolean('primary_admin').defaultTo(false);
    col.boolean('sec_admin').defaultTo(false);
    col.timestamp('create_at').defaultTo(knex.fn.now())
    col.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};