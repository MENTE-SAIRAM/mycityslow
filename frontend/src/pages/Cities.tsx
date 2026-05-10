import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';

interface City {
    _id: string;
    name: string;
    slug: string;
    state: string;
    totalSpots: number;
    image?: string;
}

export default function Cities() {
    const { data: cities, isLoading, isError } = useQuery({
        queryKey: ['cities'],
        queryFn: async () => {
            const res = await api.get('/cities');
            const payload = res.data?.data ?? res.data;
            if (Array.isArray(payload)) return payload;
            if (Array.isArray(payload?.cities)) return payload.cities;
            return [];
        },
    });

    return (
        <div className="w-full">
            <Helmet>
                <title>Slow Cities — Discover Peaceful Spots Across India | My City Slow</title>
                <meta name="description" content="Explore our curated directory of peaceful cities in India. From Bengaluru to Mumbai, find the best hidden sanctuaries and calm corners in your city." />
                <meta property="og:title" content="Slow Cities — Discover Peaceful Spots Across India | My City Slow" />
                <meta property="og:description" content="Explore our curated directory of peaceful cities in India. Find hidden sanctuaries and calm corners." />
                <link rel="canonical" href="https://mycityslow.com/cities" />
            </Helmet>
            <div className="text-center max-w-2xl mx-auto mb-16 mt-8">
                <Map className="w-12 h-12 text-terra mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Slow Cities</h1>
                <p className="text-lg text-text-secondary leading-relaxed">
                    Discover our growing network of Indian cities mapped for peace, tranquility, and slow living.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-72 bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : isError ? (
                <div className="text-center py-16 text-text-secondary">
                    Unable to load cities right now.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {cities?.map((city: City) => (
                        <Link
                            key={city._id}
                            to={`/discover?city=${city.slug}`}
                            className="group relative h-80 rounded-3xl overflow-hidden block border border-black/5 dark:border-white/5"
                        >
                            <img
                                src={city.image || "https://images.unsplash.com/photo-1596422846543-74c6fc0280eb?q=80&w=2600"}
                                alt={city.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-8 left-8 right-8">
                                <span className="text-terra-light font-medium text-sm tracking-widest uppercase mb-2 block">
                                    {city.state || 'India'}
                                </span>
                                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-terra-light transition-colors">
                                    {city.name}
                                </h3>
                                <p className="text-white/80 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-sage shadow-[0_0_8px_rgba(168,196,176,0.8)]"></span>
                                    {city.totalSpots ?? 0} Sanctuaries
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
