require('dotenv').config();

// Central Sequelize config, driven entirely by environment variables.
// Previously this file was a static config.json with hardcoded credentials
// (postgres/admin) for development and a completely different engine
// (mysql, root, no password) for test/production. That was both a security
// issue (secrets committed to the repo) and a bug (dev used Postgres but
// test/prod used MySQL, so migrations/models could behave differently
// across environments). Everything below now uses Postgres consistently
// and reads its values from .env.

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'hr_application_development',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || 'hr_application_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
};
