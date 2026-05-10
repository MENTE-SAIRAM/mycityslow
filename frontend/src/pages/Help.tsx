import { Helmet } from 'react-helmet-async';

export default function Help() {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
            <Helmet>
                <title>Help — My City Slow</title>
                <meta
                    name="description"
                    content="Help center for My City Slow. Find quick guidance for discovering spots, saving collections, and submitting places."
                />
                <link rel="canonical" href="https://mycityslow.com/help" />
            </Helmet>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Help</h1>
            <p className="text-sage-light mb-10">Find guidance for using My City Slow.</p>

            <div className="space-y-6">
                <div className="bg-dark-card border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-2">Discover Spots</h2>
                    <p className="text-sage-light">Use Discover page filters or Near Me to find peaceful places that match your vibe.</p>
                </div>
                <div className="bg-dark-card border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-2">Save to Collection</h2>
                    <p className="text-sage-light">Tap the heart icon on cards or spot detail pages to add/remove places from your collection.</p>
                </div>
                <div className="bg-dark-card border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-2">Submit New Places</h2>
                    <p className="text-sage-light">Go to the submit page and share a peaceful spot with photos and details.</p>
                </div>
            </div>
        </div>
    );
}
