import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ─── Language Context ─────────────────────────────────────────────
type Lang = 'fr' | 'en';

interface LangContextType {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
    'hero.tagline': { fr: 'Location de Voitures Premium', en: 'Premium Car Rental' },
    'hero.title': { fr: 'Vivez l\'Excellence\nSur les Routes\nde Tunisie', en: 'Experience Excellence\nOn Tunisia\'s\nRoads' },
    'hero.subtitle': { fr: 'Flotte haut de gamme disponible à Tunis, La Marsa, l\'Aéroport et Djerba. Réservez en quelques secondes.', en: 'Premium fleet available in Tunis, La Marsa, the Airport and Djerba. Book in seconds.' },
    'hero.cta': { fr: 'Réserver Maintenant', en: 'Book Now' },
    'hero.whatsapp': { fr: 'Réserver via WhatsApp', en: 'Book via WhatsApp' },
    'nav.home': { fr: 'Accueil', en: 'Home' },
    'nav.fleet': { fr: 'Notre Flotte', en: 'Our Fleet' },
    'nav.booking': { fr: 'Réservation', en: 'Booking' },
    'nav.dashboard': { fr: 'Dashboard Admin', en: 'Admin Dashboard' },
    'nav.contact': { fr: 'Contact', en: 'Contact' },
    'fleet.title': { fr: 'Notre Flotte Premium', en: 'Our Premium Fleet' },
    'fleet.subtitle': { fr: 'Choisissez parmi nos véhicules d\'exception, disponibles immédiatement à Tunis et Djerba.', en: 'Choose from our exceptional vehicles, immediately available in Tunis and Djerba.' },
    'fleet.perDay': { fr: 'DT/jour', en: 'DT/day' },
    'fleet.book': { fr: 'Réserver', en: 'Book' },
    'fleet.details': { fr: 'Voir Détails', en: 'View Details' },
    'fleet.unavailable': { fr: 'Indisponible', en: 'Unavailable' },
    'fleet.aiChoice': { fr: '🔥 Meilleur choix pour vous', en: '🔥 Best choice for you' },
    'booking.title': { fr: 'Réservation Rapide', en: 'Quick Booking' },
    'booking.subtitle': { fr: 'Réservez votre véhicule en moins de 2 minutes', en: 'Book your vehicle in under 2 minutes' },
    'booking.car': { fr: 'Véhicule', en: 'Vehicle' },
    'booking.startDate': { fr: 'Date de début', en: 'Start date' },
    'booking.endDate': { fr: 'Date de fin', en: 'End date' },
    'booking.location': { fr: 'Lieu de prise en charge', en: 'Pickup location' },
    'booking.name': { fr: 'Votre nom complet', en: 'Full name' },
    'booking.phone': { fr: 'Téléphone', en: 'Phone' },
    'booking.email': { fr: 'Email', en: 'Email' },
    'booking.payment': { fr: 'Mode de paiement', en: 'Payment method' },
    'booking.submit': { fr: 'Confirmer la Réservation', en: 'Confirm Booking' },
    'booking.whatsapp': { fr: 'Ou réserver via WhatsApp', en: 'Or book via WhatsApp' },
    'payment.delivery': { fr: 'Paiement à la livraison', en: 'Pay on delivery' },
    'payment.online': { fr: 'Paiement en ligne', en: 'Online payment' },
    'footer.rights': { fr: 'Tous droits réservés', en: 'All rights reserved' },
    'footer.call': { fr: 'Appelez-nous', en: 'Call us' },
    'impact.title': { fr: 'L\'Impact Business Réel', en: 'Real Business Impact' },
    'impact.before': { fr: 'AVANT', en: 'BEFORE' },
    'impact.after': { fr: 'APRÈS', en: 'AFTER' },
};

const LangContext = createContext<LangContextType>({} as LangContextType);

// ─── Toast / Notification Context ─────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

// ─── App Context ──────────────────────────────────────────────────
interface AppContextType {
    notificationCount: number;
    setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
    simulatingActivity: boolean;
    setSimulatingActivity: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// ─── Combined Provider ────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>('fr');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [notificationCount, setNotificationCount] = useState(3);
    const [simulatingActivity, setSimulatingActivity] = useState(false);

    const t = useCallback((key: string): string => {
        return translations[key]?.[lang] ?? key;
    }, [lang]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { ...toast, id }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4500);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <LangContext.Provider value={{ lang, setLang, t }}>
            <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
                <AppContext.Provider value={{ notificationCount, setNotificationCount, simulatingActivity, setSimulatingActivity }}>
                    {children}
                </AppContext.Provider>
            </ToastContext.Provider>
        </LangContext.Provider>
    );
}

export const useLang = () => useContext(LangContext);
export const useToast = () => useContext(ToastContext);
export const useApp = () => useContext(AppContext);
