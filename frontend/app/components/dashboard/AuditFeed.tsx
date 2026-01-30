'use client';

import React from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { auditLogs } from '../../lib/mockData';

export function AuditFeed() {
    const { currentOrganization } = useTenant();
    const logs = auditLogs.filter((log) => log.organizationId === currentOrganization.id);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const getActionColor = (action: string) => {
        if (['created', 'invited'].includes(action)) return 'var(--emerald-600)';
        if (['deleted', 'removed'].includes(action)) return 'var(--red-600)';
        if (['updated', 'changed role of'].includes(action)) return 'var(--amber-600)';
        return 'var(--slate-600)';
    };

    return (
        <div className="card">
            <div
                className="card-header"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
                        Recent Activity
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
                        Latest actions in your organization
                    </p>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: '13px' }}>
                    View all
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {logs.length === 0 ? (
                    <div
                        style={{
                            padding: '40px 20px',
                            textAlign: 'center',
                            color: 'var(--foreground-muted)',
                        }}
                    >
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            style={{ margin: '0 auto 12px', opacity: 0.5 }}
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        <p style={{ margin: 0 }}>No recent activity</p>
                    </div>
                ) : (
                    <div>
                        {logs.map((log, index) => (
                            <div
                                key={log.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '14px 20px',
                                    borderBottom: index < logs.length - 1 ? '1px solid var(--border)' : 'none',
                                }}
                            >
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--slate-400) 0%, var(--slate-500) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        flexShrink: 0,
                                    }}
                                >
                                    {getInitials(log.userName)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                                        <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>
                                            {log.userName}
                                        </span>{' '}
                                        <span style={{ color: getActionColor(log.action) }}>{log.action}</span>{' '}
                                        <span style={{ color: 'var(--foreground)' }}>{log.target}</span>
                                    </p>
                                    <p
                                        style={{
                                            margin: '4px 0 0 0',
                                            fontSize: '12px',
                                            color: 'var(--foreground-muted)',
                                        }}
                                    >
                                        {log.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
