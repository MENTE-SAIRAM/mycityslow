import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, MapPin, Heart, Clock, Navigation, Star, Send,
    ChevronLeft, ChevronRight, X, MessageCircle, User,
    Bus, Info, Maximize2, BookOpen
} from 'lucide-react';
import api from '../api/axios';
import { useAppStore } from '../store/useAppStore';
import { Helmet } from 'react-helmet-async';
import { resolveImageUrl } from '../utils/image';
import { Link } from 'react-router-dom';

interface Review {
    _id: string;
    user: { name: string; avatar?: string };
    rating: number;
    text: string;
    createdAt: string;
}

export default function SpotDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAppStore();

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [savingCollection, setSavingCollection] = useState(false);

    const { data: spot, isLoading: spotLoading } = useQuery({
        queryKey: ['spot', id],
        queryFn: () => api.get(`/discovery/spots/${id}`).then(res => res.data.data),
    });

    const { data: reviewsData } = useQuery({
        queryKey: ['spot-reviews', id],
        queryFn: () => api.get(`/spots/${id}/reviews`).then(res => res.data.data),
    });

    const { data: collectionData } = useQuery({
        queryKey: ['collection'],
        queryFn: () => api.get('/collection').then(res => res.data.data.spots),
        enabled: !!user,
    });

    const { data: storiesData } = useQuery({
        queryKey: ['spot-stories', id],
        queryFn: () => api.get(`/stories/spot/${id}`).then(res => res.data.data),
        enabled: !!id,
    });

    const addReviewMutation = useMutation({
        mutationFn: (data: { rating: number; text: string }) =>
            api.post(`/spots/${id}/reviews`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spot-reviews', id] });
            queryClient.invalidateQueries({ queryKey: ['spot', id] });
            setReviewText('');
            setReviewRating(5);
        },
    });

    if (spotLoading || !spot) {
        return (
            <div className="w-full h-screen flex justify-center mt-32">
                <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const defaultImage = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2948&auto=format&fit=crop";
    const images = spot.images && spot.images.length > 0
        ? spot.images.map((img: string) => resolveImageUrl(img))
        : [defaultImage];
    const reviews = reviewsData?.reviews || [];
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;
    const savedIds = new Set(collectionData?.map((s: any) => s._id) || []);
    const isSaved = !!id && savedIds.has(id);

    const handlePrevImage = () => {
        setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText.trim()) return;
        addReviewMutation.mutate({ rating: reviewRating, text: reviewText });
    };

    const handleToggleSave = async () => {
        if (!id || savingCollection) return;
        if (!user) {
            navigate('/login');
            return;
        }

        setSavingCollection(true);
        try {
            if (isSaved) {
                await api.delete(`/collection/${id}`);
            } else {
                await api.post(`/collection/${id}`);
            }
            queryClient.invalidateQueries({ queryKey: ['collection'] });
        } catch {
            queryClient.invalidateQueries({ queryKey: ['collection'] });
        } finally {
            setSavingCollection(false);
        }
    };

    const mapEmbedUrl = spot.location?.coordinates
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${spot.location.coordinates[0] - 0.005},${spot.location.coordinates[1] - 0.003},${spot.location.coordinates[0] + 0.005},${spot.location.coordinates[1] + 0.003}&layer=mapnik&marker=${spot.location.coordinates[1]},${spot.location.coordinates[0]}`
        : '';

    return (
        <div className="pb-24 -mt-8 mx-[-16px] sm:mx-[-24px] lg:mx-[-32px] bg-dark-bg text-white">
            <Helmet>
                <title>{`${spot.title} in ${spot.city?.name} — My City Slow`}</title>
                <meta name="description" content={spot.description?.substring(0, 160)} />
                <meta property="og:title" content={`${spot.title} in ${spot.city?.name} — My City Slow`} />
                <meta property="og:description" content={spot.description?.substring(0, 160)} />
                <meta property="og:image" content={images[0]} />
                <meta property="twitter:title" content={`${spot.title} in ${spot.city?.name} — My City Slow`} />
                <meta property="twitter:description" content={spot.description?.substring(0, 160)} />
                <meta property="twitter:image" content={images[0]} />
                <link rel="canonical" href={`https://mycityslow.com/spot/${spot._id}`} />
            </Helmet>
            {/* Full Bleed Hero */}
            <div className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden shadow-2xl">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={images[activeImageIndex] || defaultImage}
                    alt={spot.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setShowLightbox(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-black/40" />

                {/* Hero Controls */}
                <div className="absolute bottom-12 right-8 flex items-center gap-3 z-20">
                    <button 
                        onClick={() => setShowLightbox(true)}
                        className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110"
                    >
                        <Maximize2 className="w-6 h-6" />
                    </button>
                    {images.length > 1 && (
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <button onClick={handlePrevImage} className="hover:text-sage transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                            <span className="text-xs font-bold w-8 text-center">{activeImageIndex + 1} / {images.length}</span>
                            <button onClick={handleNextImage} className="hover:text-sage transition-colors"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    )}
                </div>

                {/* Top Nav inside Hero */}
                <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-4 bg-black/30 hover:bg-sage hover:text-dark-bg backdrop-blur-md rounded-full text-white transition-all shadow-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleToggleSave}
                        disabled={savingCollection}
                        className="p-4 bg-black/30 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all shadow-lg disabled:opacity-60"
                    >
                        <Heart className={`w-6 h-6 ${isSaved ? 'fill-terra text-terra' : ''}`} />
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 text-sage font-bold uppercase tracking-[0.2em] mb-6">
                            <MapPin className="w-5 h-5" />
                            <span>{spot.city?.name}</span>
                            <span className="opacity-30">•</span>
                            <span className="capitalize">{spot.vibe.replace('-', ' ')}</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-8 leading-[1.1] tracking-tighter">
                            {spot.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="glass px-6 py-2.5 rounded-full text-base font-black text-white flex items-center gap-2 border border-white/10">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                {spot.peaceScore}/10 Peace factor
                            </div>
                            {avgRating && (
                                <div className="flex items-center gap-2 text-sage-light font-bold">
                                    <MessageCircle className="w-5 h-5" />
                                    {reviews.length} Experiences shared
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-20">
                        <section>
                            <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                                <Info className="w-8 h-8 text-sage" />
                                The Essence of this Sanctuary
                            </h2>
                            <p className="text-xl text-sage-light leading-[1.8] font-medium">
                                {spot.description}
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Timing Section */}
                            <section className="bg-dark-card p-10 rounded-[3rem] border border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center text-sage">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Timings</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-sage-light font-medium">Best Experience</span>
                                        <span className="text-white font-bold capitalize">{spot.bestTime.replace('-', ' ')}</span>
                                    </div>
                                    <div className="py-3">
                                        <span className="text-sage-light font-medium block mb-2">Opening Hours</span>
                                        <p className="text-white font-bold whitespace-pre-line leading-relaxed">
                                            {spot.openingHours || "Check local listings for specific hours."}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Transportation Section */}
                            <section className="bg-dark-card p-10 rounded-[3rem] border border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center text-sage">
                                        <Bus className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">How to Reach</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="py-3">
                                        <span className="text-sage-light font-medium block mb-3">Transportation Advice</span>
                                        <p className="text-white font-bold leading-relaxed">
                                            {spot.transportation || "Conveniently accessible by public transit and walking. Check Google Maps for real-time routes."}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => window.open(`https://maps.google.com/?q=${spot.location?.coordinates?.[1]},${spot.location?.coordinates?.[0]}`, '_blank')}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sage transition-all border border-white/10 flex items-center justify-center gap-2"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        View Transport Options
                                    </button>
                                </div>
                            </section>
                        </div>

                        <section>
                            <h2 className="text-3xl font-extrabold mb-8">Offerings & Vibes</h2>
                            <div className="flex flex-wrap gap-4">
                                {spot.categories?.map((cat: string) => (
                                    <span key={cat} className="px-6 py-3 bg-sage/10 text-sage font-bold rounded-full text-sm capitalize border border-sage/20">
                                        {cat}
                                    </span>
                                ))}
                                {spot.activities?.map((act: string) => (
                                    <span key={act} className="px-6 py-3 bg-white/5 text-white font-bold rounded-full text-sm capitalize border border-white/10">
                                        {act}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Image Gallery Section */}
                        {images.length > 1 && (
                            <section>
                                <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                                    <span className="text-sage">📸</span>
                                    Visual Details & Moments
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {images.slice(1).map((img: string, i: number) => (
                                        <motion.button
                                            key={i + 1}
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => {
                                                setActiveImageIndex(i + 1);
                                                setShowLightbox(true);
                                            }}
                                            className="relative h-56 rounded-3xl overflow-hidden group cursor-pointer shadow-lg border border-white/5"
                                        >
                                            <img
                                                src={img}
                                                alt={`${spot.title} detail ${i + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                                <span className="text-white font-bold text-sm">View Fullscreen</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Local Stories */}
                        {storiesData?.stories?.length > 0 && (
                            <section className="pt-10 border-t border-white/5">
                                <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                                    <BookOpen className="w-8 h-8 text-amber-400" />
                                    Local Stories
                                </h2>
                                <div className="space-y-6">
                                    {storiesData.stories.slice(0, 3).map((story: any) => (
                                        <div key={story._id} className="p-8 bg-dark-card rounded-[2.5rem] border border-white/5">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-6 h-6 text-sage" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xl text-white">{story.title}</h4>
                                                    <p className="text-xs text-sage-light font-bold mt-1">
                                                        {story.author?.name || story.authorName} · {new Date(story.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sage-light font-medium leading-relaxed">
                                                {story.content.substring(0, 250)}{story.content.length > 250 ? '...' : ''}
                                            </p>
                                            {story.tags?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {story.tags.map((tag: string) => (
                                                        <span key={tag} className="px-3 py-1 bg-white/5 text-white/60 font-bold rounded-full text-xs">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Link to={`/stories`} className="inline-flex items-center gap-2 mt-6 text-amber-400 font-bold hover:text-white transition-colors">
                                    <BookOpen className="w-4 h-4" />
                                    Read more local stories <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Link>
                            </section>
                        )}

            {/* Reviews */}
                        <section className="pt-10 border-t border-white/5">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-extrabold flex items-center gap-4">
                                    <MessageCircle className="w-8 h-8 text-sage" />
                                    Shared Experiences
                                </h2>
                                {reviews.length > 0 && <span className="text-sage-light font-bold">{reviews.length} reviews</span>}
                            </div>

                            {user ? (
                                <form onSubmit={handleSubmitReview} className="mb-16 p-10 bg-dark-card rounded-[3rem] border border-white/5">
                                    <h3 className="text-xl font-bold mb-6">Contribute your rhythm</h3>
                                    <div className="flex items-center gap-2 mb-8">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className="transition-transform hover:scale-125"
                                            >
                                                <Star className={`w-10 h-10 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-white/10'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Speak of the silence, the light, or the coffee..."
                                        className="w-full p-6 rounded-3xl bg-black border border-white/10 text-white font-medium focus:ring-2 focus:ring-sage focus:outline-none resize-none min-h-[150px] mb-6 placeholder:text-white/20"
                                    />
                                    <button
                                        type="submit"
                                        disabled={addReviewMutation.isPending || !reviewText.trim()}
                                        className="px-10 py-4 bg-sage hover:bg-white text-dark-bg font-black rounded-full transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5" />
                                        {addReviewMutation.isPending ? 'Whispering...' : 'Post Experience'}
                                    </button>
                                </form>
                            ) : (
                                <div className="mb-16 p-12 bg-sage/5 rounded-[3rem] text-center border border-sage/10">
                                    <p className="text-sage-light text-lg mb-6 font-medium">Join the community to share your sanctuary experiences.</p>
                                    <button onClick={() => navigate('/login')} className="px-10 py-4 bg-sage text-dark-bg rounded-full font-black hover:bg-white transition-all shadow-xl">
                                        Sign In to Review
                                    </button>
                                </div>
                            )}

                            <div className="space-y-6">
                                {reviews.map((review: Review) => (
                                    <div key={review._id} className="p-8 bg-dark-card rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-sage/20 flex items-center justify-center flex-shrink-0">
                                            {review.user?.avatar ? (
                                                <img src={review.user.avatar} alt={review.user.name} className="w-full h-full rounded-2xl object-cover" />
                                            ) : (
                                                <User className="w-8 h-8 text-sage" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-xl">{review.user?.name || 'Fellow Traveler'}</h4>
                                                <span className="text-sm text-sage-light font-medium opacity-50">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 mb-4">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/10'}`} />
                                                ))}
                                            </div>
                                            <p className="text-sage-light text-lg leading-relaxed font-medium">{review.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-10">
                        <section className="sticky top-32 space-y-8">
                            {/* Map Card */}
                            <div className="bg-dark-card p-1 rounded-[3rem] border border-white/10 overflow-hidden shadow-premium">
                                <div className="h-[300px] w-full relative group">
                                    <iframe src={mapEmbedUrl} width="100%" height="100%" frameBorder="0" className="opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
                                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[2.9rem]" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-terra" />
                                        Exact Location
                                    </h3>
                                    <p className="text-sage-light font-medium text-sm mb-6 leading-relaxed">
                                        {spot.address || 'Sanctuary address hidden. Follow directions for the quietest path.'}
                                    </p>
                                    <a href={`https://maps.google.com/?q=${spot.location?.coordinates?.[1]},${spot.location?.coordinates?.[0]}`} target="_blank" className="w-full py-4 bg-sage text-dark-bg rounded-2xl font-black transition-all flex items-center justify-center gap-3 hover:bg-white shadow-premium">
                                        <Navigation className="w-5 h-5" />
                                        Open in Maps
                                    </a>
                                </div>
                            </div>

                            {/* Small Stats */}
                            <div className="bg-dark-card p-10 rounded-[3rem] border border-white/5 space-y-6">
                                <h4 className="text-xs font-black text-sage uppercase tracking-[0.2em] mb-8">At a glance</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sage-light font-medium">Crowd</span>
                                        <span className="text-white font-bold capitalize">{spot.crowdLevel}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sage-light font-medium">Best Time</span>
                                        <span className="text-white font-bold capitalize">{spot.bestTime.replace('-', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sage-light font-medium">Vibe</span>
                                        <span className="text-white font-bold capitalize">{spot.vibe.replace('-', ' ')}</span>
                                    </div>
                                    {spot.travelerTypes?.length > 0 && (
                                        <div className="pt-4 border-t border-white/5">
                                            <span className="text-sage-light font-medium block mb-3">Perfect for</span>
                                            <div className="flex flex-wrap gap-2">
                                                {spot.travelerTypes.map((t: string) => (
                                                    <span key={t} className="px-3 py-1.5 bg-sage/10 text-sage font-bold rounded-full text-xs capitalize">
                                                        {t.replace(/-/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Premium Fullscreen Lightbox */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-[100] flex flex-col"
                    >
                        {/* Lightbox Header */}
                        <div className="p-8 flex justify-between items-center z-10">
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black text-white">{spot.title}</h2>
                                <p className="text-sage font-bold uppercase tracking-widest text-xs">{activeImageIndex + 1} of {images.length}</p>
                            </div>
                            <button
                                onClick={() => setShowLightbox(false)}
                                className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Main Image Container */}
                        <div className="flex-1 relative flex items-center justify-center px-4 overflow-hidden">
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                        className="absolute left-8 p-6 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-10 group"
                                    >
                                        <ChevronLeft className="w-10 h-10 group-hover:-translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                        className="absolute right-8 p-6 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-10 group"
                                    >
                                        <ChevronRight className="w-10 h-10 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </>
                            )}

                            <motion.img
                                key={activeImageIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                src={images[activeImageIndex]}
                                alt={spot.title}
                                className="max-w-full max-h-[75vh] object-contain shadow-[0_0_50px_rgba(168,196,176,0.1)] rounded-xl"
                            />
                        </div>

                        {/* Thumbnails Strip */}
                        <div className="p-12 flex justify-center gap-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                            {images.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIndex(i)}
                                    className={`relative w-24 aspect-square rounded-2xl overflow-hidden transition-all duration-500 border-2 ${
                                        i === activeImageIndex ? 'border-sage scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
