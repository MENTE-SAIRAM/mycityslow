import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SpotCard, { type SpotData } from '../components/ui/SpotCard';
import { useAppStore } from '../store/useAppStore';

export default function Collection() {
    const { user } = useAppStore();
    const queryClient = useQueryClient();

    const { data: spots, isLoading } = useQuery({
        queryKey: ['collection'],
        queryFn: () => api.get('/collection').then(res => res.data.data.spots),
        enabled: !!user,
    });

    const handleToggleSave = async (id: string) => {
        queryClient.setQueryData(['collection'], (old: any) => {
            if (!old) return old;
            return old.filter((s: any) => s._id !== id);
        });
        try {
            await api.delete(`/collection/${id}`);
        } catch {
            queryClient.invalidateQueries({ queryKey: ['collection'] });
        }
    };

    if (!user) {
        return (
            <div className="text-center py-32 max-w-lg mx-auto">
                <HeartCrack className="w-16 h-16 text-text-tertiary mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Save your favorite spots</h1>
                <p className="text-text-secondary mb-8">Sign in to save spots to your personal slow living collection.</p>
                <Link to="/login" className="px-8 py-3 bg-sage hover:bg-sage-dark text-white rounded-full font-medium transition-colors">
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full pb-24">
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-2">My Collection</h1>
                <p className="text-text-secondary">Your personal sanctuaries and saved spots.</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : !spots || spots.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-dark-card rounded-3xl border border-black/5 dark:border-white/5">
                    <div className="w-20 h-20 bg-sage-light text-sage-dark rounded-full flex items-center justify-center mx-auto mb-6">
                        <HeartCrack className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your collection is empty</h3>
                    <p className="text-text-secondary mb-8">Start exploring to find your first peaceful spot.</p>
                    <Link to="/discover" className="px-8 py-3 bg-sage hover:bg-sage-dark text-white rounded-full font-medium transition-colors">
                        Discover Spots
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {spots.map((spot: SpotData) => (
                        <SpotCard key={spot._id} spot={spot} isSaved onToggleSave={handleToggleSave} />
                    ))}
                </div>
            )}
        </div>
    );
}
