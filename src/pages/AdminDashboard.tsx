import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, Car, Calendar, BarChart3, Settings, Bell, TrendingUp,
    Users, DollarSign, Activity, Zap, ChevronRight, Eye, Check, X,
    PlayCircle, StopCircle, Menu, LogOut, ArrowUpRight, ArrowDownRight,
    AlertTriangle, Star, RefreshCw
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
    getBookings, getDashboardStats, getRevenueChartData, getFleetUtilizationData,
    getCarPerformanceData, addBooking, generateBookingId, updateBookingStatus,
    type Booking, type BookingStatus
} from '../data/bookings';
import { FLEET } from '../data/fleet';
import { useToast, useApp } from '../context/AppContext';
import { format } from 'date-fns';

type AdminView = 'dashboard' | 'reservations' | 'flotte' | 'analytics';

const STATUS_MAP: Record<BookingStatus, { label: string; class: string }> = {
    confirmed: { label: 'Confirmé', class: 'badge-green' },
    pending: { label: 'En attente', class: 'badge-orange' },
    cancelled: { label: 'Annulé', class: 'badge-red' },
    completed: { label: 'Terminé', class: 'badge-blue' },
};

const SIMULATE_CARS = [
    'Volkswagen Passat', 'Mercedes Classe C', 'Hyundai Tucson', 'Kia Sportage', 'Renault Clio 5', 'Peugeot 208'
];
const SIMULATE_NAMES = ['Ali Mhiri', 'Sarah Dupont', 'Karim Jalled', 'Emma Blanc', 'Mohamed Slama', 'Claire Petit'];
const SIMULATE_LOCS = ['Aéroport Tunis-Carthage', 'Tunis Centre', 'Djerba', 'La Marsa'];

