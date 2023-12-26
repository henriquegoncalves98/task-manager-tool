exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.enum('role', ['manager', 'tech']).notNullable().defaultTo('tech');
      table.string('name').notNullable();
      table.timestamps(true, true);
    })
    .createTable('tasks', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('summary', 2500).notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('tasks');
};
