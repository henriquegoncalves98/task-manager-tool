// Update with your config settings.
require('dotenv').config();

const connection = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

const commonConfig = {
  client: 'mysql',
  connection,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'src/db/migrations'
  },
  seeds: {
    directory: 'src/db/seeds'
  }
};

module.exports = Object.fromEntries(['test', 'development', 'staging', 'production'].map(env => [env, commonConfig]));
