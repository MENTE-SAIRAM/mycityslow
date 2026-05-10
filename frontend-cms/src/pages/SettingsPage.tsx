import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Save, Loader2, Globe, Heart, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<any>(null);

    const { data: settings, isLoading } = useQuery({
        queryKey: ['adminSettings'],
        queryFn: () => api.get('/admin/settings').then(res => res.data),
    });

    useEffect(() => {
        if (settings) {
            setForm(settings);
        }
    }, [settings]);

    const mutation = useMutation({
        mutationFn: (data: any) => api.put('/admin/settings', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
            toast.success('Settings updated successfully');
        },
        onError: () => {
            toast.error('Failed to update settings');
        }
    });

    if (isLoading || !form) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Global Settings</h1>
                    <p className="text-gray-400 text-sm">Manage dynamic content for the home page and app global state.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl font-bold transition-all shadow-lg"
                >
                    {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            <div className="space-y-10">
                {/* Hero Section */}
                <section className="bg-dark-900 border border-gray-800 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Hero Section</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Main Title</label>
                            <input
                                type="text"
                                value={form.hero.title}
                                onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Subtitle</label>
                            <input
                                type="text"
                                value={form.hero.subtitle}
                                onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Desktop BG Image (URL)</label>
                            <input
                                type="text"
                                value={form.hero.backgroundImage}
                                onChange={(e) => setForm({ ...form, hero: { ...form.hero, backgroundImage: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Phone Image (URL)</label>
                            <input
                                type="text"
                                value={form.hero.phoneImage}
                                onChange={(e) => setForm({ ...form, hero: { ...form.hero, phoneImage: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="bg-dark-900 border border-gray-800 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Philosophy Section</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Section Title</label>
                            <input
                                type="text"
                                value={form.philosophy.title}
                                onChange={(e) => setForm({ ...form, philosophy: { ...form.philosophy, title: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Section Subtitle</label>
                            <input
                                type="text"
                                value={form.philosophy.subtitle}
                                onChange={(e) => setForm({ ...form, philosophy: { ...form.philosophy, subtitle: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Philosophy Cards</h3>
                        <div className="grid grid-cols-1 gap-6">
                            {form.philosophy.cards.map((card: any, idx: number) => (
                                <div key={idx} className="bg-dark-800/50 p-6 rounded-2xl border border-gray-700 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Card Title</label>
                                                <input
                                                    type="text"
                                                    value={card.title}
                                                    onChange={(e) => {
                                                        const newCards = [...form.philosophy.cards];
                                                        newCards[idx].title = e.target.value;
                                                        setForm({ ...form, philosophy: { ...form.philosophy, cards: newCards } });
                                                    }}
                                                    className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Icon Name</label>
                                                <input
                                                    type="text"
                                                    value={card.icon}
                                                    onChange={(e) => {
                                                        const newCards = [...form.philosophy.cards];
                                                        newCards[idx].icon = e.target.value;
                                                        setForm({ ...form, philosophy: { ...form.philosophy, cards: newCards } });
                                                    }}
                                                    className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Description</label>
                                            <textarea
                                                value={card.description}
                                                onChange={(e) => {
                                                    const newCards = [...form.philosophy.cards];
                                                    newCards[idx].description = e.target.value;
                                                    setForm({ ...form, philosophy: { ...form.philosophy, cards: newCards } });
                                                }}
                                                rows={2}
                                                className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-dark-900 border border-gray-800 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Call to Action</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">CTA Title</label>
                            <input
                                type="text"
                                value={form.cta.title}
                                onChange={(e) => setForm({ ...form, cta: { ...form.cta, title: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">CTA Subtitle</label>
                            <input
                                type="text"
                                value={form.cta.subtitle}
                                onChange={(e) => setForm({ ...form, cta: { ...form.cta, subtitle: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Button Text</label>
                            <input
                                type="text"
                                value={form.cta.buttonText}
                                onChange={(e) => setForm({ ...form, cta: { ...form.cta, buttonText: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">CTA Image (URL)</label>
                            <input
                                type="text"
                                value={form.cta.image}
                                onChange={(e) => setForm({ ...form, cta: { ...form.cta, image: e.target.value } })}
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
