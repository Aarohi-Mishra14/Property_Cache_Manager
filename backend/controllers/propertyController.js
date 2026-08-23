const propertyService = require('../services/propertyService');
const cacheService = require('../services/cacheService');
const { validateProperty, sanitizeProperty } = require('../utils/validateProperty');

const LIST_TTL = Number(process.env.CACHE_TTL_PROPERTY_LIST || 60);
const DETAIL_TTL = Number(process.env.CACHE_TTL_PROPERTY_DETAIL || 300);

async function getProperties(req, res, next) {
    try {
        const search = (req.query.search || '').trim();
        const status = (req.query.status || '').trim();

        // The cache key includes the search/filter values because a
        // "search=flat" result is different data from the full list.
        const cacheKey = `properties:list:search=${search || 'none'}&status=${status || 'all'}`;

        const { data, fromCache } = await cacheService.getOrSetCache(
            cacheKey,
            LIST_TTL,
            () => propertyService.findAll({ search, status })
        );

        res.status(200).json({ data, meta: { fromCache } });
    } catch (err) {
        next(err);
    }
}

async function getPropertyById(req, res, next) {
    try {
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'Property id must be a number.' });
        }

        const cacheKey = `property:${id}`;
        const { data, fromCache } = await cacheService.getOrSetCache(
            cacheKey,
            DETAIL_TTL,
            () => propertyService.findById(id),
            id
        );

        if (!data) {
            return res.status(404).json({ error: 'Property not found.' });
        }

        res.status(200).json({ data, meta: { fromCache } });
    } catch (err) {
        next(err);
    }
}

async function createProperty(req, res, next) {
    try {
        const errors = validateProperty(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validation failed.', fieldErrors: errors });
        }

        const clean = sanitizeProperty(req.body);
        const created = await propertyService.create(clean);
        await cacheService.invalidatePropertyCache(null);

        res.status(201).json({ data: created });
    } catch (err) {
        next(err);
    }
}

async function updateProperty(req, res, next) {
    try {
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'Property id must be a number.' });
        }

        const existing = await propertyService.findById(id);
        if (!existing) {
            return res.status(404).json({ error: 'Property not found.' });
        }

        const errors = validateProperty(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validation failed.', fieldErrors: errors });
        }

        const clean = sanitizeProperty(req.body);
        const updated = await propertyService.update(id, clean);
        await cacheService.invalidatePropertyCache(id);

        res.status(200).json({ data: updated });
    } catch (err) {
        next(err);
    }
}

async function deleteProperty(req, res, next) {
    try {
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'Property id must be a number.' });
        }

        const deleted = await propertyService.remove(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Property not found.' });
        }

        await cacheService.invalidatePropertyCache(id);
        res.status(200).json({ data: { id: Number(id) } });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};
