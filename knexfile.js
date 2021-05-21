// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection: {
      // database: process.env.DB_DEV_DATABASE,
      // user: process.env.DB_DEV_USER,
      // password: process.env.DB_DEV_PASSWORD
      database: 'postgres',
      user: 'postgres',
      password: 'Fuckpostgres1$'
    },
    // pool: {
    // afterCreate: (conn, done) => {
    //   // runs after a connection is made to the sqlite engine
    //   conn.run('PRAGMA foreign_keys = ON', done) // turn on FK enforcement
    // },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },
  production: {
    client: "pg",
    // connection: process.env.DATABASE_URL,
    connection: 5432,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },
  testing: {
    client: "pg",
    connection: {
      database: process.env.DB_TESTING_DATABASE,
      user: process.env.DB_DEV_USER,
      password: process.env.DB_DEV_PASSWORD
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  }
}