
exports.up = function(knex) {
   return knex.schema.createTable('orders_products', col => {
       
        // col.varchar('quantity', 255)
        // col.varchar('comments', 500);
        col.integer('order_id')
        .unsigned()
        .notNullable()
        .references('order_id')
        .inTable('orders')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        col.integer('product_id')
        .unsigned()
        .notNullable()
        .references('product_id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        col.primary(['order_id', 'product_id']);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orders_products')
};
