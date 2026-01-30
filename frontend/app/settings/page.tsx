'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { OrgSettingsForm } from '../components/settings/OrgSettingsForm';

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>Organization Settings</h1>
                </div>
                <OrgSettingsForm />
            </div>
        </DashboardLayout>
    );
}
