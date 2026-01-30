'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { navigationItems, canAccessNavItem, NavItem } from '../../lib/permissions';

// Icons
const icons: Record<string, React.ReactNode> = {
    dashboard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    analytics: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
        </svg>
    ),
    projects: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    ),
    users: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    settings: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    billing: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
    ),
    audit: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    ),
    lock: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
};

function NavItemComponent({ item, isActive }: { item: NavItem; isActive: boolean }) {
    const { role } = useAuth();
    const hasAccess = canAccessNavItem(role, item);

    if (!hasAccess) {
        return (
            <div className="tooltip-wrapper">
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        color: 'rgba(255,255,255,0.3)',
                        cursor: 'not-allowed',
                        fontSize: '14px',
                    }}
                >
                    {icons[item.icon]}
                    <span>{item.label}</span>
                    <span style={{ marginLeft: 'auto' }}>{icons.lock}</span>
                </div>
                <div
                    className="tooltip"
                    style={{
                        bottom: 'auto',
                        top: '50%',
                        left: '100%',
                        transform: 'translateY(-50%)',
                        marginLeft: '8px',
                        marginBottom: 0,
                    }}
                >
                    Admin access required
                </div>
            </div>
        );
    }

    return (
        <a
            href={item.href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#ffffff';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }
            }}
        >
            {icons[item.icon]}
            <span>{item.label}</span>
        </a>
    );
}

export function Sidebar() {
    return (
        <aside
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 'var(--sidebar-width)',
                height: '100vh',
                backgroundColor: 'var(--slate-900)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 40,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: '20px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '14px',
                        }}
                    >
                        S
                    </div>
                    <span
                        style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        SaaSboard
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav
                style={{
                    flex: 1,
                    padding: '16px 12px',
                    overflowY: 'auto',
                }}
            >
                <div style={{ marginBottom: '8px', padding: '0 12px' }}>
                    <span
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Main
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {navigationItems.slice(0, 3).map((item) => (
                        <NavItemComponent
                            key={item.id}
                            item={item}
                            isActive={item.id === 'dashboard'}
                        />
                    ))}
                </div>

                <div style={{ marginTop: '24px', marginBottom: '8px', padding: '0 12px' }}>
                    <span
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Administration
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {navigationItems.slice(3).map((item) => (
                        <NavItemComponent
                            key={item.id}
                            item={item}
                            isActive={false}
                        />
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div
                style={{
                    padding: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                    }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        v2.4.1
                    </span>
                </div>
            </div>
        </aside>
    );
}
