
exports.up = function(knex) {
    return knex.schema.createTable("sides", col => {
        col.increments('side_id');
        
        col.varchar('name', 255)
        .notNullable();
        col.varchar('description', 255)
        .notNullable();
        col.varchar('size', 255)
        .notNullable();
        col.varchar('units', 255)
        .notNullable();
        col.decimal("cost");
        col.varchar('comments', 255)
        .notNullable();
        col.integer('product_id')
        .unsigned()
        .notNullable()
        .references('product_id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    });
};

exports.down = function(knex) {
   return knex.schema.dropTableIfExists('sides')
};
