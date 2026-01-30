'use client';

import React from 'react';

interface PermissionDeniedModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: string;
    requiredRole: string;
    currentRole: string;
}

export function PermissionDeniedModal({
    isOpen,
    onClose,
    action,
    requiredRole,
    currentRole,
}: PermissionDeniedModalProps) {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    maxWidth: '420px',
                    width: '100%',
                    boxShadow: 'var(--shadow-xl)',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '24px 24px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--red-50)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--red-500)"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h3
                        style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            color: 'var(--foreground)',
                            margin: '0 0 8px 0',
                            textAlign: 'center',
                        }}
                    >
                        Permission Denied
                    </h3>
                </div>

                {/* Body */}
                <div
                    style={{
                        padding: '0 24px 24px',
                        textAlign: 'center',
                    }}
                >
                    <p
                        style={{
                            fontSize: '14px',
                            color: 'var(--foreground-muted)',
                            margin: '0 0 20px 0',
                            lineHeight: 1.6,
                        }}
                    >
                        You don&apos;t have permission to <strong>{action}</strong>. Your current role <strong>({currentRole})</strong> does not have the required permissions.
                    </p>

                    <div
                        style={{
                            padding: '14px 16px',
                            backgroundColor: 'var(--slate-50)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            textAlign: 'left',
                            marginBottom: '20px',
                        }}
                    >
                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--foreground-muted)',
                                margin: '0 0 8px 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Required Access
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                                className="badge badge-admin"
                                style={{ fontSize: '11px' }}
                            >
                                {requiredRole}
                            </span>
                            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                                or higher
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center',
                        }}
                    >
                        <button
                            className="btn btn-primary"
                            onClick={onClose}
                            style={{ minWidth: '100px' }}
                        >
                            Got it
                        </button>
                    </div>

                    <p
                        style={{
                            fontSize: '12px',
                            color: 'var(--foreground-muted)',
                            margin: '16px 0 0 0',
                        }}
                    >
                        Need access?{' '}
                        <a
                            href="#"
                            style={{
                                color: 'var(--blue-600)',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                alert('Request sent to administrator');
                                onClose();
                            }}
                        >
                            Contact an admin
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
