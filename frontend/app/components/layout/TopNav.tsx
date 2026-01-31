'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleBadgeClass, getRoleLabel, Role } from '../../lib/permissions';
import { ProfileModal } from '../ui/ProfileModal';
import { SettingsModal } from '../ui/SettingsModal';

const ALL_ROLES: Role[] = ['admin', 'manager', 'viewer'];

export function TopNav() {
    const { currentOrganization, organizations, switchOrganization } = useTenant();
    const { currentUser, currentRole, setRole } = useAuth();
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    // Fix hydration mismatch by ensuring client-side rendering
    useEffect(() => {
        setMounted(true);
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    // Prevent hydration mismatch by showing loading state until mounted
    if (!mounted) {
        return (
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 'var(--sidebar-width)',
                    right: 0,
                    height: 'var(--topnav-height)',
                    backgroundColor: 'white',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    zIndex: 30,
                }}
            >
                {/* Loading skeleton */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="skeleton" style={{ width: '180px', height: '40px', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="skeleton" style={{ width: '80px', height: '28px', borderRadius: 'var(--radius-sm)' }} />
                    <div className="skeleton" style={{ width: '160px', height: '40px', borderRadius: 'var(--radius-md)' }} />
                </div>
            </header>
        );
    }

    return (
        <>
            <header
                className="animate-slide-in-up"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 'var(--sidebar-width)',
                    right: 0,
                    height: 'var(--topnav-height)',
                    background: 'linear-gradient(135deg, white 0%, rgba(248, 250, 252, 0.95) 100%)',
                    borderBottom: '1px solid rgba(255, 107, 53, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    zIndex: 30,
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
            >
                {/* Left section - Organization Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="dropdown" style={{ position: 'relative' }}>
                        <button
                            className="glow-hover"
                            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 16px',
                                background: 'linear-gradient(135deg, var(--slate-50) 0%, rgba(248, 250, 252, 0.8) 100%)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--foreground)',
                                transition: 'all var(--micro-duration) var(--micro-easing)',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <div
                                className="animate-pulse-glow"
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
                                }}
                            >
                                {currentOrganization?.name?.[0] || 'O'}
                            </div>
                            <span>{currentOrganization?.name || 'Organization'}</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{
                                    transform: orgDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform var(--micro-duration) var(--micro-easing)',
                                }}
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>

                        {orgDropdownOpen && (
                            <div
                                className="dropdown-menu animate-slide-in-up"
                                style={{
                                    minWidth: '280px',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '12px 16px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: 'var(--foreground-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    Switch Organization
                                </div>
                                {organizations.map((org, index) => (
                                    <button
                                        key={org.id}
                                        className={`dropdown-item glow-hover ${org.id === currentOrganization?.id ? 'active' : ''} animate-slide-in-left animate-delay-${index * 50}`}
                                        onClick={() => {
                                            switchOrganization(org.id);
                                            setOrgDropdownOpen(false);
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                                    >
                                        <div
                                            className="animate-float"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: 'var(--radius-lg)',
                                                background:
                                                    org.id === 'org_1'
                                                        ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)'
                                                        : org.id === 'org_2'
                                                            ? 'linear-gradient(135deg, var(--emerald-500) 0%, var(--emerald-600) 100%)'
                                                            : org.id === 'org_3'
                                                                ? 'linear-gradient(135deg, var(--amber-500) 0%, var(--amber-600) 100%)'
                                                                : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                flexShrink: 0,
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                animationDelay: `${index * 0.2}s`,
                                            }}
                                        >
                                            {org.name[0]}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {org.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    color: 'var(--foreground-muted)',
                                                    textTransform: 'capitalize',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {org.plan}
                                            </div>
                                        </div>
                                        {org.id === currentOrganization?.id && (
                                            <div className="animate-pulse-glow">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="var(--accent)"
                                                    strokeWidth="2"
                                                    style={{ flexShrink: 0 }}
                                                >
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right section - Role badge, User menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Role Switcher - for demo */}
                    <div className="dropdown" style={{ position: 'relative' }}>
                        <button
                            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                            className={`badge ${getRoleBadgeClass(currentRole)} glow-hover animate-pulse-glow`}
                            style={{
                                cursor: 'pointer',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: 600,
                                padding: '6px 12px',
                            }}
                            title="Click to switch role (Demo)"
                        >
                            {getRoleLabel(currentRole)}
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ marginLeft: '6px' }}
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>

                        {roleDropdownOpen && (
                            <div
                                className="dropdown-menu animate-slide-in-up"
                                style={{
                                    right: 0,
                                    left: 'auto',
                                    minWidth: '180px',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '12px 16px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: 'var(--foreground-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    Switch Role (Demo)
                                </div>
                                {ALL_ROLES.map((r, index) => (
                                    <button
                                        key={r}
                                        className={`dropdown-item glow-hover ${r === currentRole ? 'active' : ''} animate-slide-in-right animate-delay-${index * 50}`}
                                        onClick={() => {
                                            setRole(r);
                                            setRoleDropdownOpen(false);
                                        }}
                                    >
                                        <span className={`badge ${getRoleBadgeClass(r)}`} style={{ marginRight: '10px' }}>
                                            {getRoleLabel(r)}
                                        </span>
                                        {r === currentRole && (
                                            <div className="animate-pulse-glow">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="var(--accent)"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            width: '1px',
                            height: '28px',
                            background: 'linear-gradient(180deg, transparent, var(--border), transparent)',
                        }}
                    />

                    {/* User Menu */}
                    <div className="dropdown" style={{ position: 'relative' }}>
                        <button
                            className="glow-hover"
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: '1px solid transparent',
                                borderRadius: 'var(--radius-lg)',
                                cursor: 'pointer',
                                transition: 'all var(--micro-duration) var(--micro-easing)',
                            }}
                        >
                            <div
                                className="animate-pulse-glow"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                }}
                            >
                                {getInitials(currentUser?.name || 'User')}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--foreground)',
                                    }}
                                >
                                    {currentUser?.name || 'User'}
                                </div>
                                <div
                                    style={{
                                        fontSize: '12px',
                                        color: 'var(--foreground-muted)',
                                        fontWeight: 500,
                                    }}
                                >
                                    {currentUser?.email || 'user@example.com'}
                                </div>
                            </div>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--foreground-muted)"
                                strokeWidth="2"
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>

                        {profileDropdownOpen && (
                            <div
                                className="dropdown-menu animate-slide-in-up"
                                style={{
                                    right: 0,
                                    left: 'auto',
                                    minWidth: '220px',
                                }}
                            >
                                <button className="dropdown-item glow-hover animate-slide-in-right animate-delay-50" onClick={() => {
                                    setProfileModalOpen(true);
                                    setProfileDropdownOpen(false);
                                }}>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Profile
                                </button>
                                <button className="dropdown-item glow-hover animate-slide-in-right animate-delay-100" onClick={() => {
                                    setSettingsModalOpen(true);
                                    setProfileDropdownOpen(false);
                                }}>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    Settings
                                </button>
                                <div
                                    style={{
                                        height: '1px',
                                        background: 'var(--border)',
                                        margin: '8px 0',
                                    }}
                                />
                                <button
                                    className="dropdown-item glow-hover animate-slide-in-right animate-delay-150"
                                    style={{ color: 'var(--red-600)' }}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Modals - rendered outside header for proper z-index stacking */}
            <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
            <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
        </>
    );
}
