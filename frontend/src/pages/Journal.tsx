import { Helmet } from 'react-helmet-async';

export default function Journal() {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
            <Helmet>
                <title>Journal — My City Slow</title>
                <meta
                    name="description"
                    content="My City Slow Journal is coming soon with stories, guides, and reflections on slow living."
                />
                <link rel="canonical" href="https://mycityslow.com/journal" />
            </Helmet>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Journal</h1>
            <p className="text-xl text-sage-light font-medium">
                Soon it will be added.
            </p>
        </div>
    );
}
