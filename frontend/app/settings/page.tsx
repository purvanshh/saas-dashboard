'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProfileSettingsCard } from '../components/settings/ProfileSettingsCard';

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: 'calc(100vh - 120px)',
                padding: '20px'
            }}>
                <ProfileSettingsCard />
            </div>
        </DashboardLayout>
    );
}
