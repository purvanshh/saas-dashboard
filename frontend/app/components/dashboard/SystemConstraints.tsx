'use client';

import React from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';

interface SystemConstraint {
    id: string;
    message: string;
    type: 'limit' | 'sla' | 'performance' | 'maintenance';
}

const constraintsByOrg: Record<string, SystemConstraint[]> = {
    org_1: [
        {
            id: 'rate-limit',
            message: 'Bulk operations are rate-limited to 100 actions/hour to prevent system abuse',
            type: 'limit',
        },
        {
            id: 'sla',
            message: 'Manager approval workflows may be delayed during peak hours (9-11 AM EST)',
            type: 'sla',
        },
    ],
    org_2: [
        {
            id: 'maintenance',
            message: 'Scheduled maintenance: Sunday 2-4 AM EST - API responses may be slower',
            type: 'maintenance',
        },
    ],
    org_3: [
        {
            id: 'performance',
            message: 'Large dataset detected (>50K records). Some exports may take 30+ seconds.',
            type: 'performance',
        },
    ],
};

const typeConfig: Record<SystemConstraint['type'], { icon: string; color: string; bg: string; label: string }> = {
    limit: {
        icon: 'shield',
        color: 'var(--amber-600)',
        bg: 'var(--amber-50)',
        label: 'Rate Limit',
    },
    sla: {
        icon: 'clock',
        color: 'var(--blue-600)',
        bg: 'var(--blue-50)',
        label: 'SLA Notice',
    },
    performance: {
        icon: 'alert',
        color: 'var(--orange-600)',
        bg: 'var(--orange-50)',
        label: 'Performance',
    },
    maintenance: {
        icon: 'wrench',
        color: 'var(--slate-600)',
        bg: 'var(--slate-100)',
        label: 'Maintenance',
    },
};

const icons: Record<string, React.ReactNode> = {
    shield: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    clock: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    alert: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    wrench: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    ),
};

export function SystemConstraints() {
    const { currentOrganization } = useTenant();
    const { role } = useAuth();
    const constraints = constraintsByOrg[currentOrganization.id] || constraintsByOrg['org_1'];

    // Only show to managers and above - operational details not needed for viewers
    if (role === 'viewer') {
        return null;
    }

    return (
        <div
            style={{
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: 'var(--slate-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--slate-500)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    System Constraints
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {constraints.map((constraint) => {
                    const config = typeConfig[constraint.type];
                    return (
                        <div
                            key={constraint.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                backgroundColor: config.bg,
                                borderRadius: 'var(--radius)',
                                border: `1px solid ${config.color}20`,
                            }}
                        >
                            <span style={{ color: config.color, display: 'flex', alignItems: 'center' }}>
                                {icons[config.icon]}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <span
                                    style={{
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        color: config.color,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        padding: '2px 6px',
                                        backgroundColor: 'white',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {config.label}
                                </span>
                                <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.4 }}>
                                    {constraint.message}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
