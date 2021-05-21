
exports.up = async function(knex) {
  return await knex.schema.createTable("toppingTypes", col => {
     
        col.increments('topping_type_id');
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

        col.integer('topping_id')
        .unsigned()
        .notNullable()
        .references('topping_id')
        .inTable('toppings')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    });
};

exports.down = function(knex) {
   return knex.schema.dropTableIfExists('toppingTypes')
};
