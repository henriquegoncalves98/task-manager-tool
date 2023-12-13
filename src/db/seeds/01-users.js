const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const defaultPassword = 'password123';

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  const hashPassword = await bcrypt.hash(defaultPassword, 10);
  await knex('users').insert([
    { id: 1, email: faker.internet.email().toLowerCase(), password: hashPassword, role: 'tech', name: faker.person.fullName() },
    { id: 2, email: faker.internet.email().toLowerCase(), password: hashPassword, role: 'tech', name: faker.person.fullName() },
    { id: 3, email: faker.internet.email().toLowerCase(), password: hashPassword, role: 'tech', name: faker.person.fullName() },
    { id: 4, email: faker.internet.email().toLowerCase(), password: hashPassword, role: 'manager', name: faker.person.fullName() }
  ]);
};
