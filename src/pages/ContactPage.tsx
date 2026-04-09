import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Phone, MapPin, Mail, Clock, MessageCircle } from 'lucide-react';

const locations = [
    { name: 'Tunis Centre', address: 'Avenue Habib Bourguiba, Tunis', hours: '8h – 20h', phone: '+216 22 307 649' },
    { name: 'Aéroport Tunis-Carthage', address: 'Terminal Arrivées, Aéroport Int. Tunis-Carthage', hours: '24h/24, 7j/7', phone: '+216 22 307 649' },
    { name: 'La Marsa', address: 'Avenue Taïeb Mhiri, La Marsa', hours: '8h – 19h', phone: '+216 22 307 649' },
    { name: 'Djerba', address: 'Zone Touristique, Djerba Midoun', hours: '8h – 20h', phone: '+216 22 307 649' },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-24">
                {/* Header */}
                <section className="section py-16">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h1 className="section-title mb-4">Contactez-nous</h1>
                            <p className="section-subtitle">
                                Notre équipe est disponible pour répondre à toutes vos questions en moins de 15 minutes via WhatsApp.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="max-w-7xl mx-auto">
                        {/* WhatsApp CTA */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center mb-16"
                        >
                            <a
                                href="https://wa.me/21622307649"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp whatsapp-pulse inline-flex items-center gap-3 text-lg py-5 px-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                </svg>
                                Réserver via WhatsApp maintenant
                            </a>
                            <p className="text-white/30 text-sm mt-4">+216 22 307 649 · Réponse garantie en 15 min</p>
                        </motion.div>

                        {/* Locations grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {locations.map((loc, i) => (
                                <motion.div
                                    key={loc.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="card"
                                >
                                    <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center mb-4">
                                        <MapPin size={18} className="text-brand-400" />
                                    </div>
                                    <h3 className="font-display font-semibold text-white mb-2">{loc.name}</h3>
                                    <p className="text-white/40 text-sm mb-4 leading-relaxed">{loc.address}</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-white/50 text-sm">
                                            <Clock size={13} className="text-brand-400 flex-shrink-0" />
                                            {loc.hours}
                                        </div>
                                        <a href={`tel:${loc.phone}`} className="flex items-center gap-2 text-white/50 text-sm hover:text-brand-400 transition-colors">
                                            <Phone size={13} className="text-brand-400 flex-shrink-0" />
                                            {loc.phone}
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact form */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-16 max-w-2xl mx-auto glass-card rounded-3xl p-8"
                        >
                            <h2 className="font-display font-bold text-white text-2xl mb-6">Envoyez-nous un message</h2>
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wide mb-2">Nom complet</label>
                                        <input type="text" placeholder="Ahmed Ben Ali" className="input" />
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wide mb-2">Téléphone</label>
                                        <input type="tel" placeholder="+216 22 307 649" className="input" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white/40 text-xs uppercase tracking-wide mb-2">Email</label>
                                    <input type="email" placeholder="votre@email.com" className="input" />
                                </div>
                                <div>
                                    <label className="block text-white/40 text-xs uppercase tracking-wide mb-2">Message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Bonjour, je souhaite réserver..."
                                        className="input resize-none"
                                    />
                                </div>
                                <button className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                                    <Mail size={16} />
                                    Envoyer le message
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
