import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Search, Navigation, MapPin, ArrowLeft, Loader2, ChevronDown, Check } from 'lucide-react';
import api from '../api/axios';
import SpotCard, { type SpotData } from '../components/ui/SpotCard';
import LocationModal from '../components/ui/LocationModal';
import { useLocation } from '../hooks/useLocation';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function Discover() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, savedLocation } = useAppStore();
    const queryClient = useQueryClient();
    const [showLocationModal, setShowLocationModal] = useState(false);

    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [vibe, setVibe] = useState(searchParams.get('vibe') || '');
    const [draftCategory, setDraftCategory] = useState(searchParams.get('category') || '');
    const [draftCity, setDraftCity] = useState(searchParams.get('city') || '');
    const [draftVibe, setDraftVibe] = useState(searchParams.get('vibe') || '');
    const [showFilters, setShowFilters] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [nearMeMode, setNearMeMode] = useState(searchParams.get('mode') === 'nearme');
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const locationHook = useLocation();
    const { lat, lng, loading: locationLoading, error: locationError, permissionDenied } = locationHook;

    const hasLocation = lat !== null && lng !== null;
    const activeLocation = hasLocation ? { lat, lng } : savedLocation ? { lat: savedLocation.lat, lng: savedLocation.lng } : null;

    // Sync state with URL parameters
    useEffect(() => {
        const mode = searchParams.get('mode');
        const cat = searchParams.get('category');
        const c = searchParams.get('city');
        const v = searchParams.get('vibe');

        setNearMeMode(mode === 'nearme');
        setCategory(cat || '');
        setCity(c || '');
        setVibe(v || '');
        setDraftCategory(cat || '');
        setDraftCity(c || '');
        setDraftVibe(v || '');
    }, [searchParams]);

    // Click outside listener for filters
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const filters = document.getElementById('filters-container');
            if (filters && !filters.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch filters metadata from backend
    const { data: filtersData } = useQuery({
        queryKey: ['discoveryFilters'],
        queryFn: () => api.get('/discovery/spots/filters').then(res => res.data.data || res.data),
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['spots', category, city, vibe],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({ page: pageParam.toString(), limit: '12' });
            if (category) params.append('category', category);
            if (city) params.append('city', city);
            if (vibe) params.append('vibe', vibe);
            const res = await api.get(`/discovery/spots?${params.toString()}`);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination || lastPage.data.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !nearMeMode,
    });

    const {
        data: nearbyData,
        isLoading: nearbyLoading,
        fetchNextPage: fetchNextNearby,
        hasNextPage: hasNextNearby,
        isFetchingNextPage: isFetchingNextNearby
    } = useInfiniteQuery({
        queryKey: ['nearby-spots', activeLocation?.lat, activeLocation?.lng],
        queryFn: async ({ pageParam = 1 }) => {
            if (!activeLocation) return { spots: [], pagination: { page: 1, totalPages: 1 } };
            const res = await api.get('/spots/nearby', {
                params: { lat: activeLocation.lat, lng: activeLocation.lng, radius: 15, limit: 12, page: pageParam },
            });
            // Backend returns { success: true, data: { spots, pagination } }
            return res.data.data;
        },
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: nearMeMode && !!activeLocation,
    });

    const spots = nearMeMode
        ? (nearbyData?.pages.flatMap(page => page.spots) || [])
        : (data?.pages.flatMap(page => (page.data || page).spots) || []);

    const currentLoading = nearMeMode ? nearbyLoading : isLoading;
    const currentFetchNext = nearMeMode ? fetchNextNearby : fetchNextPage;
    const currentHasNext = nearMeMode ? hasNextNearby : hasNextPage;
    const currentFetchingNext = nearMeMode ? isFetchingNextNearby : isFetchingNextPage;

    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && currentHasNext && !currentFetchingNext && !currentLoading) {
                    currentFetchNext();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [currentHasNext, currentFetchingNext, currentLoading, currentFetchNext]);

    const handleApplyFilters = () => {
        const newParams = new URLSearchParams(searchParams);

        if (draftCategory) newParams.set('category', draftCategory);
        else newParams.delete('category');

        if (draftCity) newParams.set('city', draftCity);
        else newParams.delete('city');

        if (draftVibe) newParams.set('vibe', draftVibe);
        else newParams.delete('vibe');

        setSearchParams(newParams);
        setActiveDropdown(null);
        setShowFilters(false);
    };

    const handleClearDraftFilters = () => {
        setDraftCategory('');
        setDraftCity('');
        setDraftVibe('');
    };

    const handleLocationClick = () => {
        setShowLocationModal(true);
    };

    const handleModalDetect = () => {
        locationHook.detectLocation();
    };

    const handleModalClose = () => {
        setShowLocationModal(false);
    };

    const handleManualSelect = () => {
        setShowLocationModal(false);
        navigate('/cities');
    };

    const { data: collectionData } = useQuery({
        queryKey: ['collection'],
        queryFn: () => api.get('/collection').then(res => res.data.data.spots),
        enabled: !!user,
    });

    const savedIds = new Set(collectionData?.map((s: any) => s._id) || []);

    const handleToggleSave = async (id: string) => {
        if (!user) {
            navigate('/login');
            return;
        }
        const wasSaved = savedIds.has(id);
        queryClient.setQueryData(['collection'], (old: any) => {
            if (!old) return old;
            if (wasSaved) return old.filter((s: any) => s._id !== id);
            return [...old, { _id: id }];
        });
        try {
            if (wasSaved) {
                await api.delete(`/collection/${id}`);
            } else {
                await api.post(`/collection/${id}`);
            }
        } catch {
            queryClient.invalidateQueries({ queryKey: ['collection'] });
        }
    };

    const handleToggleNearMe = () => {
        if (!activeLocation && !nearMeMode) {
            setShowLocationModal(true);
            return;
        }
        const newParams = new URLSearchParams(searchParams);
        if (!nearMeMode) {
            newParams.set('mode', 'nearme');
        } else {
            newParams.delete('mode');
        }
        setSearchParams(newParams);
    };

    const getPageTitle = () => {
        if (nearMeMode) return 'Peaceful Spots Near Me — My City Slow';
        if (city && category) return `${category} in ${city} — My City Slow`;
        if (city) return `Best Peaceful Spots in ${city} — My City Slow`;
        if (category) return `Quiet ${category} to Visit — My City Slow`;
        return 'Discover Peaceful Spots — My City Slow';
    };

    const getPageDescription = () => {
        if (nearMeMode) return 'Find the nearest quiet parks, calm cafes, and peaceful spots within 15km of your current location.';
        if (city) return `Explore curated peaceful spots, hidden parks, and serene escapes in ${city}. Perfect for slow living and relaxation.`;
        return 'Browse our handpicked collection of quiet urban escapes, serene parks, and calm cafes across India.';
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <Helmet>
                <title>{getPageTitle()}</title>
                <meta name="description" content={getPageDescription()} />
                <meta property="og:title" content={getPageTitle()} />
                <meta property="og:description" content={getPageDescription()} />
                <link rel="canonical" href={`https://mycityslow.com/discover${city ? `?city=${city}` : ''}`} />
            </Helmet>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                <div>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-sage hover:text-white transition-colors mb-6 font-bold group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
                        {nearMeMode ? 'Near Me' : 'Discover Peace'}
                    </h1>
                    <p className="text-xl text-sage-light font-medium max-w-2xl leading-relaxed">
                        {nearMeMode
                            ? activeLocation
                                ? `Showing peaceful sanctuaries within 15km of your current location.`
                                : 'Enable location services to discover serene spots nearby.'
                            : 'Browse our curated collection of intentional spaces and quiet urban escapes.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleToggleNearMe}
                        className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-lg active:scale-95 ${
                            nearMeMode
                                ? 'bg-white text-dark-bg hover:bg-sage hover:text-white'
                                : 'bg-sage text-dark-bg hover:bg-white'
                        }`}
                    >
                        <Navigation className="w-5 h-5" />
                        <span className="text-lg">{nearMeMode ? 'Show All' : 'Near Me'}</span>
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-8 py-4 bg-dark-card border border-white/10 text-white rounded-full font-bold hover:bg-white hover:text-dark-bg transition-all shadow-lg active:scale-95 ${
                            category || city || vibe ? 'ring-2 ring-sage' : ''
                        }`}
                    >
                        <Filter className="w-5 h-5" />
                        <span className="text-lg">Filters {category || city || vibe ? '(Active)' : ''}</span>
                    </button>
                </div>
            </div>

            {/* Location Status Bar */}
            <AnimatePresence>
                {nearMeMode && activeLocation && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: -20 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -20 }}
                        className="overflow-hidden mb-12"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-sage/10 rounded-[2.5rem] border border-sage/20 gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-sage" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-2xl text-white">Active Location</p>
                                    <p className="text-sage-light font-medium">Monitoring spots within a 15km radius of you.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLocationClick}
                                className="px-8 py-3 bg-white text-dark-bg rounded-full font-bold hover:bg-sage hover:text-white transition-all shadow-md flex items-center gap-2"
                            >
                                <Navigation className="w-4 h-4" />
                                Update Location
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vibe Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
                {['', 'calm', 'moderate', 'lively'].map(v => (
                    <button
                        key={v}
                        onClick={() => {
                            setVibe(v);
                            setDraftVibe(v);
                            const newParams = new URLSearchParams(searchParams);
                            if (v) newParams.set('vibe', v);
                            else newParams.delete('vibe');
                            setSearchParams(newParams);
                        }}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                            vibe === v
                                ? 'bg-sage text-dark-bg'
                                : 'bg-dark-card text-white/60 hover:text-white border border-white/10'
                        }`}
                    >
                        {v ? `🌿 ${v.charAt(0).toUpperCase() + v.slice(1)}` : '✨ All Vibes'}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        id="filters-container"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-visible mb-16 relative z-50"
                    >
                        <div className="p-10 bg-dark-card rounded-[3rem] border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-10 shadow-2xl relative z-50 overflow-visible">
                            {/* Category Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-black mb-4 text-sage uppercase tracking-[0.2em]">Category</label>
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-between hover:bg-white/10 transition-all"
                                >
                                    <span className="truncate">{filtersData?.categories?.find((c: any) => c.id === draftCategory)?.name || 'All Categories'}</span>
                                    <ChevronDown className={`w-4 h-4 text-sage transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'category' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-full mt-3 bg-dark-900/95 backdrop-blur-xl border border-white/15 ring-1 ring-black/30 rounded-2xl shadow-2xl z-[60] overflow-hidden"
                                        >
                                            <div className="max-h-60 overflow-y-auto">
                                                <button
                                                    onClick={() => { setDraftCategory(''); setActiveDropdown(null); }}
                                                    className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between"
                                                >
                                                    All Categories
                                                    {!draftCategory && <Check className="w-4 h-4 text-sage" />}
                                                </button>
                                                {filtersData?.categories?.map((cat: any) => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => { setDraftCategory(cat.id); setActiveDropdown(null); }}
                                                        className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between"
                                                    >
                                                        {cat.name}
                                                        {draftCategory === cat.id && <Check className="w-4 h-4 text-sage" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* City Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-black mb-4 text-sage uppercase tracking-[0.2em]">City</label>
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === 'city' ? null : 'city')}
                                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-between hover:bg-white/10 transition-all"
                                >
                                    <span className="truncate">{filtersData?.cities?.find((c: any) => c.slug === draftCity)?.name || 'All Cities'}</span>
                                    <ChevronDown className={`w-4 h-4 text-sage transition-transform ${activeDropdown === 'city' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'city' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-full mt-3 bg-dark-900/95 backdrop-blur-xl border border-white/15 ring-1 ring-black/30 rounded-2xl shadow-2xl z-[60] overflow-hidden"
                                        >
                                            <div className="max-h-60 overflow-y-auto">
                                                <button
                                                    onClick={() => { setDraftCity(''); setActiveDropdown(null); }}
                                                    className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between"
                                                >
                                                    All Cities
                                                    {!draftCity && <Check className="w-4 h-4 text-sage" />}
                                                </button>
                                                {filtersData?.cities?.map((c: any) => (
                                                    <button
                                                        key={c.slug}
                                                        onClick={() => { setDraftCity(c.slug); setActiveDropdown(null); }}
                                                        className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between"
                                                    >
                                                        {c.name}
                                                        {draftCity === c.slug && <Check className="w-4 h-4 text-sage" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Vibe Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-black mb-4 text-sage uppercase tracking-[0.2em]">Vibe</label>
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === 'vibe' ? null : 'vibe')}
                                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-between hover:bg-white/10 transition-all"
                                >
                                    <span className="truncate">{filtersData?.vibes?.find((v: any) => v.id === draftVibe)?.name || 'Any Vibe'}</span>
                                    <ChevronDown className={`w-4 h-4 text-sage transition-transform ${activeDropdown === 'vibe' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'vibe' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-full mt-3 bg-dark-900/95 backdrop-blur-xl border border-white/15 ring-1 ring-black/30 rounded-2xl shadow-2xl z-[60] overflow-hidden"
                                        >
                                            <div className="max-h-60 overflow-y-auto">
                                                <button
                                                    onClick={() => { setDraftVibe(''); setActiveDropdown(null); }}
                                                    className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between"
                                                >
                                                    Any Vibe
                                                    {!draftVibe && <Check className="w-4 h-4 text-sage" />}
                                                </button>
                                                {filtersData?.vibes?.map((v: any) => (
                                                    <button
                                                        key={v.id}
                                                        onClick={() => { setDraftVibe(v.id); setActiveDropdown(null); }}
                                                        className="w-full text-left px-6 py-4 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold flex items-center justify-between"
                                                    >
                                                        {v.name}
                                                        {draftVibe === v.id && <Check className="w-4 h-4 text-sage" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="md:col-span-3 flex justify-end gap-4 pt-2">
                                <button
                                    onClick={handleClearDraftFilters}
                                    className="px-6 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/5 font-bold transition-all"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={handleApplyFilters}
                                    className="px-8 py-3 rounded-full bg-sage text-dark-bg hover:bg-white font-extrabold transition-all shadow-lg"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {currentLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="w-full h-[450px] bg-white/5 rounded-[2.5rem] animate-pulse" />
                    ))}
                </div>
            ) : spots.length === 0 ? (
                <div className="text-center py-40 bg-dark-card rounded-[4rem] border border-white/5 shadow-2xl">
                    <Search className="w-24 h-24 text-sage mx-auto mb-8 opacity-20" />
                    <h3 className="text-4xl font-extrabold mb-4 text-white">
                        {nearMeMode ? 'No spots nearby' : 'No spots found'}
                    </h3>
                    <p className="text-xl text-sage-light mb-12 max-w-lg mx-auto font-medium leading-relaxed">
                        {nearMeMode
                            ? 'Try expanding your search radius or explore all spots across the globe.'
                            : 'We couldn\'t find any spots matching those filters. Try clearing them to see more.'}
                    </p>
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => { setSearchParams({}); }}
                            className="px-12 py-4 bg-sage text-dark-bg font-extrabold rounded-full hover:bg-white transition-all shadow-xl text-lg"
                        >
                            {nearMeMode ? 'Browse All Spots' : 'Clear All Filters'}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-24">
                        {spots.map((spot: SpotData) => (
                            <SpotCard key={spot._id} spot={spot} showDistance={nearMeMode} isSaved={savedIds.has(spot._id)} onToggleSave={handleToggleSave} />
                        ))}
                    </div>

                    {(currentHasNext || currentFetchingNext) && (
                        <div className="flex flex-col items-center justify-center pb-32 gap-4">
                            <div ref={loadMoreRef} className="w-full h-2" />
                            {currentFetchingNext && (
                                <div className="px-8 py-4 bg-dark-card border border-white/10 text-white rounded-full font-bold text-base shadow-xl flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Finding more peace...
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Location Modal */}
            <LocationModal
                isOpen={showLocationModal}
                onClose={handleModalClose}
                onDetect={handleModalDetect}
                onManualSelect={handleManualSelect}
                onRetry={locationHook.retry}
                loading={locationLoading}
                error={locationError}
                permissionDenied={permissionDenied}
            />
        </div>
    );
}
