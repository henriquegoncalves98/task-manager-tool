const Knex = require('knex');
const configs = require('../../knexfile');

module.exports = Knex(configs[process.env.NODE_ENV || 'development']);
