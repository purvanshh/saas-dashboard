'use client';

import React, { ReactNode, useState } from 'react';

interface DisabledActionProps {
    children: ReactNode;
    reason: string;
    disabled?: boolean;
}

export function DisabledAction({ children, reason, disabled = true }: DisabledActionProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    if (!disabled) {
        return <>{children}</>;
    }

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div
                style={{
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    pointerEvents: 'none',
                }}
            >
                {children}
            </div>

            {/* Invisible overlay to capture hover */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    cursor: 'not-allowed',
                }}
            />

            {/* Tooltip */}
            {showTooltip && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '8px',
                        padding: '8px 12px',
                        backgroundColor: 'var(--slate-900)',
                        color: 'white',
                        fontSize: '12px',
                        borderRadius: 'var(--radius)',
                        whiteSpace: 'nowrap',
                        zIndex: 100,
                        boxShadow: 'var(--shadow-lg)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        {reason}
                    </div>
                    {/* Arrow */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '6px solid var(--slate-900)',
                        }}
                    />
                </div>
            )}
        </div>
    );
}
