'use client';

import React, { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { ProfileModal } from '../ui/ProfileModal';

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar onProfileSettingsClick={() => setProfileModalOpen(true)} />
            <TopNav />
            <main
                style={{
                    marginLeft: 'var(--sidebar-width)',
                    paddingTop: 'var(--topnav-height)',
                    minHeight: '100vh',
                }}
            >
                <div
                    style={{
                        padding: '24px',
                        maxWidth: '1440px',
                    }}
                >
                    {children}
                </div>
            </main>
            <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
        </div>
    );
}
