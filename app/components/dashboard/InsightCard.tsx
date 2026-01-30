'use client';

import React, { useState } from 'react';
import { useTenant } from '../../contexts/TenantContext';

interface InsightData {
    metric: string;
    change: number;
    direction: 'up' | 'down';
    reason: string;
    detail: string;
    recommendation?: string;
    drillTarget: string;
}

const insightsData: Record<string, InsightData[]> = {
    org_1: [
        {
            metric: 'API Usage',
            change: 12.5,
            direction: 'up',
            reason: 'Increased activity from Manager roles',
            detail: 'Manager role activity increased 34% this week, primarily driven by bulk project updates on Wednesday.',
            recommendation: 'Consider enabling batch operations to reduce API calls.',
            drillTarget: 'Manager activity log',
        },
        {
            metric: 'Support Tickets',
            change: 5.2,
            direction: 'up',
            reason: 'Delayed Manager approval workflows',
            detail: 'Average approval time increased from 4 hours to 12 hours. 8 projects are pending review beyond SLA thresholds.',
            recommendation: 'Review approval bottlenecks and consider auto-approval for low-risk items.',
            drillTarget: 'Pending approval queue',
        },
    ],
    org_2: [
        {
            metric: 'Error Rate',
            change: 18,
            direction: 'down',
            reason: 'Reduced activity from Viewer roles during weekends',
            detail: 'Viewer traffic dropped 42% on weekends, correlating with lower error occurrences.',
            recommendation: 'Weekend maintenance window could be optimized.',
            drillTarget: 'Weekend error logs',
        },
    ],
    org_3: [
        {
            metric: 'Active Users',
            change: 2.1,
            direction: 'down',
            reason: 'Seasonal drop in team activity',
            detail: '15 users with Viewer role have been inactive for 14+ days. Consider sending re-engagement emails.',
            recommendation: 'Review inactive accounts for potential cleanup.',
            drillTarget: 'Inactive user list',
        },
    ],
};

function InsightItem({ insight, variant }: { insight: InsightData; variant: 'positive' | 'negative' }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleDrillDown = () => {
        alert(`Navigating to ${insight.drillTarget}...\n\nIn a real app, this would:\n• Filter Team Activity to show ${insight.reason.toLowerCase()}\n• Highlight relevant audit logs\n• Display detailed breakdown`);
    };

    const isPositive = variant === 'positive';
    const accentColor = isPositive ? 'emerald' : 'red';

    return (
        <div
            style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-md)',
                border: `1px solid var(--${isHovered ? `${accentColor}-300` : 'border'})`,
                marginBottom: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isHovered ? `0 2px 8px rgba(0,0,0,0.08)` : 'none',
            }}
            onClick={handleDrillDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: `var(--${accentColor}-600)`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {isPositive ? 'Insight' : 'Concern'}
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
                        {insight.metric} {insight.direction === 'up' ? 'increased' : 'decreased'} {insight.change}%
                    </h4>
                </div>
                <span
                    style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius)',
                        backgroundColor: `var(--${accentColor}-50)`,
                        color: `var(--${accentColor}-600)`,
                        fontSize: '13px',
                        fontWeight: 500,
                    }}
                >
                    {insight.direction === 'up' ? '↑' : '↓'} {insight.change}%
                </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                    <strong style={{ color: 'var(--foreground)' }}>Why:</strong> {insight.reason}. {insight.detail}
                </p>
                <span
                    style={{
                        fontSize: '11px',
                        color: 'var(--blue-600)',
                        fontWeight: 500,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginLeft: '12px',
                        flexShrink: 0,
                    }}
                >
                    Show me
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </span>
            </div>

            {insight.recommendation && (
                <p style={{ fontSize: '12px', color: `var(--${accentColor}-700)`, margin: '8px 0 0 0' }}>
                    <strong>Action:</strong> {insight.recommendation}
                </p>
            )}
        </div>
    );
}

export function InsightCard() {
    const { currentOrganization } = useTenant();
    const insights = insightsData[currentOrganization.id] || insightsData['org_1'];
    const primaryInsight = insights[0];
    const concernInsight = insights.find(i => i.metric.toLowerCase().includes('ticket') || i.metric.toLowerCase().includes('error'));

    return (
        <div className="card" style={{ borderColor: 'var(--slate-200)' }}>
            <div style={{ padding: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--blue-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                    </div>
                    <div>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: 'var(--blue-600)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {insights.length > 1 ? `${insights.length} Insights` : 'Insight'}
                        </span>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
                            Actionable Analytics
                        </h4>
                    </div>
                </div>

                {/* Primary Insight - Positive */}
                <InsightItem 
                    insight={primaryInsight} 
                    variant="positive" 
                />

                {/* Secondary Insight - Negative/Concern (if exists) */}
                {concernInsight && concernInsight !== primaryInsight && (
                    <InsightItem 
                        insight={concernInsight} 
                        variant="negative" 
                    />
                )}
            </div>
        </div>
    );
}
