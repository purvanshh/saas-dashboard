'use client';

import React from 'react';

interface AccessDeniedProps {
    title?: string;
    description?: string;
    requiredRole?: string;
}

export function AccessDenied({
    title = "Access Denied",
    description = "You don't have permission to view this content.",
    requiredRole,
}: AccessDeniedProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 40px',
                textAlign: 'center',
                backgroundColor: 'var(--slate-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-strong)',
            }}
        >
            <div
                style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--red-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                }}
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--red-500)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            </div>

            <h3
                style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    margin: '0 0 8px 0',
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    fontSize: '14px',
                    color: 'var(--foreground-muted)',
                    margin: 0,
                    maxWidth: '300px',
                    lineHeight: 1.5,
                }}
            >
                {description}
            </p>

            {requiredRole && (
                <div
                    style={{
                        marginTop: '16px',
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        color: 'var(--foreground-muted)',
                    }}
                >
                    Required role: <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{requiredRole}</span>
                </div>
            )}
        </div>
    );
}
