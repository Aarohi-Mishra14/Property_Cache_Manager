import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { dashboardApi } from '../services/api.js';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');

    const loadStats = useCallback(async () => {
        setStatus('loading');
        try {
            const response = await dashboardApi.stats();
            setStats(response.data);
            setStatus('success');
        } catch (err) {
            setErrorMessage(err.message);
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const statusCount = (name) =>
        stats?.byStatus.find((row) => row.status === name)?.count ?? 0;

    return (
        <>
            <TopBar
                title="Dashboard"
                subtitle="An overview of property records and the Redis cache layer."
            />
            <div className="page-content">
                {status === 'loading' && <LoadingState message="Loading dashboard..." />}
                {status === 'error' && <ErrorState message={errorMessage} onRetry={loadStats} />}
                {status === 'success' && (
                    <div className="stat-grid">
                        <div className="stat-card">
                            <div className="stat-label">Total properties</div>
                            <div className="stat-value">{stats.totalProperties}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Available</div>
                            <div className="stat-value">{statusCount('available')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Sold</div>
                            <div className="stat-value">{statusCount('sold')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Rented</div>
                            <div className="stat-value">{statusCount('rented')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Active cache entries</div>
                            <div className="stat-value">{stats.activeCacheEntries}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Redis status</div>
                            <div className="stat-value">
                                {stats.redisConnected ? 'Connected' : 'Unavailable'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
