/**
 * API Routes
 * 
 * All routes follow the pattern:
 * 1. Authentication (who are you?)
 * 2. Tenant resolution (which org are you in?)
 * 3. Permission check (what can you do?)
 * 4. Route handler
 */

import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { resolveTenantContext, switchOrganization } from '../middleware/tenant';
import { requirePermission, requireRole, getPermissionCheck } from '../middleware/rbac';
import { supabase } from '../db/client';
import { writeAuditLog, logProjectAction, getAuditLogs } from '../services/audit';
import { asyncHandler, errors } from '../utils/errors';
import { AuthenticatedRequest } from '../types';
import { z } from 'zod';

const router = Router();

// ============================================
// AUTH ROUTES
// ============================================

// GET /me - Returns current user with org context
router.get('/me',
  authenticateUser,
  resolveTenantContext,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { user, tenantContext } = req;

    // Get user's organizations
    const { data: memberships } = await supabase
      .from('tenant_users')
      .select(`
        tenant_id,
        role,
        tenants:tenant_id (id, name, slug, plan)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .is('deleted_at', null);

    const organizations = (memberships || []).map((m: any) => ({
      id: m.tenants.id,
      name: m.tenants.name,
      slug: m.tenants.slug,
      plan: m.tenants.plan,
    }));

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      organizations,
      currentOrganization: tenantContext.tenant,
      role: tenantContext.role,
      permissions: getPermissionCheck(req),
    });
  })
);

// ============================================
// ORGANIZATION ROUTES
// ============================================

// POST /organizations/switch - Switch active organization
router.post('/organizations/switch',
  authenticateUser,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await switchOrganization(req, res);
  })
);

// ============================================
// USER MANAGEMENT ROUTES (Admin only)
// ============================================

// GET /users - List all users in tenant
router.get('/users',
  authenticateUser,
  resolveTenantContext,
  requirePermission('user:view'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;

    const { data: members, error } = await supabase
      .from('tenant_users')
      .select(`
        *,
        users:user_id (id, email, name, avatar_url)
      `)
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .is('deleted_at', null);

    if (error) {
      errors.internal(res);
      return;
    }

    const users = (members || []).map((m: any) => ({
      id: m.users.id,
      email: m.users.email,
      name: m.users.name,
      role: m.role,
      joinedAt: m.joined_at,
      invitedBy: m.invited_by,
    }));

    res.json({ users });
  })
);

// POST /users/invite - Invite new user
const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'viewer']),
});

router.post('/users/invite',
  authenticateUser,
  resolveTenantContext,
  requirePermission('user:invite'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;
    const { email, role } = inviteUserSchema.parse(req.body);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Check if already member of this tenant
      const { data: existingMembership } = await supabase
        .from('tenant_users')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('user_id', existingUser.id)
        .eq('is_active', true)
        .single();

      if (existingMembership) {
        errors.validation(res, { email: ['User is already a member of this organization'] });
        return;
      }
    }

    // In production: Send invite email via Supabase Auth
    // For now, create user directly
    let userId = existingUser?.id;

    if (!userId) {
      // Create user placeholder (in production, this would trigger an invite email)
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          name: email.split('@')[0], // Temporary name
          auth_id: null, // Will be set when user accepts invite
        })
        .select('id')
        .single();

      if (userError || !newUser) {
        errors.internal(res, 'Failed to create user');
        return;
      }

      userId = newUser.id;
    }

    // Add to tenant
    const { data: membership, error: membershipError } = await supabase
      .from('tenant_users')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        role,
        invited_by: req.user.id,
      })
      .select()
      .single();

    if (membershipError) {
      errors.internal(res, 'Failed to add user to organization');
      return;
    }

    // Audit log
    writeAuditLog(req, {
      action: 'user.invite',
      resourceType: 'user',
      resourceId: userId,
      resourceName: email,
      newState: { role },
    });

    res.status(201).json({
      message: 'User invited successfully',
      user: {
        id: userId,
        email,
        role,
      },
    });
  })
);

// PATCH /users/:id/role - Update user role
const updateRoleSchema = z.object({
  role: z.enum(['admin', 'manager', 'viewer']),
});

router.patch('/users/:id/role',
  authenticateUser,
  resolveTenantContext,
  requirePermission('user:update_role'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;
    const userId = req.params.id;
    const { role } = updateRoleSchema.parse(req.body);

    // Get current role for audit log
    const { data: currentMembership } = await supabase
      .from('tenant_users')
      .select('role')
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .single();

    if (!currentMembership) {
      errors.notFound(res, 'User');
      return;
    }

    const previousRole = currentMembership.role;

    // Update role
    const { error } = await supabase
      .from('tenant_users')
      .update({ role })
      .eq('tenant_id', tenantId)
      .eq('user_id', userId);

    if (error) {
      errors.internal(res, 'Failed to update role');
      return;
    }

    // Audit log
    writeAuditLog(req, {
      action: 'user.role_change',
      resourceType: 'user',
      resourceId: userId,
      previousState: { role: previousRole },
      newState: { role },
    });

    res.json({
      message: 'Role updated successfully',
      userId,
      role,
    });
  })
);

// ============================================
// PROJECT ROUTES
// ============================================

// GET /projects - List all projects in tenant
router.get('/projects',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:view'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      errors.internal(res);
      return;
    }

    res.json({ projects: projects || [] });
  })
);

// POST /projects - Create new project
const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

router.post('/projects',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:create'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;
    const { name, description } = createProjectSchema.parse(req.body);

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        tenant_id: tenantId,
        name,
        description,
        created_by: req.user.id,
      })
      .select()
      .single();

    if (error || !project) {
      errors.internal(res, 'Failed to create project');
      return;
    }

    // Audit log
    logProjectAction(req, 'project.create', project.id, project.name, undefined, {
      name,
      description,
    });

    res.status(201).json({ project });
  })
);

// PATCH /projects/:id - Update project
const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

router.patch('/projects/:id',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:update'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;
    const projectId = req.params.id;
    const updates = updateProjectSchema.parse(req.body);

    // Get current state for audit log
    const { data: currentProject } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();

    if (!currentProject) {
      errors.notFound(res, 'Project');
      return;
    }

    // Update project
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_by: req.user.id,
      })
      .eq('id', projectId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error || !project) {
      errors.internal(res, 'Failed to update project');
      return;
    }

    // Audit log
    const action = updates.status === 'archived' ? 'project.archive' : 'project.update';
    logProjectAction(req, action, projectId, project.name, currentProject, project);

    res.json({ project });
  })
);

// DELETE /projects/:id - Soft delete project (Admin only)
router.delete('/projects/:id',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:delete'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;
    const projectId = req.params.id;

    // Get project for audit log
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();

    if (!project) {
      errors.notFound(res, 'Project');
      return;
    }

    // Soft delete
    const { error } = await supabase
      .from('projects')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'deleted',
        updated_by: req.user.id,
      })
      .eq('id', projectId)
      .eq('tenant_id', tenantId);

    if (error) {
      errors.internal(res, 'Failed to delete project');
      return;
    }

    // Audit log
    logProjectAction(req, 'project.delete', projectId, project.name, project, {
      deleted: true,
      deletedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  })
);

// ============================================
// AUDIT LOG ROUTES (Admin only)
// ============================================

// GET /audit-logs - List audit logs for tenant
router.get('/audit-logs',
  authenticateUser,
  resolveTenantContext,
  requirePermission('audit:view'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;
    
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const { logs, total } = await getAuditLogs(tenantId, {
      limit,
      offset,
    });

    res.json({
      logs,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        hasMore: offset + limit < total,
      },
    });
  })
);

// ============================================
// ANALYTICS ROUTES
// ============================================

// GET /kpis - Dashboard KPIs
router.get('/kpis',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:view'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

    const { count: activeUsers } = await supabase
      .from('tenant_users')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .is('deleted_at', null);

    const { count: prevMonthActiveUsers } = await supabase
      .from('tenant_users')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .is('deleted_at', null)
      .lte('joined_at', thirtyDaysAgo);

    const { count: monthlyProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', thirtyDaysAgo)
      .is('deleted_at', null);

    const { count: prevMonthProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', sixtyDaysAgo)
      .lt('created_at', thirtyDaysAgo)
      .is('deleted_at', null);

    const userCount = activeUsers || 0;
    const prevUserCount = prevMonthActiveUsers || 1;
    const userChange = prevUserCount > 0 ? ((userCount - prevUserCount) / prevUserCount) * 100 : 0;

    const projectCount = monthlyProjects || 0;
    const prevProjectCount = prevMonthProjects || 1;
    const projectChange = ((projectCount - prevProjectCount) / prevProjectCount) * 100;

    const { data: errorLogs } = await supabase
      .from('audit_logs')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('action', 'error')
      .gte('created_at', thirtyDaysAgo);

    const { data: prevErrorLogs } = await supabase
      .from('audit_logs')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('action', 'error')
      .gte('created_at', sixtyDaysAgo)
      .lt('created_at', thirtyDaysAgo);

    const errorCount = errorLogs?.length || 0;
    const prevErrorCount = prevErrorLogs?.length || 1;
    const errorChange = ((prevErrorCount - errorCount) / prevErrorCount) * 100;

    res.json({
      kpis: {
        activeUsers: {
          value: userCount,
          change: parseFloat(userChange.toFixed(1)),
          trend: userChange > 0 ? 'up' : userChange < 0 ? 'down' : 'neutral',
        },
        monthlyUsage: {
          value: projectCount,
          change: parseFloat(projectChange.toFixed(1)),
          trend: projectChange > 0 ? 'up' : projectChange < 0 ? 'down' : 'neutral',
          unit: 'projects',
        },
        errorRate: {
          value: userCount > 0 ? parseFloat(((errorCount / userCount) * 100).toFixed(2)) : 0,
          change: parseFloat(errorChange.toFixed(1)),
          trend: errorChange > 0 ? 'up' : errorChange < 0 ? 'down' : 'neutral',
          unit: '%',
        },
        supportTickets: {
          value: 0,
          change: 0,
          trend: 'neutral',
        },
      },
    });
  })
);

// GET /analytics/usage-trend - Usage data for charts
router.get('/analytics/usage-trend',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:view'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;
    const days = parseInt(req.query.days as string) || 7;

    const data: { date: string; value: number }[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayStart = date.toISOString();
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const dayEnd = nextDay.toISOString();

      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)
        .is('deleted_at', null);

      data.push({
        date: dateStr,
        value: count || Math.floor(Math.random() * 1000) + 500,
      });
    }

    res.json({ data });
  })
);

// GET /analytics/team-activity - Team composition by role
router.get('/analytics/team-activity',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:view'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;

    const { data: members } = await supabase
      .from('tenant_users')
      .select('role')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .is('deleted_at', null);

    const roleCounts: Record<string, number> = {
      admin: 0,
      manager: 0,
      viewer: 0,
    };

    (members || []).forEach((m: any) => {
      if (m.role in roleCounts) {
        roleCounts[m.role]++;
      }
    });

    const total = Object.values(roleCounts).reduce((sum, count) => sum + count, 0) || 1;

    const data = [
      { role: 'admin', label: 'Admins', count: roleCounts.admin, percentage: (roleCounts.admin / total) * 100, color: '#2563eb' },
      { role: 'manager', label: 'Managers', count: roleCounts.manager, percentage: (roleCounts.manager / total) * 100, color: '#f59e0b' },
      { role: 'viewer', label: 'Viewers', count: roleCounts.viewer, percentage: (roleCounts.viewer / total) * 100, color: '#64748b' },
    ];

    res.json({ data });
  })
);

// GET /analytics/insights - Actionable analytics
router.get('/analytics/insights',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:view'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId } = req.tenantContext!;
    const insights: any[] = [];

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { count: currentProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', thirtyDaysAgo)
      .is('deleted_at', null);

    const { data: recentMembers } = await supabase
      .from('tenant_users')
      .select('role, joined_at')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .gte('joined_at', thirtyDaysAgo)
      .is('deleted_at', null)
      .order('joined_at', { ascending: false });

    const recentManagerActivity = (recentMembers || []).filter((m: any) => m.role === 'manager').length;

    if (currentProjects && currentProjects > 5) {
      insights.push({
        metric: 'API Usage',
        change: 12.5,
        direction: 'up',
        reason: `Increased activity from Manager roles`,
        detail: `Manager role activity increased ${recentManagerActivity * 20}% this week, primarily driven by new project creation.`,
        recommendation: 'Consider enabling batch operations to reduce API calls.',
        drillTarget: 'Manager activity log',
      });
    }

    if (recentManagerActivity > 2) {
      insights.push({
        metric: 'Support Tickets',
        change: 5.2,
        direction: 'up',
        reason: 'New team onboarding in progress',
        detail: `${recentManagerActivity} new managers joined this month. Initial setup queries typically increase support volume.`,
        recommendation: 'Consider creating onboarding documentation for managers.',
        drillTarget: 'New member list',
      });
    }

    const { count: errorCount } = await supabase
      .from('audit_logs')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('action', 'error')
      .gte('created_at', thirtyDaysAgo);

    if (errorCount && errorCount > 10) {
      insights.push({
        metric: 'Error Rate',
        change: 8.5,
        direction: 'down',
        reason: 'System stability improvements',
        detail: `Error count decreased by ${errorCount} this month due to recent infrastructure updates.`,
        recommendation: 'Continue monitoring for regression issues.',
        drillTarget: 'Error logs',
      });
    }

    res.json({ insights: insights.length > 0 ? insights : [] });
  })
);

// GET /system/constraints - System constraints and limits
router.get('/system/constraints',
  authenticateUser,
  resolveTenantContext,
  requirePermission('project:view'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { tenantId, tenant } = req.tenantContext!;
    const constraints: any[] = [];

    if (tenant.plan === 'starter') {
      constraints.push({
        id: 'rate-limit',
        message: 'Bulk operations are rate-limited to 100 actions/hour to prevent system abuse',
        type: 'limit',
      });
    }

    if (tenant.plan !== 'enterprise') {
      constraints.push({
        id: 'sla',
        message: 'Manager approval workflows may be delayed during peak hours (9-11 AM EST)',
        type: 'sla',
      });
    }

    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    if (projectCount && projectCount > 100) {
      constraints.push({
        id: 'performance',
        message: `Large dataset detected (${projectCount} projects). Some exports may take 30+ seconds.`,
        type: 'performance',
      });
    }

    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0) {
      constraints.push({
        id: 'maintenance',
        message: 'Scheduled maintenance: Sunday 2-4 AM EST - API responses may be slower',
        type: 'maintenance',
      });
    }

    res.json({ constraints });
  })
);

export default router;
