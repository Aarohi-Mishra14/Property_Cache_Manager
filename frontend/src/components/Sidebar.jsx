import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/properties', label: 'Properties' },
    { to: '/cache-entries', label: 'Cache Entries' },
    { to: '/activity', label: 'Activity Log' },
    { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                Property<span>OS</span>
            </div>
            <nav className="sidebar-nav" aria-label="Main navigation">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
