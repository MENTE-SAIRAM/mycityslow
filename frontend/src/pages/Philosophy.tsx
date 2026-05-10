import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Leaf, Sun, Wind, Moon, Zap, Waves } from 'lucide-react';

export default function Philosophy() {
    const pillars = [
        {
            title: 'Radical Presence',
            description: 'In an age of digital distraction, being where your feet are is a revolutionary act. We curate spaces that command your attention and reward your presence.',
            icon: <Sun className="w-8 h-8" />,
            color: 'text-amber-200'
        },
        {
            title: 'Urban Ecology',
            description: 'We believe the city is a living organism. By identifying and protecting quiet natural pockets, we foster a healthier relationship between concrete and chlorophyll.',
            icon: <Leaf className="w-8 h-8" />,
            color: 'text-sage'
        },
        {
            title: 'The 15dB Rule',
            description: 'Silence is not the absence of sound, but the absence of noise. We prioritize spaces where the ambient soundscape allows for deep thought and physiological rest.',
            icon: <Waves className="w-8 h-8" />,
            color: 'text-blue-200'
        }
    ];

    return (
        <div className="w-full bg-dark-bg min-h-screen">
            <Helmet>
                <title>The Philosophy — My City Slow</title>
                <meta name="description" content="Explore the core principles of My City Slow. From Radical Presence to Urban Ecology, discover why we advocate for a slower, more intentional pace of life." />
            </Helmet>

            {/* Immersive Header */}
            <section className="relative py-40 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-sage/5 rounded-full blur-[120px] pointer-events-none" />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="relative z-10"
                >
                    <span className="text-sage font-black uppercase tracking-[0.4em] text-xs mb-8 block">A Way of Being</span>
                    <h1 className="text-7xl md:text-9xl font-extrabold text-white mb-12 tracking-tighter leading-none">
                        Philosophy <br /> of <span className="italic font-serif text-sage">Slow.</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-sage-light/60 font-serif max-w-3xl mx-auto leading-relaxed italic">
                        "The faster the world spins, the more we must learn to stand still."
                    </p>
                </motion.div>
            </section>

            {/* The Pillars */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {pillars.map((pillar, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="group"
                        >
                            <div className={`mb-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${pillar.color}`}>
                                {pillar.icon}
                            </div>
                            <h3 className="text-3xl font-extrabold text-white mb-6 tracking-tight">{pillar.title}</h3>
                            <p className="text-sage-light text-lg leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                {pillar.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Full Width Quote */}
            <section className="py-40 bg-white/5 border-y border-white/5 relative overflow-hidden">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
                    className="absolute -right-40 -top-40 w-[600px] h-[600px] border border-sage/10 rounded-full flex items-center justify-center pointer-events-none"
                >
                    <div className="w-[400px] h-[400px] border border-sage/5 rounded-full" />
                </motion.div>

                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-12 leading-tight">
                        We don't just map places. We map <span className="text-sage">moments of clarity</span> in a world of constant motion.
                    </h2>
                    <div className="flex justify-center gap-12">
                        <div className="flex flex-col items-center">
                            <span className="text-sage font-black text-xs uppercase tracking-widest mb-4">Focus</span>
                            <Wind className="w-6 h-6 text-white/40" />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-sage font-black text-xs uppercase tracking-widest mb-4">Rest</span>
                            <Moon className="w-6 h-6 text-white/40" />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-sage font-black text-xs uppercase tracking-widest mb-4">Growth</span>
                            <Zap className="w-6 h-6 text-white/40" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Deep Dive Content */}
            <section className="py-32 px-6 max-w-4xl mx-auto space-y-20">
                <div>
                    <h3 className="text-3xl font-extrabold text-white mb-6 tracking-tight">The Cortisol Connection</h3>
                    <p className="text-xl text-sage-light leading-relaxed font-medium">
                        Research shows that even 20 minutes in a high-vegetation, low-decibel environment can significantly reduce physiological stress markers. Our database isn't built on aesthetics alone—it's built on science. We prioritize "soft fascination" environments that allow the mind to recover from directed-attention fatigue.
                    </p>
                </div>
                <div>
                    <h3 className="text-3xl font-extrabold text-white mb-6 tracking-tight">Intentional Urbanism</h3>
                    <p className="text-xl text-sage-light leading-relaxed font-medium">
                        Cities are designed for efficiency, commerce, and speed. We advocate for "negative space" in urban planning—the areas designed for nothing other than existence. Our mission is to prove that a city's value is measured not just by its skyscrapers, but by its sanctuaries.
                    </p>
                </div>
            </section>
        </div>
    );
}
