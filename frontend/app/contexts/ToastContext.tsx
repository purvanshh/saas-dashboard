'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Components
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 9999,
                pointerEvents: 'none',
            }}
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const bgMap = {
        success: 'var(--emerald-600)',
        error: 'var(--red-600)',
        info: 'var(--blue-600)',
        warning: 'var(--amber-600)',
    };

    return (
        <div
            style={{
                pointerEvents: 'auto',
                minWidth: '300px',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'slideIn 0.3s ease-out forwards',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    width: '4px',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    backgroundColor: bgMap[toast.type],
                }}
            />

            <div
                style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: `${bgMap[toast.type]}20`,
                    color: bgMap[toast.type],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {toast.type === 'success' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                )}
                {toast.type === 'error' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                )}
                {toast.type === 'info' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                )}
                {toast.type === 'warning' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                )}
            </div>

            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>
                {toast.message}
            </p>

            <button
                onClick={onClose}
                style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: 'var(--foreground-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
