'use client';

import React, { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 40px',
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-strong)',
            }}
        >
            {icon && (
                <div
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--slate-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        color: 'var(--slate-400)',
                    }}
                >
                    {icon}
                </div>
            )}

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
                    maxWidth: '320px',
                    lineHeight: 1.5,
                }}
            >
                {description}
            </p>

            {action && (
                <button
                    className="btn btn-primary"
                    style={{ marginTop: '20px' }}
                    onClick={action.onClick}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

// Welcome state for new tenants
export function WelcomeState({ orgName }: { orgName: string }) {
    return (
        <div
            className="card"
            style={{
                background: 'linear-gradient(135deg, var(--blue-600) 0%, var(--blue-700) 100%)',
                padding: '32px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative background */}
            <div
                style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-40px',
                    right: '100px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '28px' }}>🎉</span>
                    <span
                        style={{
                            padding: '4px 10px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 'var(--radius)',
                            fontSize: '12px',
                            fontWeight: 500,
                        }}
                    >
                        New Organization
                    </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>
                    Welcome to {orgName}!
                </h2>
                <p style={{ fontSize: '15px', opacity: 0.9, margin: '0 0 24px 0', maxWidth: '500px' }}>
                    Your organization is set up and ready to go. Get started by inviting your team members
                    and configuring your organization preferences.
                </p>

                {/* Setup checklist */}
                <div
                    style={{
                        padding: '16px 20px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '20px',
                    }}
                >
                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', opacity: 0.8 }}>
                        QUICK SETUP CHECKLIST
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { label: 'Create your organization', done: true },
                            { label: 'Invite team members', done: false },
                            { label: 'Set up your first project', done: false },
                            { label: 'Configure billing', done: false },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: item.done ? 'white' : 'rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.done ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" strokeWidth="3">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    ) : (
                                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'white' }}>{i + 1}</span>
                                    )}
                                </div>
                                <span style={{ fontSize: '14px', opacity: item.done ? 0.7 : 1, textDecoration: item.done ? 'line-through' : 'none' }}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="btn"
                        style={{
                            backgroundColor: 'white',
                            color: 'var(--blue-700)',
                            fontWeight: 500,
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                        Invite Team Members
                    </button>
                    <button
                        className="btn"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                        }}
                    >
                        View Setup Guide
                    </button>
                </div>
            </div>
        </div>
    );
}

// Empty data states
export function NoDataState({ type }: { type: 'projects' | 'users' | 'audit' | 'analytics' }) {
    const states = {
        projects: {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
            ),
            title: 'No projects yet',
            description: 'Create your first project to start tracking work and collaborating with your team.',
            action: 'Create Project',
        },
        users: {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            title: 'No team members',
            description: 'Invite colleagues to collaborate. You can assign them Admin, Manager, or Viewer roles.',
            action: 'Invite Users',
        },
        audit: {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
            ),
            title: 'No activity yet',
            description: 'Activity will appear here as your team starts using the platform.',
            action: undefined,
        },
        analytics: {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                </svg>
            ),
            title: 'No analytics data',
            description: 'Analytics will be available once your organization has usage data to analyze.',
            action: undefined,
        },
    };

    const state = states[type];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 32px',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--slate-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: 'var(--slate-400)',
                }}
            >
                {state.icon}
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 6px 0' }}>
                {state.title}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: 0, maxWidth: '280px', lineHeight: 1.5 }}>
                {state.description}
            </p>

            {state.action && (
                <button className="btn btn-primary" style={{ marginTop: '16px', padding: '8px 16px', fontSize: '13px' }}>
                    {state.action}
                </button>
            )}
        </div>
    );
}

// Tenant isolation message
export function TenantIsolationNotice() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'var(--slate-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
            }}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--slate-500)"
                strokeWidth="2"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
                <p style={{ fontSize: '13px', color: 'var(--foreground)', margin: 0, fontWeight: 500 }}>
                    Organization-scoped data
                </p>
                <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', margin: '2px 0 0 0' }}>
                    All data shown is isolated to your current organization. Switch organizations to view other workspaces.
                </p>
            </div>
        </div>
    );
}
