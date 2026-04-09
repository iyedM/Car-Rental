import { motion } from 'framer-motion';
import { TrendingUp, X, Check, BarChart3, Clock, Users, Star, Zap } from 'lucide-react';
import { useLang } from '../../context/AppContext';

const beforeItems = [
    'Réservations perdues faute de suivi',
    'Gestion manuelle et chronophage',
    'Aucune visibilité sur la flotte',
    'Image professionnelle insuffisante',
    'Clients contactés trop tard',
];

const afterItems = [
    '+35% de réservations confirmées',
    'Gestion automatisée en temps réel',
    'Dashboard complet & analytiques',
    'Présence digitale premium',
    'Réponse WhatsApp en 15 minutes',
];

const kpis = [
    { icon: <TrendingUp size={24} />, value: '+35%', label: 'Réservations', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: <Clock size={24} />, value: '80%', label: 'Temps économisé', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: <Users size={24} />, value: '+60%', label: 'Satisfaction client', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: <Star size={24} />, value: '4.9/5', label: 'Note moyenne', color: 'text-brand-400', bg: 'bg-brand-500/10' },
];

export default function ImpactSection() {
    const { t } = useLang();

    return (
        <section className="section">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 glass-orange px-4 py-2 rounded-full mb-6">
                        <Zap size={14} className="text-brand-400" />
                        <span className="text-brand-300 text-sm font-medium">Impact Business Prouvé</span>
                    </div>
                    <h2 className="section-title mb-4">{t('impact.title')}</h2>
                    <p className="section-subtitle">
                        Transformez votre agence de location avec notre plateforme digitale premium
                    </p>
                </motion.div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {kpis.map((kpi, i) => (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="stat-card text-center"
                        >
                            <div className={`w-12 h-12 ${kpi.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 ${kpi.color}`}>
                                {kpi.icon}
                            </div>
                            <p className={`font-display font-black text-3xl ${kpi.color}`}>{kpi.value}</p>
                            <p className="text-content/50 text-sm mt-1">{kpi.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Before / After */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Before */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="impact-before rounded-3xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <X size={20} className="text-red-400" />
                            </div>
                            <span className="font-display font-bold text-red-400 text-lg uppercase tracking-wide">
                                {t('impact.before')}
                            </span>
                        </div>
                        <ul className="space-y-4">
                            {beforeItems.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <X size={10} className="text-red-400" />
                                    </div>
                                    <span className="text-content/60 text-sm leading-relaxed">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* After */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="impact-after rounded-3xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <Check size={20} className="text-emerald-400" />
                            </div>
                            <span className="font-display font-bold text-emerald-400 text-lg uppercase tracking-wide">
                                {t('impact.after')}
                            </span>
                        </div>
                        <ul className="space-y-4">
                            {afterItems.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check size={10} className="text-emerald-400" />
                                    </div>
                                    <span className="text-content/80 text-sm leading-relaxed font-medium">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
