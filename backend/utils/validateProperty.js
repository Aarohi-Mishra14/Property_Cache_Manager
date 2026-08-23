const validator = require('validator');

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'plot', 'commercial'];
const STATUSES = ['available', 'sold', 'rented'];

// Returns an array of field-level error messages. An empty array means
// the input is valid. The API never trusts the frontend's own validation.
function validateProperty(body) {
    const errors = [];

    const title = (body.title || '').trim();
    if (!title || title.length < 3 || title.length > 150) {
        errors.push({ field: 'title', message: 'Title must be between 3 and 150 characters.' });
    }

    const location = (body.location || '').trim();
    if (!location || location.length < 2 || location.length > 150) {
        errors.push({ field: 'location', message: 'Location must be between 2 and 150 characters.' });
    }

    if (!PROPERTY_TYPES.includes(body.propertyType)) {
        errors.push({ field: 'propertyType', message: 'Select a valid property type.' });
    }

    if (body.price === undefined || body.price === null || !validator.isFloat(String(body.price), { min: 0 })) {
        errors.push({ field: 'price', message: 'Price must be a number of 0 or more.' });
    }

    // Bedrooms/bathrooms/area are optional. The frontend sends them as an
    // empty string (not undefined) when left blank, so both are treated
    // as "not provided" here to match what the client already validated.
    const isBlank = (value) => value === undefined || value === null || value === '';

    if (!isBlank(body.bedrooms) && !validator.isInt(String(body.bedrooms), { min: 0, max: 50 })) {
        errors.push({ field: 'bedrooms', message: 'Bedrooms must be a whole number between 0 and 50.' });
    }

    if (!isBlank(body.bathrooms) && !validator.isInt(String(body.bathrooms), { min: 0, max: 50 })) {
        errors.push({ field: 'bathrooms', message: 'Bathrooms must be a whole number between 0 and 50.' });
    }

    if (!isBlank(body.areaSqft) && !validator.isInt(String(body.areaSqft), { min: 0, max: 1000000 })) {
        errors.push({ field: 'areaSqft', message: 'Area must be a whole number of 0 or more.' });
    }

    if (body.status !== undefined && !STATUSES.includes(body.status)) {
        errors.push({ field: 'status', message: 'Select a valid status.' });
    }

    return errors;
}

// Strips HTML tags from free-text fields before they ever reach the
// database, so stored data can't carry a script injection payload.
function sanitizeProperty(body) {
    return {
        title: validator.escape((body.title || '').trim()),
        location: validator.escape((body.location || '').trim()),
        propertyType: body.propertyType,
        price: Number(body.price),
        bedrooms: body.bedrooms !== undefined && body.bedrooms !== '' ? Number(body.bedrooms) : 0,
        bathrooms: body.bathrooms !== undefined && body.bathrooms !== '' ? Number(body.bathrooms) : 0,
        areaSqft: body.areaSqft !== undefined && body.areaSqft !== '' ? Number(body.areaSqft) : 0,
        status: body.status || 'available',
    };
}

module.exports = { validateProperty, sanitizeProperty };
