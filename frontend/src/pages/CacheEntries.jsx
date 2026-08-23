import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import { cacheApi } from '../services/api.js';

export default function CacheEntries() {
    const [entries, setEntries] = useState([]);
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const [redisConnected, setRedisConnected] = useState(true);
    const [actionError, setActionError] = useState('');

    const loadEntries = useCallback(async () => {
        setStatus('loading');
        try {
            const response = await cacheApi.listEntries();
            setEntries(response.data);
            setRedisConnected(response.meta.redisConnected);
            setStatus('success');
        } catch (err) {
            setErrorMessage(err.message);
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    async function handleClear(key) {
        setActionError('');
        try {
            await cacheApi.clearEntry(key);
            console.log('[Analytics] User interacted with Redis Caching');
            await loadEntries();
        } catch (err) {
            setActionError(err.message);
        }
    }

    return (
        <>
            <TopBar
                title="Cache Entries"
                subtitle="Active Redis keys currently holding cached property data, with time remaining before expiry."
            />
            <div className="page-content">
                <InlineAlert message={actionError} onDismiss={() => setActionError('')} />
                {!redisConnected && status === 'success' && (
                    <div className="card" role="status">
                        Redis is currently unreachable. The application is serving data directly
                        from the database until the cache reconnects.
                    </div>
                )}

                {status === 'loading' && <LoadingState message="Loading cache entries..." />}
                {status === 'error' && <ErrorState message={errorMessage} onRetry={loadEntries} />}
                {status === 'success' && entries.length === 0 && (
                    <EmptyState
                        title="No cache entries found"
                        hint="Cache entries appear here after properties have been viewed or listed."
                    />
                )}
                {status === 'success' && entries.length > 0 && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cache key</th>
                                    <th scope="col">Expires in</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry) => (
                                    <tr key={entry.key}>
                                        <td><code>{entry.key}</code></td>
                                        <td>{entry.ttlSeconds}s</td>
                                        <td>
                                            <div className="row-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => handleClear(entry.key)}
                                                    aria-label={`Clear cache entry ${entry.key}`}
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
