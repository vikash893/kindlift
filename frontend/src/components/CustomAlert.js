import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  CheckCircle, XCircle, AlertTriangle, Info, HelpCircle, X
} from 'lucide-react';

/* ── Alert Context ─────────────────────────────────────── */
const AlertContext = createContext(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within <AlertProvider>');
  return ctx;
};

/* ── Variants ─────────────────────────────────────────── */
const VARIANTS = {
  success: {
    icon: CheckCircle,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    title: 'Success',
  },
  error: {
    icon: XCircle,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    title: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    color: '#e8a838',
    bg: 'rgba(232,168,56,0.08)',
    border: 'rgba(232,168,56,0.25)',
    title: 'Warning',
  },
  info: {
    icon: Info,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    title: 'Info',
  },
  confirm: {
    icon: HelpCircle,
    color: '#e8a838',
    bg: 'rgba(232,168,56,0.08)',
    border: 'rgba(232,168,56,0.25)',
    title: 'Confirm',
  },
};

/* ── Toast Component (non-blocking notification) ────── */
const Toast = ({ id, variant = 'info', message, onClose }) => {
  const v = VARIANTS[variant] || VARIANTS.info;
  const Icon = v.icon;
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onClose(id), 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`toast-item ${exiting ? 'toast-exit' : 'toast-enter'}`}
      style={{
        background: '#0a0a0a',
        border: `1px solid ${v.border}`,
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '320px',
        maxWidth: '440px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)`,
      }}
    >
      <div
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: v.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 18, height: 18, color: v.color }} />
      </div>
      <p style={{
        color: '#e5e5e5', fontSize: '0.875rem', lineHeight: 1.5, flex: 1,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {message}
      </p>
      <button
        onClick={() => { setExiting(true); setTimeout(() => onClose(id), 400); }}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: 4, color: '#555', flexShrink: 0,
        }}
      >
        <X style={{ width: 14, height: 14 }} />
      </button>
    </div>
  );
};

/* ── Modal Alert Component (blocking dialog) ─────────── */
const AlertModal = ({ variant = 'info', title, message, confirmText, cancelText, onConfirm, onCancel }) => {
  const v = VARIANTS[variant] || VARIANTS.info;
  const Icon = v.icon;
  const isConfirm = variant === 'confirm';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = (result) => {
    setVisible(false);
    setTimeout(() => {
      if (result) onConfirm?.();
      else onCancel?.();
    }, 350);
  };

  return (
    <div
      className={`alert-backdrop ${visible ? 'alert-backdrop-visible' : ''}`}
      onClick={() => handleClose(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`alert-modal ${visible ? 'alert-modal-visible' : ''}`}
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          overflow: 'hidden',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Accent line on top */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${v.color}, transparent)` }} />

        {/* Content */}
        <div style={{ padding: '32px 28px 28px' }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: v.bg, border: `1px solid ${v.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Icon style={{ width: 28, height: 28, color: v.color }} />
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "'Syne', system-ui, sans-serif",
            fontSize: '1.25rem', fontWeight: 700, color: '#ffffff',
            textAlign: 'center', marginBottom: 8,
          }}>
            {title || v.title}
          </h3>

          {/* Message */}
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.875rem', lineHeight: 1.6, color: '#999',
            textAlign: 'center', marginBottom: 28,
          }}>
            {message}
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex', gap: 12,
            flexDirection: isConfirm ? 'row' : 'column',
          }}>
            {isConfirm && (
              <button
                onClick={() => handleClose(false)}
                style={{
                  flex: 1, padding: '14px 24px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, cursor: 'pointer',
                  fontFamily: "'Syne', system-ui, sans-serif",
                  fontSize: '0.875rem', fontWeight: 700,
                  color: '#999',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                  e.target.style.color = '#999';
                }}
              >
                {cancelText || 'Cancel'}
              </button>
            )}
            <button
              onClick={() => handleClose(true)}
              style={{
                flex: 1, padding: '14px 24px',
                background: isConfirm ? v.color : v.color,
                border: 'none', borderRadius: 12, cursor: 'pointer',
                fontFamily: "'Syne', system-ui, sans-serif",
                fontSize: '0.875rem', fontWeight: 700,
                color: variant === 'error' ? '#fff' : '#0a0a0a',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 16px ${v.color}33`,
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.85';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {confirmText || 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Alert Provider ───────────────────────────────────── */
export const AlertProvider = ({ children }) => {
  const [modals, setModals] = useState([]);
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* toast(variant, message) — non-blocking */
  const toast = useCallback((variant, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, variant, message }]);
  }, []);

  /* showAlert({ variant, title, message, confirmText }) — blocking modal (returns Promise) */
  const showAlert = useCallback((opts) => {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random();
      setModals((prev) => [
        ...prev,
        {
          id, ...opts,
          onConfirm: () => { setModals((m) => m.filter((x) => x.id !== id)); resolve(true); },
          onCancel: () => { setModals((m) => m.filter((x) => x.id !== id)); resolve(false); },
        },
      ]);
    });
  }, []);

  /* Shorthand helpers */
  const success = useCallback((msg, title) => showAlert({ variant: 'success', message: msg, title }), [showAlert]);
  const error = useCallback((msg, title) => showAlert({ variant: 'error', message: msg, title }), [showAlert]);
  const warning = useCallback((msg, title) => showAlert({ variant: 'warning', message: msg, title }), [showAlert]);
  const info = useCallback((msg, title) => showAlert({ variant: 'info', message: msg, title }), [showAlert]);
  const confirm = useCallback((msg, title) =>
    showAlert({ variant: 'confirm', message: msg, title, confirmText: 'Confirm', cancelText: 'Cancel' }),
  [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert, toast, success, error, warning, info, confirm }}>
      {children}

      {/* Modal stack */}
      {modals.map((m) => (
        <AlertModal key={m.id} {...m} />
      ))}

      {/* Toast container */}
      {toasts.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 99998,
          display: 'flex', flexDirection: 'column-reverse', gap: 10,
        }}>
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onClose={removeToast} />
          ))}
        </div>
      )}

      {/* Inline styles for animations */}
      <style>{`
        .toast-enter {
          animation: toastSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .toast-exit {
          animation: toastSlideOut 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(60px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(60px) scale(0.95); }
        }
      `}</style>
    </AlertContext.Provider>
  );
};
