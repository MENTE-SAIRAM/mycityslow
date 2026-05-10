import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/cities', label: 'Cities', icon: '🏙️' },
    { to: '/spots', label: 'Spots', icon: '📍' },
    { to: '/submissions', label: 'Submissions', icon: '📝' },
    { to: '/help', label: 'Help', icon: '❓' },
    { to: '/settings', label: 'Global Settings', icon: '⚙️' },
];

export default function Sidebar() {
    const { user, logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-900 border-r border-dark-700 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-dark-700">
                <h1 className="text-xl font-bold text-primary-400">🌿 My City Slow</h1>
                <p className="text-xs text-dark-400 mt-1">Admin CMS</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User info + logout */}
            <div className="p-4 border-t border-dark-700">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-dark-400">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-left"
                >
                    ← Logout
                </button>
            </div>
        </aside>
    );
}
