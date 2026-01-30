'use client';

import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', className, style }: SkeletonProps) {
    return (
        <div
            className={className}
            style={{
                width,
                height,
                backgroundColor: 'var(--slate-200)',
                borderRadius,
                animation: 'pulse 1.5s ease-in-out infinite',
                ...style,
            }}
        />
    );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} style={{ padding: '14px 16px' }}>
                    <Skeleton height="16px" width={i === 0 ? '60%' : '40%'} />
                </td>
            ))}
        </tr>
    );
}

// Card skeleton
export function CardSkeleton() {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <Skeleton width="40%" height="20px" />
            <div style={{ marginTop: '16px' }}>
                <Skeleton width="100%" height="14px" />
                <Skeleton width="80%" height="14px" style={{ marginTop: '8px' }} />
            </div>
        </div>
    );
}

// Add pulse animation via style tag
if (typeof document !== 'undefined') {
    const styleId = 'skeleton-pulse-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
}
