export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type PaymentMethod = 'on_delivery' | 'online';

export interface Booking {
    id: string;
    carId: string;
    carName: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    startDate: string;
    endDate: string;
    days: number;
    totalPrice: number;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    location: string;
    createdAt: string;
    notes?: string;
}

export const LOCATIONS = [
    'Tunis Centre',
    'Aéroport Tunis-Carthage',
    'La Marsa',
    'Djerba',
];

let bookingsStore: Booking[] = [
    {
        id: 'BK-001',
        carId: 'car-3',
        carName: 'Mercedes Classe C',
        customerName: 'Ahmed Ben Ali',
        customerPhone: '+216 50 123 456',
        customerEmail: 'ahmed.benali@email.com',
        startDate: '2026-04-10',
        endDate: '2026-04-14',
        days: 4,
        totalPrice: 720,
        status: 'confirmed',
        paymentMethod: 'on_delivery',
        location: 'Aéroport Tunis-Carthage',
        createdAt: '2026-04-08T10:30:00Z',
    },
    {
        id: 'BK-002',
        carId: 'car-4',
        carName: 'Mercedes GLC',
        customerName: 'Jean-Pierre Dubois',
        customerPhone: '+33 6 12 34 56 78',
        customerEmail: 'jp.dubois@mail.fr',
        startDate: '2026-04-12',
        endDate: '2026-04-19',
        days: 7,
        totalPrice: 1540,
        status: 'confirmed',
        paymentMethod: 'online',
        location: 'Djerba',
        createdAt: '2026-04-08T14:00:00Z',
    },
    {
        id: 'BK-003',
        carId: 'car-1',
        carName: 'Volkswagen Passat',
        customerName: 'Leila Mansour',
        customerPhone: '+216 22 987 654',
        customerEmail: 'leila.mansour@gmail.com',
        startDate: '2026-04-09',
        endDate: '2026-04-11',
        days: 2,
        totalPrice: 180,
        status: 'pending',
        paymentMethod: 'on_delivery',
        location: 'La Marsa',
        createdAt: '2026-04-09T08:15:00Z',
    },
    {
        id: 'BK-004',
        carId: 'car-7',
        carName: 'Hyundai Tucson',
        customerName: 'Khaled Gharbi',
        customerPhone: '+216 23 456 789',
        customerEmail: 'khaled.gharbi@hotmail.com',
        startDate: '2026-04-05',
        endDate: '2026-04-08',
        days: 3,
        totalPrice: 360,
        status: 'completed',
        paymentMethod: 'online',
        location: 'Tunis Centre',
        createdAt: '2026-04-03T09:00:00Z',
    },
    {
        id: 'BK-005',
        carId: 'car-5',
        carName: 'Range Rover Evoque',
        customerName: 'Marie Leclerc',
        customerPhone: '+33 7 89 01 23 45',
        customerEmail: 'marie.leclerc@orange.fr',
        startDate: '2026-04-15',
        endDate: '2026-04-22',
        days: 7,
        totalPrice: 1750,
        status: 'pending',
        paymentMethod: 'online',
        location: 'Djerba',
        createdAt: '2026-04-09T11:00:00Z',
    },
    {
        id: 'BK-006',
        carId: 'car-9',
        carName: 'Peugeot 208',
        customerName: 'Sonia Trabelsi',
        customerPhone: '+216 27 654 321',
        customerEmail: 'sonia.t@email.tn',
        startDate: '2026-04-01',
        endDate: '2026-04-03',
        days: 2,
        totalPrice: 160,
        status: 'completed',
        paymentMethod: 'on_delivery',
        location: 'Tunis Centre',
        createdAt: '2026-03-30T16:00:00Z',
    },
];

// In-memory store functions
export const getBookings = (): Booking[] => [...bookingsStore];

export const addBooking = (booking: Booking): void => {
    bookingsStore = [booking, ...bookingsStore];
};

export const updateBookingStatus = (id: string, status: BookingStatus): void => {
    bookingsStore = bookingsStore.map(b => b.id === id ? { ...b, status } : b);
};

export const generateBookingId = (): string => {
    const num = String(bookingsStore.length + 1).padStart(3, '0');
    return `BK-${num}`;
};

// Dashboard stats
export const getDashboardStats = () => {
    const bookings = getBookings();
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const totalRevenue = bookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

    const monthlyRevenue = bookings
        .filter(b => b.createdAt.startsWith(thisMonth) && (b.status === 'completed' || b.status === 'confirmed'))
        .reduce((sum, b) => sum + b.totalPrice, 0);

    return {
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        totalRevenue,
        monthlyRevenue,
        avgBookingValue: Math.round(totalRevenue / bookings.length),
    };
};

export const getRevenueChartData = () => [
    { month: 'Jan', revenue: 8400, bookings: 32 },
    { month: 'Fév', revenue: 9200, bookings: 38 },
    { month: 'Mar', revenue: 11800, bookings: 47 },
    { month: 'Avr', revenue: 14200, bookings: 58 },
    { month: 'Mai', revenue: 16500, bookings: 65 },
    { month: 'Jun', revenue: 19800, bookings: 78 },
    { month: 'Jul', revenue: 24000, bookings: 95 },
    { month: 'Aoû', revenue: 26500, bookings: 104 },
    { month: 'Sep', revenue: 21000, bookings: 82 },
    { month: 'Oct', revenue: 17500, bookings: 69 },
    { month: 'Nov', revenue: 12800, bookings: 51 },
    { month: 'Déc', revenue: 15200, bookings: 60 },
];

export const getFleetUtilizationData = () => [
    { name: 'Disponible', value: 4, color: '#10b981' },
    { name: 'Loué', value: 5, color: '#f97316' },
    { name: 'Maintenance', value: 1, color: '#ef4444' },
];

export const getCarPerformanceData = () => [
    { name: 'Mercedes GLC', bookings: 41, revenue: 9020 },
    { name: 'Range Rover Sport', bookings: 28, revenue: 8400 },
    { name: 'Mercedes Classe V', bookings: 32, revenue: 6400 },
    { name: 'Range Rover Evoque', bookings: 23, revenue: 5750 },
    { name: 'Mercedes Classe C', bookings: 28, revenue: 5040 },
    { name: 'Hyundai Tucson', bookings: 56, revenue: 6720 },
];
