const cacheService = require('../services/cacheService');
const pool = require('../config/db');
const { isRedisConnected } = require('../config/redis');

async function getCacheEntries(req, res, next) {
    try {
        const entries = await cacheService.listActiveCacheEntries();
        res.status(200).json({ data: entries, meta: { redisConnected: isRedisConnected() } });
    } catch (err) {
        next(err);
    }
}

async function deleteCacheEntry(req, res, next) {
    try {
        const { key } = req.params;
        const deleted = await cacheService.clearCacheEntry(key);

        if (!deleted) {
            return res.status(404).json({ error: 'Cache entry not found or already expired.' });
        }

        res.status(200).json({ data: { key } });
    } catch (err) {
        next(err);
    }
}

async function getActivityLog(req, res, next) {
    try {
        const limit = Math.min(Number(req.query.limit) || 50, 200);

        const [rows] = await pool.query(
            `SELECT id, cache_key, event_type, property_id, created_at
             FROM cache_activity_log
             ORDER BY created_at DESC
             LIMIT ?`,
            [limit]
        );

        res.status(200).json({ data: rows });
    } catch (err) {
        next(err);
    }
}

module.exports = { getCacheEntries, deleteCacheEntry, getActivityLog };
