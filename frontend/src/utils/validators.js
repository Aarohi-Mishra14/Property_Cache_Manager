const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'plot', 'commercial'];
const STATUSES = ['available', 'sold', 'rented'];

// Mirrors the backend's rules so the user gets instant feedback, but the
// backend still re-validates everything before it touches the database.
export function validatePropertyForm(values) {
    const errors = {};

    if (!values.title || values.title.trim().length < 3) {
        errors.title = 'Title must be at least 3 characters.';
    }

    if (!values.location || values.location.trim().length < 2) {
        errors.location = 'Location is required.';
    }

    if (!PROPERTY_TYPES.includes(values.propertyType)) {
        errors.propertyType = 'Select a property type.';
    }

    const price = Number(values.price);
    if (values.price === '' || Number.isNaN(price) || price < 0) {
        errors.price = 'Enter a valid price of 0 or more.';
    }

    if (values.bedrooms !== '' && (Number.isNaN(Number(values.bedrooms)) || Number(values.bedrooms) < 0)) {
        errors.bedrooms = 'Bedrooms must be 0 or more.';
    }

    if (values.bathrooms !== '' && (Number.isNaN(Number(values.bathrooms)) || Number(values.bathrooms) < 0)) {
        errors.bathrooms = 'Bathrooms must be 0 or more.';
    }

    if (values.areaSqft !== '' && (Number.isNaN(Number(values.areaSqft)) || Number(values.areaSqft) < 0)) {
        errors.areaSqft = 'Area must be 0 or more.';
    }

    if (!STATUSES.includes(values.status)) {
        errors.status = 'Select a status.';
    }

    return errors;
}
