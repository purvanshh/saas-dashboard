'use client';

import React from 'react';
import { KPICard } from './KPICard';
import { useTenant } from '../../contexts/TenantContext';
import { kpiData } from '../../lib/mockData';
import { useStaggeredAnimation } from '../../hooks/useScrollAnimation';

export function KPIGrid() {
  const { currentOrganization, loading: tenantLoading } = useTenant();
  const { containerRef, visibleItems } = useStaggeredAnimation(4, 150);

  if (tenantLoading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="card skeleton"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '140px',
            }}
          >
            <div
              className="skeleton"
              style={{
                width: '60%',
                height: '16px',
                marginBottom: '16px',
              }}
            />
            <div
              className="skeleton"
              style={{
                width: '80%',
                height: '32px',
                marginBottom: '12px',
              }}
            />
            <div
              className="skeleton"
              style={{
                width: '40%',
                height: '14px',
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Use mock data based on current organization
  const orgId = currentOrganization?.id || 'org_1';
  const data = kpiData[orgId] || kpiData['org_1'];

  const kpiCards = [
    {
      title: "Active Users",
      value: data.activeUsers.value,
      change: data.activeUsers.change,
      trend: data.activeUsers.trend,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Monthly Usage",
      value: data.monthlyUsage.value,
      unit: data.monthlyUsage.unit,
      change: data.monthlyUsage.change,
      trend: data.monthlyUsage.trend,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20" />
          <path d="M2 12h20" />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 2a10 10 0 0 0-10 10" />
          <path d="M12 22a10 10 0 0 1 10-10" />
          <path d="M12 22a10 10 0 0 0-10-10" />
        </svg>
      ),
    },
    {
      title: "Error Rate",
      value: data.errorRate.value,
      unit: data.errorRate.unit,
      change: data.errorRate.change,
      trend: data.errorRate.trend,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      title: "Support Tickets",
      value: data.supportTickets.value,
      change: data.supportTickets.change,
      trend: data.supportTickets.trend,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}
    >
      {kpiCards.map((kpi, index) => (
        <KPICard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          unit={kpi.unit}
          change={kpi.change}
          trend={kpi.trend as 'up' | 'down' | 'neutral'}
          icon={kpi.icon}
          index={index}
        />
      ))}
    </div>
  );
}
