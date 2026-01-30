'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { UserList } from '../components/users/UserList';

export default function UsersPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>User Management</h1>
                </div>
                <UserList />
            </div>
        </DashboardLayout>
    );
}
