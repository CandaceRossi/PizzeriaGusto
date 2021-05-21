
exports.up = function(knex) {
    return knex.schema.createTable("products", col => {
        col.increments('product_id');
        
        col.varchar('name', 255)
        .notNullable();
        col.varchar('description', 255)
        .notNullable();
        col.varchar('size', 255)
        .notNullable();
        col.varchar('units', 255)
        .notNullable();
        col.varchar('comments', 255)
        .notNullable();
        col.integer('order_id')
        .unsigned()
        .notNullable()
        .references('order_id')
        .inTable('orders')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    });
};

exports.down = function(knex) {
   return knex.schema.dropTableIfExists('products')
};