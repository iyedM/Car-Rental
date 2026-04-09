import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CarCard from '../components/cars/CarCard';
import { FLEET, CATEGORIES, type Category } from '../data/fleet';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const WhatsAppFAB = () => (
    <a href="https://wa.me/21622307649" target="_blank" rel="noopener noreferrer" className="fab-whatsapp">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
        <span className="hidden sm:inline">Réserver via WhatsApp</span>
    </a>
);

type SortType = 'price_asc' | 'price_desc' | 'rating' | 'default';

export default function FleetPage() {
    const [category, setCategory] = useState<Category>('Tous');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<SortType>('default');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [maxPrice, setMaxPrice] = useState(300);

    const filtered = FLEET
        .filter(car => {
            const matchCat = category === 'Tous' || car.category === category;
            const matchSearch = car.name.toLowerCase().includes(search.toLowerCase()) ||
                car.brand.toLowerCase().includes(search.toLowerCase());
            const matchAvail = availableOnly ? car.available : true;
            const matchPrice = car.price <= maxPrice;
            return matchCat && matchSearch && matchAvail && matchPrice;
        })
        .sort((a, b) => {
            if (sort === 'price_asc') return a.price - b.price;
            if (sort === 'price_desc') return b.price - a.price;
            if (sort === 'rating') return b.rating - a.rating;
            return 0;
        });

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-24">
                {/* Hero */}
                <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent" />
                    <div className="relative max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 glass-orange px-4 py-2 rounded-full mb-6">
                                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                                <span className="text-brand-300 text-sm font-medium">{FLEET.length} véhicules disponibles</span>
                            </div>
                            <h1 className="section-title mb-4">Notre Flotte Premium</h1>
                            <p className="section-subtitle">
                                De la citadine économique au SUV de luxe, trouvez la voiture parfaite pour votre voyage
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Filters */}
                <section className="px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="glass-card rounded-2xl p-5"
                        >
                            <div className="flex flex-col gap-4">
                                {/* Top row: search + sort */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un véhicule..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="input pl-10 text-sm"
                                        />
                                        {search && (
                                            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <select
                                        value={sort}
                                        onChange={e => setSort(e.target.value as SortType)}
                                        className="input text-sm w-full sm:w-56"
                                    >
                                        <option value="default">Tri par défaut</option>
                                        <option value="price_asc">Prix croissant</option>
                                        <option value="price_desc">Prix décroissant</option>
                                        <option value="rating">Meilleures notes</option>
                                    </select>
                                </div>

                                {/* Categories */}
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${category === cat
                                                ? 'bg-brand-500 text-white shadow-glow'
                                                : 'glass-card text-white/50 hover:text-white hover:border-brand-500/30'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Price range + Available filter */}
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-3 flex-1 min-w-48">
                                        <span className="text-white/40 text-xs whitespace-nowrap">Prix max: <span className="text-brand-400 font-semibold">{maxPrice} DT</span></span>
                                        <input
                                            type="range"
                                            min={80}
                                            max={300}
                                            step={10}
                                            value={maxPrice}
                                            onChange={e => setMaxPrice(Number(e.target.value))}
                                            className="flex-1 accent-brand-500"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div
                                            onClick={() => setAvailableOnly(!availableOnly)}
                                            className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer ${availableOnly ? 'bg-brand-500' : 'bg-dark-500'}`}
                                            style={{ height: '22px', width: '40px' }}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${availableOnly ? 'left-5' : 'left-0.5'}`} />
                                        </div>
                                        <span className="text-white/50 text-sm">Disponibles uniquement</span>
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Results */}
                <section className="px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-white/40 text-sm">
                                <span className="text-white font-semibold">{filtered.length}</span> véhicule{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {filtered.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filtered.map((car, i) => (
                                        <motion.div key={car.id} layout>
                                            <CarCard car={car} index={i} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-24"
                                >
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="font-display font-semibold text-white text-xl mb-2">Aucun véhicule trouvé</h3>
                                    <p className="text-white/40 text-sm mb-6">Essayez de modifier vos filtres</p>
                                    <button
                                        onClick={() => { setCategory('Tous'); setSearch(''); setAvailableOnly(false); setMaxPrice(300); }}
                                        className="btn-primary text-sm"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
            <Footer />
            <WhatsAppFAB />
        </div>
    );
}
