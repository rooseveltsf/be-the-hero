exports.up = function(knex) {
  return knex.schema.createTable('ongs', function(table) {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.decimal('whatsapp').notNullable();
    table.decimal('city').notNullable();
    table.decimal('uf').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ongs');
};
