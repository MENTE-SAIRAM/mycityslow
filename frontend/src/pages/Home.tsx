import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    ArrowRight, 
    Leaf, 
    Coffee, 
    TreePine, 
    Sun, 
    Navigation, 
    Sparkles, 
    Heart, 
    Waves,
    Plus,
    ChevronRight,
    Mountain,
    Library,
    Footprints
} from 'lucide-react';
import api from '../api/axios';
import SpotCard, { type SpotData } from '../components/ui/SpotCard';
import LocationModal from '../components/ui/LocationModal';
import { useLocation } from '../hooks/useLocation';
import { useAppStore } from '../store/useAppStore';

interface City {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    totalSpots: number;
}

const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
        case 'sparkles': return <Sparkles className="w-6 h-6" />;
        case 'heart': return <Heart className="w-6 h-6" />;
        case 'leaf': return <Leaf className="w-6 h-6" />;
        case 'park': case '🌳': return <TreePine className="w-6 h-6" />;
        case 'cafe': case '☕': return <Coffee className="w-6 h-6" />;
        case 'sunset': case '🌅': return <Sun className="w-6 h-6" />;
        case 'lake': case '🏞️': return <Waves className="w-6 h-6" />;
        case 'mountain': case '🏔️': return <Mountain className="w-6 h-6" />;
        case 'library': case '📚': return <Library className="w-6 h-6" />;
        case 'trail': case '🥾': return <Footprints className="w-6 h-6" />;
        default: return <Sparkles className="w-6 h-6" />;
    }
};

