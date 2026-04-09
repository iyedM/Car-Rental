import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Fuel, Settings, Star, Zap } from 'lucide-react';
import { type Car } from '../../data/fleet';
import { useLang } from '../../context/AppContext';

interface CarCardProps {
    car: Car;
    index?: number;
}

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
);

export default function CarCard({ car, index = 0 }: CarCardProps) {
    const { t, lang } = useLang();

    const waMessage = encodeURIComponent(
        lang === 'fr'
            ? `Bonjour, je souhaite réserver la ${car.name} du [date] au [date]`
            : `Hello, I would like to book the ${car.name} from [date] to [date]`
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="car-card group"
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[16/9]">
                <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {car.badge && (
                        <span className="badge-orange text-xs font-semibold">
                            {car.badge}
                        </span>
                    )}
                    {car.aiSuggestion && (
                        <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                            <Zap size={10} />
                            {t('fleet.aiChoice')}
                        </span>
                    )}
                </div>

                {/* Availability */}
                <div className="absolute top-3 right-3">
                    <span className={`badge text-xs ${car.available ? 'badge-green' : 'badge-red'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${car.available ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {car.available ? 'Disponible' : t('fleet.unavailable')}
                    </span>
                </div>

                {/* Price overlay */}
                <div className="absolute bottom-3 left-3">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-display font-bold text-white">{car.price}</span>
                        <span className="text-brand-400 text-sm font-medium">{t('fleet.perDay')}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Name & Rating */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-display font-semibold text-content text-lg leading-tight">{car.name}</h3>
                        <p className="text-content/40 text-xs mt-0.5">{car.year} · {car.color}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star size={13} className="star-filled fill-current" />
                        <span className="text-content font-semibold text-sm">{car.rating}</span>
                        <span className="text-content/30 text-xs">({car.reviews})</span>
                    </div>
                </div>

                {/* Specs row */}
                <div className="flex items-center gap-4 mb-5 py-3 border-y border-content/10">
                    <div className="flex items-center gap-1.5 text-content/50 text-xs">
                        <Users size={13} className="text-brand-400" />
                        <span>{car.seats} places</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-content/50 text-xs">
                        <Settings size={13} className="text-brand-400" />
                        <span>{car.transmission === 'Automatique' ? 'Auto' : 'Manuel'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-content/50 text-xs">
                        <Fuel size={13} className="text-brand-400" />
                        <span>{car.fuel}</span>
                    </div>
                </div>

                {/* CTA buttons */}
                <div className="flex gap-2">
                    {car.available ? (
                        <>
                            <Link
                                to={`/voitures/${car.id}`}
                                className="flex-1 btn-ghost text-center text-sm py-2.5 px-3 rounded-xl"
                            >
                                {t('fleet.details')}
                            </Link>
                            <a
                                href={`https://wa.me/21622307649?text=${waMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 btn-whatsapp flex items-center justify-center gap-1.5 text-sm py-2.5 px-3 rounded-xl"
                            >
                                <WhatsAppIcon />
                                {t('fleet.book')}
                            </a>
                        </>
                    ) : (
                        <button disabled className="w-full py-2.5 rounded-xl bg-content/5 text-content/30 text-sm font-medium cursor-not-allowed">
                            {t('fleet.unavailable')}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
