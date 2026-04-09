import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Car as CarIcon, ArrowRight, Loader2 } from 'lucide-react';
import { FLEET } from '../../data/fleet';
import { LOCATIONS } from '../../data/bookings';
import { useLang, useToast } from '../../context/AppContext';
import { format, addDays, differenceInDays } from 'date-fns';

export default function QuickBookingWidget() {
    const { t, lang } = useLang();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    const [carId, setCarId] = useState(FLEET[0].id);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(tomorrow);
    const [location, setLocation] = useState(LOCATIONS[0]);
    const [searching, setSearching] = useState(false);

    const selectedCar = FLEET.find(c => c.id === carId)!;
    const days = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)));
    const total = selectedCar ? selectedCar.price * days : 0;

    const handleSearch = async () => {
        setSearching(true);
        await new Promise(r => setTimeout(r, 700));
        setSearching(false);
        navigate(`/reservation?car=${carId}&start=${startDate}&end=${endDate}&location=${encodeURIComponent(location)}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-6 lg:p-8 max-w-4xl mx-auto"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                    <CarIcon size={20} className="text-brand-400" />
                </div>
                <div>
                    <h3 className="font-display font-bold text-content text-xl">{t('booking.title')}</h3>
                    <p className="text-content/40 text-sm">{t('booking.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Car select */}
                <div className="lg:col-span-1">
                    <label className="block text-content/50 text-xs font-medium mb-2 uppercase tracking-wide">
                        {t('booking.car')}
                    </label>
                    <select
                        value={carId}
                        onChange={e => setCarId(e.target.value)}
                        className="input text-sm"
                    >
                        {FLEET.filter(c => c.available).map(car => (
                            <option key={car.id} value={car.id}>{car.name}</option>
                        ))}
                    </select>
                </div>

                {/* Start date */}
                <div>
                    <label className="block text-content/50 text-xs font-medium mb-2 uppercase tracking-wide">
                        {t('booking.startDate')}
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        min={today}
                        onChange={e => setStartDate(e.target.value)}
                        className="input text-sm"
                    />
                </div>

                {/* End date */}
                <div>
                    <label className="block text-content/50 text-xs font-medium mb-2 uppercase tracking-wide">
                        {t('booking.endDate')}
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="input text-sm"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-content/50 text-xs font-medium mb-2 uppercase tracking-wide">
                        {t('booking.location')}
                    </label>
                    <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none" />
                        <select
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            className="input text-sm pl-9"
                        >
                            {LOCATIONS.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Price preview + CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-content/6">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-content/50">
                        <Calendar size={15} className="text-brand-400" />
                        <span>{days} jour{days > 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-4 w-px bg-main/10" />
                    <div className="flex items-baseline gap-1">
                        <span className="text-content font-bold text-2xl font-display">{total}</span>
                        <span className="text-brand-400 font-medium">DT</span>
                        <span className="text-content/30 text-xs">total estimé</span>
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="btn-primary flex items-center gap-2 py-3.5 px-8 text-sm w-full sm:w-auto justify-center"
                >
                    {searching ? (
                        <><Loader2 size={16} className="animate-spin" /> Recherche...</>
                    ) : (
                        <>{t('booking.submit')} <ArrowRight size={16} /></>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
