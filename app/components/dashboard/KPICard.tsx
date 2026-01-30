'use client';

import React from 'react';

interface KPICardProps {
    title: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    unit?: string;
    icon: React.ReactNode;
}

export function KPICard({ title, value, change, trend, unit, icon }: KPICardProps) {
    const getTrendColor = () => {
        if (trend === 'up') return 'var(--emerald-600)';
        if (trend === 'down') return 'var(--red-600)';
        return 'var(--slate-500)';
    };

    const getTrendIcon = () => {
        if (trend === 'up') {
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" />
                </svg>
            );
        }
        if (trend === 'down') {
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            );
        }
        return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
            </svg>
        );
    };

    // Determine if the trend is positive or negative based on context
    // For error rate, down is good. For others, up is good.
    const isPositive = title.toLowerCase().includes('error')
        ? trend === 'down'
        : trend === 'up';

    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <p style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--foreground-muted)',
                        marginBottom: '8px',
                    }}>
                        {title}
                    </p>
                    <p style={{
                        fontSize: '28px',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                        lineHeight: 1.2,
                    }}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                        {unit && <span style={{ fontSize: '16px', fontWeight: 500, marginLeft: '2px' }}>{unit}</span>}
                    </p>
                </div>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--slate-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-600)',
                }}>
                    {icon}
                </div>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '12px',
            }}>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    color: isPositive ? 'var(--emerald-600)' : getTrendColor(),
                    fontSize: '13px',
                    fontWeight: 500,
                }}>
                    {getTrendIcon()}
                    {Math.abs(change)}%
                </span>
                <span style={{
                    fontSize: '13px',
                    color: 'var(--foreground-muted)',
                }}>
                    vs last month
                </span>
            </div>
        </div>
    );
}
