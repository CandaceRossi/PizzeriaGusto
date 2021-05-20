
exports.up = function (knex) {
  return knex.schema.createTable('customers', col => {
    col.increments('customer_id');

    col.varchar("first_name", 255)
      .notNullable()
    col.varchar("last_name", 255)
      .notNullable()
    col.varchar("email", 255)
      .notNullable()
    col.text('DOB', 255)
      .notNullable();
    col.varchar('street_address', 255)
      .notNullable();
    col.varchar('city', 255)
      .notNullable()
    col.varchar('state', 255)
      .notNullable();
    col.text('post_code', 255)
      .notNullable();
    col.varchar('about', 500);
    col.timestamp('create_at').defaultTo(knex.fn.now())
    col.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('customers');

};