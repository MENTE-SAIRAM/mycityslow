import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Star } from 'lucide-react';

export interface ExperienceData {
    _id: string;
    title: string;
    description: string;
    type: string;
    travelerTypes: string[];
    city: { name: string; slug: string };
    images: string[];
    priceRange: string;
    duration: string;
    hostedBy: string;
    peaceScore: number;
    isFeatured: boolean;
}

const TYPE_LABELS: Record<string, string> = {
    'home-cooked-meal': 'Home-Cooked Meal',
    'heritage-walk': 'Heritage Walk',
    'craft-workshop': 'Craft Workshop',
    'village-visit': 'Village Visit',
    'cultural-session': 'Cultural Session',
    'slow-travel-itinerary': 'Slow Travel Itinerary',
    'neighborhood-exploration': 'Neighborhood Exploration',
};

const PRICE_LABELS: Record<string, string> = {
    free: 'Free',
    budget: 'Budget',
    moderate: 'Moderate',
    premium: 'Premium',
};

export default function ExperienceCard({ experience }: { experience: ExperienceData }) {
    const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940&auto=format&fit=crop';
    const image = experience.images?.[0] || defaultImage;
    const typeLabel = TYPE_LABELS[experience.type] || experience.type;
    const priceLabel = PRICE_LABELS[experience.priceRange] || experience.priceRange;

    return (
        <Link to={`/experience/${experience._id}`} className="block group">
            <motion.div
                whileHover={{ y: -6 }}
                className="bg-dark-card rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-sage/30 transition-all shadow-sm hover:shadow-premium-hover h-full flex flex-col"
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={image}
                        alt={experience.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <span className="px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-black text-white uppercase tracking-wider border border-white/20">
                            {typeLabel}
                        </span>
                        {experience.isFeatured && (
                            <span className="px-3 py-1.5 bg-terra/80 backdrop-blur-md rounded-full text-xs font-black text-white uppercase tracking-wider">
                                Featured
                            </span>
                        )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/90 text-sm font-bold">
                            <MapPin className="w-4 h-4" />
                            {experience.city?.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/90 text-sm font-bold">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {experience.peaceScore}
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-sage transition-colors leading-tight">
                        {experience.title}
                    </h3>
                    <p className="text-sage-light font-medium text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
                        {experience.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1.5 text-sage-light font-bold">
                            <Clock className="w-4 h-4" />
                            {experience.duration}
                        </span>
                        <span className="flex items-center gap-1.5 text-sage-light font-bold">
                            <Users className="w-4 h-4" />
                            {experience.hostedBy || 'Local host'}
                        </span>
                        <span className="ml-auto px-3 py-1 bg-sage/10 text-sage font-bold rounded-full text-xs">
                            {priceLabel}
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
