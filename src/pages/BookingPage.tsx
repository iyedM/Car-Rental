import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FLEET } from '../data/fleet';
import { LOCATIONS, addBooking, generateBookingId } from '../data/bookings';
import { useLang, useToast } from '../context/AppContext';
import { format, addDays, differenceInDays } from 'date-fns';
import confetti from 'canvas-confetti';
import { Calendar, MapPin, User, Phone, Mail, CreditCard, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';

type Step = 1 | 2 | 3;

export default function BookingPage() {
    const { t, lang } = useLang();
    const { addToast } = useToast();
    const [searchParams] = useSearchParams();

    const today = format(new Date(), 'yyyy-MM-dd');
    const initCarId = searchParams.get('car') || FLEET[0].id;
    const initStart = searchParams.get('start') || today;
    const initEnd = searchParams.get('end') || format(addDays(new Date(), 3), 'yyyy-MM-dd');
    const initLocation = searchParams.get('location') || LOCATIONS[0];

    const [step, setStep] = useState<Step>(1);
    const [carId, setCarId] = useState(initCarId);
    const [startDate, setStartDate] = useState(initStart);
    const [endDate, setEndDate] = useState(initEnd);
    const [location, setLocation] = useState(initLocation);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [payment, setPayment] = useState<'on_delivery' | 'online'>('on_delivery');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [bookingId, setBookingId] = useState('');

    const selectedCar = FLEET.find(c => c.id === carId) || FLEET[0];
    const days = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)));
    const total = selectedCar.price * days;

    const waMessage = encodeURIComponent(
        lang === 'fr'
            ? `Bonjour, je souhaite réserver la ${selectedCar.name} du ${startDate} au ${endDate} à ${location}. Mon nom: ${name || '[Nom]'}`
            : `Hello, I would like to book the ${selectedCar.name} from ${startDate} to ${endDate} at ${location}. My name: ${name || '[Name]'}`
    );

    const handleStep1 = () => {
        if (!startDate || !endDate || !location) return;
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStep2 = () => {
        if (!name || !phone || !email) {
            addToast({ type: 'error', title: 'Champs manquants', message: 'Veuillez remplir tous les champs obligatoires.' });
            return;
        }
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleConfirm = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));

        const id = generateBookingId();
        addBooking({
            id,
            carId: selectedCar.id,
            carName: selectedCar.name,
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            startDate,
            endDate,
            days,
            totalPrice: total,
            status: 'pending',
            paymentMethod: payment,
            location,
            createdAt: new Date().toISOString(),
            notes,
        });

        setBookingId(id);
        setLoading(false);
        setConfirmed(true);

        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#f97316', '#fb923c', '#fbbf24', '#ffffff', '#10b981'] });
        addToast({ type: 'success', title: '🎉 Réservation confirmée!', message: `Réservation ${id} créée. Nous vous contactons sous 15 min.` });
    };

    if (confirmed) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="max-w-xl mx-auto text-center">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
                        >
                            <CheckCircle size={48} className="text-emerald-400" />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h1 className="font-display font-black text-4xl text-content mb-4">Réservation Confirmée! 🎉</h1>
                            <p className="text-content/60 text-lg mb-2">Votre réservation <span className="text-brand-400 font-bold">{bookingId}</span> a bien été reçue.</p>
                            <p className="text-content/40 text-sm mb-8">Notre équipe vous contactera dans les 15 prochaines minutes au <strong className="text-content/60">{phone}</strong>.</p>

                            <div className="glass-card rounded-2xl p-6 text-left mb-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <img src={selectedCar.image} alt={selectedCar.name} className="w-20 h-14 object-cover rounded-xl" />
                                    <div>
                                        <p className="font-semibold text-content">{selectedCar.name}</p>
                                        <p className="text-content/40 text-sm">{startDate} → {endDate}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-content/40">Durée:</span> <span className="text-content">{days} jours</span></div>
                                    <div><span className="text-content/40">Lieu:</span> <span className="text-content">{location}</span></div>
                                    <div><span className="text-dark-900/40">Total:</span> <span className="text-brand-400 font-bold">{total} DT</span></div>
                                    <div><span className="text-content/40">Paiement:</span> <span className="text-content">{payment === 'on_delivery' ? 'À la livraison' : 'En ligne'}</span></div>
                                </div>
                            </div>

                            <a
                                href={`https://wa.me/21622307649?text=${encodeURIComponent(`Bonjour, ma réservation ${bookingId} est confirmée. ${selectedCar.name} du ${startDate} au ${endDate}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp w-full flex items-center justify-center gap-2 py-4 text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                </svg>
                                Contacter sur WhatsApp
                            </a>
                        </motion.div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const stepLabels = [
        { num: 1, label: 'Dates & Lieu' },
        { num: 2, label: 'Vos informations' },
        { num: 3, label: 'Confirmation' },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-3xl mx-auto">
                    {/* Page header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="section-title mb-3">{t('booking.title')}</h1>
                        <p className="section-subtitle">{t('booking.subtitle')}</p>
                    </motion.div>

                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-10">
                        {stepLabels.map((s, i) => (
                            <div key={s.num} className="flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step > s.num ? 'bg-emerald-500 text-dark-900' : step === s.num ? 'bg-brand-500 text-dark-900 shadow-glow' : 'bg-dark-600 text-dark-900/30'
                                        }`}>
                                        {step > s.num ? '✓' : s.num}
                                    </div>
                                    <span className={`text-sm font-medium hidden sm:block transition-colors ${step === s.num ? 'text-content' : 'text-content/30'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < stepLabels.length - 1 && (
                                    <div className={`w-12 md:w-24 h-px mx-3 transition-colors ${step > s.num ? 'bg-emerald-500/60' : 'bg-dark-900/10'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Vehicle + Dates */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="glass-card rounded-3xl p-6 lg:p-8 space-y-5">
                                    <h2 className="font-display font-bold text-content text-xl flex items-center gap-2">
                                        <Calendar size={20} className="text-brand-400" /> Sélectionnez votre véhicule et vos dates
                                    </h2>

                                    <div>
                                        <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">{t('booking.car')}</label>
                                        <select value={carId} onChange={e => setCarId(e.target.value)} className="input">
                                            {FLEET.filter(c => c.available).map(car => (
                                                <option key={car.id} value={car.id}>{car.name} – {car.price} DT/jour</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Selected car preview */}
                                    <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                                        <img src={selectedCar.image} alt={selectedCar.name} className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-content">{selectedCar.name}</p>
                                            <p className="text-content/40 text-sm">{selectedCar.category} · {selectedCar.transmission} · {selectedCar.fuel}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-brand-400 text-lg">{selectedCar.price} DT</p>
                                            <p className="text-content/30 text-xs">/jour</p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">{t('booking.startDate')}</label>
                                            <input type="date" value={startDate} min={today} onChange={e => setStartDate(e.target.value)} className="input" />
                                        </div>
                                        <div>
                                            <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">{t('booking.endDate')}</label>
                                            <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className="input" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">{t('booking.location')}</label>
                                        <div className="relative">
                                            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                                            <select value={location} onChange={e => setLocation(e.target.value)} className="input pl-10">
                                                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Price preview */}
                                    <div className="flex items-center justify-between px-4 py-3 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                                        <span className="text-content/60 text-sm">{days} jours × {selectedCar.price} DT</span>
                                        <span className="font-display font-bold text-lg text-brand-400">{total} DT estimé</span>
                                    </div>

                                    <button onClick={handleStep1} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                                        Continuer <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Personal info */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="glass-card rounded-3xl p-6 lg:p-8 space-y-5">
                                    <h2 className="font-display font-bold text-content text-xl flex items-center gap-2">
                                        <User size={20} className="text-brand-400" /> Vos informations personnelles
                                    </h2>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">{t('booking.name')} *</label>
                                            <div className="relative">
                                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                                                <input type="text" placeholder="Ahmed Ben Ali" value={name} onChange={e => setName(e.target.value)} className="input pl-10" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">{t('booking.phone')} *</label>
                                            <div className="relative">
                                                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                                                <input type="tel" placeholder="+216 22 307 649" value={phone} onChange={e => setPhone(e.target.value)} className="input pl-10" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">{t('booking.email')} *</label>
                                        <div className="relative">
                                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                                            <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} className="input pl-10" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">{t('booking.payment')}</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { value: 'on_delivery', label: '💵 À la livraison', desc: 'Payez à la remise des clés' },
                                                { value: 'online', label: '💳 En ligne', desc: 'Paiement sécurisé CB/Paypal' },
                                            ].map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setPayment(opt.value as any)}
                                                    className={`p-4 rounded-2xl text-left transition-all duration-200 border ${payment === opt.value
                                                        ? 'border-brand-500/50 bg-brand-500/10'
                                                        : 'border-dark-900/8 glass-card hover:border-dark-900/20'
                                                        }`}
                                                >
                                                    <p className="font-semibold text-content text-sm mb-1">{opt.label}</p>
                                                    <p className="text-content/40 text-xs">{opt.desc}</p>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Fake online payment UI */}
                                        {payment === 'online' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 glass-card rounded-2xl p-4 border border-brand-500/20 space-y-3"
                                            >
                                                <div className="flex items-center gap-2 text-content/60 text-xs mb-3">
                                                    <CreditCard size={14} className="text-brand-400" />
                                                    <span>Entrez vos informations de carte (simulation)</span>
                                                </div>
                                                <input type="text" placeholder="Numéro de carte" className="input text-sm" maxLength={19} />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input type="text" placeholder="MM/AA" className="input text-sm" />
                                                    <input type="text" placeholder="CVV" className="input text-sm" maxLength={3} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-content/40 text-xs uppercase tracking-wide mb-2">Notes / demandes spéciales</label>
                                        <textarea
                                            placeholder="Ex: Vol AF1234, siège bébé requis..."
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            rows={3}
                                            className="input resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setStep(1)} className="btn-ghost py-3.5 px-6 text-sm">Retour</button>
                                        <button onClick={handleStep2} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5">
                                            Vérifier la réservation <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Confirm */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="glass-card rounded-3xl p-6 lg:p-8 space-y-6">
                                    <h2 className="font-display font-bold text-content text-xl">Récapitulatif de votre réservation</h2>

                                    {/* Car */}
                                    <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                                        <img src={selectedCar.image} alt={selectedCar.name} className="w-24 h-16 object-cover rounded-xl flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-bold text-content text-lg">{selectedCar.name}</p>
                                            <p className="text-content/40 text-sm">{selectedCar.year} · {selectedCar.transmission} · {selectedCar.fuel}</p>
                                        </div>
                                    </div>

                                    {/* Details grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Début', value: startDate },
                                            { label: 'Fin', value: endDate },
                                            { label: 'Durée', value: `${days} jour${days > 1 ? 's' : ''}` },
                                            { label: 'Lieu', value: location },
                                            { label: 'Client', value: name },
                                            { label: 'Téléphone', value: phone },
                                            { label: 'Email', value: email },
                                            { label: 'Paiement', value: payment === 'on_delivery' ? 'À la livraison' : 'En ligne' },
                                        ].map(item => (
                                            <div key={item.label} className="glass-card rounded-xl p-3">
                                                <p className="text-content/40 text-xs mb-1">{item.label}</p>
                                                <p className="text-content text-sm font-medium truncate">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between glass-orange rounded-2xl p-5">
                                        <div>
                                            <p className="text-content/60 text-sm">{days} jours × {selectedCar.price} DT/jour</p>
                                            <p className="text-content/30 text-xs mt-0.5">Assurance tous risques incluse</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display font-black text-3xl gradient-text">{total} DT</p>
                                            <p className="text-content/30 text-xs">TTC</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setStep(2)} className="btn-ghost py-4 px-6 text-sm">Retour</button>
                                        <button
                                            onClick={handleConfirm}
                                            disabled={loading}
                                            className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
                                        >
                                            {loading ? (
                                                <><Loader2 size={18} className="animate-spin" /> Confirmation...</>
                                            ) : (
                                                <>✓ Confirmer et réserver</>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-content/30 text-xs mb-3">ou</p>
                                        <a
                                            href={`https://wa.me/21622307649?text=${waMessage}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-whatsapp w-full flex items-center justify-center gap-2 py-3.5"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                            </svg>
                                            Réserver via WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </div>
    );
}
