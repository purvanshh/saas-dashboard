'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AnalyticsView } from '../components/analytics/AnalyticsView';

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>Analytics</h1>
                </div>
                <AnalyticsView />
            </div>
        </DashboardLayout>
    );
}
