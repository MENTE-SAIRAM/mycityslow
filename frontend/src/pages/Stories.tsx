import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Loader2, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import StoryCard, { type StoryData } from '../components/ui/StoryCard';

export default function Stories() {
    const navigate = useNavigate();
    const [cityFilter, setCityFilter] = useState('');

    const { data: homeData } = useQuery({
        queryKey: ['homeData'],
        queryFn: () => api.get('/home').then(res => res.data.data),
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['stories', cityFilter],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({ page: pageParam.toString(), limit: '12' });
            if (cityFilter) params.append('city', cityFilter);
            const res = await api.get(`/stories?${params.toString()}`);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            const pag = lastPage.pagination || lastPage.data?.pagination;
            if (!pag) return undefined;
            return pag.page < pag.totalPages ? pag.page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const stories = data?.pages.flatMap(page => (page.data || page).stories) || [];

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <Helmet>
                <title>Local Stories — My City Slow</title>
                <meta name="description" content="Real stories from locals about hidden spots, authentic experiences, and the peaceful side of Indian cities." />
            </Helmet>

            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sage hover:text-white transition-colors mb-6 font-bold group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                <div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 flex items-center gap-4">
                        <BookOpen className="w-12 h-12 text-sage" />
                        Local Stories
                    </h1>
                    <p className="text-xl text-sage-light font-medium max-w-3xl leading-relaxed">
                        Real stories from locals and travelers. Hidden gems, chance encounters, and the moments that make travel meaningful.
                    </p>
                </div>
            </div>

            {homeData?.cities && (
                <div className="flex flex-wrap gap-3 mb-12">
                    <button
                        onClick={() => setCityFilter('')}
                        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${!cityFilter ? 'bg-sage text-dark-bg' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                    >
                        All Stories
                    </button>
                    {homeData.cities.map((c: any) => (
                        <button
                            key={c._id}
                            onClick={() => setCityFilter(c._id)}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${cityFilter === c._id ? 'bg-sage text-dark-bg' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[320px] bg-white/5 rounded-[2.5rem] animate-pulse" />)}
                </div>
            ) : stories.length === 0 ? (
                <div className="text-center py-40 bg-dark-card rounded-[4rem] border border-white/5">
                    <Search className="w-24 h-24 text-sage mx-auto mb-8 opacity-20" />
                    <h3 className="text-4xl font-extrabold mb-4 text-white">No stories yet</h3>
                    <p className="text-xl text-sage-light mb-12 max-w-lg mx-auto font-medium">Be the first to share a story about your experience.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                        {stories.map((story: StoryData) => (
                            <StoryCard key={story._id} story={story} />
                        ))}
                    </div>
                    {hasNextPage && (
                        <div className="flex justify-center pb-16">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="px-10 py-4 bg-dark-card border border-white/10 text-white rounded-full font-bold hover:bg-white hover:text-dark-bg transition-all shadow-lg flex items-center gap-3 disabled:opacity-50"
                            >
                                {isFetchingNextPage ? <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</> : 'More Stories'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
