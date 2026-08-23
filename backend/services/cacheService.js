const { redisClient, isRedisConnected } = require('../config/redis');
const pool = require('../config/db');

async function logActivity(cacheKey, eventType, propertyId = null) {
    try {
        await pool.query(
            'INSERT INTO cache_activity_log (cache_key, event_type, property_id) VALUES (?, ?, ?)',
            [cacheKey, eventType, propertyId]
        );
    } catch (err) {
        // Logging must never break the actual request.
        console.error('[cacheService] failed to log activity:', err.message);
    }
}

// Checks Redis first. On a hit, returns the cached value straight away.
// On a miss (or if Redis is unreachable), it runs fetchFromDb, stores the
// result in Redis with the given TTL, and returns it.
async function getOrSetCache(cacheKey, ttlSeconds, fetchFromDb, propertyId = null) {
    if (isRedisConnected()) {
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                await logActivity(cacheKey, 'HIT', propertyId);
                return { data: JSON.parse(cached), fromCache: true };
            }
        } catch (err) {
            console.error('[cacheService] redis read failed, falling back to db:', err.message);
        }
    }

    await logActivity(cacheKey, 'MISS', propertyId);
    const data = await fetchFromDb();

    if (isRedisConnected()) {
        try {
            await redisClient.set(cacheKey, JSON.stringify(data), { EX: ttlSeconds });
            await logActivity(cacheKey, 'SET', propertyId);
        } catch (err) {
            console.error('[cacheService] redis write failed:', err.message);
        }
    }

    return { data, fromCache: false };
}

// Removes stale cache entries after a property is created, updated or deleted.
async function invalidatePropertyCache(propertyId) {
    if (!isRedisConnected()) return;

    try {
        if (propertyId) {
            await redisClient.del(`property:${propertyId}`);
            await logActivity(`property:${propertyId}`, 'INVALIDATE', propertyId);
        }

        // The list endpoint is cached per search/filter combination, so every
        // properties:list:* key is cleared whenever the underlying data changes.
        for await (const key of redisClient.scanIterator({ MATCH: 'properties:list:*', COUNT: 50 })) {
            await redisClient.del(key);
            await logActivity(key, 'INVALIDATE', propertyId);
        }
    } catch (err) {
        console.error('[cacheService] cache invalidation failed:', err.message);
    }
}

// Lists every active cache entry with its remaining TTL, for the Cache Entries page.
async function listActiveCacheEntries() {
    if (!isRedisConnected()) return [];

    const entries = [];
    for await (const key of redisClient.scanIterator({ MATCH: 'propert*', COUNT: 50 })) {
        const ttl = await redisClient.ttl(key);
        entries.push({ key, ttlSeconds: ttl });
    }
    return entries;
}

async function clearCacheEntry(key) {
    if (!isRedisConnected()) {
        return false;
    }
    const deletedCount = await redisClient.del(key);
    if (deletedCount > 0) {
        await logActivity(key, 'INVALIDATE', null);
    }
    return deletedCount > 0;
}

module.exports = {
    getOrSetCache,
    invalidatePropertyCache,
    listActiveCacheEntries,
    clearCacheEntry,
    logActivity,
};
