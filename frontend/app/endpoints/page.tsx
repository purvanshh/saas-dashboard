'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { EndpointList } from '../components/endpoints/EndpointList';

export default function EndpointsPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>Endpoints</h1>
                    <p style={{ color: 'var(--foreground-muted)', marginTop: '6px' }}>
                        Configure which API endpoints are active and who can update them.
                    </p>
                </div>
                <EndpointList />
            </div>
        </DashboardLayout>
    );
}
