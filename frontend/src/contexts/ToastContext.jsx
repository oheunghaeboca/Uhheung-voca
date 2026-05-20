import { createContext, useCallback, useMemo, useState } from 'react';

export const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, variant = 'info', durationMs = 3000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ toasts, show }), [toasts, show]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
