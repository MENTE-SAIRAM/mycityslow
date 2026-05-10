import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, AlertCircle, Loader2, Navigation } from 'lucide-react';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDetect: () => void;
    onManualSelect: () => void;
    onRetry?: () => void;
    loading: boolean;
    error: string | null;
    permissionDenied: boolean;
}

export default function LocationModal({
    isOpen,
    onClose,
    onDetect,
    onManualSelect,
    onRetry,
    loading,
    error,
    permissionDenied,
}: LocationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50"
                    >
                        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden border border-black/5 dark:border-white/10">
                            <div className="relative p-8 text-center">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <X className="w-5 h-5 text-text-secondary" />
                                </button>

                                {loading ? (
                                    <div className="py-8">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage/20 flex items-center justify-center"
                                        >
                                            <Loader2 className="w-10 h-10 text-sage-dark animate-spin" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold mb-2">Detecting your location...</h3>
                                        <p className="text-text-secondary">Please wait a moment while we find peaceful spots near you</p>
                                    </div>
                                ) : error ? (
                                    <div className="py-4">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                            <AlertCircle className="w-8 h-8 text-red-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Location Access Failed</h3>
                                        <p className="text-text-secondary text-sm mb-6">{error}</p>
                                        <div className="flex flex-col gap-3">
                                            {permissionDenied && onRetry && (
                                                <button
                                                    onClick={onRetry}
                                                    className="w-full px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-full font-medium transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Navigation className="w-4 h-4" />
                                                    Try Again
                                                </button>
                                            )}
                                            <button
                                                onClick={onManualSelect}
                                                className="w-full px-6 py-3 bg-white dark:bg-dark-bg border border-black/10 dark:border-white/10 hover:border-sage dark:hover:border-sage rounded-full font-medium transition-all flex items-center justify-center gap-2"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                Choose City Manually
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage/20 flex items-center justify-center">
                                            <MapPin className="w-10 h-10 text-sage-dark" />
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-2">Find Peaceful Spots Near You</h3>
                                        <p className="text-text-secondary mb-8">
                                            We'll use your location to discover serene spots, quiet cafes, and tranquil parks within 15km of you.
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={onDetect}
                                                className="w-full px-6 py-4 bg-sage hover:bg-sage-dark text-white rounded-full font-medium text-lg transition-all hover:scale-[1.02] shadow-lg shadow-sage/20 flex items-center justify-center gap-2"
                                            >
                                                <Navigation className="w-5 h-5" />
                                                Use My Current Location
                                            </button>
                                            <button
                                                onClick={onManualSelect}
                                                className="w-full px-6 py-3 bg-white dark:bg-dark-bg border border-black/10 dark:border-white/10 hover:border-sage dark:hover:border-sage rounded-full font-medium transition-all flex items-center justify-center gap-2"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                Choose City Manually
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
