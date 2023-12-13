exports.up = function (knex) {
  return knex.schema
    .table('tasks', (table) => {
      table.datetime('date', { precision: 6 }).notNullable().defaultTo(knex.fn.now(6));
    });
};

exports.down = function (knex) {
  return knex.schema
    .table('tasks')
    .dropColumn('date');
};
