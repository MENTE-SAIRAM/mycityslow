import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Heart, Shield, Users, MapPin, Sparkles, Coffee } from 'lucide-react';

export default function About() {
    const stats = [
        { label: 'Peaceful Spots', value: '1,200+', icon: <MapPin className="w-6 h-6" /> },
        { label: 'Slow Seekers', value: '50,000+', icon: <Users className="w-6 h-6" /> },
        { label: 'Cities Covered', value: '24', icon: <Sparkles className="w-6 h-6" /> },
        { label: 'Quiet Cafés', value: '450+', icon: <Coffee className="w-6 h-6" /> },
    ];

    return (
        <div className="w-full">
            <Helmet>
                <title>About Us — The Story of My City Slow</title>
                <meta name="description" content="Learn about My City Slow and our mission to help urban dwellers find peace, silence, and intentionality in India's busiest cities." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden -mt-20">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop" 
                        alt="Serene Desk" 
                        className="w-full h-full object-cover opacity-30 blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/20 via-dark-bg/80 to-dark-bg" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sage font-black uppercase tracking-[0.3em] text-sm mb-6 block"
                    >
                        Our Origin Story
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tighter"
                    >
                        Mapping the <span className="text-sage">Silence.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-sage-light font-medium leading-relaxed"
                    >
                        My City Slow started as a personal quest to find a single quiet hour in the heart of Bengaluru. Today, it's a movement helping thousands rediscover the rhythm of intentional living.
                    </motion.p>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-dark-card p-10 rounded-[3rem] border border-white/5 text-center flex flex-col items-center gap-4 shadow-premium"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center text-sage">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                            <p className="text-sage-light font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-32 px-6 bg-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-5xl font-extrabold text-white mb-10 tracking-tight leading-tight">
                            We believe peace shouldn't be a luxury.
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0 text-sage">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Curated with Intent</h4>
                                    <p className="text-sage-light leading-relaxed">Every spot on our platform is personally vetted for noise levels, vegetation density, and overall "calm factor."</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0 text-sage">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Wellbeing First</h4>
                                    <p className="text-sage-light leading-relaxed">We focus on the intersection of urban design and mental health, helping you find spaces that naturally lower cortisol.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2086&auto=format&fit=crop" 
                            alt="Quiet Park" 
                            className="rounded-[4rem] shadow-2xl border border-white/10"
                        />
                        <div className="absolute -bottom-10 -left-10 bg-sage p-12 rounded-[3rem] shadow-2xl hidden md:block">
                            <p className="text-dark-bg font-black text-2xl">ESTD. 2024</p>
                            <p className="text-dark-bg/60 font-bold">Bengaluru, India</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Join CTA */}
            <section className="py-40 px-6 text-center max-w-4xl mx-auto">
                <h2 className="text-5xl font-extrabold text-white mb-8 tracking-tight">Become a Slow Contributor</h2>
                <p className="text-xl text-sage-light mb-12 leading-relaxed">
                    We're a small team of designers, environmentalists, and urbanists. If you know a hidden sanctuary that the world needs to hear (silently), join our community of contributors.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button className="px-12 py-5 bg-sage text-dark-bg rounded-full font-black text-lg hover:bg-white transition-all shadow-xl">
                        Submit a Spot
                    </button>
                    <button className="px-12 py-5 bg-dark-card border border-white/10 text-white rounded-full font-black text-lg hover:bg-white hover:text-dark-bg transition-all">
                        Join Our Discord
                    </button>
                </div>
            </section>
        </div>
    );
}
