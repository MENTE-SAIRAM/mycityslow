import { Link } from 'react-router-dom';
import { Mail, Leaf, Globe, Share2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-dark-bg border-t border-white/5 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="md:col-span-5">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-dark-bg font-bold text-lg transition-transform group-hover:rotate-12 shadow-sm">
                                <Leaf className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">
                                My City Slow
                            </span>
                        </Link>
                        <p className="text-sage-light max-w-sm mb-8 leading-relaxed text-sm">
                            Dedicated to preserving the quiet moments in our vibrant urban landscapes. 
                            Your guide to intentional living and peaceful discoveries.
                        </p>
                    </div>

                    {/* Links Sections */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold text-sm uppercase tracking-[0.1em] mb-6 text-white">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-sm text-sage-light hover:text-sage transition-colors">About Us</Link></li>
                            <li><Link to="/philosophy" className="text-sm text-sage-light hover:text-sage transition-colors">The Philosophy</Link></li>
                            <li><Link to="/impact" className="text-sm text-sage-light hover:text-sage transition-colors">Impact Report</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold text-sm uppercase tracking-[0.1em] mb-6 text-white">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link to="/cities" className="text-sm text-sage-light hover:text-sage transition-colors">City Guides</Link></li>
                            <li><Link to="/journal" className="text-sm text-sage-light hover:text-sage transition-colors">Journal</Link></li>
                            <li><Link to="/help" className="text-sm text-sage-light hover:text-sage transition-colors">Help</Link></li>
                            <li><Link to="/submit" className="text-sm text-sage-light hover:text-sage transition-colors">Peace Mapping</Link></li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div className="md:col-span-3">
                        <h4 className="font-bold text-sm uppercase tracking-[0.1em] mb-6 text-white">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-dark-card border border-white/10 flex items-center justify-center text-sage-light hover:bg-sage hover:text-dark-bg transition-all shadow-sm">
                                <Share2 className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-dark-card border border-white/10 flex items-center justify-center text-sage-light hover:bg-sage hover:text-dark-bg transition-all shadow-sm">
                                <Globe className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-dark-card border border-white/10 flex items-center justify-center text-sage-light hover:bg-sage hover:text-dark-bg transition-all shadow-sm">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold">
                        © {new Date().getFullYear()} My City Slow. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link to="/privacy" className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold hover:text-sage transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold hover:text-sage transition-colors">Terms of Service</Link>
                        <a href="/sitemap.xml" className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold hover:text-sage transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