export default function AdminDashboard() {
    const { addToast } = useToast();
    const { notificationCount, setNotificationCount, simulatingActivity, setSimulatingActivity } = useApp();
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookings, setBookings] = useState(getBookings());
    const [stats, setStats] = useState(getDashboardStats());
    const [revenueData, setRevenueData] = useState(getRevenueChartData());
    const [fleetData] = useState(getFleetUtilizationData());
    const [carPerf] = useState(getCarPerformanceData());
    const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');

    const refreshData = useCallback(() => {
        setBookings(getBookings());
        setStats(getDashboardStats());
    }, []);

    // Simulate activity
    const simulateActivity = useCallback(() => {
        if (simulatingActivity) {
            setSimulatingActivity(false);
            addToast({ type: 'info', title: 'Simulation arrêtée', message: 'La simulation d\'activité a été arrêtée.' });
            return;
        }

        setSimulatingActivity(true);
        addToast({ type: 'info', title: '🎮 Simulation démarrée', message: 'Génération de réservations en temps réel...' });

        let count = 0;
        const interval = setInterval(() => {
            if (count >= 5) {
                clearInterval(interval);
                setSimulatingActivity(false);
                addToast({ type: 'success', title: '✅ Simulation terminée', message: '5 nouvelles réservations générées!' });
                return;
            }

            const car = SIMULATE_CARS[Math.floor(Math.random() * SIMULATE_CARS.length)];
            const name = SIMULATE_NAMES[Math.floor(Math.random() * SIMULATE_NAMES.length)];
            const loc = SIMULATE_LOCS[Math.floor(Math.random() * SIMULATE_LOCS.length)];
            const days = Math.floor(Math.random() * 5) + 1;
            const price = Math.floor(Math.random() * 150) + 80;
            const fleetCar = FLEET.find(c => c.name === car) || FLEET[0];

            const newBooking: Booking = {
                id: generateBookingId(),
                carId: fleetCar.id,
                carName: car,
                customerName: name,
                customerPhone: `+216 2${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 900000 + 100000)}`,
                customerEmail: `${name.split(' ')[0].toLowerCase()}@mail.com`,
                startDate: format(new Date(Date.now() + Math.random() * 7 * 24 * 3600 * 1000), 'yyyy-MM-dd'),
                endDate: format(new Date(Date.now() + (Math.random() * 7 + days) * 24 * 3600 * 1000), 'yyyy-MM-dd'),
                days,
                totalPrice: price * days,
                status: 'pending',
                paymentMethod: Math.random() > 0.5 ? 'online' : 'on_delivery',
                location: loc,
                createdAt: new Date().toISOString(),
            };

            addBooking(newBooking);
            refreshData();
            setNotificationCount(prev => prev + 1);
            count++;

            addToast({
                type: 'success',
                title: '🔔 Nouvelle réservation!',
                message: `${name} a réservé ${car} — ${price * days} DT`,
            });
        }, 1800);
    }, [simulatingActivity, addToast, refreshData, setNotificationCount, setSimulatingActivity]);

    useEffect(() => {
        // Initial maintenance notification
        setTimeout(() => {
            addToast({ type: 'warning', title: '🔧 Maintenance requise', message: 'Range Rover Sport — Révision dans 500 km.' });
        }, 2000);
    }, []);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'reservations', label: 'Réservations', icon: <Calendar size={18} />, badge: stats.pendingBookings },
        { id: 'flotte', label: 'Flotte', icon: <Car size={18} /> },
        { id: 'analytics', label: 'Analytiques', icon: <BarChart3 size={18} /> },
    ];

    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    return (
        <div className="min-h-screen bg-main flex">
            {/* Sidebar */}
            <AnimatePresence>
                {(sidebarOpen || true) && (
                    <motion.aside
                        initial={{ x: typeof window !== 'undefined' && window.innerWidth < 768 ? -300 : 0 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className={`dashboard-sidebar w-64 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-30
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
              transition-transform duration-300 md:sticky md:top-0 md:h-screen`}
                    >
                        {/* Logo */}
                        <div className="p-6 border-b border-content/10">
                            <Link to="/" className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                                    <Car size={18} className="text-dark-900" />
                                </div>
                                <div>
                                    <p className="font-display font-bold text-content leading-none">Car Rental</p>
                                    <p className="text-brand-400 text-xs tracking-widest">ADMIN</p>
                                </div>
                            </Link>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveView(item.id as AdminView); setSidebarOpen(false); }}
                                    className={`sidebar-link w-full ${activeView === item.id ? 'active' : ''}`}
                                >
                                    {item.icon}
                                    <span className="flex-1 text-left text-sm">{item.label}</span>
                                    {item.badge ? (
                                        <span className="w-5 h-5 bg-brand-500 rounded-full text-[#1c1917] text-xs flex items-center justify-center font-bold">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </button>
                            ))}

                            {/* Simulate Activity Button */}
                            <div className="pt-4 mt-4 border-t border-content/10">
                                <button
                                    onClick={simulateActivity}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${simulatingActivity
                                        ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                        }`}
                                >
                                    {simulatingActivity ? <StopCircle size={16} /> : <PlayCircle size={16} />}
                                    {simulatingActivity ? 'Arrêter simulation' : '▶ Simuler activité'}
                                    {simulatingActivity && (
                                        <span className="ml-auto w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                    )}
                                </button>
                            </div>
                        </nav>

                        {/* Bottom */}
                        <div className="p-4 border-t border-content/10">
                            <Link to="/" className="sidebar-link w-full flex items-center gap-3 text-sm">
                                <LogOut size={16} />
                                <span>Retour au site</span>
                            </Link>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Top bar */}
                <header className="glass sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-dark-900/60 hover:text-dark-900">
                            <Menu size={20} />
                        </button>
                        <h1 className="font-display font-bold text-content text-lg capitalize">{activeView}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={refreshData}
                            className="w-9 h-9 glass-card rounded-xl flex items-center justify-center text-dark-900/50 hover:text-dark-900 transition-colors"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <div className="relative">
                            <button className="w-9 h-9 glass-card rounded-xl flex items-center justify-center text-content/50 hover:text-content transition-colors">
                                <Bell size={16} />
                            </button>
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-dark-900 text-xs flex items-center justify-center font-bold">
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </span>
                            )}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-[#1c1917] text-sm font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Dashboard View */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {activeView === 'dashboard' && (
                        <div className="space-y-6">
                            {/* AI Insight */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-orange rounded-2xl p-4 flex items-start gap-3"
                            >
                                <div className="w-8 h-8 bg-brand-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Zap size={16} className="text-brand-400" />
                                </div>
                                <div>
                                    <p className="text-brand-300 font-semibold text-sm">💡 Insight IA — Opportunité détectée</p>
                                    <p className="text-dark-900/60 text-sm mt-0.5">
                                        Forte demande sur les SUVs ce mois-ci (+47%). Considérez augmenter les tarifs de +10% sur le Mercedes GLC et Range Rover Evoque pour maximiser vos revenus.
                                    </p>
                                </div>
                            </motion.div>

                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    {
                                        label: 'Réservations totales',
                                        value: stats.totalBookings,
                                        icon: <Calendar size={20} />,
                                        color: 'text-brand-400',
                                        bg: 'bg-brand-500/15',
                                        trend: '+12%',
                                        up: true,
                                    },
                                    {
                                        label: 'Revenu mensuel',
                                        value: `${stats.monthlyRevenue} DT`,
                                        icon: <DollarSign size={20} />,
                                        color: 'text-emerald-400',
                                        bg: 'bg-emerald-500/15',
                                        trend: '+8%',
                                        up: true,
                                    },
                                    {
                                        label: 'En attente',
                                        value: stats.pendingBookings,
                                        icon: <Activity size={20} />,
                                        color: 'text-yellow-400',
                                        bg: 'bg-yellow-500/15',
                                        trend: '-3',
                                        up: false,
                                    },
                                    {
                                        label: 'Valeur moyenne',
                                        value: `${stats.avgBookingValue} DT`,
                                        icon: <TrendingUp size={20} />,
                                        color: 'text-purple-400',
                                        bg: 'bg-purple-500/15',
                                        trend: '+5%',
                                        up: true,
                                    },
                                ].map((kpi, i) => (
                                    <motion.div
                                        key={kpi.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className="stat-card group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center ${kpi.color}`}>
                                                {kpi.icon}
                                            </div>
                                            <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                {kpi.trend}
                                            </span>
                                        </div>
                                        <p className="font-display font-black text-2xl text-content">{kpi.value}</p>
                                        <p className="text-dark-900/40 text-xs mt-1">{kpi.label}</p>
                                        {/* Glow on hover */}
                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{ background: `radial-gradient(ellipse at center, ${kpi.bg} 0%, transparent 70%)` }} />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Charts Row */}
                            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                                {/* Revenue Chart */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="glass-card rounded-2xl p-6"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="font-semibold text-content">Évolution des revenus</h3>
                                            <p className="text-dark-900/40 text-xs mt-0.5">12 derniers mois</p>
                                        </div>
                                        <span className="badge-green text-xs">+35% VS 2025</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid rgb(var(--border-subtle) / 0.1)', borderRadius: 12, color: 'var(--text-main)' }}
                                                labelStyle={{ color: 'rgba(0,0,0,0.6)' }}
                                                formatter={(v: any) => [`${v} DT`, 'Revenu']}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revenueGrad)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </motion.div>

                                {/* Fleet Utilization */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="glass-card rounded-2xl p-6"
                                >
                                    <h3 className="font-semibold text-dark-900 mb-1">Utilisation flotte</h3>
                                    <p className="text-dark-900/40 text-xs mb-6">10 véhicules au total</p>
                                    <ResponsiveContainer width="100%" height={160}>
                                        <PieChart>
                                            <Pie data={fleetData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                                                {fleetData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid rgb(var(--border-subtle) / 0.1)', borderRadius: 12, color: 'var(--text-main)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-2 mt-2">
                                        {fleetData.map(d => (
                                            <div key={d.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                                    <span className="text-dark-900/50 text-xs">{d.name}</span>
                                                </div>
                                                <span className="text-dark-900 text-xs font-semibold">{d.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Recent Bookings */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="glass-card rounded-2xl overflow-hidden"
                            >
                                <div className="flex items-center justify-between p-6 border-b border-dark-900/5">
                                    <h3 className="font-semibold text-content">Réservations récentes</h3>
                                    <button onClick={() => setActiveView('reservations')} className="flex items-center gap-1 text-brand-400 text-sm hover:text-brand-300 transition-colors">
                                        Voir tout <ChevronRight size={14} />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="premium-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Client</th>
                                                <th>Véhicule</th>
                                                <th>Dates</th>
                                                <th>Montant</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.slice(0, 5).map(b => (
                                                <tr key={b.id}>
                                                    <td><span className="font-mono text-brand-400 text-xs">{b.id}</span></td>
                                                    <td>
                                                        <div>
                                                            <p className="text-content text-sm font-medium">{b.customerName}</p>
                                                            <p className="text-dark-900/30 text-xs">{b.location}</p>
                                                        </div>
                                                    </td>
                                                    <td><span className="text-dark-900/70 text-sm">{b.carName}</span></td>
                                                    <td>
                                                        <div className="text-xs">
                                                            <p className="text-dark-900/60">{b.startDate}</p>
                                                            <p className="text-dark-900/30">→ {b.endDate}</p>
                                                        </div>
                                                    </td>
                                                    <td><span className="font-semibold text-content">{b.totalPrice} DT</span></td>
                                                    <td>
                                                        <span className={`badge text-xs ${STATUS_MAP[b.status].class}`}>
                                                            {STATUS_MAP[b.status].label}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center gap-1">
                                                            {b.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => { updateBookingStatus(b.id, 'confirmed'); refreshData(); addToast({ type: 'success', title: 'Confirmée', message: `Réservation ${b.id} confirmée.` }); }}
                                                                        className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
                                                                    >
                                                                        <Check size={13} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { updateBookingStatus(b.id, 'cancelled'); refreshData(); addToast({ type: 'error', title: 'Annulée', message: `Réservation ${b.id} annulée.` }); }}
                                                                        className="w-7 h-7 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors"
                                                                    >
                                                                        <X size={13} />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Reservations View */}
                    {activeView === 'reservations' && (
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filterStatus === status
                                            ? 'bg-brand-500 text-dark-900'
                                            : 'glass-card text-dark-900/50 hover:text-dark-900'
                                            }`}
                                    >
                                        {status === 'all' ? 'Toutes' : STATUS_MAP[status as BookingStatus].label}
                                        <span className="ml-2 text-xs opacity-60">
                                            ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="glass-card rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="premium-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Client</th>
                                                <th>Téléphone</th>
                                                <th>Véhicule</th>
                                                <th>Lieu</th>
                                                <th>Du</th>
                                                <th>Au</th>
                                                <th>Jours</th>
                                                <th>Total</th>
                                                <th>Paiement</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence>
                                                {filteredBookings.map(b => (
                                                    <motion.tr
                                                        key={b.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <td><span className="font-mono text-brand-400 text-xs">{b.id}</span></td>
                                                        <td><p className="text-dark-900 font-medium text-sm">{b.customerName}</p></td>
                                                        <td><p className="text-dark-900/50 text-xs">{b.customerPhone}</p></td>
                                                        <td><p className="text-dark-900/70 text-sm">{b.carName}</p></td>
                                                        <td><p className="text-dark-900/50 text-xs">{b.location}</p></td>
                                                        <td><span className="text-dark-900/60 text-xs">{b.startDate}</span></td>
                                                        <td><span className="text-dark-900/60 text-xs">{b.endDate}</span></td>
                                                        <td><span className="text-dark-900 text-sm">{b.days}j</span></td>
                                                        <td><span className="text-brand-400 font-bold text-sm">{b.totalPrice} DT</span></td>
                                                        <td>
                                                            <span className={`badge text-xs ${b.paymentMethod === 'online' ? 'badge-blue' : 'badge-orange'}`}>
                                                                {b.paymentMethod === 'online' ? '💳 En ligne' : '💵 Livraison'}
                                                            </span>
                                                        </td>
                                                        <td><span className={`badge text-xs ${STATUS_MAP[b.status].class}`}>{STATUS_MAP[b.status].label}</span></td>
                                                        <td>
                                                            <div className="flex items-center gap-1">
                                                                {b.status === 'pending' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => { updateBookingStatus(b.id, 'confirmed'); refreshData(); addToast({ type: 'success', title: '✓ Confirmée', message: `${b.id} confirmée` }); }}
                                                                            title="Confirmer"
                                                                            className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
                                                                        >
                                                                            <Check size={12} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { updateBookingStatus(b.id, 'cancelled'); refreshData(); addToast({ type: 'error', title: 'Annulée', message: `${b.id} annulée` }); }}
                                                                            title="Annuler"
                                                                            className="w-7 h-7 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors"
                                                                        >
                                                                            <X size={12} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {b.status === 'confirmed' && (
                                                                    <button
                                                                        onClick={() => { updateBookingStatus(b.id, 'completed'); refreshData(); addToast({ type: 'info', title: 'Terminée', message: `${b.id} marquée terminée` }); }}
                                                                        title="Marquer terminée"
                                                                        className="w-7 h-7 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                                                                    >
                                                                        <Check size={12} />
                                                                    </button>
                                                                )}
                                                                <a
                                                                    href={`https://wa.me/${b.customerPhone.replace(/\s+/g, '').replace('+', '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title="WhatsApp"
                                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-dark-900 hover:opacity-80 transition-opacity"
                                                                    style={{ background: '#25D366' }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                                                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                                                    </svg>
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fleet View */}
                    {activeView === 'flotte' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {FLEET.map((car, i) => (
                                <motion.div
                                    key={car.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="glass-card rounded-2xl overflow-hidden"
                                >
                                    <div className="relative h-40 overflow-hidden">
                                        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                            <div>
                                                <p className="text-dark-900 font-semibold text-sm">{car.name}</p>
                                                <p className="text-dark-900/50 text-xs">{car.category}</p>
                                            </div>
                                            <span className={`badge text-xs ${car.available ? 'badge-green' : 'badge-red'}`}>
                                                {car.available ? 'Disponible' : 'Loué'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-1">
                                                <Star size={12} className="star-filled fill-current" />
                                                <span className="text-dark-900 text-sm font-semibold">{car.rating}</span>
                                                <span className="text-dark-900/30 text-xs">({car.reviews})</span>
                                            </div>
                                            <span className="font-display font-bold text-brand-400">{car.price} DT/j</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/voitures/${car.id}`}
                                                className="flex-1 py-2 text-center text-xs font-medium glass-card rounded-lg text-dark-900/60 hover:text-dark-900 transition-colors"
                                            >
                                                Voir page
                                            </Link>
                                            <button className="flex-1 py-2 text-center text-xs font-medium bg-brand-500/15 text-brand-400 rounded-lg hover:bg-brand-500/25 transition-colors border border-brand-500/20">
                                                {car.available ? '🔒 Réserver' : '🔓 Libérer'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Analytics View */}
                    {activeView === 'analytics' && (
                        <div className="space-y-6">
                            {/* Revenue & Bookings bar chart */}
                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="font-semibold text-content mb-6">Réservations & Revenus mensuels</h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid rgb(var(--border-subtle) / 0.1)', borderRadius: 12, color: 'var(--text-main)' }} />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Revenu (DT)" fill="#f97316" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="bookings" name="Réservations" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Car performance */}
                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="font-semibold text-content mb-6">Performance par véhicule</h3>
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={carPerf} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.6)' }} axisLine={false} tickLine={false} width={140} />
                                        <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid rgb(var(--border-subtle) / 0.1)', borderRadius: 12, color: 'var(--text-main)' }} />
                                        <Bar dataKey="revenue" name="Revenu (DT)" fill="#f97316" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Summary cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Taux d\'occupation', value: '70%', icon: '🚗', color: 'text-brand-400' },
                                    { label: 'Durée moy. location', value: '3.8j', icon: '📅', color: 'text-blue-400' },
                                    { label: 'Revenus totaux', value: `${stats.totalRevenue} DT`, icon: '💰', color: 'text-emerald-400' },
                                    { label: 'NPS Score', value: '92', icon: '⭐', color: 'text-yellow-400' },
                                ].map(item => (
                                    <div key={item.label} className="stat-card text-center">
                                        <div className="text-3xl mb-3">{item.icon}</div>
                                        <p className={`font-display font-black text-2xl ${item.color}`}>{item.value}</p>
                                        <p className="text-dark-900/40 text-xs mt-1">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
