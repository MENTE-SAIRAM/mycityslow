import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Compass, Clock, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';

interface GuideData {
    _id: string;
    title: string;
    city: { name: string; slug: string; image?: string; description?: string };
    slug: string;
    overview: string;
    travelerType: string;
    duration: string;
    image: string;
}

const TRAVELER_LABELS: Record<string, string> = {
    'slow-traveler': 'Slow Traveler',
    'cultural-explorer': 'Cultural Explorer',
    'foodie': 'Foodie',
    'photographer': 'Photographer',
    'wellness-seeker': 'Wellness Seeker',
    'solo-female': 'Solo Female',
    'history-lover': 'History Lover',
};

export default function Guides() {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ['guides'],
        queryFn: () => api.get('/guides').then(res => res.data.data || res.data),
    });

    const guides: GuideData[] = data?.guides || [];

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <Helmet>
                <title>Curated City Guides — My City Slow</title>
                <meta name="description" content="First time in a city? Our curated guides help you discover the authentic side of India's most beautiful destinations." />
            </Helmet>

            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sage hover:text-white transition-colors mb-6 font-bold group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
            </button>

            <div className="mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">Curated City Guides</h1>
                <p className="text-xl text-sage-light font-medium max-w-3xl leading-relaxed">
                    First time in a city? Let our local-curated guides show you the authentic side — beyond the guidebooks and tourist traps.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-[400px] bg-white/5 rounded-[3rem] animate-pulse" />)}
                </div>
            ) : guides.length === 0 ? (
                <div className="text-center py-40 bg-dark-card rounded-[4rem] border border-white/5">
                    <Compass className="w-24 h-24 text-sage mx-auto mb-8 opacity-20" />
                    <h3 className="text-4xl font-extrabold mb-4 text-white">No guides yet</h3>
                    <p className="text-xl text-sage-light font-medium">Curated guides are coming soon for your favorite cities.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {guides.map((guide, index) => {
                        const defaultImg = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=3000&auto=format&fit=crop';
                        const image = guide.image || guide.city?.image || defaultImg;
                        const travelerLabel = TRAVELER_LABELS[guide.travelerType] || guide.travelerType || 'All Travelers';

                        return (
                            <Link key={guide._id} to={`/guides/${guide.city?.slug || guide.slug}`} className="block group">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-dark-card rounded-[3rem] overflow-hidden border border-white/5 hover:border-sage/30 transition-all shadow-sm hover:shadow-premium-hover"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img src={image} alt={guide.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h3 className="text-3xl font-extrabold text-white mb-2">{guide.title}</h3>
                                            <div className="flex items-center gap-2 text-white/80 text-sm font-bold">
                                                <MapPin className="w-4 h-4 text-sage" />
                                                {guide.city?.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <p className="text-sage-light font-medium leading-relaxed line-clamp-2 mb-6">{guide.overview}</p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1.5 text-sage-light font-bold">
                                                <Clock className="w-4 h-4" />
                                                {guide.duration}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-sage-light font-bold">
                                                <Users className="w-4 h-4" />
                                                {travelerLabel}
                                            </span>
                                            <span className="ml-auto text-sage font-bold group-hover:underline">Explore Guide →</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
