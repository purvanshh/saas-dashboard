'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { navigationItems, canAccessNavItem, NavItem } from '../../lib/permissions';
import { usePathname } from 'next/navigation';

// Icons with enhanced styling
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
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
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

function NavItemComponent({ item, isActive, index, onModalClick }: { item: NavItem; isActive: boolean; index: number; onModalClick?: () => void }) {
    const { currentRole } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const hasAccess = currentRole ? canAccessNavItem(currentRole, item) : false;

    if (!hasAccess) {
        return (
            <div
                className={`tooltip-wrapper animate-slide-in-left animate-delay-${(index + 2) * 100}`}
                style={{
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-lg)',
                        color: 'rgba(255,255,255,0.3)',
                        cursor: 'not-allowed',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'all var(--micro-duration) var(--micro-easing)',
                        border: '1px solid transparent',
                    }}
                >
                    <div style={{ opacity: 0.5 }}>
                        {icons[item.icon]}
                    </div>
                    <span>{item.label}</span>
                    <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{icons.lock}</span>
                </div>
                <div
                    className="tooltip glass-dark"
                    style={{
                        position: 'absolute',
                        bottom: 'auto',
                        top: '50%',
                        left: '100%',
                        transform: 'translateY(-50%)',
                        marginLeft: '12px',
                        marginBottom: 0,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.9)',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'all var(--micro-duration) var(--micro-easing)',
                        zIndex: 50,
                    }}
                >
                    Admin access required
                </div>
            </div>
        );
    }

    // If this item should open a modal instead of navigating
    if (item.id === 'settings' && onModalClick) {
        return (
            <button
                onClick={onModalClick}
                className={`animate-slide-in-left animate-delay-${(index + 2) * 100}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    background: isActive
                        ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0.1) 100%)'
                        : 'transparent',
                    border: isActive
                        ? '1px solid rgba(79, 70, 229, 0.3)'
                        : '1px solid transparent',
                    transition: 'all var(--micro-duration) var(--micro-easing)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Active indicator */}
                {isActive && (
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '3px',
                            height: '20px',
                            background: 'var(--accent)',
                            borderRadius: '0 2px 2px 0',
                        }}
                    />
                )}

                {/* Hover shimmer effect */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: isHovered ? '0%' : '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                        transition: 'left var(--spring-duration) var(--spring-easing)',
                        pointerEvents: 'none',
                    }}
                />

                <div
                    style={{
                        color: isActive ? 'var(--accent)' : 'inherit',
                        transition: 'color var(--micro-duration) var(--micro-easing)',
                    }}
                >
                    {icons[item.icon]}
                </div>
                <span>{item.label}</span>
            </button>
        );
    }

    return (
        <a
            href={item.href}
            className={`animate-slide-in-left animate-delay-${(index + 2) * 100}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                background: isActive
                    ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0.1) 100%)'
                    : isHovered
                        ? 'rgba(255,255,255,0.08)'
                        : 'transparent',
                border: isActive
                    ? '1px solid rgba(79, 70, 229, 0.3)'
                    : '1px solid transparent',
                transition: 'all var(--micro-duration) var(--micro-easing)',
                position: 'relative',
                overflow: 'hidden',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Active indicator */}
            {isActive && (
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px',
                        height: '20px',
                        background: 'var(--accent)',
                        borderRadius: '0 2px 2px 0',
                    }}
                />
            )}

            {/* Hover shimmer effect */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: isHovered ? '0%' : '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transition: 'left var(--spring-duration) var(--spring-easing)',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    color: isActive ? 'var(--accent)' : 'inherit',
                    transition: 'color var(--micro-duration) var(--micro-easing)',
                }}
            >
                {icons[item.icon]}
            </div>
            <span>{item.label}</span>
        </a>
    );
}

interface SidebarProps {
    onProfileSettingsClick?: () => void;
}

export function Sidebar({ onProfileSettingsClick }: SidebarProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <aside
            className={`glass-dark ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 'var(--sidebar-width)',
                height: '100vh',
                background: 'linear-gradient(180deg, var(--slate-900) 0%, rgba(15, 23, 42, 0.95) 100%)',
                borderRight: '1px solid rgba(79, 70, 229, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 40,
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Premium Logo Section */}
            <div
                className="animate-slide-in-left animate-delay-100"
                style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid rgba(79, 70, 229, 0.1)',
                    position: 'relative',
                }}
            >
                {/* Background glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120px',
                        height: '60px',
                        background: 'radial-gradient(ellipse, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        position: 'relative',
                    }}
                >
                    <div
                        className="animate-pulse-glow"
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '16px',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                        }}
                    >
                        S
                    </div>
                    <span
                        className="text-gradient"
                        style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        SaaSboard
                    </span>
                </div>
            </div>

            {/* Enhanced Navigation */}
            <nav
                style={{
                    flex: 1,
                    padding: '20px 16px',
                    overflowY: 'auto',
                }}
            >
                {/* Main Section */}
                <div
                    className="animate-slide-in-left animate-delay-200"
                    style={{ marginBottom: '12px', padding: '0 16px' }}
                >
                    <span
                        style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}
                    >
                        Main
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
                    {navigationItems.slice(0, 3).map((item, index) => (
                        <NavItemComponent
                            key={item.id}
                            item={item}
                            isActive={pathname === item.href}
                            index={index}
                            onModalClick={item.id === 'settings' ? onProfileSettingsClick : undefined}
                        />
                    ))}
                </div>

                {/* Administration Section */}
                <div
                    className="animate-slide-in-left animate-delay-600"
                    style={{ marginBottom: '12px', padding: '0 16px' }}
                >
                    <span
                        style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}
                    >
                        Administration
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navigationItems.slice(3).map((item, index) => (
                        <NavItemComponent
                            key={item.id}
                            item={item}
                            isActive={pathname === item.href}
                            index={index + 3}
                            onModalClick={item.id === 'settings' ? onProfileSettingsClick : undefined}
                        />
                    ))}
                </div>
            </nav>

            {/* Enhanced Footer */}
            <div
                className="animate-slide-in-left animate-delay-1000"
                style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(79, 70, 229, 0.1)',
                }}
            >
                <div
                    className="glass glow-hover"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all var(--micro-duration) var(--micro-easing)',
                    }}
                >
                    <div className="animate-pulse-glow">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--accent)"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                    </div>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                        v2.4.1 Premium
                    </span>
                    <div
                        style={{
                            marginLeft: 'auto',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--emerald-500)',
                            boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                        }}
                    />
                </div>
            </div>
        </aside>
    );
}