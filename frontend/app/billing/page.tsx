'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { BillingOverview } from '../components/billing/BillingOverview';

export default function BillingPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>Billing & Subscription</h1>
                </div>
                <BillingOverview />
            </div>
        </DashboardLayout>
    );
}
