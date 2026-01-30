'use client';

import React, { useEffect, useCallback } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
    // Close on escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const widths = {
        sm: '400px',
        md: '500px',
        lg: '640px',
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    width: '100%',
                    maxWidth: widths[size],
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.2s ease',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: 'var(--slate-400)',
                            borderRadius: '4px',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px',
                            padding: '16px 20px',
                            borderTop: '1px solid var(--border)',
                        }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// CONFIRM DIALOG
// ============================================

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'default';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    isLoading = false,
}: ConfirmDialogProps) {
    const buttonColors = {
        danger: 'var(--red-500)',
        warning: 'var(--amber-500)',
        default: 'var(--accent)',
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="btn"
                        onClick={onConfirm}
                        disabled={isLoading}
                        style={{ backgroundColor: buttonColors[variant], color: 'white' }}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </>
            }
        >
            <p style={{ color: 'var(--foreground-muted)', margin: 0, lineHeight: 1.6 }}>
                {message}
            </p>
        </Modal>
    );
}
