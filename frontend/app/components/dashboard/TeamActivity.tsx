'use client';

import React, { useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { teamActivityData, TeamActivityData } from '../../lib/mockData';

export function TeamActivity() {
  const { currentOrganization, loading: tenantLoading } = useTenant();

  // Use mock data based on current organization
  const orgId = currentOrganization?.id || 'org_1';
  const data: TeamActivityData[] = teamActivityData[orgId] || teamActivityData['org_1'];

  const totalCount = useMemo(() => {
    return data.reduce((sum, d) => sum + d.count, 0);
  }, [data]);

  if (tenantLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
            Team Activity by Role
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
            Loading...
          </p>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--slate-200)',
                      }}
                    />
                    <span
                      style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground-muted)' }}
                    >
                      Loading...
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-300)' }}>—</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--slate-100)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ width: '0%', height: '100%', backgroundColor: 'var(--slate-200)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
          Team Activity by Role
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
          {totalCount} active team members
        </p>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.map((item: TeamActivityData) => (
            <div key={item.role}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                    }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>
                    {item.count}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'var(--slate-100)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
          }}
        >
          {data.map((item: TeamActivityData) => (
            <div key={item.role} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: item.color,
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
