import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useAppStore } from '../store/useAppStore';

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/register', form);
            localStorage.setItem('token', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            setUser(data.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-text dark:text-dark-text">
                        Join My City Slow
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                        Create an account to discover, save, and submit peaceful spots.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 pl-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full p-4 rounded-xl bg-warm-bg dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-sage border border-transparent focus:border-sage transition-all"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 pl-1">Email address</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full p-4 rounded-xl bg-warm-bg dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-sage border border-transparent focus:border-sage transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 pl-1">Password</label>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full p-4 rounded-xl bg-warm-bg dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-sage border border-transparent focus:border-sage transition-all"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-sage hover:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage transition-all items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-sage hover:text-sage-dark transition-colors">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
