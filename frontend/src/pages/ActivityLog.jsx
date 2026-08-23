import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';

import { cacheApi } from '../services/api.js';

const EVENT_BADGE = {
    HIT: 'badge-success',
    MISS: 'badge-warning',
    SET: 'badge-neutral',
    INVALIDATE: 'badge-error',
};

export default function ActivityLog() {
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');

    const loadLogs = useCallback(async () => {
        setStatus('loading');
        try {
            const response = await cacheApi.activityLog(50);
            setLogs(response.data);
            setStatus('success');
        } catch (err) {
            setErrorMessage(err.message);
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    return (
        <>
            <TopBar
                title="Activity Log"
                subtitle="The most recent cache hits, misses, writes, and invalidations recorded by the backend."
            />
            <div className="page-content">
                {status === 'loading' && <LoadingState message="Loading activity log..." />}
                {status === 'error' && <ErrorState message={errorMessage} onRetry={loadLogs} />}
                {status === 'success' && logs.length === 0 && (
                    <EmptyState title="No activity recorded yet" hint="Activity appears once properties are viewed or edited." />
                )}
                {status === 'success' && logs.length > 0 && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Event</th>
                                    <th scope="col">Cache key</th>
                                    <th scope="col">Property ID</th>
                                    <th scope="col">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <span className={`badge ${EVENT_BADGE[log.event_type] || 'badge-neutral'}`}>
                                                {log.event_type}
                                            </span>
                                        </td>
                                        <td><code>{log.cache_key}</code></td>
                                        <td>{log.property_id ?? '—'}</td>
                                        <td>{new Date(log.created_at).toLocaleString()}</td>
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
