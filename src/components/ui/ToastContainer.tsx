import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast, type Toast } from '../../context/AppContext';

const icons = {
    success: <CheckCircle size={20} className="text-emerald-400" />,
    error: <XCircle size={20} className="text-red-400" />,
    warning: <AlertCircle size={20} className="text-yellow-400" />,
    info: <Info size={20} className="text-blue-400" />,
};

const borders = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-blue-500',
};

function ToastItem({ toast }: { toast: Toast }) {
    const { removeToast } = useToast();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`glass-card rounded-2xl p-4 max-w-sm w-full shadow-card border-l-4 ${borders[toast.type]}`}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">{icons[toast.type]}</div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{toast.title}</p>
                    <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
                </div>
                <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    );
}

export default function ToastContainer() {
    const { toasts } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 items-end pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
