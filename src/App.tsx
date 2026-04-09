import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import ToastContainer from './components/ui/ToastContainer';
import HomePage from './pages/HomePage';
import FleetPage from './pages/FleetPage';
import CarDetailPage from './pages/CarDetailPage';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import ContactPage from './pages/ContactPage';

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/flotte" element={<PageWrapper><FleetPage /></PageWrapper>} />
        <Route path="/voitures/:id" element={<PageWrapper><CarDetailPage /></PageWrapper>} />
        <Route path="/reservation" element={<PageWrapper><BookingPage /></PageWrapper>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="*" element={
          <PageWrapper>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="text-8xl font-display font-black gradient-text mb-4">404</p>
                <h1 className="text-content text-2xl font-semibold mb-2">Page introuvable</h1>
                <p className="text-content/40 mb-8">Cette page n'existe pas.</p>
                <a href="/" className="btn-primary">Retour à l'accueil</a>
              </div>
            </div>
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
      <ToastContainer />
    </AppProvider>
  );
}
