'use client';

import React from 'react';
import { useTenant } from '../../contexts/TenantContext'; // Fix import path
import { useToast } from '../../contexts/ToastContext'; // Fix import path
import { billingData, plans } from '../../lib/mockData'; // Fix import path

// Helper
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export function BillingOverview() {
    const { currentOrganization } = useTenant();
    const { addToast } = useToast();

    if (!currentOrganization) return null;

    const billing = billingData[currentOrganization.id];

    // Fallback if no billing data exists for this org in mock
    if (!billing) {
        return (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--foreground-muted)' }}>No billing information available for this organization.</p>
                <button
                    className="btn btn-primary"
                    style={{ marginTop: '16px' }}
                    onClick={() => addToast('Navigating to subscription setup...', 'success')}
                >
                    Set Up Billing
                </button>
            </div>
        );
    }

    const currentPlan = plans.find(p => p.id === billing.currentPlanId) || plans[0];

    return (
        <div style={{ display: 'grid', gap: '24px' }}>
            {/* Current Plan Card */}
            <div className="card">
                <div className="card-header">
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Current Subscription</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)' }}>
                                {currentPlan.name} Plan
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginTop: '4px' }}>
                                {formatCurrency(currentPlan.price)} / month
                            </div>
                        </div>
                        <span className="badge badge-manager" style={{ fontSize: '14px', padding: '6px 12px' }}>
                            Active
                        </span>
                    </div>

                    <div className="divider" style={{ margin: '20px 0', height: '1px', backgroundColor: 'var(--slate-200)' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>
                                Next Billing Date
                            </div>
                            <div style={{ fontWeight: 500, marginTop: '4px' }}>{billing.nextBillingDate}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>
                                Payment Method
                            </div>
                            <div style={{ fontWeight: 500, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="20" height="14" viewBox="0 0 24 16" fill="var(--slate-600)">
                                    <rect width="24" height="16" rx="2" />
                                </svg>
                                {billing.paymentMethod}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => addToast('Opening plan upgrade modal...', 'success')}
                        >
                            Upgrade Plan
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => addToast('Opening payment method settings...', 'info')}
                        >
                            Manage Payment Method
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoice History */}
            <div className="card">
                <div className="card-header">
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Invoice History</h2>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Date</th>
                                <th style={{ textAlign: 'left' }}>Amount</th>
                                <th style={{ textAlign: 'left' }}>Status</th>
                                <th style={{ textAlign: 'right' }}>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billing.invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{invoice.date}</td>
                                    <td>{formatCurrency(invoice.amount)}</td>
                                    <td>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                backgroundColor: 'var(--emerald-50)',
                                                color: 'var(--emerald-600)',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => addToast(`Downloading invoice ${invoice.id}...`, 'info')}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
