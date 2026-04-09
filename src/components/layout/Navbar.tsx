import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, BarChart3, Menu, X, Phone, MapPin, Bell, Sun, Moon } from 'lucide-react';
import { useLang, useApp } from '../../context/AppContext';

export default function Navbar() {
    const { lang, setLang, t } = useLang();
    const { notificationCount, theme, toggleTheme } = useApp();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const navLinks = [
        { href: '/', label: t('nav.home') },
        { href: '/flotte', label: t('nav.fleet') },
        { href: '/reservation', label: t('nav.booking') },
        { href: '/contact', label: t('nav.contact') },
    ];

    const isActive = (href: string) => location.pathname === href;

    return (
        <>
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-card py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                                <Car size={20} className="text-main" />
                            </div>
                            <div>
                                <p className="font-display font-bold text-content text-lg leading-none">Car</p>
                                <p className="text-brand-400 text-xs font-medium tracking-widest">RENTAL</p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`nav-link font-medium text-sm ${isActive(link.href) ? 'text-brand-400' : ''}`}
                                >
                                    {link.label}
                                    {isActive(link.href) && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-500"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {/* Language Toggle */}
                            <div className="lang-toggle hidden sm:flex">
                                <button
                                    onClick={() => setLang('fr')}
                                    className={`lang-btn ${lang === 'fr' ? 'active' : ''}`}
                                >
                                    🇫🇷 FR
                                </button>
                                <button
                                    onClick={() => setLang('en')}
                                    className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                                >
                                    🇬🇧 EN
                                </button>
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="glass-card p-2 rounded-xl text-content-muted hover:text-content transition-colors flex items-center justify-center"
                                aria-label="Toggle Theme"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={theme}
                                        initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {theme === 'dark' ? <Moon fill="currentColor" size={18} /> : <Sun fill="currentColor" size={18} />}
                                    </motion.div>
                                </AnimatePresence>
                            </button>

                            {/* Admin Dashboard */}
                            <Link
                                to="/admin"
                                className="hidden md:flex items-center gap-2 relative glass-orange px-4 py-2 rounded-xl text-brand-400 hover:text-content text-sm font-medium transition-all duration-200 hover:bg-brand-500"
                            >
                                <BarChart3 size={16} />
                                <span>Admin</span>
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 rounded-full text-content text-xs flex items-center justify-center font-bold">
                                        {notificationCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden glass-card p-2.5 rounded-xl text-content/70 hover:text-content transition-colors"
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mobile-menu-overlay lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="mobile-menu lg:hidden"
                        >
                            <div className="p-6 border-b border-subtle/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                                        <Car size={20} className="text-main" />
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-content text-lg leading-none">Car</p>
                                        <p className="text-brand-400 text-xs font-medium tracking-widest">RENTAL</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive(link.href)
                                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                                            : 'text-content/60 hover:text-content hover:bg-main/5'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-content/60 hover:text-content hover:bg-main/5 font-medium transition-all duration-200"
                                >
                                    <BarChart3 size={18} />
                                    Admin Dashboard
                                </Link>
                            </div>

                            <div className="p-6 border-t border-content/6 space-y-3">
                                <a href="tel:+21622307649" className="flex items-center gap-3 text-content/60 hover:text-content transition-colors">
                                    <Phone size={16} className="text-brand-400" />
                                    <span className="text-sm">+216 22 307 649</span>
                                </a>
                                <div className="flex items-center gap-3 text-content/60">
                                    <MapPin size={16} className="text-brand-400" />
                                    <span className="text-sm">Tunis · Djerba · La Marsa · Aéroport</span>
                                </div>

                                {/* Lang toggle mobile */}
                                <div className="lang-toggle mt-4 w-fit">
                                    <button onClick={() => setLang('fr')} className={`lang-btn ${lang === 'fr' ? 'active' : ''}`}>🇫🇷 FR</button>
                                    <button onClick={() => setLang('en')} className={`lang-btn ${lang === 'en' ? 'active' : ''}`}>🇬🇧 EN</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
