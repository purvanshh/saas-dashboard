'use client';

import React, { useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { insightsData, InsightData } from '../../lib/mockData';

interface InsightItemProps {
  insight: InsightData;
  variant: 'positive' | 'negative';
}

function InsightItem({ insight, variant }: InsightItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleDrillDown = () => {
    alert(`Navigating to ${insight.drillTarget}...\n\nIn a real app, this would:\n• Filter Team Activity to show relevant data\n• Highlight relevant audit logs\n• Display detailed breakdown`);
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
  const { currentOrganization, loading: tenantLoading } = useTenant();

  // Low loading simulation for better UX feel
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (tenantLoading) return;
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [tenantLoading]);

  // Use mock data
  const orgId = currentOrganization?.id || 'org_1';
  const insights = insightsData[orgId] || [];

  const primaryInsight = useMemo(() => {
    return insights.find((i) => i.direction === 'up') || insights[0];
  }, [insights]);

  const concernInsight = useMemo(() => {
    // Prefer showing a concern if available
    return insights.find(
      (i) => i.direction === 'down' && i !== primaryInsight
    );
  }, [insights, primaryInsight]);

  if (tenantLoading || loading) {
    return (
      <div className="card" style={{ borderColor: 'var(--slate-200)' }}>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--slate-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--slate-400)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Loading...
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
                Actionable Analytics
              </h4>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    width: '40%',
                    height: '14px',
                    backgroundColor: 'var(--slate-200)',
                    borderRadius: '4px',
                    marginBottom: '8px',
                  }}
                />
                <div
                  style={{
                    width: '80%',
                    height: '12px',
                    backgroundColor: 'var(--slate-100)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="card" style={{ borderColor: 'var(--slate-200)' }}>
        <div style={{ padding: '20px' }}>
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
                Analytics
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
                Actionable Analytics
              </h4>
            </div>
          </div>
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--foreground-muted)',
            }}
          >
            <p style={{ margin: 0 }}>No insights available yet. Check back later as data accumulates.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ borderColor: 'var(--slate-200)' }}>
      <div style={{ padding: '20px' }}>
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

        {primaryInsight && (
          <InsightItem insight={primaryInsight} variant="positive" />
        )}

        {concernInsight && (
          <InsightItem insight={concernInsight} variant="negative" />
        )}
      </div>
    </div>
  );
}
