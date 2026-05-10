import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle2, ArrowLeft, Bus, Clock } from 'lucide-react';
import api from '../api/axios';
import { useAppStore } from '../store/useAppStore';
import { Helmet } from 'react-helmet-async';

export default function Submit() {
    const { user } = useAppStore();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        city: '',
        address: '',
        vibe: 'very-calm',
        bestTime: 'anytime',
        crowdLevel: 'low',
        categories: '',
        transportation: '',
        openingHours: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-dark-bg min-h-screen text-white">
                <p className="text-2xl mb-8 font-bold">Please log in to submit a sanctuary.</p>
                <button onClick={() => navigate('/login')} className="px-10 py-4 bg-sage text-dark-bg rounded-full font-black hover:bg-white transition-all">Sign In</button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/spots/submit', {
                ...form,
                categories: form.categories.split(',').map(c => c.trim()).filter(Boolean),
                location: { type: 'Point', coordinates: [0, 0] }, // Mock coordinates
                images: [], // Mock images for now
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error submitting spot');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-center max-w-2xl mx-auto px-6 bg-dark-bg min-h-screen text-white">
                <div className="w-24 h-24 bg-sage/20 rounded-full flex items-center justify-center mb-10">
                    <CheckCircle2 className="w-12 h-12 text-sage" />
                </div>
                <h2 className="text-5xl font-black mb-6">Gratitude shared.</h2>
                <p className="text-sage-light text-xl mb-12 leading-relaxed">Your sanctuary has been submitted for review. Our moderators will verify its peace factor before it appears for the community.</p>
                <button onClick={() => navigate('/discover')} className="px-12 py-5 bg-sage text-dark-bg rounded-full font-black text-xl hover:bg-white transition-all shadow-xl">Continue Exploring</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-20 px-6 bg-dark-bg text-white">
            <Helmet>
                <title>Suggest a Sanctuary — Contribute to My City Slow</title>
                <meta name="description" content="Share your favorite peaceful spots, hidden parks, and calm cafes with the community. Help others find their rhythm in the city." />
                <meta property="og:title" content="Suggest a Sanctuary — Contribute to My City Slow" />
                <meta property="og:description" content="Share your favorite peaceful spots with the community." />
                <link rel="canonical" href="https://mycityslow.com/submit" />
            </Helmet>
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sage hover:text-white transition-colors mb-10 font-bold group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Go Back
            </button>

            <div className="mb-16">
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Suggest a Sanctuary</h1>
                <p className="text-xl text-sage-light max-w-2xl font-medium">Help others find their rhythm in the city. Share a place of quiet, light, and presence.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {error && <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[2rem] font-bold">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8 lg:col-span-2">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-sage text-dark-bg flex items-center justify-center text-sm">1</span>
                            Core Identity
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest">Sanctuary Name</label>
                                <input required placeholder="e.g. The Bamboo Grove at Cubbon Park" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage focus:outline-none transition-all placeholder:text-white/10" />
                            </div>
                            <div>
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest">Why is this spot special?</label>
                                <textarea required rows={5} placeholder="Speak of the atmosphere, the lack of noise, or the feeling of presence..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage focus:outline-none transition-all resize-none placeholder:text-white/10" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 lg:col-span-2">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-sage text-dark-bg flex items-center justify-center text-sm">2</span>
                            Access & Timing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest">City</label>
                                <input required placeholder="e.g. Bengaluru" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage focus:outline-none transition-all placeholder:text-white/10" />
                            </div>
                            <div>
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest">Location / Landmark</label>
                                <input required placeholder="e.g. Near Central Library" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage focus:outline-none transition-all placeholder:text-white/10" />
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Opening Hours
                                </label>
                                <input placeholder="e.g. Mon-Fri: 6am-10am, 4pm-7pm" value={form.openingHours} onChange={e => setForm({ ...form, openingHours: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage focus:outline-none transition-all placeholder:text-white/10" />
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest flex items-center gap-2">
                                    <Bus className="w-3 h-3" /> Transportation Info
                                </label>
                                <textarea rows={2} placeholder="e.g. Take the Blue Line to Central, Exit Gate 2. 5 min walk north." value={form.transportation} onChange={e => setForm({ ...form, transportation: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage focus:outline-none transition-all resize-none placeholder:text-white/10" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 lg:col-span-2">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-sage text-dark-bg flex items-center justify-center text-sm">3</span>
                            The Atmosphere
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest">Vibe</label>
                                <select value={form.vibe} onChange={e => setForm({ ...form, vibe: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage appearance-none cursor-pointer">
                                    <option value="very-calm">Very Calm</option>
                                    <option value="moderate">Moderate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest">Best Timing</label>
                                <select value={form.bestTime} onChange={e => setForm({ ...form, bestTime: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage appearance-none cursor-pointer">
                                    <option value="early-morning">Early Morning</option>
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                    <option value="evening">Evening</option>
                                    <option value="anytime">Anytime</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black mb-3 text-sage uppercase tracking-widest">Crowd Level</label>
                                <select value={form.crowdLevel} onChange={e => setForm({ ...form, crowdLevel: e.target.value })} className="w-full p-5 rounded-2xl bg-dark-card border border-white/5 focus:ring-2 focus:ring-sage appearance-none cursor-pointer">
                                    <option value="very-low">Very Low</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10">
                    <button type="submit" disabled={loading} className="w-full py-6 bg-sage hover:bg-white text-dark-bg rounded-3xl font-black text-2xl transition-all flex justify-center items-center gap-4 shadow-2xl disabled:opacity-50">
                        {loading ? 'Transmitting...' : 'Suggest Sanctuary'}
                        {!loading && <UploadCloud className="w-8 h-8" />}
                    </button>
                    <p className="text-center text-sage-light mt-6 text-sm font-medium">All submissions are carefully curated for peace factor.</p>
                </div>
            </form>
        </div>
    );
}
