'use client';

import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
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
        </div>
    );
}
