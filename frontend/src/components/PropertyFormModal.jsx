import { useState } from 'react';
import { validatePropertyForm } from '../utils/validators.js';
import { sanitizeText } from '../utils/sanitize.js';
import InlineAlert from './InlineAlert.jsx';

const EMPTY_FORM = {
    title: '',
    location: '',
    propertyType: 'apartment',
    price: '',
    bedrooms: '',
    bathrooms: '',
    areaSqft: '',
    status: 'available',
};

export default function PropertyFormModal({ initialValues, onClose, onSubmit, isSaving, submitError }) {
    const [values, setValues] = useState(() =>
        initialValues
            ? {
                  title: initialValues.title,
                  location: initialValues.location,
                  propertyType: initialValues.property_type,
                  price: String(initialValues.price),
                  bedrooms: String(initialValues.bedrooms),
                  bathrooms: String(initialValues.bathrooms),
                  areaSqft: String(initialValues.area_sqft),
                  status: initialValues.status,
              }
            : EMPTY_FORM
    );
    const [errors, setErrors] = useState({});

    function handleChange(field, rawValue) {
        const value = field === 'title' || field === 'location' ? sanitizeText(rawValue) : rawValue;
        setValues((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        const validationErrors = validatePropertyForm(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        onSubmit(values);
    }

    const isEditing = Boolean(initialValues);

    return (
        <div className="modal-overlay" role="presentation" onClick={onClose}>
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="property-form-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 id="property-form-title" style={{ fontSize: '18px' }}>
                        {isEditing ? 'Edit property' : 'Add property'}
                    </h2>
                    <button type="button" className="btn btn-secondary" onClick={onClose} aria-label="Close form">
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {submitError && (
                        <div style={{ marginBottom: 'var(--space-16)' }}>
                            <InlineAlert message={submitError} onDismiss={() => {}} />
                        </div>
                    )}
                    <div className="form-grid">
                        <div className="form-field full-width">
                            <label className="form-label" htmlFor="title">Title</label>
                            <input
                                id="title"
                                className={`input${errors.title ? ' invalid' : ''}`}
                                value={values.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                aria-invalid={Boolean(errors.title)}
                                aria-describedby={errors.title ? 'title-error' : undefined}
                            />
                            {errors.title && <span id="title-error" className="field-error">{errors.title}</span>}
                        </div>

                        <div className="form-field full-width">
                            <label className="form-label" htmlFor="location">Location</label>
                            <input
                                id="location"
                                className={`input${errors.location ? ' invalid' : ''}`}
                                value={values.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                aria-invalid={Boolean(errors.location)}
                                aria-describedby={errors.location ? 'location-error' : undefined}
                            />
                            {errors.location && <span id="location-error" className="field-error">{errors.location}</span>}
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="propertyType">Property type</label>
                            <select
                                id="propertyType"
                                className="select"
                                value={values.propertyType}
                                onChange={(e) => handleChange('propertyType', e.target.value)}
                            >
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                                <option value="villa">Villa</option>
                                <option value="plot">Plot</option>
                                <option value="commercial">Commercial</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="status">Status</label>
                            <select
                                id="status"
                                className="select"
                                value={values.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                            >
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="rented">Rented</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="price">Price (INR)</label>
                            <input
                                id="price"
                                type="number"
                                min="0"
                                className={`input${errors.price ? ' invalid' : ''}`}
                                value={values.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                aria-invalid={Boolean(errors.price)}
                                aria-describedby={errors.price ? 'price-error' : undefined}
                            />
                            {errors.price && <span id="price-error" className="field-error">{errors.price}</span>}
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="areaSqft">Area (sqft)</label>
                            <input
                                id="areaSqft"
                                type="number"
                                min="0"
                                className={`input${errors.areaSqft ? ' invalid' : ''}`}
                                value={values.areaSqft}
                                onChange={(e) => handleChange('areaSqft', e.target.value)}
                                aria-invalid={Boolean(errors.areaSqft)}
                                aria-describedby={errors.areaSqft ? 'area-error' : undefined}
                            />
                            {errors.areaSqft && <span id="area-error" className="field-error">{errors.areaSqft}</span>}
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="bedrooms">Bedrooms</label>
                            <input
                                id="bedrooms"
                                type="number"
                                min="0"
                                className={`input${errors.bedrooms ? ' invalid' : ''}`}
                                value={values.bedrooms}
                                onChange={(e) => handleChange('bedrooms', e.target.value)}
                                aria-invalid={Boolean(errors.bedrooms)}
                                aria-describedby={errors.bedrooms ? 'bedrooms-error' : undefined}
                            />
                            {errors.bedrooms && <span id="bedrooms-error" className="field-error">{errors.bedrooms}</span>}
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="bathrooms">Bathrooms</label>
                            <input
                                id="bathrooms"
                                type="number"
                                min="0"
                                className={`input${errors.bathrooms ? ' invalid' : ''}`}
                                value={values.bathrooms}
                                onChange={(e) => handleChange('bathrooms', e.target.value)}
                                aria-invalid={Boolean(errors.bathrooms)}
                                aria-describedby={errors.bathrooms ? 'bathrooms-error' : undefined}
                            />
                            {errors.bathrooms && <span id="bathrooms-error" className="field-error">{errors.bathrooms}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Add property'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
