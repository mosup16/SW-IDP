import { createContext, useCallback, useRef, useState } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const leavingRef = useRef(new Set());

  const dismiss = useCallback((id) => {
    if (leavingRef.current.has(id)) return;
    leavingRef.current.add(id);

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      leavingRef.current.delete(id);
    }, 220);
  }, []);

  const push = useCallback(
    (message, tone = 'info') => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, tone, leaving: false }]);
      setTimeout(() => dismiss(id), 4000);
      return id;
    },
    [dismiss]
  );

  const api = {
    success: (msg) => push(msg, 'success'),
    error:   (msg) => push(msg, 'error'),
    info:    (msg) => push(msg, 'info'),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            tone={t.tone}
            leaving={t.leaving}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}