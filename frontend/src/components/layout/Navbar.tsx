import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Menu, User, LogOut, Leaf } from 'lucide-react';

export default function Navbar() {
    const { user, setUser } = useAppStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setShowMobileMenu(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setShowDropdown(false);
        setShowMobileMenu(false);
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { name: 'Discovery', path: '/discover' },
        { name: 'Experiences', path: '/experiences' },
        { name: 'Guides', path: '/guides' },
        { name: 'Stories', path: '/stories' },
        { name: 'Map', path: '/map' },
        { name: 'Collection', path: '/collection' },
    ];

    return (
        <nav 
            className={`sticky top-0 z-[120] isolate w-full transition-all duration-500 ${
                scrolled ? 'py-2' : 'py-5'
            }`}
            style={{ borderTop: '3px solid transparent', borderImage: 'linear-gradient(90deg, var(--color-sage), var(--color-terra), var(--color-sage-light)) 1' }}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div 
                    className={`flex justify-between items-center px-8 py-4 rounded-full transition-all duration-500 border border-sage/15 ${
                        scrolled ? 'glass bg-dark-bg/90 backdrop-blur-2xl shadow-premium' : 'bg-dark-card/90 backdrop-blur-xl shadow-sm border-sage/10'
                    }`}
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-full bg-sage flex items-center justify-center text-dark-bg font-bold text-lg transition-transform group-hover:rotate-12 shadow-sm">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-white">
                            My City Slow
                        </span>
                    </Link>

                    {/* Desktop Menu - Centered */}
                    <div className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                        className={`text-base font-bold transition-all hover:text-sage-light ${
                                            isActive(link.path)
                                                ? 'text-sage-light underline decoration-2 underline-offset-8'
                                                : 'text-sage/70 hover:text-sage'
                                        }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-10 h-10 rounded-full bg-sage/30 border-2 border-sage flex items-center justify-center text-white font-extrabold text-sm focus:outline-none transition-all hover:scale-110 shadow-sm"
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-4 w-60 glass rounded-3xl shadow-premium border border-sage/15 py-2 z-50 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-sage/10">
                                            <p className="text-sm font-extrabold truncate text-white">{user.name}</p>
                                            <p className="text-[10px] text-sage-light uppercase tracking-widest truncate mt-1 font-bold">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-6 py-4 text-sm text-red-400 hover:bg-red-900/10 flex items-center gap-2 transition-colors font-bold"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className="w-10 h-10 rounded-full bg-white text-dark-bg flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                            >
                                <User className="w-5 h-5" />
                            </Link>
                        )}
                        
                        {/* Mobile Menu */}
                        <button
                            onClick={() => setShowMobileMenu((prev) => !prev)}
                            className="md:hidden p-2 text-white"
                            aria-label="Toggle mobile menu"
                            aria-expanded={showMobileMenu}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {showMobileMenu && (
                    <div className="md:hidden mt-3 rounded-3xl border border-sage/15 bg-dark-card/95 backdrop-blur-md shadow-premium px-5 py-5">
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                                            isActive(link.path)
                                                ? 'bg-sage/20 text-sage-light'
                                                : 'text-sage/70 hover:bg-sage/10 hover:text-sage-light'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-5 pt-4 border-t border-sage/15">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="px-3">
                                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                        <p className="text-xs text-sage-light truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-red-400 hover:bg-red-900/10"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block w-full px-3 py-2 rounded-xl text-sm font-bold text-white bg-sage/30 border border-sage/30 text-center"
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
