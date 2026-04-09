import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Users, Fuel, Settings, MapPin, Check, ChevronLeft, ChevronRight, Shield, Calendar } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FLEET } from '../data/fleet';
import { REVIEWS } from '../data/fleet';
import { LOCATIONS } from '../data/bookings';
import { useLang, useToast } from '../context/AppContext';
import { format, addDays, differenceInDays } from 'date-fns';
import confetti from 'canvas-confetti';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
);

export default function CarDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { lang } = useLang();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const car = FLEET.find(c => c.id === id);
    const reviews = REVIEWS.filter(r => r.carId === id);
    const relatedCars = FLEET.filter(c => c.id !== id && c.category === car?.category).slice(0, 3);

    const [galleryIndex, setGalleryIndex] = useState(0);
    const today = format(new Date(), 'yyyy-MM-dd');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
    const [location, setLocation] = useState(LOCATIONS[0]);
    const [payment, setPayment] = useState<'on_delivery' | 'online'>('on_delivery');
    const [booking, setBooking] = useState(false);
    const [booked, setBooked] = useState(false);

    const days = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)));
    const total = car ? car.price * days : 0;

    if (!car) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/40 text-xl mb-4">Véhicule introuvable</p>
                    <Link to="/flotte" className="btn-primary">Retour à la flotte</Link>
                </div>
            </div>
        );
    }

    const waMessage = encodeURIComponent(
        lang === 'fr'
            ? `Bonjour, je souhaite réserver la ${car.name} du ${startDate} au ${endDate}`
            : `Hello, I would like to book the ${car.name} from ${startDate} to ${endDate}`
    );

    const handleBook = async () => {
        setBooking(true);
        await new Promise(r => setTimeout(r, 800));
        setBooking(false);
        setBooked(true);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#f97316', '#fb923c', '#fbbf24', '#ffffff'] });
        addToast({
            type: 'success',
            title: '🎉 Réservation confirmée!',
            message: `${car.name} réservée du ${startDate} au ${endDate}. Nous vous contactons sous 15 minutes.`,
        });
        setTimeout(() => navigate('/reservation'), 2000);
    };

    const gallery = car.gallery.length > 0 ? car.gallery : [car.image];

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-20">
                {/* Breadcrumb */}
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-white/40">
                        <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
                        <span>/</span>
                        <Link to="/flotte" className="hover:text-white transition-colors">Flotte</Link>
                        <span>/</span>
                        <span className="text-white/70">{car.name}</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="grid lg:grid-cols-[1fr_380px] gap-10">
                        {/* Left: Details */}
                        <div>
                            {/* Gallery */}
                            <div className="relative rounded-3xl overflow-hidden mb-6 group">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={galleryIndex}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        src={gallery[galleryIndex]}
                                        alt={car.name}
                                        className="w-full object-cover"
                                        style={{ height: '420px' }}
                                    />
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />

                                {gallery.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setGalleryIndex(i => (i - 1 + gallery.length) % gallery.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 glass-card w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={() => setGalleryIndex(i => (i + 1) % gallery.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 glass-card w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {gallery.map((_, i) => (
                                                <button key={i} onClick={() => setGalleryIndex(i)}
                                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${i === galleryIndex ? 'bg-brand-400 w-6' : 'bg-white/40'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {car.badge && <span className="badge-orange">{car.badge}</span>}
                                    {car.aiSuggestion && (
                                        <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                            🔥 Meilleur choix
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail strip */}
                            {gallery.length > 1 && (
                                <div className="flex gap-3 mb-8">
                                    {gallery.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setGalleryIndex(i)}
                                            className={`flex-1 rounded-xl overflow-hidden h-20 transition-all duration-200 ${i === galleryIndex ? 'ring-2 ring-brand-500' : 'opacity-50 hover:opacity-80'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Car Info */}
                            <div className="mb-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="font-display font-black text-4xl text-white mb-1">{car.name}</h1>
                                        <div className="flex items-center gap-3 text-white/40 text-sm">
                                            <span>{car.year}</span>
                                            <span>·</span>
                                            <span>{car.color}</span>
                                            <span>·</span>
                                            <span>{car.category}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-1 justify-end">
                                            <span className="font-display font-black text-4xl gradient-text">{car.price}</span>
                                            <span className="text-brand-400 font-medium">DT/jour</span>
                                        </div>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <Star size={14} className="star-filled fill-current" />
                                            <span className="text-white font-semibold">{car.rating}</span>
                                            <span className="text-white/30 text-xs">({car.reviews} avis)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick specs */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                    {[
                                        { icon: <Users size={16} />, label: `${car.seats} places` },
                                        { icon: <Settings size={16} />, label: car.transmission },
                                        { icon: <Fuel size={16} />, label: car.fuel },
                                        { icon: <Shield size={16} />, label: 'Assuré tous risques' },
                                    ].map(spec => (
                                        <div key={spec.label} className="glass-card rounded-xl p-3 flex items-center gap-2">
                                            <span className="text-brand-400">{spec.icon}</span>
                                            <span className="text-white/70 text-sm">{spec.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-white/60 text-base leading-relaxed mb-6">{car.description}</p>

                                {/* Features */}
                                <div>
                                    <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider text-white/50">Équipements</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {car.features.map(f => (
                                            <div key={f} className="flex items-center gap-2 text-white/60 text-sm">
                                                <Check size={14} className="text-brand-400 flex-shrink-0" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reviews */}
                            {reviews.length > 0 && (
                                <div className="mb-10">
                                    <h2 className="font-display font-bold text-2xl text-white mb-6">
                                        Avis clients
                                        <span className="ml-3 text-base font-normal text-white/40">({reviews.length})</span>
                                    </h2>
                                    <div className="space-y-4">
                                        {reviews.map(r => (
                                            <motion.div
                                                key={r.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="card"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="font-semibold text-white text-sm">{r.author}</p>
                                                            <span className="text-white/30 text-xs">{r.date}</span>
                                                        </div>
                                                        <div className="flex gap-0.5 mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={12} className={i < r.rating ? 'star-filled fill-current' : 'star-empty'} />
                                                            ))}
                                                        </div>
                                                        <p className="text-white/60 text-sm leading-relaxed">{r.comment}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Sticky Booking CTA */}
                        <div className="lg:block">
                            <div className="sticky top-24">
                                <div className="glass-card rounded-3xl p-6">
                                    <h3 className="font-display font-bold text-white text-xl mb-5">Réserver ce véhicule</h3>

                                    <div className="space-y-4 mb-5">
                                        <div>
                                            <label className="block text-white/40 text-xs uppercase tracking-wide mb-1.5">Date de début</label>
                                            <input type="date" value={startDate} min={today} onChange={e => setStartDate(e.target.value)} className="input text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-white/40 text-xs uppercase tracking-wide mb-1.5">Date de fin</label>
                                            <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className="input text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-white/40 text-xs uppercase tracking-wide mb-1.5">Lieu de prise en charge</label>
                                            <div className="relative">
                                                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
                                                <select value={location} onChange={e => setLocation(e.target.value)} className="input text-sm pl-9">
                                                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Payment */}
                                        <div>
                                            <label className="block text-white/40 text-xs uppercase tracking-wide mb-1.5">Paiement</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { value: 'on_delivery', label: 'À la livraison' },
                                                    { value: 'online', label: 'En ligne 💳' },
                                                ].map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setPayment(opt.value as any)}
                                                        className={`py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${payment === opt.value
                                                                ? 'bg-brand-500/20 border border-brand-500/40 text-brand-400'
                                                                : 'glass-card text-white/50 hover:text-white'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price calc */}
                                    <div className="bg-dark-700/50 rounded-xl p-4 mb-5 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">{car.price} DT × {days} jour{days > 1 ? 's' : ''}</span>
                                            <span className="text-white">{car.price * days} DT</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">Assurance incluse</span>
                                            <span className="text-emerald-400">Gratuit</span>
                                        </div>
                                        <div className="border-t border-white/10 pt-2 flex justify-between">
                                            <span className="text-white font-semibold">Total</span>
                                            <span className="font-display font-bold text-xl gradient-text">{total} DT</span>
                                        </div>
                                    </div>

                                    {car.available ? (
                                        <>
                                            <button
                                                onClick={handleBook}
                                                disabled={booking || booked}
                                                className="btn-primary w-full flex items-center justify-center gap-2 py-4 mb-3"
                                            >
                                                {booking ? (
                                                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Traitement...</>
                                                ) : booked ? (
                                                    <>✓ Réservation confirmée!</>
                                                ) : (
                                                    <><Calendar size={16} /> Confirmer la réservation</>
                                                )}
                                            </button>

                                            <a
                                                href={`https://wa.me/21622307649?text=${waMessage}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-whatsapp w-full flex items-center justify-center gap-2 py-3.5"
                                            >
                                                <WhatsAppIcon />
                                                Réserver via WhatsApp
                                            </a>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <span className="badge-red text-sm py-2 px-4">Véhicule actuellement indisponible</span>
                                            <p className="text-white/40 text-xs mt-3">Contactez-nous pour connaître les disponibilités</p>
                                            <a href="tel:+21622307649" className="btn-ghost mt-3 block text-center text-sm">
                                                +216 22 307 649
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Trust badges */}
                                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                    {['🔒 Paiement sécurisé', '✅ Annulation flexible', '🚗 Assurance incluse'].map(badge => (
                                        <span key={badge} className="text-white/30 text-xs px-3 py-1 glass-card rounded-full">{badge}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
