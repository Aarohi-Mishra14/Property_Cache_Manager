import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Properties from './pages/Properties.jsx';
import CacheEntries from './pages/CacheEntries.jsx';
import ActivityLog from './pages/ActivityLog.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
    return (
        <div className="app-shell">
            <Sidebar />
            <div className="main-area">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/cache-entries" element={<CacheEntries />} />
                    <Route path="/activity" element={<ActivityLog />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </div>
    );
}
