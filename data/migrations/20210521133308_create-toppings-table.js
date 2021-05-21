
exports.up = async function(knex) {
 return await knex.schema.createTable("toppings", col => {
    col.increments('topping_id');
    col.integer('pizza_id')
      .unsigned()
      .notNullable()
      .references('pizza_id')
      .inTable('pizzas')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
       
    // col.integer('topping_type_id')
    //   .unsigned()
    //   .notNullable()
    //   .references('topping_type_id')
    //   .inTable('toppingTypes')
    //   .onUpdate('CASCADE')
    //   .onDelete('CASCADE');
    // // col.primary(['pizza_id', 'topping_type_id']);
    });
};

exports.down = function(knex) {
   return knex.schema.dropTableIfExists('toppings')
};
