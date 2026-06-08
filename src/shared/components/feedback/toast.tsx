"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 rounded-lg border p-3 shadow-lg ${
              t.type === "success"
                ? "border-green-500 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100"
                : t.type === "error"
                  ? "border-red-500 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
                  : "border-border bg-card text-card-foreground"
            }`}
          >
            {t.type === "error" ? (
              <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
            ) : (
              <FiCheckCircle className="mt-0.5 shrink-0" size={18} />
            )}
            <p className="flex-1 text-sm leading-relaxed">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              aria-label="Cerrar notificación"
              className="text-current/60 hover:text-current"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
