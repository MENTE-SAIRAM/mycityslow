import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Compass, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';

export default function GuideDetail() {
    const { citySlug } = useParams();
    const navigate = useNavigate();

    const { data: guide, isLoading } = useQuery({
        queryKey: ['guide', citySlug],
        queryFn: () => api.get(`/guides/${citySlug}`).then(res => res.data.data || res.data),
        enabled: !!citySlug,
    });

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center mt-32">
                <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="w-full max-w-7xl mx-auto px-6 py-32 text-center">
                <Compass className="w-24 h-24 text-sage mx-auto mb-8 opacity-20" />
                <h2 className="text-4xl font-extrabold text-white mb-4">Guide not found</h2>
                <p className="text-xl text-sage-light font-medium mb-8">We haven't created a guide for this city yet.</p>
                <button onClick={() => navigate('/guides')} className="px-10 py-4 bg-sage text-dark-bg rounded-full font-extrabold hover:bg-white transition-all">
                    Browse All Guides
                </button>
            </div>
        );
    }

    const defaultBg = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=3000&auto=format&fit=crop';

    return (
        <div className="pb-24 -mt-8 mx-[-16px] sm:mx-[-24px] lg:mx-[-32px] bg-dark-bg text-white">
            <Helmet>
                <title>{guide.title} — My City Slow</title>
                <meta name="description" content={guide.overview?.substring(0, 160)} />
            </Helmet>

            <div className="relative w-full h-[50vh] overflow-hidden shadow-2xl">
                <img src={guide.image || guide.city?.image || defaultBg} alt={guide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
                <div className="absolute top-0 left-0 w-full p-8 z-20">
                    <button onClick={() => navigate('/guides')} className="p-4 bg-black/30 hover:bg-sage hover:text-dark-bg backdrop-blur-md rounded-full text-white transition-all shadow-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="flex items-center gap-3 text-sage font-bold uppercase tracking-[0.2em] mb-4">
                            <MapPin className="w-5 h-5" />
                            <span>{guide.city?.name}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tighter">{guide.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sage-light font-bold">
                            <span className="flex items-center gap-2"><Clock className="w-5 h-5" />{guide.duration}</span>
                            <span className="flex items-center gap-2"><Users className="w-5 h-5" />{guide.travelerType ? guide.travelerType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'For everyone'}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16">
                <p className="text-xl text-sage-light leading-[1.8] font-medium mb-20">{guide.overview}</p>

                {guide.sections?.map((section: any, index: number) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="mb-16 last:mb-0"
                    >
                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-sage/20 flex items-center justify-center text-sage text-2xl font-black flex-shrink-0">
                                {index + 1}
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-white mb-4">{section.title}</h2>
                                <p className="text-lg text-sage-light leading-relaxed font-medium">{section.content}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
