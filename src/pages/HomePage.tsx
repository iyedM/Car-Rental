import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import QuickBookingWidget from '../components/home/QuickBookingWidget';
import ImpactSection from '../components/home/ImpactSection';
import { motion } from 'framer-motion';
import { FLEET } from '../data/fleet';
import CarCard from '../components/cars/CarCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, MessageCircle } from 'lucide-react';

const WhatsAppFAB = () => (
    <a
        href="https://wa.me/21622307649"
        target="_blank"
        rel="noopener noreferrer"
        className="fab-whatsapp"
        title="Réserver via WhatsApp"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
        <span className="hidden sm:inline">Réserver via WhatsApp</span>
    </a>
);

export default function HomePage() {
    const featuredCars = FLEET.filter(c => c.available).slice(0, 6);

    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <HeroSection />

                {/* Quick Booking Widget */}
                <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="max-w-7xl mx-auto">
                        <QuickBookingWidget />
                    </div>
                </section>

                {/* Featured Fleet */}
                <section className="section">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 glass-orange px-4 py-2 rounded-full mb-6">
                                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                                <span className="text-brand-300 text-sm font-medium">Flotte Premium</span>
                            </div>
                            <h2 className="section-title mb-4">Nos Véhicules Vedettes</h2>
                            <p className="section-subtitle">
                                Une sélection soigneuse de véhicules haut de gamme pour chaque occasion
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredCars.map((car, i) => (
                                <CarCard key={car.id} car={car} index={i} />
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mt-10"
                        >
                            <Link to="/flotte" className="btn-primary inline-flex items-center gap-2 py-4 px-8">
                                Voir toute la flotte
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Impact Section */}
                <ImpactSection />

                {/* Services Section */}
                <section className="section">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="section-title mb-4">Pourquoi Choisir Bayrem?</h2>
                            <p className="section-subtitle">Un service pensé pour votre confort et votre tranquillité d'esprit</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { emoji: '⚡', title: 'Réservation instantanée', desc: 'Réservez en moins de 2 minutes via notre plateforme ou WhatsApp. Confirmation immédiate garantie.' },
                                { emoji: '🚗', title: 'Flotte Premium', desc: 'Mercedes, Range Rover, et plus. Nos véhicules sont régulièrement entretenus et désinfectés.' },
                                { emoji: '📍', title: '4 Agences en Tunisie', desc: 'Tunis Centre, Aéroport Tunis-Carthage, La Marsa et Djerba. Livraison possible sur demande.' },
                                { emoji: '🛡️', title: 'Assurance Complète', desc: 'Tous nos véhicules sont couverts par une assurance tous risques pour votre sécurité.' },
                                { emoji: '💳', title: 'Paiement Flexible', desc: 'Paiement à la livraison ou en ligne. Tous les modes de paiement acceptés sans frais supplémentaires.' },
                                { emoji: '🎯', title: 'Support 24/7', desc: 'Notre équipe est disponible 24h/24 via WhatsApp pour répondre à toutes vos questions.' },
                            ].map((service, i) => (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="card group"
                                >
                                    <div className="text-4xl mb-4">{service.emoji}</div>
                                    <h3 className="font-display font-semibold text-white text-lg mb-2">{service.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="section pt-0">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-3xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.08) 100%)',
                                border: '1px solid rgba(249,115,22,0.2)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent" />
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-10 lg:p-12">
                                <div>
                                    <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-3">
                                        Prêt à prendre la route?
                                    </h2>
                                    <p className="text-white/60 text-lg">
                                        Appelez-nous ou réservez directement via WhatsApp
                                    </p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <MapPin size={16} className="text-brand-400" />
                                        <span className="text-white/50 text-sm">Tunis · La Marsa · Aéroport · Djerba</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                                    <a href="tel:+21622307649" className="btn-ghost flex items-center gap-2 justify-center">
                                        <Phone size={16} />
                                        +216 22 307 649
                                    </a>
                                    <a
                                        href="https://wa.me/21622307649"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-whatsapp flex items-center gap-2 justify-center"
                                    >
                                        <MessageCircle size={16} />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
            <WhatsAppFAB />
        </div>
    );
}
