const {pool} = require('./pool');

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;