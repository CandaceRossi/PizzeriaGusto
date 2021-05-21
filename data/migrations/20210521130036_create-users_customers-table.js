
exports.up = function (knex) {
  return knex.schema.createTable('users_customers', col => {

    col.integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    col.integer('customer_id')
      .unsigned()
      .notNullable()
      .references('customer_id')
      .inTable('customers')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    col.primary(['user_id', 'customer_id']);
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users_customers')
};
