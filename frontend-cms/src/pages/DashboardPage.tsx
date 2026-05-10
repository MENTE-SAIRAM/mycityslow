import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Stats {
    totalUsers: number;
    totalCities: number;
    totalSpots: number;
    approvedSpots: number;
    pendingSubmissions: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard')
            .then((res) => setStats(res.data.data || res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-dark-400">Loading dashboard...</div>;
    }

    const cards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'from-blue-500/20 to-blue-600/5 border-blue-500/20' },
        { label: 'Cities', value: stats?.totalCities || 0, icon: '🏙️', color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20' },
        { label: 'Total Spots', value: stats?.totalSpots || 0, icon: '📍', color: 'from-green-500/20 to-green-600/5 border-green-500/20' },
        { label: 'Approved Spots', value: stats?.approvedSpots || 0, icon: '✅', color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20' },
        { label: 'Pending Reviews', value: stats?.pendingSubmissions || 0, icon: '⏳', color: 'from-orange-500/20 to-orange-600/5 border-orange-500/20' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-dark-400 mt-1">Overview of My City Slow platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className={`bg-gradient-to-br ${card.color} border rounded-xl p-5 transition-transform hover:scale-105`}
                    >
                        <div className="text-2xl mb-2">{card.icon}</div>
                        <div className="text-3xl font-bold text-white">{card.value}</div>
                        <div className="text-sm text-dark-300 mt-1">{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-dark-900 border border-dark-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/cities" className="px-4 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg text-center text-sm text-white transition-all">
                        🏙️ Manage Cities
                    </a>
                    <a href="/spots" className="px-4 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg text-center text-sm text-white transition-all">
                        📍 Manage Spots
                    </a>
                    <a href="/submissions" className="px-4 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg text-center text-sm text-white transition-all">
                        📝 Review Submissions
                    </a>
                </div>
            </div>
        </div>
    );
}
