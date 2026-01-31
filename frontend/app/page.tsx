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
import { useScrollAnimation } from './hooks/useScrollAnimation';

export default function Dashboard() {
  const { currentOrganization } = useTenant();
  const { currentRole, hasPermission } = useAuth();
  const { addToast } = useToast();
  const isNewOrg = currentOrganization?.isNew || false;
  const [showPermissionDenied, setShowPermissionDenied] = React.useState(false);

  // Animation hooks for premium feel
  const headerAnimation = useScrollAnimation({ delay: 0 });
  const kpiAnimation = useScrollAnimation({ delay: 200 });
  const constraintsAnimation = useScrollAnimation({ delay: 400 });
  const insightAnimation = useScrollAnimation({ delay: 600 });
  const mainContentAnimation = useScrollAnimation({ delay: 800 });

  return (
    <DashboardLayout>
      {/* Premium Animated Header */}
      <div 
        ref={headerAnimation.elementRef}
        className={`mb-6 ${headerAnimation.isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}
        style={{ marginBottom: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="animate-slide-in-left">
            <h1 className="text-gradient" style={{
              fontSize: '32px',
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              Dashboard
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--foreground-muted)',
              margin: '8px 0 0 0',
              fontWeight: 400
            }}>
              {isNewOrg
                ? `Let's get ${currentOrganization?.name || 'your organization'} up and running`
                : `Welcome back! Here's what's happening at ${currentOrganization?.name || 'your organization'}`
              }
            </p>
          </div>
          <div className="animate-slide-in-right animate-delay-200" style={{ display: 'flex', gap: '12px' }}>
            {/* Enhanced Disabled Action with Premium Styling */}
            <DisabledAction
              reason="Admin access required to export"
              disabled={!hasPermission('canManageOrg')}
            >
              <button
                className="btn btn-secondary glow-hover"
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
                className="btn btn-primary animate-pulse-glow"
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

        {/* Enhanced Role Notice with Premium Styling */}
        {currentRole === 'viewer' && (
          <div className="animate-slide-in-up animate-delay-300" style={{
            marginTop: '20px',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, var(--amber-50) 0%, rgba(255, 251, 235, 0.8) 100%)',
            border: '1px solid var(--amber-500)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 6px rgba(245, 158, 11, 0.1)',
          }}>
            <div className="animate-float">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--amber-600)"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--amber-700)', fontWeight: 500 }}>
              You have <strong>Viewer</strong> access. Some features are read-only or restricted.
            </span>
          </div>
        )}
      </div>

      {/* New Organization Welcome State with Premium Animations */}
      {isNewOrg ? (
        <div className="animate-fade-in">
          <WelcomeState orgName={currentOrganization?.name || 'your organization'} />

          {/* Empty dashboard state with staggered animations */}
          <div 
            ref={constraintsAnimation.elementRef}
            className={`mt-6 ${constraintsAnimation.isVisible ? 'animate-slide-in-up animate-delay-200' : 'opacity-0'}`}
          >
            <TenantIsolationNotice />
          </div>

          <div
            className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Empty KPI placeholders with staggered entrance */}
            {['Active Users', 'Monthly Usage', 'Error Rate', 'Support Tickets'].map((title, index) => (
              <div
                key={title}
                className={`card animate-scale-in animate-delay-${(index + 1) * 100}`}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '140px',
                  background: 'linear-gradient(135deg, var(--slate-50) 0%, rgba(248, 250, 252, 0.8) 100%)',
                  border: '2px dashed var(--border-strong)',
                }}
              >
                <div className="animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: 0, fontWeight: 500 }}>
                    {title}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--slate-300)', margin: '12px 0 0 0' }}>
                    —
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--slate-400)', margin: '8px 0 0 0' }}>
                    No data yet
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Tenant Isolation Notice with Animation */}
          <div 
            ref={constraintsAnimation.elementRef}
            className={`mb-4 ${constraintsAnimation.isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}
          >
            <TenantIsolationNotice />
          </div>

          {/* Enhanced KPI Cards with Staggered Animation */}
          <section 
            ref={kpiAnimation.elementRef}
            className={`mb-6 ${kpiAnimation.isVisible ? 'animate-slide-in-up animate-delay-100' : 'opacity-0'}`}
          >
            <KPIGrid />
          </section>

          {/* System Constraints with Premium Animation */}
          <div 
            ref={constraintsAnimation.elementRef}
            className={`${constraintsAnimation.isVisible ? 'animate-slide-in-up animate-delay-200' : 'opacity-0'}`}
          >
            <SystemConstraints />
          </div>

          {/* Insight Card with Floating Animation */}
          <section 
            ref={insightAnimation.elementRef}
            className={`mb-6 ${insightAnimation.isVisible ? 'animate-slide-in-up animate-delay-300' : 'opacity-0'}`}
          >
            <InsightCard />
          </section>

          {/* Main Content Grid with Premium Layout */}
          <div
            ref={mainContentAnimation.elementRef}
            className={`${mainContentAnimation.isVisible ? 'animate-fade-in animate-delay-400' : 'opacity-0'}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px',
            }}
          >
            {/* Left Column with Staggered Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="animate-slide-in-left animate-delay-500">
                <UsageChart />
              </div>

              {/* Admin-only Panel with Enhanced Styling */}
              <div className="animate-slide-in-left animate-delay-600">
                <PermissionGate
                  requiredRole="admin"
                  fallback={
                    <div className="card glass" style={{ padding: '20px' }}>
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
            </div>

            {/* Right Column with Staggered Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="animate-slide-in-right animate-delay-500">
                <TeamActivity />
              </div>
              <div className="animate-slide-in-right animate-delay-600">
                <AuditFeed />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Manager-only Section */}
      <PermissionGate requiredRole="manager">
        <section className="animate-slide-in-up animate-delay-700" style={{ marginTop: '24px' }}>
          <div className="card border-gradient">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="text-gradient" style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
                  Project Management
                </h3>
                <span className="badge badge-manager animate-pulse-glow">Manager+</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', margin: '6px 0 0 0' }}>
                Create and manage team projects with enhanced controls
              </p>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary glow-hover"
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
                    className="btn btn-primary animate-pulse-glow"
                    onClick={() => addToast('Opening project creation wizard...', 'success')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Project
                  </button>
                </PermissionGate>

                <PermissionGate requiredPermission="canEdit">
                  <button
                    className="btn btn-secondary glow-hover"
                    onClick={() => addToast('Edit mode enabled. Select a project to edit.', 'info')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Selected
                  </button>
                </PermissionGate>

                {/* Enhanced Delete Button with Premium Styling */}
                {hasPermission('canDelete') ? (
                  <button
                    className="btn btn-secondary glow-hover"
                    onClick={() => addToast('Simulating deletion... Project has been removed.', 'error')}
                    style={{
                      color: 'var(--red-600)',
                      borderColor: 'var(--red-200)',
                      background: 'linear-gradient(135deg, var(--red-50) 0%, rgba(254, 242, 242, 0.8) 100%)',
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
                      opacity: 0.6,
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

                <DisabledAction
                  reason="You don't have permission to archive projects"
                  disabled={!hasPermission('canDelete')}
                >
                  <button
                    className="btn btn-ghost glow-hover"
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

              {/* Enhanced Permission Summary */}
              <div className="glass animate-slide-in-up animate-delay-800" style={{
                marginTop: '24px',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
              }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Permissions
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'View', allowed: hasPermission('canView') },
                    { label: 'Create', allowed: hasPermission('canCreate') },
                    { label: 'Edit', allowed: hasPermission('canEdit') },
                    { label: 'Delete', allowed: hasPermission('canDelete') },
                  ].map((perm, index) => (
                    <div key={perm.label} className={`animate-scale-in animate-delay-${(index + 9) * 100}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className={perm.allowed ? 'animate-pulse-glow' : ''}>
                        {perm.allowed ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-600)" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-500)" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: '14px', color: perm.allowed ? 'var(--foreground)' : 'var(--foreground-muted)', fontWeight: perm.allowed ? 500 : 400 }}>
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

      {/* Enhanced Viewer Empty State */}
      {currentRole === 'viewer' && (
        <section className="animate-slide-in-up animate-delay-700" style={{ marginTop: '24px' }}>
          <div className="card glass" style={{ padding: '20px' }}>
            <AccessDenied
              title="Project Management"
              description="You need Manager or Admin access to create, edit, or delete projects. Contact your administrator to request elevated permissions."
              requiredRole="Manager or Admin"
            />
          </div>
        </section>
      )}

      {/* Enhanced Permission Denied Modal */}
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
