'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AuditLogTable } from '../components/audit/AuditLogTable';

export default function AuditPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>Audit Logs</h1>
                    <p style={{ color: 'var(--foreground-muted)', marginTop: '4px' }}>Track all activity within your organization</p>
                </div>
                <AuditLogTable />
            </div>
        </DashboardLayout>
    );
}
