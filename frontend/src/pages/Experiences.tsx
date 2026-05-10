import { useState, useEffect } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, ArrowLeft, ChevronDown, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import ExperienceCard, { type ExperienceData } from '../components/ui/ExperienceCard';
import { useNavigate } from 'react-router-dom';

export default function Experiences() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [type, setType] = useState(searchParams.get('type') || '');
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [travelerType, setTravelerType] = useState(searchParams.get('travelerType') || '');
    const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || '');
    const [draftType, setDraftType] = useState(searchParams.get('type') || '');
    const [draftCity, setDraftCity] = useState(searchParams.get('city') || '');
    const [draftTravelerType, setDraftTravelerType] = useState(searchParams.get('travelerType') || '');
    const [draftPriceRange, setDraftPriceRange] = useState(searchParams.get('priceRange') || '');
    const [showFilters, setShowFilters] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: filtersData } = useQuery({
        queryKey: ['experienceFilters'],
        queryFn: () => api.get('/experiences/filters').then(res => res.data.data || res.data),
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['experiences', type, city, travelerType, priceRange],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({ page: pageParam.toString(), limit: '12' });
            if (type) params.append('type', type);
            if (city) params.append('city', city);
            if (travelerType) params.append('travelerType', travelerType);
            if (priceRange) params.append('priceRange', priceRange);
            const res = await api.get(`/experiences?${params.toString()}`);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            const pag = lastPage.pagination || lastPage.data?.pagination;
            if (!pag) return undefined;
            return pag.page < pag.totalPages ? pag.page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const experiences = data?.pages.flatMap(page => (page.data || page).experiences) || [];

    const handleApplyFilters = () => {
        const newParams = new URLSearchParams();
        if (draftType) newParams.set('type', draftType);
        if (draftCity) newParams.set('city', draftCity);
        if (draftTravelerType) newParams.set('travelerType', draftTravelerType);
        if (draftPriceRange) newParams.set('priceRange', draftPriceRange);
        setSearchParams(newParams);
        setActiveDropdown(null);
        setShowFilters(false);
    };

    const handleClearDraftFilters = () => {
        setDraftType('');
        setDraftCity('');
        setDraftTravelerType('');
        setDraftPriceRange('');
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <Helmet>
                <title>Authentic Local Experiences — My City Slow</title>
                <meta name="description" content="Discover authentic local experiences across India — home-cooked meals, heritage walks, craft workshops, and more." />
            </Helmet>

            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sage hover:text-white transition-colors mb-6 font-bold group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                <div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">Authentic Experiences</h1>
                    <p className="text-xl text-sage-light font-medium max-w-3xl leading-relaxed">
                        Go beyond tourism. Connect with locals, learn ancient crafts, taste home-cooked traditions, and discover the real India.
                    </p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-8 py-4 bg-dark-card border border-white/10 text-white rounded-full font-bold hover:bg-white hover:text-dark-bg transition-all shadow-lg active:scale-95 ${type || city || travelerType || priceRange ? 'ring-2 ring-sage' : ''}`}
                >
                    <Filter className="w-5 h-5" />
                    <span className="text-lg">Filters {type || city || travelerType || priceRange ? '(Active)' : ''}</span>
                </button>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-visible mb-16 relative z-50"
                    >
                        <div className="p-10 bg-dark-card rounded-[3rem] border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 shadow-2xl">
                            <div className="relative">
                                <label className="block text-xs font-black mb-4 text-sage uppercase tracking-[0.2em]">Experience Type</label>
                                <button onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-between hover:bg-white/10 transition-all">
                                    <span className="truncate">{filtersData?.experienceTypes?.find((t: any) => t.id === draftType)?.name || 'All Types'}</span>
                                    <ChevronDown className={`w-4 h-4 text-sage transition-transform ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'type' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-full mt-3 bg-dark-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl z-[60] overflow-hidden max-h-60 overflow-y-auto">
                                            <button onClick={() => { setDraftType(''); setActiveDropdown(null); }}
                                                className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between">
                                                All Types {!draftType && <Check className="w-4 h-4 text-sage" />}
                                            </button>
                                            {filtersData?.experienceTypes?.map((t: any) => (
                                                <button key={t.id} onClick={() => { setDraftType(t.id); setActiveDropdown(null); }}
                                                    className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between">
                                                    {t.name} {draftType === t.id && <Check className="w-4 h-4 text-sage" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-black mb-4 text-sage uppercase tracking-[0.2em]">City</label>
                                <button onClick={() => setActiveDropdown(activeDropdown === 'city' ? null : 'city')}
                                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-between hover:bg-white/10 transition-all">
                                    <span className="truncate">{filtersData?.cities?.find((c: any) => c.slug === draftCity)?.name || 'All Cities'}</span>
                                    <ChevronDown className={`w-4 h-4 text-sage transition-transform ${activeDropdown === 'city' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'city' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-full mt-3 bg-dark-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl z-[60] overflow-hidden max-h-60 overflow-y-auto">
                                            <button onClick={() => { setDraftCity(''); setActiveDropdown(null); }}
                                                className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between">
                                                All Cities {!draftCity && <Check className="w-4 h-4 text-sage" />}
                                            </button>
                                            {filtersData?.cities?.map((c: any) => (
                                                <button key={c.slug} onClick={() => { setDraftCity(c.slug); setActiveDropdown(null); }}
                                                    className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between">
                                                    {c.name} {draftCity === c.slug && <Check className="w-4 h-4 text-sage" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-black mb-4 text-sage uppercase tracking-[0.2em]">Traveler Type</label>
                                <button onClick={() => setActiveDropdown(activeDropdown === 'travelerType' ? null : 'travelerType')}
                                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-between hover:bg-white/10 transition-all">
                                    <span className="truncate">{filtersData?.travelerTypes?.find((t: any) => t.id === draftTravelerType)?.name || 'All Travelers'}</span>
                                    <ChevronDown className={`w-4 h-4 text-sage transition-transform ${activeDropdown === 'travelerType' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'travelerType' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-full mt-3 bg-dark-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl z-[60] overflow-hidden max-h-60 overflow-y-auto">
                                            <button onClick={() => { setDraftTravelerType(''); setActiveDropdown(null); }}
                                                className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between">
                                                All Travelers {!draftTravelerType && <Check className="w-4 h-4 text-sage" />}
                                            </button>
                                            {filtersData?.travelerTypes?.map((t: any) => (
                                                <button key={t.id} onClick={() => { setDraftTravelerType(t.id); setActiveDropdown(null); }}
                                                    className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between">
                                                    {t.name} {draftTravelerType === t.id && <Check className="w-4 h-4 text-sage" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-black mb-4 text-sage uppercase tracking-[0.2em]">Budget</label>
                                <button onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-between hover:bg-white/10 transition-all">
                                    <span className="truncate">{filtersData?.priceRanges?.find((p: any) => p.id === draftPriceRange)?.name || 'Any Budget'}</span>
                                    <ChevronDown className={`w-4 h-4 text-sage transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'price' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-full mt-3 bg-dark-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl z-[60] overflow-hidden">
                                            <button onClick={() => { setDraftPriceRange(''); setActiveDropdown(null); }}
                                                className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between">
                                                Any Budget {!draftPriceRange && <Check className="w-4 h-4 text-sage" />}
                                            </button>
                                            {filtersData?.priceRanges?.map((p: any) => (
                                                <button key={p.id} onClick={() => { setDraftPriceRange(p.id); setActiveDropdown(null); }}
                                                    className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between">
                                                    {p.name} {draftPriceRange === p.id && <Check className="w-4 h-4 text-sage" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="lg:col-span-4 flex justify-end gap-4 pt-2">
                                <button onClick={handleClearDraftFilters} className="px-6 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/5 font-bold transition-all">Clear</button>
                                <button onClick={handleApplyFilters} className="px-8 py-3 rounded-full bg-sage text-dark-bg hover:bg-white font-extrabold transition-all shadow-lg">Apply Filters</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[480px] bg-white/5 rounded-[2.5rem] animate-pulse" />)}
                </div>
            ) : experiences.length === 0 ? (
                <div className="text-center py-40 bg-dark-card rounded-[4rem] border border-white/5">
                    <Search className="w-24 h-24 text-sage mx-auto mb-8 opacity-20" />
                    <h3 className="text-4xl font-extrabold mb-4 text-white">No experiences found</h3>
                    <p className="text-xl text-sage-light mb-12 max-w-lg mx-auto font-medium">Try adjusting your filters to discover more authentic experiences.</p>
                    <button onClick={() => { setSearchParams({}); }} className="px-12 py-4 bg-sage text-dark-bg font-extrabold rounded-full hover:bg-white transition-all shadow-xl text-lg">Clear All Filters</button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
                        {experiences.map((exp: ExperienceData) => (
                            <ExperienceCard key={exp._id} experience={exp} />
                        ))}
                    </div>
                    {hasNextPage && (
                        <div className="flex justify-center pb-32">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="px-10 py-4 bg-dark-card border border-white/10 text-white rounded-full font-bold hover:bg-white hover:text-dark-bg transition-all shadow-lg flex items-center gap-3 disabled:opacity-50"
                            >
                                {isFetchingNextPage ? <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</> : 'Load More Experiences'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
