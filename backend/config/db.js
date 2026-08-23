const mysql = require('mysql2/promise');

// A connection pool is used instead of a single connection so multiple
// requests can hit the database at the same time without waiting.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
});

module.exports = pool;