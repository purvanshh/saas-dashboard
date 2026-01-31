'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 4000 }: ToastProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(onClose, 300); // Wait for exit animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible && !isAnimating) return null;

    const getToastStyles = () => {
        const baseStyles = {
            position: 'fixed' as const,
            top: '24px',
            right: '24px',
            minWidth: '320px',
            maxWidth: '480px',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
            opacity: isAnimating ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        };

        switch (type) {
            case 'success':
                return {
                    ...baseStyles,
                    backgroundColor: '#10b981',
                    color: 'white',
                };
            case 'error':
                return {
                    ...baseStyles,
                    backgroundColor: '#ef4444',
                    color: 'white',
                };
            case 'warning':
                return {
                    ...baseStyles,
                    backgroundColor: '#f59e0b',
                    color: 'white',
                };
            case 'info':
                return {
                    ...baseStyles,
                    backgroundColor: '#3b82f6',
                    color: 'white',
                };
            default:
                return baseStyles;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                );
            case 'error':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                );
            case 'info':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                );
        }
    };

    return (
        <div style={getToastStyles()}>
            <div style={{ flexShrink: 0 }}>
                {getIcon()}
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>
                {message}
            </div>
            <button
                onClick={() => {
                    setIsAnimating(false);
                    setTimeout(onClose, 300);
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'currentColor',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
}

// Toast Container Component
interface ToastContainerProps {
    children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
    return (
        <>
            {children}
            <div id="toast-container" style={{ position: 'fixed', top: 0, right: 0, zIndex: 1000 }} />
        </>
    );
}

// Hook for using toasts
export function useToast() {
    const [toasts, setToasts] = useState<Array<{
        id: string;
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
        isVisible: boolean;
    }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type, isVisible: true }]);
    };

    const hideToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const ToastRenderer = () => (
        <>
            {toasts.map((toast, index) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={() => hideToast(toast.id)}
                />
            ))}
        </>
    );

    return {
        showToast,
        ToastRenderer,
        success: (message: string) => showToast(message, 'success'),
        error: (message: string) => showToast(message, 'error'),
        info: (message: string) => showToast(message, 'info'),
        warning: (message: string) => showToast(message, 'warning'),
    };
}