
exports.up = function(knex) {
  return knex.schema.createTable("orders", col => {
        col.increments('order_id');
        
        col.varchar('comments', 500);
        col.timestamp('create_at').defaultTo(knex.fn.now())
        col.timestamp('updated_at').defaultTo(knex.fn.now())
        col.integer('customer_id')
        .unsigned()
        .notNullable()
        .references('customer_id')
        .inTable('customers')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    });
};


exports.down = function(knex) {
  return knex.schema.dropTableIfExists('orders');
};
