const pool = require('../config/db');
const cacheService = require('../services/cacheService');
const { isRedisConnected } = require('../config/redis');

async function getStats(req, res, next) {
    try {
        const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM properties');
        const [statusRows] = await pool.query(
            'SELECT status, COUNT(*) AS count FROM properties GROUP BY status'
        );

        const activeCacheEntries = await cacheService.listActiveCacheEntries();

        res.status(200).json({
            data: {
                totalProperties: total,
                byStatus: statusRows,
                activeCacheEntries: activeCacheEntries.length,
                redisConnected: isRedisConnected(),
            },
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getStats };
