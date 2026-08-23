const express = require('express');
const router = express.Router();
const cacheController = require('../controllers/cacheController');

router.get('/entries', cacheController.getCacheEntries);
router.delete('/entries/:key', cacheController.deleteCacheEntry);
router.get('/activity', cacheController.getActivityLog);

module.exports = router;
