'use client';

import React from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useToast } from '../../contexts/ToastContext';
import { UsageChart } from '../dashboard/UsageChart';
import { KPIGrid } from '../dashboard/KPIGrid';
import { InsightCard } from '../dashboard/InsightCard';

export function AnalyticsView() {
    const { currentOrganization } = useTenant();
    const { addToast } = useToast();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Key Metrics */}
            <section>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Key Performance Indicators</h3>
                    <select
                        className="input"
                        style={{ width: 'auto' }}
                        onChange={() => addToast('Timeframe updated', 'info')}
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last Quarter</option>
                    </select>
                </div>
                <KPIGrid />
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <UsageChart />

                    {/* Traffic Sources Mock */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Traffic Sources</h3>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { label: 'Direct', value: '45%', count: '4,521' },
                                    { label: 'Social Media', value: '32%', count: '3,102' },
                                    { label: 'Organic Search', value: '18%', count: '1,850' },
                                    { label: 'Referral', value: '5%', count: '480' },
                                ].map((source) => (
                                    <div key={source.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '14px', color: 'var(--foreground)' }}>{source.label}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '200px' }}>
                                            <div style={{ flex: 1, backgroundColor: 'var(--slate-100)', height: '6px', borderRadius: '3px' }}>
                                                <div style={{
                                                    width: source.value,
                                                    height: '100%',
                                                    backgroundColor: 'var(--blue-500)',
                                                    borderRadius: '3px'
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', width: '40px', textAlign: 'right' }}>{source.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <InsightCard />

                    {/* Device Breakdown Mock */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Devices</h3>
                        </div>
                        <div className="card-body" style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                            <div style={{
                                width: '160px',
                                height: '160px',
                                borderRadius: '50%',
                                border: '20px solid var(--blue-500)',
                                borderRightColor: 'var(--emerald-400)',
                                borderBottomColor: 'var(--slate-200)',
                                transform: 'rotate(45deg)',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: 700 }}>68%</div>
                                    <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>Desktop</div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer" style={{ borderTop: '1px solid var(--border)', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--blue-500)' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>Desktop</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--emerald-400)' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>Mobile</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--slate-200)' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>Tablet</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
