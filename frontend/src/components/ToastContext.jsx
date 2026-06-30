import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);

      timers.current[id] = setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack - fixed top-right, stacks downward */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-[calc(100%-2.5rem)] sm:w-auto sm:max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className="toast-enter pointer-events-auto cursor-pointer glass-card px-4 py-3.5 flex items-start gap-3"
            style={{
              borderColor:
                toast.type === "success"
                  ? "rgba(34, 197, 94, 0.35)"
                  : toast.type === "error"
                  ? "rgba(239, 68, 68, 0.35)"
                  : "rgba(255, 94, 58, 0.35)",
            }}
          >
            <span className="text-lg leading-none flex-shrink-0 mt-0.5">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "⚠️"}
              {toast.type === "info" && "ℹ️"}
            </span>
            <p className="text-sm text-white/90 leading-snug">
              {toast.message}
            </p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}