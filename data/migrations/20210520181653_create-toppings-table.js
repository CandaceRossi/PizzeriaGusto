
exports.up = function(knex) {
 return knex.schema.createTable("toppings", col => {
    col.integer('pizza_id')
      .unsigned()
      .notNullable()
      .references('pizza_id')
      .inTable('pizzas')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    col.integer('topping_type_code')
      .unsigned()
      .notNullable()
      .references('topping_type_code')
      .inTable('toppingTypes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    col.primary(['pizza_id', 'topping_type_code']);
    });
};

exports.down = function(knex) {
   return knex.schema.dropTableIfExists('toppings')
};