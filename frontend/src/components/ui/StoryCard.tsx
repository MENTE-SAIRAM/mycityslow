import { motion } from 'framer-motion';
import { User, Heart, MapPin } from 'lucide-react';

export interface StoryData {
    _id: string;
    title: string;
    content: string;
    author: { name: string; avatar?: string };
    authorName: string;
    city: { name: string; slug: string };
    images: string[];
    tags: string[];
    likes: number;
    createdAt: string;
}

export default function StoryCard({ story }: { story: StoryData }) {
    const authorName = story.author?.name || story.authorName || 'Local Explorer';
    const preview = story.content.substring(0, 200) + (story.content.length > 200 ? '...' : '');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-card rounded-[2.5rem] p-8 border border-white/5 hover:border-sage/20 transition-all"
        >
            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center flex-shrink-0">
                    {story.author?.avatar ? (
                        <img src={story.author.avatar} alt={authorName} className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                        <User className="w-6 h-6 text-sage" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-extrabold text-white mb-1 leading-tight">{story.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-sage-light font-bold">
                        <span>{authorName}</span>
                        {story.city?.name && (
                            <>
                                <span className="opacity-30">•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {story.city.name}
                                </span>
                            </>
                        )}
                        <span className="opacity-30">•</span>
                        <span>{new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <p className="text-sage-light font-medium leading-relaxed mb-6">{preview}</p>

            {story.tags && story.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {story.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-white/5 text-white/70 font-bold rounded-full text-xs capitalize">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-sage-light font-bold text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{story.likes || 0}</span>
                </div>
            </div>
        </motion.div>
    );
}
