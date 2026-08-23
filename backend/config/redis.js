const { createClient } = require('redis');

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

// Redis being down should never crash the app. We just log it and let
// cacheService fall back to hitting the database directly.
redisClient.on('error', (err) => {
    console.error('[Redis] connection error:', err.message);
});

let isConnected = false;

async function connectRedis() {
    if (isConnected) return;
    try {
        await redisClient.connect();
        isConnected = true;
        console.log('[Redis] connected');
    } catch (err) {
        console.error('[Redis] failed to connect, caching will be skipped:', err.message);
    }
}

function isRedisConnected() {
    return isConnected;
}

module.exports = { redisClient, connectRedis, isRedisConnected };
