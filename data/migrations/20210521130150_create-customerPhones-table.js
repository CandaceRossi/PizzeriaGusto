
exports.up = function(knex) {
    return knex.schema.createTable("customerPhones", col => {
        col.increments("customerPhones_id");
        col.varchar('area_code', 255)
        .notNullable();
        col.varchar('phone_number', 255)
        .notNullable();
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
  return knex.schema.dropTableIfExists("customerPhones");
};
