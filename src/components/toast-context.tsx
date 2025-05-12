// toast-context.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // Duration in milliseconds
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
  clearToasts: () => void;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxToasts?: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({
  children,
  position = "top-right",
  maxToasts = 3,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const addToast = ({ title, description, variant = "info", duration = 5000 }: Omit<Toast, "id">) => {
    if (toasts.length >= maxToasts) {
      setToasts((prev) => prev.slice(1)); // Remove oldest toast if max is reached
    }
    const id = Date.now();
    const newToast = { id, title, description, variant, duration };
    setToasts((prev) => [...prev, newToast]);

    startTimer(id, duration);
  };

  const startTimer = (id: number, duration: number) => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);
    timersRef.current.set(id, timer);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimer(id);
  };

  const clearToasts = () => {
    setToasts([]);
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  };

  const clearTimer = (id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  };

  const handleMouseEnter = (id: number) => {
    clearTimer(id);
  };

  const handleMouseLeave = (id: number, duration: number) => {
    startTimer(id, duration);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  // Determine position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      <div
        className={`fixed ${positionClasses[position]} space-y-2 z-[999] max-w-xs p-2 rounded-lg`}
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence>
          {toasts.map(({ id, title, description, variant = "info", duration = 5000 }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: position.includes("right") ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: position.includes("right") ? 50 : -50 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg shadow-lg overflow-hidden p-4 w-80 border border-gray-600 relative bg-light-2 dark:bg-dark-2`}
              onMouseEnter={() => handleMouseEnter(id)}
              onMouseLeave={() => handleMouseLeave(id, duration)}
              role="alert"
            >
              <button
                onClick={() => removeToast(id)}
                className="absolute top-2 right-2 rounded-full p-1"
                aria-label="Close notification"
              >
                <X size={18} />
              </button>
              {title && <h4 className="font-semibold text-lg mb-1 text-black dark:text-white">{title}</h4>}
              {description && <p className="text-sm text-black/40 dark:text-white/40">{description}</p>}
              <motion.div
                className="absolute bottom-0 left-0 h-[0.2rem] bg-gray-300 dark:bg-gray-600"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};