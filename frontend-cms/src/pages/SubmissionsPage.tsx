import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Submission {
    _id: string;
    title: string;
    description: string;
    city: string;
    categories: string[];
    status: 'pending' | 'approved' | 'rejected';
    submittedBy: { name: string; email: string } | null;
    createdAt: string;
    vibe: string;
    bestTime: string;
    address: string;
}

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    const fetchSubmissions = () => {
        setLoading(true);
        api.get(`/admin/submissions?status=${filter}&limit=50`)
            .then((res) => setSubmissions((res.data.data || res.data).submissions || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchSubmissions(); }, [filter]);

    const handleApprove = async (id: string) => {
        try {
            await api.put(`/admin/submissions/${id}/approve`);
            fetchSubmissions();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error approving submission');
        }
    };

    const handleReject = async (id: string) => {
        const note = prompt('Rejection reason (optional):') || '';
        try {
            await api.put(`/admin/submissions/${id}/reject`, { reviewNote: note });
            fetchSubmissions();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error rejecting submission');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Submissions</h1>
                    <p className="text-dark-400 mt-1">Review and moderate user-submitted spots</p>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2">
                    {['pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${filter === status
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-dark-400 text-center py-12">Loading submissions...</div>
            ) : submissions.length === 0 ? (
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-12 text-center">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-dark-400">No {filter} submissions</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((sub) => (
                        <div key={sub._id} className="bg-dark-900 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-white">{sub.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${sub.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                sub.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                                    'bg-red-500/10 text-red-400'
                                            }`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-dark-300 mb-3 line-clamp-2">{sub.description}</p>
                                    <div className="flex flex-wrap gap-3 text-xs text-dark-400">
                                        <span>🏙️ {sub.city}</span>
                                        <span>🎭 {sub.vibe}</span>
                                        <span>⏰ {sub.bestTime}</span>
                                        {sub.address && <span>📍 {sub.address}</span>}
                                        <span>👤 {sub.submittedBy?.name || 'Unknown'} ({sub.submittedBy?.email || ''})</span>
                                        <span>📅 {new Date(sub.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {sub.categories.length > 0 && (
                                        <div className="flex gap-1.5 mt-2">
                                            {sub.categories.map((cat) => (
                                                <span key={cat} className="px-2 py-0.5 bg-dark-800 text-dark-300 rounded-md text-xs">{cat}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {sub.status === 'pending' && (
                                    <div className="flex gap-2 ml-4">
                                        <button onClick={() => handleApprove(sub._id)} className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all text-sm font-medium">
                                            ✅ Approve
                                        </button>
                                        <button onClick={() => handleReject(sub._id)} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium">
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
