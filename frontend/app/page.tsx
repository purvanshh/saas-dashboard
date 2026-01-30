'use client';

import React from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { KPIGrid } from './components/dashboard/KPIGrid';
import { UsageChart } from './components/dashboard/UsageChart';
import { TeamActivity } from './components/dashboard/TeamActivity';
import { AdminActions } from './components/dashboard/AdminActions';
import { AuditFeed } from './components/dashboard/AuditFeed';
import { InsightCard } from './components/dashboard/InsightCard';
import { useTenant } from './contexts/TenantContext';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import { PermissionGate } from './components/ui/PermissionGate';
import { DisabledAction } from './components/ui/DisabledAction';
import { AccessDenied } from './components/ui/AccessDenied';
import { WelcomeState, TenantIsolationNotice } from './components/ui/EmptyState';
import { SystemConstraints } from './components/dashboard/SystemConstraints';
import { PermissionDeniedModal } from './components/ui/PermissionDeniedModal';

export default function Dashboard() {
  const { currentOrganization } = useTenant();
  const { currentRole, hasPermission } = useAuth();
  const { addToast } = useToast();
  const isNewOrg = currentOrganization?.isNew || false;
  const [showPermissionDenied, setShowPermissionDenied] = React.useState(false);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--foreground)',
              margin: 0
            }}>
              Dashboard
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'var(--foreground-muted)',
              margin: '4px 0 0 0'
            }}>
              {isNewOrg
                ? `Let's get ${currentOrganization?.name || 'your organization'} up and running`
                : `Welcome back! Here's what's happening at ${currentOrganization?.name || 'your organization'}`
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Disabled action example for non-admins */}
            <DisabledAction
              reason="Admin access required to export"
              disabled={!hasPermission('canManageOrg')}
            >
              <button
                className="btn btn-secondary"
                onClick={() => addToast('Generating report... This may take a moment.', 'info')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Report
              </button>
            </DisabledAction>

            <PermissionGate requiredPermission="canCreate">
              <button
                className="btn btn-primary"
                onClick={() => addToast('Opening project creation wizard...', 'success')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Project
              </button>
            </PermissionGate>
          </div>
        </div>

        {/* Role-based notice for Viewers */}
        {currentRole === 'viewer' && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: 'var(--amber-50)',
              border: '1px solid var(--amber-500)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--amber-600)"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: '14px', color: 'var(--amber-700)' }}>
              You have <strong>Viewer</strong> access. Some features are read-only or restricted.
            </span>
          </div>
        )}
      </div>

      {/* New Organization Welcome State */}
      {isNewOrg ? (
        <>
          <WelcomeState orgName={currentOrganization?.name || 'your organization'} />

          {/* Empty dashboard state */}
          <div style={{ marginTop: '24px' }}>
            <TenantIsolationNotice />
          </div>

          <div
            style={{
              marginTop: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >
            {/* Empty KPI placeholders */}
            {['Active Users', 'Monthly Usage', 'Error Rate', 'Support Tickets'].map((title) => (
              <div
                key={title}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '120px',
                  backgroundColor: 'var(--slate-50)',
                  border: '1px dashed var(--border-strong)',
                }}
              >
                <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: 0 }}>
                  {title}
                </p>
                <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--slate-300)', margin: '8px 0 0 0' }}>
                  —
                </p>
                <p style={{ fontSize: '11px', color: 'var(--slate-400)', margin: '8px 0 0 0' }}>
                  No data yet
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Tenant Isolation Notice */}
          <div style={{ marginBottom: '16px' }}>
            <TenantIsolationNotice />
          </div>

          {/* KPI Cards */}
          <section style={{ marginBottom: '24px' }}>
            <KPIGrid />
          </section>

          {/* System Constraints - Real operational limits */}
          <SystemConstraints />

          {/* Insight Card - Actionable Analytics */}
          <section style={{ marginBottom: '24px' }}>
            <InsightCard />
          </section>

          {/* Main Content Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px',
            }}
          >
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <UsageChart />

              {/* Admin-only Panel */}
              <PermissionGate
                requiredRole="admin"
                fallback={
                  <div className="card" style={{ padding: '20px' }}>
                    <AccessDenied
                      title="Admin Panel"
                      description="Quick actions are only available to administrators."
                      requiredRole="Admin"
                    />
                  </div>
                }
              >
                <AdminActions />
              </PermissionGate>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <TeamActivity />
              <AuditFeed />
            </div>
          </div>
        </>
      )}

      {/* Manager-only section example with destructive action */}
      <PermissionGate requiredRole="manager">
        <section style={{ marginTop: '24px' }}>
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
                  Project Management
                </h3>
                <span className="badge badge-manager">Manager+</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
                Create and manage team projects
              </p>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => addToast('Navigating to projects list...', 'info')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  View Projects
                </button>

                <PermissionGate requiredPermission="canCreate">
                  <button
                    className="btn btn-primary"
                    onClick={() => addToast('Opening project creation wizard...', 'success')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Project
                  </button>
                </PermissionGate>

                {/* Edit action - available to managers */}
                <PermissionGate requiredPermission="canEdit">
                  <button
                    className="btn btn-secondary"
                    onClick={() => addToast('Edit mode enabled. Select a project to edit.', 'info')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Selected
                  </button>
                </PermissionGate>

                {/* DESTRUCTIVE ACTION - explicit permission denial for non-admins */}
                {hasPermission('canDelete') ? (
                  <button
                    className="btn btn-secondary"
                    onClick={() => addToast('Simulating deletion... Project has been removed.', 'error')}
                    style={{
                      color: 'var(--red-600)',
                      borderColor: 'var(--red-200)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Delete Selected
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPermissionDenied(true)}
                    style={{
                      color: 'var(--red-400)',
                      borderColor: 'var(--red-100)',
                    }}
                    title="Admin access required to delete projects"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Delete Selected
                  </button>
                )}

                {/* Archive action - also admin only */}
                <DisabledAction
                  reason="You don't have permission to archive projects"
                  disabled={!hasPermission('canDelete')}
                >
                  <button
                    className="btn btn-ghost"
                    onClick={() => addToast('Projects archived successfully.', 'info')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="21 8 21 21 3 21 3 8" />
                      <rect x="1" y="3" width="22" height="5" />
                      <line x1="10" y1="12" x2="14" y2="12" />
                    </svg>
                    Archive
                  </button>
                </DisabledAction>
              </div>

              {/* Permission summary for demonstration */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px 16px',
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Permissions
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'View', allowed: hasPermission('canView') },
                    { label: 'Create', allowed: hasPermission('canCreate') },
                    { label: 'Edit', allowed: hasPermission('canEdit') },
                    { label: 'Delete', allowed: hasPermission('canDelete') },
                  ].map((perm) => (
                    <div key={perm.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {perm.allowed ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-600)" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red-500)" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                      <span style={{ fontSize: '13px', color: perm.allowed ? 'var(--foreground)' : 'var(--foreground-muted)' }}>
                        {perm.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </PermissionGate>

      {/* Viewer empty state for project management */}
      {currentRole === 'viewer' && (
        <section style={{ marginTop: '24px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <AccessDenied
              title="Project Management"
              description="You need Manager or Admin access to create, edit, or delete projects. Contact your administrator to request elevated permissions."
              requiredRole="Manager or Admin"
            />
          </div>
        </section>
      )}

      {/* Permission Denied Modal - shown when Manager attempts delete */}
      <PermissionDeniedModal
        isOpen={showPermissionDenied}
        onClose={() => setShowPermissionDenied(false)}
        action="delete projects"
        requiredRole="Admin"
        currentRole={currentRole === 'manager' ? 'Manager' : currentRole === 'viewer' ? 'Viewer' : 'User'}
      />
    </DashboardLayout>
  );
}