export default function Home() {
    const navigate = useNavigate();
    const { user, savedLocation } = useAppStore();
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showCityDrop, setShowCityDrop] = useState(false);
    const [selectedCityName, setSelectedCityName] = useState('Select City');
    const queryClient = useQueryClient();

    const locationHook = useLocation();
    const { lat, lng, loading: locationLoading, error: locationError, permissionDenied } = locationHook;

    // Click outside listener for dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const drop = document.getElementById('city-dropdown');
            if (drop && !drop.contains(event.target as Node)) {
                setShowCityDrop(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ['homeData'],
        queryFn: () => api.get('/home').then(res => res.data.data),
    });

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

    const handleLocationClick = () => {
        setShowLocationModal(true);
    };

    // Auto-navigate to discover when location is detected from modal
    useEffect(() => {
        if (lat && lng && showLocationModal) {
            setShowLocationModal(false);
            navigate(`/discover?mode=nearme`);
        }
    }, [lat, lng, showLocationModal, navigate]);

    return (
        <div className="flex flex-col w-full -mt-20">
            <Helmet>
                <title>{savedLocation?.city ? `Peaceful Spots in ${savedLocation.city} — My City Slow` : 'My City Slow — Discover Peaceful Spots in Your City'}</title>
                <meta name="description" content={savedLocation?.city ? `Discover the best hidden parks, calm cafes, and quiet corners for slow living in ${savedLocation.city}.` : 'Find peace in the chaos. Your guide to the most serene and calm spots in major Indian cities like Bengaluru, Mumbai, and Delhi.'} />
                <meta property="og:title" content={savedLocation?.city ? `Peaceful Spots in ${savedLocation.city} — My City Slow` : 'My City Slow — Discover Peaceful Spots in Your City'} />
                <meta property="og:description" content={savedLocation?.city ? `Discover the best hidden parks, calm cafes, and quiet corners for slow living in ${savedLocation.city}.` : 'Find peace in the chaos. Your guide to the most serene and calm spots in major Indian cities.'} />
                <link rel="canonical" href="https://mycityslow.com/" />
            </Helmet>

            {/* Hero Section */}
            <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-dark-bg">
                {/* Blurry Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={data?.hero?.backgroundImage || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=3000&auto=format&fit=crop"}
                        alt="Background"
                        className="w-full h-full object-cover blur-2xl scale-110 opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/50 to-dark-bg" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-6xl min-h-[520px] sm:min-h-[620px] md:min-h-[700px] lg:min-h-[800px] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
                    >
                        <img
                            src={data?.hero?.phoneImage || "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2400&auto=format&fit=crop"}
                            alt="Peaceful Scene"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,196,176,0.18),transparent_40%)]" />

                        <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-auto flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                            <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
                                <Leaf className="w-3.5 h-3.5 text-sage" />
                                Slow Living
                            </div>
                            <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
                                <Sparkles className="w-3.5 h-3.5 text-sage" />
                                Curated Peace
                            </div>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 sm:px-6 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
                            <motion.h1
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.7 }}
                                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-3 sm:mb-4 md:mb-6 text-white leading-[1.1] sm:leading-[1.05] text-balance"
                            >
                                {data?.hero?.title || (savedLocation?.city ? `Find Peace in ${savedLocation.city}` : 'Find Peace in Your City')}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.7 }}
                                className="text-sm sm:text-base md:text-lg lg:text-2xl text-white/95 mb-6 sm:mb-8 md:mb-10 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-medium"
                            >
                                {data?.hero?.subtitle || 'Rediscover the rhythm of intentional living. Uncover hidden sanctuaries and quiet corners designed for your wellbeing.'}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.7 }}
                                className="flex flex-col sm:flex-row-reverse items-center gap-4 w-full max-w-xl"
                            >
                                <button
                                    onClick={handleLocationClick}
                                    className="w-full sm:w-auto px-10 py-4 bg-sage text-dark-bg hover:bg-white transition-all rounded-full font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95"
                                >
                                    <Navigation className="w-5 h-5" />
                                    Near Me
                                </button>
                                <div className="relative w-full sm:w-auto" id="city-dropdown">
                                    <button
                                        onClick={() => setShowCityDrop(!showCityDrop)}
                                        className="w-full sm:w-64 flex items-center justify-between px-8 py-4 bg-dark-card/65 hover:bg-dark-card/85 backdrop-blur-md border border-white/30 rounded-full text-white font-bold shadow-lg transition-all cursor-pointer group"
                                    >
                                        <span className="truncate">{selectedCityName}</span>
                                        <ChevronRight className={`w-4 h-4 text-sage transition-transform duration-300 ${showCityDrop ? 'rotate-90' : 'rotate-0'}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showCityDrop && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute bottom-full mb-4 left-0 w-full sm:w-64 bg-dark-card/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl py-3 z-50 overflow-hidden"
                                            >
                                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                    <div className="px-4 py-2 text-[10px] font-black text-sage uppercase tracking-widest border-b border-white/5 mb-2">Select your city</div>
                                                    {data?.cities?.map((city: City) => (
                                                        <button
                                                            key={city._id}
                                                            onClick={() => {
                                                                setSelectedCityName(city.name);
                                                                navigate(`/discover?city=${city.slug}`);
                                                                setShowCityDrop(false);
                                                            }}
                                                            className="w-full text-left px-6 py-4 text-white/80 hover:text-white hover:bg-sage/20 transition-all font-bold flex items-center justify-between group"
                                                        >
                                                            {city.name}
                                                            <div className="w-1.5 h-1.5 rounded-full bg-sage opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Floating Add Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        onClick={() => navigate('/submit')}
                        className="fixed bottom-10 right-10 z-40 w-16 h-16 bg-sage text-dark-bg rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:bg-sage-dark hover:text-white"
                    >
                        <Plus className="w-8 h-8" />
                    </motion.button>
                </div>
            </section>

            {/* Trending Section */}
            <section className="py-24 px-4 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-terra mb-3 block">Curated Sanctuary</span>
                        <h2 className="text-4xl font-extrabold tracking-tight text-white">
                            {savedLocation?.city ? `Peaceful Spots in ${savedLocation.city}` : 'Peaceful Spots Near You'}
                        </h2>
                    </div>
                    <Link to="/discover" className="group flex items-center gap-2 text-lg font-bold text-sage-light hover:text-white transition-colors border-b-2 border-sage/20 hover:border-white pb-1">
                        Show All <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/5] rounded-3xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        data?.trending?.slice(0, 3).map((spot: SpotData) => (
                            <SpotCard key={spot._id} spot={spot} isSaved={savedIds.has(spot._id)} onToggleSave={handleToggleSave} />
                        ))
                    )}
                </div>
            </section>

            {/* Vibe Section */}
            <section className="py-24 px-4 bg-white/5">
                <div className="max-w-7xl mx-auto w-full text-center mb-16">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">Explore by Vibe</h2>
                    <p className="text-lg text-sage-light font-medium">Choose a destination that matches your inner state of mind.</p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {data?.categories?.slice(0, 8).map((cat: any) => (
                        <button
                            key={cat.id}
                            onClick={() => navigate(`/discover?category=${cat.id}`)}
                            className="bg-dark-card p-10 rounded-3xl hover:shadow-premium-hover transition-all group flex flex-col items-center justify-center gap-6 border border-white/5 shadow-sm hover:border-sage/30"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-sage/20 flex items-center justify-center text-sage group-hover:scale-110 transition-transform duration-500">
                                {getIcon(cat.id)}
                            </div>
                            <span className="font-bold text-xl text-white">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-32 px-4 max-w-7xl mx-auto w-full">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">{data?.philosophy?.title || 'Philosophy of Presence'}</h2>
                    <p className="text-lg text-sage-light font-medium">{data?.philosophy?.subtitle || 'Why we advocate for a slower urban pace.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data?.philosophy?.cards?.map((card: any, idx: number) => (
                        <div key={idx} className="bg-dark-card p-10 rounded-[3rem] border border-white/5 shadow-sm flex flex-col items-start text-left hover:border-sage/20 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center text-sage mb-8">
                                {getIcon(card.icon)}
                            </div>
                            <h3 className="text-2xl font-extrabold mb-4 text-white">{card.title}</h3>
                            <p className="text-sage-light leading-relaxed font-medium">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 pb-24 max-w-7xl mx-auto w-full">
                <div className="relative rounded-[3rem] overflow-hidden bg-dark-card min-h-[500px] flex items-center border border-white/5">
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                        <img 
                            src={data?.cta?.image || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop"}
                            alt="CTA Background"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-dark-card to-transparent" />
                    </div>
                    
                    <div className="relative z-10 w-full md:w-1/2 p-12 md:p-24 flex flex-col items-start gap-8">
                        <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                            {data?.cta?.title || 'Ready to <br /> slow down?'}
                        </h2>
                        <p className="text-xl text-sage-light max-w-md leading-relaxed font-medium">
                            {data?.cta?.subtitle || 'Join a community of 50,000+ urban dwellers finding their sanctuary in the city.'}
                        </p>
                        <button 
                            onClick={() => navigate(user ? '/discover' : '/register')}
                            className="px-10 py-5 bg-sage text-dark-bg rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl hover:bg-white"
                        >
                            {data?.cta?.buttonText || 'Start Your Journey'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Location Modal */}
            <LocationModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onDetect={() => locationHook.detectLocation()}
                onManualSelect={() => {
                    setShowLocationModal(false);
                    navigate('/cities');
                }}
                onRetry={() => locationHook.retry()}
                loading={locationLoading}
                error={locationError}
                permissionDenied={permissionDenied}
            />
        </div>
    );
}
