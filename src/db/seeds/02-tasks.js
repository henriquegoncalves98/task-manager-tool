const { faker } = require('@faker-js/faker');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('tasks').del();
  const techs = await knex('users').where({ role: 'tech' });
  const techsCount = techs.length;
  await knex('tasks').insert([...Array(10)].map((_, i) => ({ id: i + 1, title: faker.lorem.sentence(), summary: faker.lorem.paragraph(), user_id: techs[i % techsCount].id })));
};
