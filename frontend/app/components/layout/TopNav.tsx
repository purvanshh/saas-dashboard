'use client';

import React, { useState } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleBadgeClass, getRoleLabel, Role } from '../../lib/permissions';

const ALL_ROLES: Role[] = ['admin', 'manager', 'viewer'];

export function TopNav() {
    const { currentOrganization, organizations, switchOrganization } = useTenant();
    const { currentUser, currentRole, setRole } = useAuth();
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

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
            {/* Left section - Organization Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="dropdown" style={{ position: 'relative' }}>
                    <button
                        onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            background: 'var(--slate-50)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--foreground)',
                        }}
                    >
                        <div
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 700,
                            }}
                        >
                            {currentOrganization?.name?.[0]}
                        </div>
                        <span>{currentOrganization?.name}</span>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{
                                transform: orgDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.15s ease',
                            }}
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </button>

                    {orgDropdownOpen && (
                        <div
                            className="dropdown-menu animate-slide-in"
                            style={{ minWidth: '240px' }}
                        >
                            <div
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--foreground-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Switch Organization
                            </div>
                            {organizations.map((org) => (
                                <button
                                    key={org.id}
                                    className={`dropdown-item ${org.id === currentOrganization?.id ? 'active' : ''}`}
                                    onClick={() => {
                                        switchOrganization(org.id);
                                        setOrgDropdownOpen(false);
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                                >
                                    <div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '6px',
                                            background:
                                                org.id === 'org_1'
                                                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                                                    : org.id === 'org_2'
                                                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                        : org.id === 'org_3'
                                                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                                            : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {org.name[0]}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {org.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                color: 'var(--foreground-muted)',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {org.plan}
                                        </div>
                                    </div>
                                    {org.id === currentOrganization?.id && (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="var(--blue-600)"
                                            strokeWidth="2"
                                            style={{ flexShrink: 0 }}
                                        >
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right section - Role badge, User menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Role Switcher - for demo */}
                <div className="dropdown" style={{ position: 'relative' }}>
                    <button
                        onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                        className={`badge ${getRoleBadgeClass(currentRole)}`}
                        style={{ cursor: 'pointer', border: 'none' }}
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
                            style={{ marginLeft: '4px' }}
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </button>

                    {roleDropdownOpen && (
                        <div
                            className="dropdown-menu animate-slide-in"
                            style={{ right: 0, left: 'auto', minWidth: '160px' }}
                        >
                            <div
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--foreground-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Switch Role (Demo)
                            </div>
                            {ALL_ROLES.map((r) => (
                                <button
                                    key={r}
                                    className={`dropdown-item ${r === currentRole ? 'active' : ''}`}
                                    onClick={() => {
                                        setRole(r);
                                        setRoleDropdownOpen(false);
                                    }}
                                >
                                    <span className={`badge ${getRoleBadgeClass(r)}`} style={{ marginRight: '8px' }}>
                                        {getRoleLabel(r)}
                                    </span>
                                    {r === currentRole && (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="var(--blue-600)"
                                            strokeWidth="2"
                                        >
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    style={{
                        width: '1px',
                        height: '24px',
                        backgroundColor: 'var(--border)',
                    }}
                />

                {/* User Menu */}
                <div className="dropdown" style={{ position: 'relative' }}>
                    <button
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 600,
                            }}
                        >
                            {getInitials(currentUser?.name || 'User')}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: 'var(--foreground)',
                                }}
                            >
                                {currentUser?.name}
                            </div>
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: 'var(--foreground-muted)',
                                }}
                            >
                                {currentUser?.email}
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
                            className="dropdown-menu animate-slide-in"
                            style={{ right: 0, left: 'auto', minWidth: '200px' }}
                        >
                            <button className="dropdown-item">
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
                            <button className="dropdown-item">
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
                                    margin: '4px 0',
                                }}
                            />
                            <button
                                className="dropdown-item"
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
    );
}
