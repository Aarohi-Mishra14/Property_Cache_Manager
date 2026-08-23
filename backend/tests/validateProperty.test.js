// Run with: node tests/validateProperty.test.js
// Simple assert-based checks, no test framework needed for this project size.

const assert = require('assert');
const { validateProperty } = require('../utils/validateProperty');

const validInput = {
    title: 'Sunrise Residency Flat',
    location: 'Bareilly, UP',
    propertyType: 'apartment',
    price: 3500000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 950,
    status: 'available',
};

// Valid input should produce no errors.
assert.strictEqual(validateProperty(validInput).length, 0, 'valid input should pass');

// Missing title should fail.
assert.ok(validateProperty({ ...validInput, title: '' }).length > 0, 'empty title should fail');

// Negative price should fail.
assert.ok(validateProperty({ ...validInput, price: -100 }).length > 0, 'negative price should fail');

// Invalid property type should fail.
assert.ok(
    validateProperty({ ...validInput, propertyType: 'castle' }).length > 0,
    'unknown property type should fail'
);

// Non-numeric bedrooms should fail.
assert.ok(
    validateProperty({ ...validInput, bedrooms: 'two' }).length > 0,
    'non-numeric bedrooms should fail'
);

console.log('All validateProperty tests passed.');
