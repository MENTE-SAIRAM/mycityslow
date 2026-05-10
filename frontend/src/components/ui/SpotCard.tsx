import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/image';

export interface SpotData {
    _id: string;
    title: string;
    description: string;
    city: { name: string; slug: string };
    images: string[];
    peaceScore: number;
    distanceKm?: number;
    vibe: string;
    bestTime: string;
}

interface SpotCardProps {
    spot: SpotData;
    showDistance?: boolean;
    isSaved?: boolean;
    onToggleSave?: (id: string) => void;
}

export default function SpotCard({ spot, showDistance, isSaved = false, onToggleSave }: SpotCardProps) {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const handleSaveClick = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (saving) return;
        setSaving(true);
        onToggleSave?.(spot._id);
        setTimeout(() => setSaving(false), 500);
    };

    const handleCardClick = () => {
        navigate(`/spot/${spot._id}`);
    };

    const defaultImage = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2948&auto=format&fit=crop";
    const image = spot.images && spot.images.length > 0 ? resolveImageUrl(spot.images[0]) : defaultImage;

    return (
        <div onClick={handleCardClick} className="group block cursor-pointer">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-premium group-hover:shadow-premium-hover transition-all duration-500 bg-black border border-white/5"
            >
                <img
                    src={image}
                    alt={spot.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                
                {/* Badges */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                    <div className="glass px-4 py-2 rounded-full text-xs font-extrabold text-white flex items-center gap-1.5 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {spot.peaceScore}/10 Peace Factor
                    </div>
                    <div className="flex gap-2">
                        {showDistance && spot.distanceKm !== undefined && (
                            <div className="bg-sage px-4 py-2 rounded-full text-[10px] font-black text-dark-bg uppercase tracking-widest shadow-md">
                                {spot.distanceKm} km away
                            </div>
                        )}
                        {onToggleSave && (
                            <motion.button
                                whileTap={{ scale: 0.8 }}
                                onPointerDown={handleSaveClick}
                                disabled={saving}
                                className="glass p-2.5 rounded-full shadow-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                            >
                                <motion.div
                                    animate={saving ? { scale: [1, 1.4, 1] } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-terra text-terra' : 'text-white'}`} />
                                </motion.div>
                            </motion.button>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:translate-y-[-8px] z-10">
                    <div className="flex items-center gap-2 text-terra text-[11px] font-black uppercase tracking-[0.2em] mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        {spot.city?.name}
                    </div>
                    
                    <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight text-shadow-lg leading-tight">
                        {spot.title}
                    </h3>
                    
                    <p className="text-sm text-white/90 line-clamp-2 mb-6 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {spot.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/80 uppercase font-black tracking-tighter mb-0.5">Best Time</span>
                                <span className="text-xs text-sage font-bold capitalize">{spot.bestTime?.replace('-', ' ')}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/80 uppercase font-black tracking-tighter mb-0.5">Vibe</span>
                                <span className="text-xs text-sage font-bold capitalize">{spot.vibe?.replace('-', ' ')}</span>
                            </div>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md group-hover:bg-sage group-hover:text-dark-bg transition-colors shadow-sm">
                            <Navigation className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
