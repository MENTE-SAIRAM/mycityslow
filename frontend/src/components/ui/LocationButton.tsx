import { Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationButtonProps {
    onClick: () => void;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'hero';
    className?: string;
}

export default function LocationButton({ onClick, loading = false, variant = 'primary', className = '' }: LocationButtonProps) {
    const baseClasses = 'inline-flex items-center gap-2 font-medium transition-all rounded-full';

    const variantClasses = {
        primary: 'px-5 py-2.5 bg-sage hover:bg-sage-dark text-white shadow-md shadow-sage/20 hover:scale-[1.02]',
        secondary: 'px-4 py-2 bg-white dark:bg-dark-card border border-black/10 dark:border-white/10 hover:border-sage dark:hover:border-sage text-text-primary dark:text-dark-text hover:shadow-sm',
        hero: 'px-8 py-4 bg-white/90 hover:bg-white text-sage-dark rounded-full font-medium text-lg transition-all hover:scale-105 shadow-lg backdrop-blur-md',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            disabled={loading}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Navigation className="w-4 h-4" />
            )}
            {loading ? 'Detecting...' : variant === 'hero' ? 'Near Me' : 'Use My Location'}
        </motion.button>
    );
}
