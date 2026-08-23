import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PropertyFormModal from '../components/PropertyFormModal.jsx';
import { propertyApi } from '../services/api.js';
import { sanitizeText } from '../utils/sanitize.js';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [modalMode, setModalMode] = useState(null); // null | 'create' | { editing: property }
    const [isSaving, setIsSaving] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [actionError, setActionError] = useState('');

    const loadProperties = useCallback(async () => {
        setStatus('loading');
        try {
            const response = await propertyApi.list({
                search: appliedSearch || undefined,
                status: statusFilter || undefined,
            });
            setProperties(response.data);
            setStatus('success');
        } catch (err) {
            setErrorMessage(err.message);
            setStatus('error');
        }
    }, [appliedSearch, statusFilter]);

    useEffect(() => {
        loadProperties();
    }, [loadProperties]);

    function handleSearchSubmit(event) {
        event.preventDefault();
        setAppliedSearch(sanitizeText(searchInput.trim()));
        console.log('[Analytics] User interacted with Redis Caching');
    }

    async function handleCreateOrUpdate(values) {
        setIsSaving(true);
        setActionError('');
        try {
            if (modalMode?.editing) {
                await propertyApi.update(modalMode.editing.id, values);
            } else {
                await propertyApi.create(values);
            }
            console.log('[Analytics] User interacted with Redis Caching');
            setModalMode(null);
            await loadProperties();
        } catch (err) {
            setActionError(err.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(id) {
        setActionError('');
        try {
            await propertyApi.remove(id);
            console.log('[Analytics] User interacted with Redis Caching');
            setPendingDeleteId(null);
            await loadProperties();
        } catch (err) {
            setActionError(err.message);
            setPendingDeleteId(null);
        }
    }

    return (
        <>
            <TopBar
                title="Properties"
                subtitle="Property records are cached in Redis to speed up repeat requests."
            />
            <div className="page-content">
                <InlineAlert message={actionError} onDismiss={() => setActionError('')} />
                <div className="toolbar">
                    <form className="toolbar-controls" onSubmit={handleSearchSubmit} role="search">
                        <label htmlFor="search" className="sr-only" style={{ display: 'none' }}>
                            Search properties
                        </label>
                        <input
                            id="search"
                            className="input"
                            placeholder="Search by title or location"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <select
                            className="select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            aria-label="Filter by status"
                        >
                            <option value="">All statuses</option>
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                        </select>
                        <button type="submit" className="btn btn-secondary">
                            Search
                        </button>
                    </form>
                    <button type="button" className="btn btn-primary" onClick={() => setModalMode('create')}>
                        Add property
                    </button>
                </div>

                {status === 'loading' && <LoadingState message="Loading properties..." />}
                {status === 'error' && <ErrorState message={errorMessage} onRetry={loadProperties} />}
                {status === 'success' && properties.length === 0 && (
                    <EmptyState
                        title="No properties found"
                        hint="Try a different search term or clear the status filter."
                    />
                )}
                {status === 'success' && properties.length > 0 && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((property) => (
                                    <tr key={property.id}>
                                        <td>{property.title}</td>
                                        <td>{property.location}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{property.property_type}</td>
                                        <td>{currencyFormatter.format(property.price)}</td>
                                        <td><StatusBadge status={property.status} /></td>
                                        <td>
                                            {pendingDeleteId === property.id ? (
                                                <div className="row-actions">
                                                    <span>Delete this property?</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(property.id)}
                                                        aria-label={`Confirm delete of ${property.title}`}
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingDeleteId(null)}
                                                        aria-label={`Cancel delete of ${property.title}`}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="row-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => setModalMode({ editing: property })}
                                                        aria-label={`Edit ${property.title}`}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingDeleteId(property.id)}
                                                        aria-label={`Delete ${property.title}`}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalMode && (
                <PropertyFormModal
                    initialValues={modalMode.editing}
                    isSaving={isSaving}
                    submitError={actionError}
                    onClose={() => {
                        setActionError('');
                        setModalMode(null);
                    }}
                    onSubmit={handleCreateOrUpdate}
                />
            )}
        </>
    );
}
