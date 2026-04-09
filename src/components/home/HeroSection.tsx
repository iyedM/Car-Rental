import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Shield, Clock, Star } from 'lucide-react';
import { useLang } from '../../context/AppContext';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
);

const stats = [
    { value: '10+', label: 'Années d\'expérience' },
    { value: '500+', label: 'Clients satisfaits' },
    { value: '4', label: 'Agences en Tunisie' },
    { value: '99%', label: 'Taux de satisfaction' },
];

const locations = ['Tunis Centre', 'Aéroport Tunis-Carthage', 'La Marsa', 'Djerba'];

// Floating particles
const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
}));

export default function HeroSection() {
    const { t } = useLang();

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-bg pt-20">
            {/* Animated background orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 70%)' }}
                />

                {/* Floating particles */}
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-brand-500/20"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                        }}
                        animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div>
                        {/* Tagline pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 glass-orange px-4 py-2 rounded-full mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                            <span className="text-brand-300 text-sm font-medium">{t('hero.tagline')}</span>
                        </motion.div>

                        {/* Main heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-dark-900 leading-[1.05] mb-6"
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {t('hero.title').split('\n').map((line, i) => (
                                <span key={i} className="block">
                                    {i === 1 ? <span className="gradient-text">{line}</span> : line}
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="text-content/60 text-lg leading-relaxed mb-8 max-w-lg"
                        >
                            {t('hero.subtitle')}
                        </motion.p>

                        {/* Location pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="flex flex-wrap gap-2 mb-10"
                        >
                            {locations.map(loc => (
                                <span
                                    key={loc}
                                    className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-full text-content/60 text-xs"
                                >
                                    <MapPin size={11} className="text-brand-400" />
                                    {loc}
                                </span>
                            ))}
                        </motion.div>

                        {/* CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link to="/flotte" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
                                {t('hero.cta')}
                                <ArrowRight size={18} />
                            </Link>
                            <a
                                href="https://wa.me/21622307649"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp whatsapp-pulse flex items-center justify-center gap-2 text-base py-4 px-8"
                            >
                                <WhatsAppIcon />
                                {t('hero.whatsapp')}
                            </a>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-content/10"
                        >
                            <div className="flex items-center gap-2 text-dark-900/50 text-sm">
                                <Shield size={16} className="text-brand-400" />
                                <span>Assurance incluse</span>
                            </div>
                            <div className="flex items-center gap-2 text-dark-900/50 text-sm">
                                <Clock size={16} className="text-brand-400" />
                                <span>Réponse en 15 min</span>
                            </div>
                            <div className="flex items-center gap-2 text-content/50 text-sm">
                                <Star size={16} className="text-brand-400 fill-current" />
                                <span>4.9/5 sur 250+ avis</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Car showcase */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="relative hidden lg:block"
                    >
                        {/* Main car image */}
                        <div className="relative">
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative z-10"
                            >
                                <div className="relative rounded-3xl overflow-hidden ring-glow">
                                    <img
                                        src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=90"
                                        alt="Mercedes GLC – Bayrem Rent a Car"
                                        className="w-full object-cover rounded-3xl"
                                        style={{ maxHeight: '420px' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent rounded-3xl" />

                                    {/* Overlay info card */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-semibold font-display">Mercedes GLC 2025</p>
                                                <p className="text-white/70 text-xs mt-0.5">SUV Premium · 4MATIC</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-brand-400 font-bold text-xl font-display">220 DT</p>
                                                <p className="text-white/70 text-xs">/jour</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating stat cards */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                className="absolute -left-8 top-1/3 glass-card rounded-2xl p-4 shadow-card z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <span className="text-emerald-400 text-lg">✓</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm leading-none">Disponible</p>
                                        <p className="text-white/70 text-xs mt-1">Dès aujourd'hui</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                                className="absolute -right-4 top-8 glass-card rounded-2xl p-4 shadow-card z-20"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Star size={14} className="text-yellow-400 fill-current" />
                                    <Star size={14} className="text-yellow-400 fill-current" />
                                    <Star size={14} className="text-yellow-400 fill-current" />
                                    <Star size={14} className="text-yellow-400 fill-current" />
                                    <Star size={14} className="text-yellow-400 fill-current" />
                                </div>
                                <p className="text-white text-xs font-medium">"Service impeccable!"</p>
                                <p className="text-white/70 text-xs">– Ahmed B.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-content/10"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.value}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                            className="text-center"
                        >
                            <p className="font-display font-black text-4xl gradient-text">{stat.value}</p>
                            <p className="text-content/40 text-sm mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-content/20 rounded-full flex justify-center pt-2"
                >
                    <div className="w-1 h-2 bg-brand-400 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
}
