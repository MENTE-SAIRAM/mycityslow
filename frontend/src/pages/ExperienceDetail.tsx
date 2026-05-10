import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Users, Globe, Gift, Star, Navigation, Info, CheckCircle, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import { resolveImageUrl } from '../utils/image';

const TYPE_LABELS: Record<string, string> = {
    'home-cooked-meal': 'Home-Cooked Meal',
    'heritage-walk': 'Heritage Walk',
    'craft-workshop': 'Craft Workshop',
    'village-visit': 'Village Visit',
    'cultural-session': 'Cultural Session',
    'slow-travel-itinerary': 'Slow Travel Itinerary',
    'neighborhood-exploration': 'Neighborhood Exploration',
};

const TRAVELER_LABELS: Record<string, string> = {
    'slow-traveler': 'Slow Traveler',
    'cultural-explorer': 'Cultural Explorer',
    'foodie': 'Foodie',
    'photographer': 'Photographer',
    'wellness-seeker': 'Wellness Seeker',
    'solo-female': 'Solo Female',
    'history-lover': 'History Lover',
};

export default function ExperienceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    const { data: exp, isLoading } = useQuery({
        queryKey: ['experience', id],
        queryFn: () => api.get(`/experiences/${id}`).then(res => res.data.data),
    });

    if (isLoading || !exp) {
        return (
            <div className="w-full h-screen flex justify-center mt-32">
                <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940&auto=format&fit=crop';
    const images = exp.images?.length > 0 ? exp.images.map((img: string) => resolveImageUrl(img)) : [defaultImage];
    const typeLabel = TYPE_LABELS[exp.type] || exp.type;
    const travelerTypeNames = exp.travelerTypes?.map((t: string) => TRAVELER_LABELS[t] || t) || [];

    const handlePrevImage = () => setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const handleNextImage = () => setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div className="pb-24 -mt-8 mx-[-16px] sm:mx-[-24px] lg:mx-[-32px] bg-dark-bg text-white">
            <Helmet>
                <title>{`${exp.title} in ${exp.city?.name} — My City Slow`}</title>
                <meta name="description" content={exp.description?.substring(0, 160)} />
            </Helmet>

            <div className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden shadow-2xl">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={images[activeImageIndex]}
                    alt={exp.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setShowLightbox(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-black/40" />

                <div className="absolute bottom-12 right-8 flex items-center gap-3 z-20">
                    <button onClick={() => setShowLightbox(true)} className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110"><Maximize2 className="w-6 h-6" /></button>
                    {images.length > 1 && (
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <button onClick={handlePrevImage} className="hover:text-sage"><ChevronLeft className="w-5 h-5" /></button>
                            <span className="text-xs font-bold w-8 text-center">{activeImageIndex + 1} / {images.length}</span>
                            <button onClick={handleNextImage} className="hover:text-sage"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    )}
                </div>

                <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20">
                    <button onClick={() => navigate(-1)} className="p-4 bg-black/30 hover:bg-sage hover:text-dark-bg backdrop-blur-md rounded-full text-white transition-all shadow-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <span className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-xs font-black text-white uppercase tracking-wider border border-white/20">
                        {typeLabel}
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-4xl">
                        <div className="flex items-center gap-3 text-sage font-bold uppercase tracking-[0.2em] mb-6">
                            <MapPin className="w-5 h-5" />
                            <span>{exp.city?.name}</span>
                            <span className="opacity-30">•</span>
                            <Users className="w-4 h-4" />
                            <span>{exp.hostedBy || 'Local host'}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tighter">{exp.title}</h1>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="glass px-6 py-2.5 rounded-full text-base font-black text-white flex items-center gap-2 border border-white/10">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                {exp.peaceScore}/10 Authenticity
                            </div>
                            <div className="flex items-center gap-2 text-sage-light font-bold">
                                <Clock className="w-5 h-5" />
                                {exp.duration}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-8 space-y-20">
                        <section>
                            <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3"><Info className="w-8 h-8 text-sage" /> About This Experience</h2>
                            <p className="text-xl text-sage-light leading-[1.8] font-medium">{exp.description}</p>
                        </section>

                        {exp.includes?.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3"><Gift className="w-8 h-8 text-sage" /> What's Included</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {exp.includes.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-5 bg-dark-card rounded-2xl border border-white/5">
                                            <CheckCircle className="w-5 h-5 text-sage flex-shrink-0" />
                                            <span className="text-white font-bold">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {travelerTypeNames.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-extrabold mb-8">Perfect For</h2>
                                <div className="flex flex-wrap gap-3">
                                    {travelerTypeNames.map((t: string) => (
                                        <span key={t} className="px-5 py-3 bg-sage/10 text-sage font-bold rounded-full text-sm capitalize border border-sage/20">{t}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {images.length > 1 && (
                            <section>
                                <h2 className="text-3xl font-extrabold mb-8">Gallery</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {images.slice(1).map((img: string, i: number) => (
                                        <motion.button key={i} whileHover={{ scale: 1.05 }}
                                            onClick={() => { setActiveImageIndex(i + 1); setShowLightbox(true); }}
                                            className="relative h-56 rounded-3xl overflow-hidden group cursor-pointer shadow-lg border border-white/5">
                                            <img src={img} alt={`${exp.title} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                                <span className="text-white font-bold text-sm">View Fullscreen</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-dark-card p-8 rounded-[3rem] border border-white/5 space-y-8">
                                <h3 className="text-xl font-extrabold flex items-center gap-2"><Info className="w-5 h-5 text-sage" /> Details</h3>
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center text-sage"><Clock className="w-5 h-5" /></div>
                                        <div><p className="text-xs text-sage-light font-bold uppercase tracking-wider">Duration</p><p className="text-white font-bold">{exp.duration}</p></div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center text-sage"><Users className="w-5 h-5" /></div>
                                        <div><p className="text-xs text-sage-light font-bold uppercase tracking-wider">Hosted by</p><p className="text-white font-bold">{exp.hostedBy || 'Local host'}</p></div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center text-sage"><Globe className="w-5 h-5" /></div>
                                        <div><p className="text-xs text-sage-light font-bold uppercase tracking-wider">Languages</p><p className="text-white font-bold">{exp.languages?.join(', ') || 'English'}</p></div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center text-sage"><MapPin className="w-5 h-5" /></div>
                                        <div><p className="text-xs text-sage-light font-bold uppercase tracking-wider">Meeting Point</p><p className="text-white font-bold">{exp.meetingPoint || exp.address || 'To be confirmed'}</p></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-dark-card p-8 rounded-[3rem] border border-white/10">
                                <h3 className="text-xl font-extrabold mb-4">Want to book?</h3>
                                <p className="text-sage-light font-medium mb-6 leading-relaxed">This experience is hosted by a local. Contact us to check availability and book your slot.</p>
                                <a href={`mailto:hello@mycityslow.com?subject=Booking: ${exp.title}`}
                                    className="w-full py-4 bg-sage text-dark-bg rounded-2xl font-black transition-all flex items-center justify-center gap-3 hover:bg-white shadow-premium">
                                    Request Booking
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showLightbox && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[100] flex flex-col">
                        <div className="p-8 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-black text-white">{exp.title}</h2>
                            <button onClick={() => setShowLightbox(false)} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"><X className="w-8 h-8" /></button>
                        </div>
                        <div className="flex-1 relative flex items-center justify-center px-4 overflow-hidden">
                            {images.length > 1 && (
                                <>
                                    <button onClick={handlePrevImage} className="absolute left-8 p-6 bg-white/5 hover:bg-white/10 rounded-full text-white z-10"><ChevronLeft className="w-10 h-10" /></button>
                                    <button onClick={handleNextImage} className="absolute right-8 p-6 bg-white/5 hover:bg-white/10 rounded-full text-white z-10"><ChevronRight className="w-10 h-10" /></button>
                                </>
                            )}
                            <motion.img key={activeImageIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                src={images[activeImageIndex]} alt={exp.title} className="max-w-full max-h-[75vh] object-contain" />
                        </div>
                        <div className="p-12 flex justify-center gap-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                            {images.map((img: string, i: number) => (
                                <button key={i} onClick={() => setActiveImageIndex(i)}
                                    className={`relative w-24 aspect-square rounded-2xl overflow-hidden transition-all duration-500 border-2 ${i === activeImageIndex ? 'border-sage scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}>
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
