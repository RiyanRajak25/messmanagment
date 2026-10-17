import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title: string; message?: string; duration?: number }) => void;
  celebrate: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(
    ({ type = 'success', title, message, duration = 4000 }: { type?: ToastType; title: string; message?: string; duration?: number }) => {
      const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const celebrate = useCallback(() => {
    // Military specification: disciplined subtle pulse instead of playful confetti
    console.info('[HIMRASAD] Operational milestone logged.');
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, celebrate }}>
      {children}
      {/* Toast Viewport Bottom-Right */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const config = {
              success: {
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.2] shrink-0" />,
                border: 'border-l-4 border-l-emerald-500',
              },
              error: {
                icon: <XCircle className="w-4 h-4 text-danger stroke-[2.2] shrink-0" />,
                border: 'border-l-4 border-l-danger',
              },
              warning: {
                icon: <AlertTriangle className="w-4 h-4 text-gold stroke-[2.2] shrink-0" />,
                border: 'border-l-4 border-l-gold',
              },
              info: {
                icon: <Info className="w-4 h-4 text-glacier-mist stroke-[2.2] shrink-0" />,
                border: 'border-l-4 border-l-glacier',
              },
            }[t.type];

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.94 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto bg-olive-night text-snow border border-sand/30 ${config.border} rounded-card p-3.5 shadow-elevated flex items-start gap-3 select-none`}
              >
                <div className="shrink-0 mt-0.5">{config.icon}</div>
                <div className="flex-1 pr-1 min-w-0">
                  <h4 className="text-xs font-heading font-bold text-snow leading-snug tracking-wide">{t.title}</h4>
                  {t.message && <p className="text-[11px] text-snow/75 font-sans mt-0.5 leading-relaxed">{t.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 p-1 rounded-control hover:bg-white/10 text-snow/50 hover:text-snow transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
